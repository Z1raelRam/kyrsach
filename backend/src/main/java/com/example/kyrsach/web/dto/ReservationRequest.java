package com.example.kyrsach.web.dto;

import java.time.LocalDateTime;

public record ReservationRequest(LocalDateTime startTime, LocalDateTime endTime, int participants) {
}