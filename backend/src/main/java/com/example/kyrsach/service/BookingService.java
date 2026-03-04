package com.example.kyrsach.service;

import com.example.kyrsach.domain.Bed;
import com.example.kyrsach.domain.Booking;
import com.example.kyrsach.domain.User;
import com.example.kyrsach.exception.ResourceNotFoundException;
import com.example.kyrsach.repository.BedRepository;
import com.example.kyrsach.repository.BookingRepository;
import com.example.kyrsach.web.dto.BookingDetailsResponse;
import com.example.kyrsach.web.dto.BookingRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BedRepository bedRepository;

    @Transactional
    public Booking createBooking(BookingRequest request, User user) {
        Bed bed = bedRepository.findById(request.bedId())
                .orElseThrow(() -> new ResourceNotFoundException("Койко-место с ID " + request.bedId() + " не найдено"));

        // ПРОВЕРКА ДОСТУПНОСТИ:
        if (request.checkInDate().isAfter(request.checkOutDate()) || request.checkInDate().isEqual(request.checkOutDate())) {
            throw new IllegalArgumentException("Дата выезда должна быть позже даты заезда");
        }

        boolean isConflict = bookingRepository.existsConflictingBooking(bed.getId(), request.checkInDate(), request.checkOutDate());
        if (isConflict) {
            throw new IllegalArgumentException("К сожалению, это место уже забронировано на выбранные даты.");
        }

        Booking booking = Booking.builder()
                .user(user)
                .bed(bed)
                .checkInDate(request.checkInDate())
                .checkOutDate(request.checkOutDate())
                .status("CONFIRMED")
                .build();

        return bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingDetailsResponse> getBookingsForUser(Long userId) {
        List<Booking> bookings = bookingRepository.findAllByUserId(userId);
        return bookings.stream().map(booking -> new BookingDetailsResponse(
                booking.getId(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getStatus(),
                booking.getBed().getRoom().getHostel().getName(),
                booking.getBed().getRoom().getRoomNumber(),
                booking.getBed().getBedNumber()
        )).collect(Collectors.toList());
    }

    // НОВЫЙ МЕТОД: Отмена бронирования
    @Transactional
    public void cancelBooking(Long bookingId, User user) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Бронирование не найдено"));

        // Проверяем, что это бронирование именно этого пользователя (или админа)
        if (!booking.getUser().getId().equals(user.getId()) && !user.getRole().getName().equals("ROLE_ADMIN")) {
            throw new IllegalArgumentException("Вы не можете отменить чужое бронирование");
        }

        // Проверяем бизнес-правило BR-4 (нельзя отменить менее чем за 24 часа)
        long daysBetween = ChronoUnit.DAYS.between(LocalDate.now(), booking.getCheckInDate());
        if (daysBetween < 1 && !user.getRole().getName().equals("ROLE_ADMIN")) {
            throw new IllegalArgumentException("Бронирование можно отменить не позднее, чем за 24 часа до заезда");
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }
}