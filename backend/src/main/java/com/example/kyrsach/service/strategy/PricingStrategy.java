package com.example.kyrsach.service.strategy;

import java.math.BigDecimal;

// Паттерн Strategy (2 из 3) - Стратегия расчета цены
public interface PricingStrategy {
    BigDecimal calculatePrice(int nights, BigDecimal basePricePerNight);
}