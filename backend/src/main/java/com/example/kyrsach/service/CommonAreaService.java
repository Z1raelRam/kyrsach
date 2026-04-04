package com.example.kyrsach.service;
import com.example.kyrsach.domain.AreaReservation;
import com.example.kyrsach.domain.CommonArea;
import com.example.kyrsach.domain.User;
import com.example.kyrsach.exception.ResourceNotFoundException;
import com.example.kyrsach.repository.AreaReservationRepository;
import com.example.kyrsach.repository.BookingRepository;
import com.example.kyrsach.repository.CommonAreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommonAreaService {

    private final CommonAreaRepository commonAreaRepository;
    private final AreaReservationRepository areaReservationRepository;
    private final BookingRepository bookingRepository; // ДОБАВИЛИ ЭТО ПОЛЕ

    public List<CommonArea> getAreasByHostelId(Long hostelId) {
        return commonAreaRepository.findByHostelId(hostelId);
    }

    @Transactional
    public AreaReservation createReservation(Long areaId, LocalDateTime start, LocalDateTime end, int participants, User user) {
        if (start.isBefore(LocalDateTime.now())) throw new IllegalArgumentException("Нельзя забронировать на прошедшее время.");
        if (start.isAfter(end) || start.isEqual(end)) throw new IllegalArgumentException("Неверный временной интервал.");
        if (participants <= 0) throw new IllegalArgumentException("Количество людей должно быть больше 0.");

        CommonArea area = commonAreaRepository.findById(areaId)
                .orElseThrow(() -> new ResourceNotFoundException("Общая зона не найдена"));

        // ПРОВЕРКА: Проживает ли гость в этом же хостеле (используем BookingRepository)
        boolean isStaying = bookingRepository.findAllByUserId(user.getId()).stream()
                .anyMatch(b -> b.getBed().getRoom().getHostel().getId().equals(area.getHostel().getId()) &&
                        b.getCheckInDate().isBefore(end.toLocalDate().plusDays(1)) &&
                        b.getCheckOutDate().isAfter(start.toLocalDate().minusDays(1)));

        if (!isStaying) {
            throw new IllegalArgumentException("Вы можете бронировать общие зоны только в том хостеле, где вы проживаете!");
        }

        // ПРОВЕРКА: Не бронировал ли этот же гость эту же зону на это время ранее?
        boolean alreadyBookedByMe = areaReservationRepository.findAllByUserId(user.getId()).stream()
                .anyMatch(r -> r.getCommonArea().getId().equals(areaId) &&
                        r.getStatus().equals("CONFIRMED") &&
                        r.getStartTime().isBefore(end) && r.getEndTime().isAfter(start));
        if (alreadyBookedByMe) {
            throw new IllegalArgumentException("Вы уже забронировали эту зону на данное время.");
        }

        // ПРОВЕРКА: Вместимость
        Integer currentParticipants = areaReservationRepository.sumOverlappingParticipants(areaId, start, end);
        int totalOccupied = (currentParticipants == null) ? 0 : currentParticipants;

        if (totalOccupied + participants > area.getCapacity()) {
            throw new IllegalArgumentException("Недостаточно мест! Свободно только " + (area.getCapacity() - totalOccupied) + " мест.");
        }

        AreaReservation reservation = AreaReservation.builder()
                .commonArea(area)
                .user(user)
                .startTime(start)
                .endTime(end)
                .status("CONFIRMED")
                .participants(participants)
                .build();

        return areaReservationRepository.save(reservation);
    }

    @Transactional(readOnly = true)
    public List<AreaReservation> getMyReservations(Long userId) {
        return areaReservationRepository.findAllByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<AreaReservation> getFutureReservationsForArea(Long areaId) {
        return areaReservationRepository.findFutureReservationsByAreaId(areaId);
    }

    @Transactional
    public void cancelReservation(Long id, User user) {
        AreaReservation res = areaReservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Бронь не найдена"));

        if (!res.getUser().getId().equals(user.getId()) && !user.getRole().getName().equals("ROLE_ADMIN")) {
            throw new IllegalArgumentException("Вы не можете отменить чужую бронь");
        }

        long hoursBetween = ChronoUnit.HOURS.between(LocalDateTime.now(), res.getStartTime());
        if (hoursBetween < 2 && !user.getRole().getName().equals("ROLE_ADMIN")) {
            throw new IllegalArgumentException("Отменить зону можно минимум за 2 часа до начала");
        }

        res.setStatus("CANCELLED");
        areaReservationRepository.save(res);
    }
}