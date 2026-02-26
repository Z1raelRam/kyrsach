package com.example.kyrsach.service;

import com.example.kyrsach.domain.User;
import com.example.kyrsach.exception.ResourceNotFoundException;
import com.example.kyrsach.repository.UserRepository;
import com.example.kyrsach.web.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        // Использование Optional и кастомного исключения (лямбда)
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь с ID " + id + " не найден"));

        return mapToResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();

        // Требование: Stream API, лямбда-выражения
        return users.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Вспомогательный метод маппинга Entity -> Record (DTO)
    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().getName()
        );
    }
}