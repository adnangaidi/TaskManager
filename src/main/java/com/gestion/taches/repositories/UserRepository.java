package com.gestion.taches.repositories;

import com.gestion.taches.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    public Optional<User> findByUsername(String username);
    public Optional<User> findByEmail(String email);
    public boolean existsByUsername(String username);
    public boolean existsByEmail(String email);

    long countByIsActive(boolean b);
}
