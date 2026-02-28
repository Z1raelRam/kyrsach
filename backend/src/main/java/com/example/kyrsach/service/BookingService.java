package com.example.kyrsach.service;

import com.example.kyrsach.domain.Bed;
import com.example.kyrsach.domain.Booking;
import com.example.kyrsach.domain.User;
import com.example.kyrsach.exception.ResourceNotFoundException;
import com.example.kyrsach.repository.BedRepository;
import com.example.kyrsach.repository.BookingRepository;
import com.example.kyrsach.web.dto.BookingRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BedRepository bedRepository;

    @Transactional
    public Booking createBooking(BookingRequest request, User user) {
        Bed bed = bedRepository.findById(request.bedId())
                .orElseThrow(() -> new ResourceNotFoundException("Койко-место с ID " + request.bedId() + " не найдено"));

        // TODO: Добавить логику проверки, не занято ли место на эти даты

        Booking booking = Booking.builder()
                .user(user)
                .bed(bed)
                .checkInDate(request.checkInDate())
                .checkOutDate(request.checkOutDate())
                .status("CONFIRMED")
                .build();

        return bookingRepository.save(booking);
    }
}