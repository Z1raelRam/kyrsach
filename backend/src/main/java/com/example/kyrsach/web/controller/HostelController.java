package com.example.kyrsach.web.controller;

import com.example.kyrsach.domain.Hostel;
import com.example.kyrsach.exception.ResourceNotFoundException;
import com.example.kyrsach.repository.HostelRepository;
import com.example.kyrsach.web.dto.BedResponse;
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

    @GetMapping
    public ResponseEntity<Page<HostelResponse>> getAllHostels(Pageable pageable) {
        Page<HostelResponse> hostels = hostelRepository.findAll(pageable)
                .map(h -> new HostelResponse(h.getId(), h.getName(), h.getAddress(), h.getDescription()));
        return ResponseEntity.ok(hostels);
    }

    @GetMapping("/search")
    public ResponseEntity<List<HostelResponse>> searchHostels(@RequestParam String keyword) {
        return ResponseEntity.ok(hostelRepository.searchHostelsCustom(keyword));
    }

    // ПОЛНОСТЬЮ ОБНОВЛЕННЫЙ МЕТОД
    @GetMapping("/{id}")
    public ResponseEntity<HostelDetailsResponse> getHostelById(@PathVariable Long id) {
        Hostel hostel = hostelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Хостел с ID " + id + " не найден"));

        // Собираем DTO для комнат, а внутри них - DTO для койко-мест
        List<RoomResponse> roomResponses = hostel.getRooms().stream()
                .map(room -> {
                    List<BedResponse> bedResponses = room.getBeds().stream()
                            .map(bed -> new BedResponse(bed.getId(), bed.getBedNumber()))
                            .toList();
                    return new RoomResponse(room.getId(), room.getRoomNumber(), room.getType(), room.getCapacity(), bedResponses);
                })
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