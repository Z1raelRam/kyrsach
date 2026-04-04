package com.example.kyrsach.web.controller;

import com.example.kyrsach.domain.User;
import com.example.kyrsach.service.CommonAreaService;
import com.example.kyrsach.web.dto.ReservationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CommonAreaController {

    private final CommonAreaService commonAreaService;

    @GetMapping("/hostels/{hostelId}/common-areas")
    public ResponseEntity<?> getCommonAreas(@PathVariable Long hostelId) {
        var areas = commonAreaService.getAreasByHostelId(hostelId).stream()
                .map(a -> new CommonAreaResponse(a.getId(), a.getName(), a.getCapacity()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(areas);
    }

    @PostMapping("/common-areas/{areaId}/reserve")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> reserveArea(@PathVariable Long areaId,
                                         @RequestBody ReservationRequest req,
                                         @AuthenticationPrincipal User user) {
        try {
            // Теперь передаем 5 аргументов
            commonAreaService.createReservation(areaId, req.startTime(), req.endTime(), req.participants(), user);
            return ResponseEntity.ok(Map.of("message", "Общая зона успешно забронирована"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/common-areas/my-reservations")
    public ResponseEntity<?> getMyAreaReservations(@AuthenticationPrincipal User user) {
        var reservations = commonAreaService.getMyReservations(user.getId()).stream()
                .map(r -> new ReservationDetailsResponse(
                        r.getId(),
                        r.getCommonArea().getHostel().getName(),
                        r.getCommonArea().getName(),
                        r.getStartTime(),
                        r.getEndTime(),
                        r.getStatus()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/common-areas/{areaId}/booked-slots")
    public ResponseEntity<?> getBookedSlots(@PathVariable Long areaId) {
        var slots = commonAreaService.getFutureReservationsForArea(areaId).stream()
                .map(r -> new BookedSlotResponse(r.getStartTime(), r.getEndTime(), r.getParticipants()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(slots);
    }

    @PatchMapping("/common-areas/reservations/{id}/cancel")
    public ResponseEntity<?> cancelAreaReservation(@PathVariable Long id, @AuthenticationPrincipal User user) {
        try {
            commonAreaService.cancelReservation(id, user);
            return ResponseEntity.ok(Map.of("message", "Бронь зоны отменена"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

// --- DTO ---
record CommonAreaResponse(Long id, String name, int capacity) {}
record ReservationDetailsResponse(Long id, String hostelName, String areaName, LocalDateTime startTime, LocalDateTime endTime, String status) {}
record BookedSlotResponse(LocalDateTime start, LocalDateTime end, int participants) {}