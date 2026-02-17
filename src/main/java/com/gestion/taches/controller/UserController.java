package com.gestion.taches.controller;

import com.gestion.taches.dto.MessageResponse;
import com.gestion.taches.models.User;
import com.gestion.taches.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    @PutMapping("/{id}")
    public ResponseEntity<MessageResponse> updateProfile(@PathVariable Long id, @RequestBody User userDetails) {
        userService.updateUser(id, userDetails);
        return ResponseEntity.ok(new MessageResponse("Profil mis à jour avec succès"));
    }

    @PutMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(@RequestBody Map<String, String> passwords) {
        User currentUser = userService.getCurrentUser();
        userService.changePassword(
                currentUser.getId(),
                passwords.get("oldPassword"),
                passwords.get("newPassword")
        );
        return ResponseEntity.ok(new MessageResponse("Mot de passe changé avec succès"));
    }
}