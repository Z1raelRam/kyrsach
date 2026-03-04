package com.example.kyrsach.web.controller.auth;

import com.example.kyrsach.security.JwtUtils;
import com.example.kyrsach.service.UserService;
import com.example.kyrsach.web.dto.LoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwtToken = jwtUtils.generateToken(userDetails);
            String refreshToken = jwtUtils.generateRefreshToken(userDetails);
            String role = userDetails.getAuthorities().iterator().next().getAuthority();

            return ResponseEntity.ok(Map.of("token", jwtToken, "refreshToken", refreshToken, "role", role));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Неверный email или пароль"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    // НОВЫЙ ЭНДПОИНТ: Регистрация
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            userService.registerGuest(request.email(), request.password(), request.firstName(), request.lastName());
            return ResponseEntity.ok(Map.of("message", "Регистрация успешна"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Внутренняя ошибка сервера"));
        }
    }
}

// DTO для регистрации
record RegisterRequest(String email, String password, String firstName, String lastName) {}