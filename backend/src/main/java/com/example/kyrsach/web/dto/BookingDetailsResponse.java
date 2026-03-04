package com.example.kyrsach.web.dto;

import java.time.LocalDate;

public record BookingDetailsResponse(
        Long bookingId,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        String status,
        String hostelName,
        String roomNumber,
        String bedNumber
) {}