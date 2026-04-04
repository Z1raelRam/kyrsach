package com.example.kyrsach.web.dto;

import java.io.Serializable;

// Добавили implements Serializable, чтобы Redis мог сохранять этот объект в кэш
public record HostelResponse(Long id, String name, String address, String description) implements Serializable {
}