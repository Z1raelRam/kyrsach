package com.example.kyrsach.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "common_areas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CommonArea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hostel_id", nullable = false)
    private Hostel hostel;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int capacity; // Максимальное количество человек одновременно
}