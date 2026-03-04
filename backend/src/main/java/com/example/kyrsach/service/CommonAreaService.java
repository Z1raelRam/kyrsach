package com.example.kyrsach.service;

import com.example.kyrsach.domain.AreaReservation;
import com.example.kyrsach.domain.CommonArea;
import com.example.kyrsach.domain.User;
import com.example.kyrsach.exception.ResourceNotFoundException;
import com.example.kyrsach.repository.AreaReservationRepository;
import com.example.kyrsach.repository.CommonAreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommonAreaService {

    private final CommonAreaRepository commonAreaRepository;
    private final AreaReservationRepository areaReservationRepository;

    public List<CommonArea> getAreasByHostelId(Long hostelId) {
        return commonAreaRepository.findByHostelId(hostelId);
    }

    @Transactional
    public AreaReservation createReservation(Long areaId, LocalDateTime start, LocalDateTime end, User user) {
        if (start.isAfter(end) || start.isEqual(end)) {
            throw new IllegalArgumentException("Время окончания должно быть позже времени начала.");
        }

        CommonArea area = commonAreaRepository.findById(areaId)
                .orElseThrow(() -> new ResourceNotFoundException("Общая зона не найдена"));

        // Проверка: не превышен ли лимит людей в зоне
        int currentReservations = areaReservationRepository.countOverlappingReservations(areaId, start, end);
        if (currentReservations >= area.getCapacity()) {
            throw new IllegalArgumentException("На это время зона уже полностью забронирована (достигнут лимит в " + area.getCapacity() + " чел.).");
        }

        AreaReservation reservation = AreaReservation.builder()
                .commonArea(area)
                .user(user)
                .startTime(start)
                .endTime(end)
                .build();

        return areaReservationRepository.save(reservation);
    }

    public List<AreaReservation> getMyReservations(Long userId) {
        return areaReservationRepository.findAllByUserId(userId);
    }
}