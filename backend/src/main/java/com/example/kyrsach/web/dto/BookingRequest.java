package com.example.kyrsach.web.dto;

import java.time.LocalDate;

public record BookingRequest(
        Long bedId,
        LocalDate checkInDate,
        LocalDate checkOutDate
) {}