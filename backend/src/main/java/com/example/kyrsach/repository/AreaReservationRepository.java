package com.example.kyrsach.repository;

import com.example.kyrsach.domain.AreaReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AreaReservationRepository extends JpaRepository<AreaReservation, Long> {

    // Получить бронирования конкретного пользователя
    @Query("SELECT r FROM AreaReservation r JOIN FETCH r.commonArea a JOIN FETCH a.hostel WHERE r.user.id = :userId")
    List<AreaReservation> findAllByUserId(@Param("userId") Long userId);

    // Проверяем, сколько броней пересекается с выбранным временем
    @Query("SELECT COUNT(r) FROM AreaReservation r WHERE r.commonArea.id = :areaId " +
            "AND (r.startTime < :endTime AND r.endTime > :startTime)")
    int countOverlappingReservations(@Param("areaId") Long areaId,
                                     @Param("startTime") LocalDateTime startTime,
                                     @Param("endTime") LocalDateTime endTime);
}