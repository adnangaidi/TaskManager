package com.gestion.taches.controller;

import com.gestion.taches.dto.JwtResponse;
import com.gestion.taches.dto.LoginRequest;
import com.gestion.taches.dto.MessageResponse;
import com.gestion.taches.dto.SignupRequest;
import com.gestion.taches.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        String message = authService.registerUser(signupRequest);
        return ResponseEntity.ok(new MessageResponse(message));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logoutUser() {
        authService.logout();
        return ResponseEntity.ok(new MessageResponse("Déconnexion réussie"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<MessageResponse> refreshToken(@RequestHeader("Authorization") String token) {
        String newToken = authService.refreshToken(token.substring(7));
        return ResponseEntity.ok(new MessageResponse(newToken));
    }
}