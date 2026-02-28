package com.example.kyrsach.service;

import com.example.kyrsach.service.strategy.PricingStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

// Паттерн Facade (3 из 3) - скрывает сложную логику бронирования
@Service
@RequiredArgsConstructor
public class BookingFacade {

    private final PricingStrategy pricingStrategy;
    // Сюда позже добавим UserService, RoomService, NotificationService

    public String createBooking(Long userId, Long roomId, int nights) {
        // 1. Проверить пользователя
        // 2. Проверить доступность комнаты
        // 3. Рассчитать цену через стратегию
        BigDecimal price = pricingStrategy.calculatePrice(nights, BigDecimal.valueOf(1000));
        // 4. Сохранить в БД

        return "Бронирование успешно создано! Итоговая стоимость: " + price + " руб.";
    }
}