package com.example.kyrsach.web.controller;

import com.example.kyrsach.domain.Hostel;
import com.example.kyrsach.exception.ResourceNotFoundException;
import com.example.kyrsach.repository.HostelRepository;
import com.example.kyrsach.service.HostelService; // <-- ДОБАВЛЕН ИМПОРТ НОВОГО СЕРВИСА
import com.example.kyrsach.web.dto.BedResponse;
import com.example.kyrsach.web.dto.HostelCreateRequest;
import com.example.kyrsach.web.dto.HostelDetailsResponse;
import com.example.kyrsach.web.dto.HostelResponse;
import com.example.kyrsach.web.dto.RoomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hostels")
@RequiredArgsConstructor
public class HostelController {

    private final HostelRepository hostelRepository;
    private final HostelService hostelService; // <-- ИНЖЕКТИРУЕМ НОВЫЙ СЕРВИС

    @GetMapping
    // @Cacheable("hostels") // <-- УБРАЛИ ОТСЮДА!
    public ResponseEntity<Page<HostelResponse>> getAllHostels(Pageable pageable) {
        // ТЕПЕРЬ ВЫЗЫВАЕМ СЕРВИС, КОТОРЫЙ УЖЕ КЭШИРУЕТ!
        return ResponseEntity.ok(hostelService.getAllHostels(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<List<HostelResponse>> searchHostels(@RequestParam String keyword) {
        return ResponseEntity.ok(hostelRepository.searchHostelsCustom(keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HostelDetailsResponse> getHostelById(@PathVariable Long id) {
        Hostel hostel = hostelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Хостел с ID " + id + " не найден"));

        List<RoomResponse> roomResponses = hostel.getRooms().stream()
                .map(room -> {
                    List<BedResponse> bedResponses = room.getBeds().stream()
                            .map(bed -> new BedResponse(bed.getId(), bed.getBedNumber()))
                            .toList();
                    return new RoomResponse(room.getId(), room.getRoomNumber(), room.getType(), room.getCapacity(), bedResponses);
                })
                .toList();

        HostelDetailsResponse response = new HostelDetailsResponse(
                hostel.getId(), hostel.getName(), hostel.getAddress(), hostel.getDescription(), roomResponses
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HostelResponse> createHostel(@RequestBody HostelCreateRequest request) {
        Hostel hostel = Hostel.builder()
                .name(request.name())
                .address(request.address())
                .description(request.description())
                .build();

        Hostel saved = hostelRepository.save(hostel);
        return ResponseEntity.ok(new HostelResponse(saved.getId(), saved.getName(), saved.getAddress(), saved.getDescription()));
    }
}