package com.gestion.taches.services;

import com.gestion.taches.exceptions.UserAlreadyExistsException;
import com.gestion.taches.enums.ERole;
import com.gestion.taches.models.Role;
import com.gestion.taches.models.User;
import com.gestion.taches.repositories.RoleRepository;
import com.gestion.taches.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Créer un nouvel utilisateur
    public User createUser(User user) {
        // Vérifier si le username existe déjà
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UserAlreadyExistsException("Le nom d'utilisateur existe déjà: " + user.getUsername());
        }

        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException("L'email existe déjà: " + user.getEmail());
        }

        // Encoder le mot de passe
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Assigner le rôle USER par défaut si aucun rôle n'est spécifié
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            Role userRole = (Role) roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Erreur: Le rôle USER n'existe pas dans la base de données"));
            roles.add(userRole);
            user.setRoles(roles);
        }

        return userRepository.save(user);
    }

    // Récupérer tous les utilisateurs
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Récupérer un utilisateur par ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Récupérer un utilisateur par username
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Récupérer un utilisateur par email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Mettre à jour un utilisateur
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'id: " + id));

        // Mettre à jour les champs (sauf le mot de passe)
        if (userDetails.getEmail() != null && !userDetails.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(userDetails.getEmail())) {
                throw new UserAlreadyExistsException("L'email existe déjà: " + userDetails.getEmail());
            }
            user.setEmail(userDetails.getEmail());
        }

        if (userDetails.getUsername() != null && !userDetails.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(userDetails.getUsername())) {
                throw new UserAlreadyExistsException("Le nom d'utilisateur existe déjà: " + userDetails.getUsername());
            }
            user.setUsername(userDetails.getUsername());
        }

        if (userDetails.getIsActive() != null) {
            user.setIsActive(userDetails.getIsActive());
        }

        return userRepository.save(user);
    }

    // Changer le mot de passe
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'id: " + userId));

        // Vérifier l'ancien mot de passe
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("L'ancien mot de passe est incorrect");
        }

        // Encoder et sauvegarder le nouveau mot de passe
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // Supprimer un utilisateur
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'id: " + id));
        userRepository.delete(user);
    }

    // Désactiver un utilisateur (soft delete)
    public void deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'id: " + id));
        user.setIsActive(false);
        userRepository.save(user);
    }

    // Activer un utilisateur
    public void activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'id: " + id));
        user.setIsActive(true);
        userRepository.save(user);
    }

    // Ajouter un rôle à un utilisateur
    public void addRoleToUser(Long userId, ERole roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'id: " + userId));

        Role role = (Role) roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Erreur: Le rôle " + roleName + " n'existe pas"));

        user.getRoles().add(role);
        userRepository.save(user);
    }

    // Supprimer un rôle d'un utilisateur
    public void removeRoleFromUser(Long userId, ERole roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'id: " + userId));

        Role role = (Role) roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Erreur: Le rôle " + roleName + " n'existe pas"));

        user.getRoles().remove(role);
        userRepository.save(user);
    }

    // Récupérer l'utilisateur actuellement connecté
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Aucun utilisateur connecté");
        }

        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur connecté non trouvé: " + username));
    }

    // Vérifier si un utilisateur existe par username
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    // Vérifier si un utilisateur existe par email
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // Compter le nombre total d'utilisateurs
    public long countUsers() {
        return userRepository.count();
    }

    // Compter les utilisateurs actifs
    public long countActiveUsers() {
        return userRepository.countByIsActive(true);
    }
}