package com.example.kyrsach.web.dto;

import java.util.List;

public record HostelDetailsResponse(
        Long id,
        String name,
        String address,
        String description,
        List<RoomResponse> rooms
) {}