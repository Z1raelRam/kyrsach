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

    // Получить бронирования конкретного пользователя (отсортированные по дате)
    @Query("SELECT r FROM AreaReservation r JOIN FETCH r.commonArea a JOIN FETCH a.hostel WHERE r.user.id = :userId ORDER BY r.startTime DESC")
    List<AreaReservation> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(r.participants) FROM AreaReservation r WHERE r.commonArea.id = :areaId AND r.status = 'CONFIRMED' " +
            "AND (r.startTime < :endTime AND r.endTime > :startTime)")
    Integer sumOverlappingParticipants(@Param("areaId") Long areaId,
                                       @Param("startTime") LocalDateTime startTime,
                                       @Param("endTime") LocalDateTime endTime);

    // Подсчет активных (CONFIRMED) бронирований для проверки вместимости
    @Query("SELECT COUNT(r) FROM AreaReservation r WHERE r.commonArea.id = :areaId AND r.status = 'CONFIRMED' " +
            "AND (r.startTime < :endTime AND r.endTime > :startTime)")
    int countOverlappingReservations(@Param("areaId") Long areaId,
                                     @Param("startTime") LocalDateTime startTime,
                                     @Param("endTime") LocalDateTime endTime);

    // Получение будущих занятых слотов (игнорируя отмененные)
    @Query("SELECT r FROM AreaReservation r WHERE r.commonArea.id = :areaId AND r.status = 'CONFIRMED' AND r.endTime > CURRENT_TIMESTAMP ORDER BY r.startTime ASC")
    List<AreaReservation> findFutureReservationsByAreaId(@Param("areaId") Long areaId);
}