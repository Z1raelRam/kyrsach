package com.example.kyrsach.web.controller;

import com.example.kyrsach.service.UserService;
import com.example.kyrsach.web.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Требование: Role-based (RBAC) и Method-based authorization
    // Этот метод сможет вызвать только пользователь с ролью ADMIN
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    // А этот метод доступен любому авторизованному пользователю (и админу, и гостю)
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public UserResponse getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }
}