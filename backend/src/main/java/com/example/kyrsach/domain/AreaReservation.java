package com.example.kyrsach.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "area_reservations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AreaReservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int participants;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_area_id", nullable = false)
    private CommonArea commonArea;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    @Builder.Default // Важно для Lombok, чтобы дефолтное значение работало при .builder()
    private String status = "CONFIRMED";
}