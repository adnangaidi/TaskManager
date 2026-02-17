package com.gestion.taches.services;

import com.gestion.taches.dto.JwtResponse;
import com.gestion.taches.dto.LoginRequest;
import com.gestion.taches.dto.SignupRequest;
import com.gestion.taches.exceptions.UserAlreadyExistsException;
import com.gestion.taches.enums.ERole;
import com.gestion.taches.models.Role;
import com.gestion.taches.models.User;
import com.gestion.taches.repositories.RoleRepository;
import com.gestion.taches.repositories.UserRepository;
import com.gestion.taches.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    // Authentification (Login)
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        // Authentifier l'utilisateur
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        // Mettre l'authentification dans le contexte de sécurité
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Générer le token JWT
        String jwt = jwtUtils.generateJwtToken(authentication);

        // Récupérer les détails de l'utilisateur
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // Récupérer l'utilisateur complet depuis la base de données
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Créer et retourner la réponse JWT
        return new JwtResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                roles
        );
    }

    // Inscription (Register)
    public String registerUser(SignupRequest signupRequest) {
        // Vérifier si le username existe déjà
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new UserAlreadyExistsException("Erreur: Le nom d'utilisateur existe déjà!");
        }

        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new UserAlreadyExistsException("Erreur: L'email existe déjà!");
        }
        System.out.println("signupRequest:"+signupRequest);

        // Assigner les rôles
        Set<String> strRoles = signupRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            // Par défaut, assigner le rôle USER
            Role userRole =(Role) roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Erreur: Le rôle USER n'est pas trouvé."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin":
                        Role adminRole = (Role) roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Erreur: Le rôle ADMIN n'est pas trouvé."));
                        roles.add(adminRole);
                        break;
                    case "mod":
                    case "moderator":
                        Role modRole = (Role) roleRepository.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Erreur: Le rôle MODERATOR n'est pas trouvé."));
                        roles.add(modRole);
                        break;
                    default:
                        Role userRole = (Role) roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Erreur: Le rôle USER n'est pas trouvé."));
                        roles.add(userRole);
                }
            });
        }
        // Créer le nouvel utilisateur
        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setEmail(signupRequest.getEmail());
        user.setPassword("{noop}"+signupRequest.getPassword());
        user.setRoles(roles);
        System.out.println("user: " + user);
        userRepository.save(user);

        return "Utilisateur enregistré avec succès!";
    }

    // Déconnexion (Logout) - côté serveur (optionnel)
    public void logout() {
        SecurityContextHolder.clearContext();
    }

    // Vérifier si le token est valide
    public boolean validateToken(String token) {
        return jwtUtils.validateJwtToken(token);
    }

    // Récupérer le username depuis le token
    public String getUsernameFromToken(String token) {
        return jwtUtils.getUserNameFromJwtToken(token);
    }

    // Rafraîchir le token (optionnel)
    public String refreshToken(String oldToken) {
        if (jwtUtils.validateJwtToken(oldToken)) {
            String username = jwtUtils.getUserNameFromJwtToken(oldToken);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            // Créer une nouvelle authentification
            UserDetails userDetails = UserDetailsServiceImpl.build(user);
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
            );

            // Générer un nouveau token
            return jwtUtils.generateJwtToken(authentication);
        }
        throw new RuntimeException("Token invalide, impossible de le rafraîchir");
    }

    // Vérifier les credentials sans générer de token (pour validation)
    public boolean checkCredentials(String username, String password) {
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            return passwordEncoder.matches(password, user.getPassword());
        } catch (Exception e) {
            return false;
        }
    }

    // Changer le mot de passe de l'utilisateur connecté
    public void changePassword(String oldPassword, String newPassword) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier l'ancien mot de passe
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("L'ancien mot de passe est incorrect");
        }

        // Mettre à jour avec le nouveau mot de passe
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // Réinitialiser le mot de passe (sans vérification de l'ancien - pour admin ou forgot password)
    public void resetPassword(String username, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
