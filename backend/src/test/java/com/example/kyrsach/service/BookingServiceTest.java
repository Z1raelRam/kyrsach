package com.example.kyrsach.service;

import com.example.kyrsach.domain.Bed;
import com.example.kyrsach.domain.Booking;
import com.example.kyrsach.domain.Role;
import com.example.kyrsach.domain.User;
import com.example.kyrsach.repository.BedRepository;
import com.example.kyrsach.repository.BookingRepository;
import com.example.kyrsach.web.dto.BookingRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Включаем поддержку Mockito
class BookingServiceTest {

    @Mock // Имитируем (мокаем) репозиторий, чтобы не лезть в реальную БД
    private BookingRepository bookingRepository;

    @Mock
    private BedRepository bedRepository;

    @InjectMocks // Внедряем моки в наш настоящий сервис
    private BookingService bookingService;

    private User mockUser;
    private Bed mockBed;

    @BeforeEach
    void setUp() {
        Role role = new Role(1L, "ROLE_GUEST");
        mockUser = new User(1L, "test@mail.com", "pass", "Ivan", "Ivanov", role);
        mockBed = new Bed(10L, null, "1A");
    }

    @Test
    void createBooking_Success_WhenDatesAreValidAndNoConflicts() {
        // 1. Подготовка данных (Arrange)
        BookingRequest request = new BookingRequest(10L, LocalDate.now().plusDays(1), LocalDate.now().plusDays(5));

        when(bedRepository.findById(10L)).thenReturn(Optional.of(mockBed));
        when(bookingRepository.existsConflictingBooking(10L, request.checkInDate(), request.checkOutDate())).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // 2. Выполнение (Act)
        Booking result = bookingService.createBooking(request, mockUser);

        // 3. Проверка (Assert)
        assertNotNull(result);
        assertEquals("CONFIRMED", result.getStatus());
        assertEquals(mockUser, result.getUser());
        verify(bookingRepository, times(1)).save(any(Booking.class)); // Проверяем, что метод save был вызван 1 раз
    }

    @Test
    void createBooking_ThrowsException_WhenCheckOutIsBeforeCheckIn() {
        // 1. Подготовка данных (неправильные даты: выезд раньше заезда)
        BookingRequest request = new BookingRequest(10L, LocalDate.now().plusDays(5), LocalDate.now().plusDays(1));
        when(bedRepository.findById(10L)).thenReturn(Optional.of(mockBed));

        // 2 & 3. Выполнение и проверка
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(request, mockUser);
        });

        assertEquals("Дата выезда должна быть позже даты заезда", exception.getMessage());
        verify(bookingRepository, never()).save(any()); // Убеждаемся, что в БД ничего не сохранилось
    }

    @Test
    void createBooking_ThrowsException_WhenDatesOverlap() {
        // 1. Подготовка (эмулируем, что место уже занято)
        BookingRequest request = new BookingRequest(10L, LocalDate.now().plusDays(1), LocalDate.now().plusDays(5));
        when(bedRepository.findById(10L)).thenReturn(Optional.of(mockBed));
        when(bookingRepository.existsConflictingBooking(10L, request.checkInDate(), request.checkOutDate())).thenReturn(true);

        // 2 & 3. Выполнение и проверка
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(request, mockUser);
        });

        assertTrue(exception.getMessage().contains("уже забронировано"));
        verify(bookingRepository, never()).save(any());
    }
}