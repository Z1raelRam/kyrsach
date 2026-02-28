package com.example.kyrsach.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

// Паттерн Builder (1 из 3 требуемых) реализован через аннотацию @Builder
@Entity
@Table(name = "hostels")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Hostel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    private String description;

    // НОВОЕ ПОЛЕ: Связь "один ко многим" с комнатами
    @OneToMany(mappedBy = "hostel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Room> rooms = new ArrayList<>();
}