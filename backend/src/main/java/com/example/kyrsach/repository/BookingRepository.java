package com.example.kyrsach.repository;

import com.example.kyrsach.domain.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b JOIN FETCH b.bed bed JOIN FETCH bed.room r JOIN FETCH r.hostel WHERE b.user.id = :userId")
    List<Booking> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT b FROM Booking b WHERE b.bed.id = :bedId AND b.status = 'CONFIRMED' AND b.checkOutDate >= CURRENT_DATE")
    List<Booking> findActiveBookingsByBedId(@Param("bedId") Long bedId);

    // Запрос для проверки: есть ли уже активные брони на это место в эти даты
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.bed.id = :bedId AND b.status = 'CONFIRMED' " +
            "AND (b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate)")
    boolean existsConflictingBooking(@Param("bedId") Long bedId,
                                     @Param("checkInDate") LocalDate checkInDate,
                                     @Param("checkOutDate") LocalDate checkOutDate);
}

