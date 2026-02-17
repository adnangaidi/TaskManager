package com.gestion.taches.repositories;
 import com.gestion.taches.enums.ERole;
 import com.gestion.taches.models.Role;
 import org.springframework.data.jpa.repository.JpaRepository;
 import java.util.Optional;
public interface RoleRepository extends JpaRepository<Role, Long> {
// public Optional<Role> findByERole(String role);
// public Optional<Role> findByERole(String role, Long id);
// public Role findByName(String name);

 Optional<Object> findByName(ERole eRole);
}
