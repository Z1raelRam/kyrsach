package com.example.kyrsach.web.dto;

import java.util.List;

public record RoomResponse(
        Long id,
        String roomNumber,
        String type,
        int capacity,
        List<BedResponse> beds // Добавили список мест
) {
}