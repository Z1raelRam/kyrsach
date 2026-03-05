package com.example.kyrsach.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest // Поднимает весь контекст приложения (реальную интеграцию)
@AutoConfigureMockMvc // Позволяет отправлять HTTP-запросы к нашему API
class HostelControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "GUEST") // Эмулируем авторизованного пользователя
    void getAllHostels_ShouldReturnPageOfHostels() throws Exception {
        // Отправляем GET запрос на получение хостелов и проверяем ответ
        mockMvc.perform(get("/api/v1/hostels"))
                .andExpect(status().isOk()) // Ожидаем HTTP 200 OK
                .andExpect(jsonPath("$.content").exists()) // Ожидаем, что в JSON есть массив content (пагинация)
                .andExpect(jsonPath("$.pageable").exists());
    }

    @Test
    void getAllHostels_ShouldReturn401_WhenNotAuthenticated() throws Exception {
        // Отправляем запрос без пользователя (@WithMockUser нет)
        mockMvc.perform(get("/api/v1/hostels"))
                .andExpect(status().isForbidden()); // Spring Security должен заблокировать (403/401)
    }
}