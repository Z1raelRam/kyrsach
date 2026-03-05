package com.example.kyrsach.repository;

import com.example.kyrsach.domain.Hostel;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@DataJpaTest // Эта аннотация загружает только слой БД и автоматически поднимает H2 базу
class HostelRepositoryTest {

    @Autowired
    private HostelRepository hostelRepository;

    @Test
    void shouldSaveAndFindHostel() {
        // 1. Создаем тестовый хостел
        Hostel hostel = Hostel.builder()
                .name("Тестовый Хостел")
                .address("ул. Тестовая, 1")
                .description("Описание")
                .build();

        // 2. Сохраняем в БД
        Hostel savedHostel = hostelRepository.save(hostel);

        // 3. Проверяем, что сохранилось успешно и ID сгенерирован
        assertNotNull(savedHostel.getId());

        // 4. Достаем из БД и проверяем данные
        Hostel foundHostel = hostelRepository.findById(savedHostel.getId()).orElse(null);
        assertNotNull(foundHostel);
        assertEquals("Тестовый Хостел", foundHostel.getName());
    }
}