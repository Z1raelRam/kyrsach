package com.example.kyrsach.web.controller;

import com.example.kyrsach.repository.AreaReservationRepository;
import com.example.kyrsach.repository.BookingRepository;
import com.example.kyrsach.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final AreaReservationRepository areaReservationRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Защита: только для админов!
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        // Собираем ключевые метрики (KPI)
        long totalUsers = userRepository.count();
        long totalBookings = bookingRepository.count();
        long totalAreaReservations = areaReservationRepository.count();

        return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "totalBookings", totalBookings,
                "totalAreaReservations", totalAreaReservations
        ));
    }
}