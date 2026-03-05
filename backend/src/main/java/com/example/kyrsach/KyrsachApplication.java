package com.example.kyrsach;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class KyrsachApplication {

    public static void main(String[] args) {
        SpringApplication.run(KyrsachApplication.class, args);
    }
}