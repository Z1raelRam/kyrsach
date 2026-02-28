package com.example.kyrsach.web.controller;

import com.example.kyrsach.domain.Hostel;
import com.example.kyrsach.exception.ResourceNotFoundException;
import com.example.kyrsach.repository.HostelRepository;
import com.example.kyrsach.web.dto.HostelDetailsResponse;
import com.example.kyrsach.web.dto.HostelResponse;
import com.example.kyrsach.web.dto.RoomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hostels")
@RequiredArgsConstructor
public class HostelController {

    private final HostelRepository hostelRepository;

    // Требование: пагинация через Pageable (Spring)
    @GetMapping
    public ResponseEntity<Page<HostelResponse>> getAllHostels(Pageable pageable) {
        Page<HostelResponse> hostels = hostelRepository.findAll(pageable)
                .map(h -> new HostelResponse(h.getId(), h.getName(), h.getAddress(), h.getDescription()));
        return ResponseEntity.ok(hostels);
    }

    // Требование: использование кастомного поиска через JdbcTemplate
    @GetMapping("/search")
    public ResponseEntity<List<HostelResponse>> searchHostels(@RequestParam String keyword) {
        return ResponseEntity.ok(hostelRepository.searchHostelsCustom(keyword));
    }

    // НОВЫЙ МЕТОД
    @GetMapping("/{id}")
    public ResponseEntity<HostelDetailsResponse> getHostelById(@PathVariable Long id) {
        Hostel hostel = hostelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Хостел с ID " + id + " не найден"));

        // Используем Stream API для конвертации сущностей комнат в DTO
        List<RoomResponse> roomResponses = hostel.getRooms().stream()
                .map(room -> new RoomResponse(room.getId(), room.getRoomNumber(), room.getType(), room.getCapacity()))
                .toList();

        HostelDetailsResponse response = new HostelDetailsResponse(
                hostel.getId(),
                hostel.getName(),
                hostel.getAddress(),
                hostel.getDescription(),
                roomResponses
        );
        return ResponseEntity.ok(response);
    }
}