package com.example.kyrsach.service;

import com.example.kyrsach.domain.User;
import com.example.kyrsach.exception.ResourceNotFoundException;
import com.example.kyrsach.repository.UserRepository;
import com.example.kyrsach.web.dto.UserResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Написали конструктор вручную вместо @RequiredArgsConstructor, чтобы добавить @Lazy
    // @Lazy спасает нас от ошибки циклической зависимости (Circular Dependency)
    public UserService(UserRepository userRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь с ID " + id + " не найден"));

        return mapToResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // --- НОВЫЙ МЕТОД ДЛЯ SPRING SECURITY ---
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден с email: " + email));
    }

    // --- НОВЫЙ МЕТОД ДЛЯ РЕГИСТРАЦИИ ---
    @Transactional
    public User createUser(User user) {
        // Перед сохранением в БД обязательно шифруем пароль
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
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