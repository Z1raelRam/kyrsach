package com.example.kyrsach.web.controller;

import com.example.kyrsach.domain.AreaReservation;
import com.example.kyrsach.domain.User;
import com.example.kyrsach.service.CommonAreaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CommonAreaController {

    private final CommonAreaService commonAreaService;

    // 1. Получить список зон для конкретного хостела
    @GetMapping("/hostels/{hostelId}/common-areas")
    public ResponseEntity<?> getCommonAreas(@PathVariable Long hostelId) {
        var areas = commonAreaService.getAreasByHostelId(hostelId).stream()
                .map(a -> new CommonAreaResponse(a.getId(), a.getName(), a.getCapacity()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(areas);
    }

    // 2. Забронировать общую зону
    @PostMapping("/common-areas/{areaId}/reserve")
    public ResponseEntity<?> reserveArea(@PathVariable Long areaId,
                                         @RequestBody ReservationRequest req,
                                         @AuthenticationPrincipal User user) {
        try {
            commonAreaService.createReservation(areaId, req.startTime(), req.endTime(), user);
            return ResponseEntity.ok(Map.of("message", "Общая зона успешно забронирована"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 3. Получить мои бронирования общих зон
    @GetMapping("/common-areas/my-reservations")
    public ResponseEntity<?> getMyAreaReservations(@AuthenticationPrincipal User user) {
        var reservations = commonAreaService.getMyReservations(user.getId()).stream()
                .map(r -> new ReservationDetailsResponse(
                        r.getId(),
                        r.getCommonArea().getHostel().getName(),
                        r.getCommonArea().getName(),
                        r.getStartTime(),
                        r.getEndTime()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(reservations);
    }
}

// --- DTO прямо в этом файле для удобства ---
record CommonAreaResponse(Long id, String name, int capacity) {}
record ReservationRequest(LocalDateTime startTime, LocalDateTime endTime) {}
record ReservationDetailsResponse(Long id, String hostelName, String areaName, LocalDateTime startTime, LocalDateTime endTime) {}