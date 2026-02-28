package com.example.kyrsach.web.controller;

import com.example.kyrsach.domain.User;
import com.example.kyrsach.service.BookingService;
import com.example.kyrsach.web.dto.BookingRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request, @AuthenticationPrincipal User user) {
        // @AuthenticationPrincipal User user - Spring Security автоматически достает текущего юзера из JWT токена
        return ResponseEntity.ok(bookingService.createBooking(request, user));
    }
}