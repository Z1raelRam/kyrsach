package com.example.kyrsach.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtils {

    @Value("${jwt.secret}") // Получаем секретный ключ из application.properties
    private String secret;

    @Value("${jwt.expiration}") // Время жизни токена (в миллисекундах)
    private Long jwtExpiration;

    @Value("${jwt.refresh.expiration}") // Время жизни refresh токена (в миллисекундах)
    private Long refreshExpiration;

    // Генерирует JWT токен для пользователя
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername(), jwtExpiration);
    }

    // Генерирует Refresh токен для пользователя
    public String generateRefreshToken(UserDetails userDetails) {
        return createToken(new HashMap<>(), userDetails.getUsername(), refreshExpiration);
    }

    // Создаёт JWT токен
    private String createToken(Map<String, Object> claims, String subject, Long expiration) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    // Извлекает username из JWT токена
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Извлекает claim из JWT токена
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Извлекает все claims из JWT токена
    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
    }

    // Проверяет, не истек ли JWT токен
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Извлекает дату истечения срока действия из JWT токена
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Проверяет, является ли токен валидным для данного пользователя
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}