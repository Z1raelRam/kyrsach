package com.example.kyrsach.web.controller;

import com.example.kyrsach.domain.User;
import com.example.kyrsach.service.UserService;
import com.example.kyrsach.web.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Получить данные ТЕКУЩЕГО пользователя
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getUserById(user.getId()));
    }

    // Обновить данные ТЕКУЩЕГО пользователя
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> updateCurrentUser(
            @AuthenticationPrincipal User user,
            @RequestBody UpdateProfileRequest request) {
        UserResponse updated = userService.updateProfile(user.getId(), request.firstName(), request.lastName(), request.password());
        return ResponseEntity.ok(updated);
    }

    // Для админа - список всех
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }
}

// DTO прямо здесь
record UpdateProfileRequest(String firstName, String lastName, String password) {}