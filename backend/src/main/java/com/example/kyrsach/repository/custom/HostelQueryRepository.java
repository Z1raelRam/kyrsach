package com.example.kyrsach.repository.custom;

import com.example.kyrsach.web.dto.HostelResponse;
import java.util.List;

public interface HostelQueryRepository {
    List<HostelResponse> searchHostelsCustom(String keyword);
}