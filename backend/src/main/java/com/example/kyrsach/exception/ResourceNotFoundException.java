package com.example.kyrsach.exception;

// Требование: пользовательские исключения (custom exceptions)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}