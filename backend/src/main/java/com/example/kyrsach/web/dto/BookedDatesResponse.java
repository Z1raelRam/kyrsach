package com.example.kyrsach.web.dto;

import java.time.LocalDate;

// Задание DTO через record для передачи диапазонов занятых дат
public record BookedDatesResponse(LocalDate from, LocalDate to) {}