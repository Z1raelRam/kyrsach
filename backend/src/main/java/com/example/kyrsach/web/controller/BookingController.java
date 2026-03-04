package com.example.kyrsach.web.controller;

import com.example.kyrsach.domain.User;
import com.example.kyrsach.service.BookingService;
import com.example.kyrsach.web.dto.BookingDetailsResponse;
import com.example.kyrsach.web.dto.BookingRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.example.kyrsach.web.dto.BookedDatesResponse;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request, @AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(bookingService.createBooking(request, user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingDetailsResponse>> getMyBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getBookingsForUser(user.getId()));
    }

    @GetMapping("/beds/{bedId}/booked-dates")
    public ResponseEntity<List<BookedDatesResponse>> getBookedDates(@PathVariable Long bedId) {
        return ResponseEntity.ok(bookingService.getBookedDatesForBed(bedId));
    }

    // НОВЫЙ МЕТОД
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, @AuthenticationPrincipal User user) {
        try {
            bookingService.cancelBooking(id, user);
            return ResponseEntity.ok(Map.of("message", "Бронирование успешно отменено"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}