package com.example.kyrsach.repository;

import com.example.kyrsach.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Требование: использование Optional для обработки потенциально null значений
    Optional<User> findByEmail(String email);
}