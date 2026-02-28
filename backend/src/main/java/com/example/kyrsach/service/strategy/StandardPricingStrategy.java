package com.example.kyrsach.service.strategy;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class StandardPricingStrategy implements PricingStrategy {
    @Override
    public BigDecimal calculatePrice(int nights, BigDecimal basePricePerNight) {
        // Если больше 7 ночей - скидка 10%
        BigDecimal total = basePricePerNight.multiply(BigDecimal.valueOf(nights));
        if (nights > 7) {
            return total.multiply(BigDecimal.valueOf(0.9));
        }
        return total;
    }
}