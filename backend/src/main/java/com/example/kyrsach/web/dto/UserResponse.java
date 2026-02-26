package com.example.kyrsach.web.dto;

// Использование record из новых версий Java (задание: Java 14+ record для DTO)
public record UserResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        String roleName
) {
}