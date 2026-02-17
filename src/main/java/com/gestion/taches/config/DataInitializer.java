package com.gestion.taches.config;

import com.gestion.taches.dto.SignupRequest;
import com.gestion.taches.enums.ERole;
import com.gestion.taches.enums.TaskStatus;
import com.gestion.taches.models.Role;
import com.gestion.taches.models.Task;
import com.gestion.taches.models.User;
import com.gestion.taches.repositories.RoleRepository;
import com.gestion.taches.repositories.TaskRepository;
import com.gestion.taches.repositories.UserRepository;
import com.gestion.taches.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private AuthService authService;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;
    @Override
    public void run(String... args) throws Exception {
        // Créer les rôles s'ils n'existent pas
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(ERole.ROLE_USER));
            roleRepository.save(new Role(ERole.ROLE_MODERATOR));
            roleRepository.save(new Role(ERole.ROLE_ADMIN));

            System.out.println("Rôles initialisés avec succès!");
        }
        if (roleRepository.count() >0) {
//            Set<Role> roles = new HashSet<>();
//            roles.add(new Role(ERole.ROLE_ADMIN));
//            User user = new User();
//            user.setUsername("admin");
//            user.setPassword("admin1");
//            user.setRoles(roles);
//            user.setEmail("admin@gestion.com");
//            authService.userRepository.save(user);
            SignupRequest signupRequest = new SignupRequest();
            signupRequest.setUsername("admin");
            signupRequest.setPassword("admin1");
            signupRequest.setEmail("admin@gestion.com");

            authService.registerUser(signupRequest);
            if (userRepository.count()>0) {
                for (int i = 1; i <= 20; i++) {
                    Task task = new Task();
                    task.setTitle("Task " + i);
                    task.setDescription("Description " + i);
                    task.setStatus(TaskStatus.EN_COURS);
                    taskRepository.save(task);
                    System.out.println("Rôles initialisés avec succès!");
                }
            }

        }
    }
}