package com.example.kyrsach.security;

import com.example.kyrsach.domain.Role;
import com.example.kyrsach.domain.User;
import com.example.kyrsach.repository.RoleRepository;
import com.example.kyrsach.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // Получаем email из GitHub
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String login = oAuth2User.getAttribute("login"); // запасной вариант, если name null

        if (email == null) {
            email = login + "@github.com"; // Генерация заглушки, если email скрыт
        }

        // Ищем пользователя или создаем нового
        String finalEmail = email;
        String finalName = name != null ? name : login;
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            Role guestRole = roleRepository.findByName("ROLE_GUEST")
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            User newUser = User.builder()
                    .email(finalEmail)
                    .password("") // Пароль не нужен при OAuth
                    .firstName(finalName)
                    .lastName("GitHubUser")
                    .role(guestRole)
                    .build();
            return userRepository.save(newUser);
        });

        // Генерируем JWT токен
        String token = jwtUtils.generateToken(user);
        String role = user.getRole().getName();

        // Перенаправляем на фронтенд с токеном в URL
        String targetUrl = "http://localhost:5173/login?token=" + token + "&role=" + role;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}