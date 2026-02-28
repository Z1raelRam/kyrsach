package com.example.kyrsach.bootstrap;

import com.example.kyrsach.domain.Role;
import com.example.kyrsach.domain.User;
import com.example.kyrsach.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Проверяем, есть ли уже пользователи в базе
        if (userRepository.count() == 0) {

            // Создаем роль ADMIN
            Role adminRole = new Role();
            adminRole.setId(2L); // 2L, т.к. в V1__init_schema.sql мы создали ROLE_GUEST (1) и ROLE_ADMIN (2)
            adminRole.setName("ROLE_ADMIN");

            // Создаем Админа
            User admin = User.builder()
                    .email("admin@hostel.com")
                    .password(passwordEncoder.encode("admin123")) // Пароль зашифруется автоматически!
                    .firstName("Иван")
                    .lastName("Админов")
                    .role(adminRole)
                    .build();

            // Создаем роль GUEST
            Role guestRole = new Role();
            guestRole.setId(1L);
            guestRole.setName("ROLE_GUEST");

            // Создаем обычного пользователя
            User guest = User.builder()
                    .email("guest@hostel.com")
                    .password(passwordEncoder.encode("guest123"))
                    .firstName("Петр")
                    .lastName("Гостев")
                    .role(guestRole)
                    .build();

            userRepository.save(admin);
            userRepository.save(guest);

            System.out.println("Тестовые пользователи успешно созданы!");
        }
    }
}