package com.example.kyrsach.service;

import com.example.kyrsach.domain.Hostel;
import com.example.kyrsach.repository.HostelRepository;
import com.example.kyrsach.web.dto.HostelResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable; // Импорт
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HostelService {

    private final HostelRepository hostelRepository;

    @Transactional(readOnly = true)
    @Cacheable("hostels") // <-- ТЕПЕРЬ КЭШИРУЕМ ЗДЕСЬ!
    public Page<HostelResponse> getAllHostels(Pageable pageable) {
        return hostelRepository.findAll(pageable)
                .map(h -> new HostelResponse(h.getId(), h.getName(), h.getAddress(), h.getDescription()));
    }
}