package com.example.kyrsach.repository;

import com.example.kyrsach.domain.CommonArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommonAreaRepository extends JpaRepository<CommonArea, Long> {
    List<CommonArea> findByHostelId(Long hostelId);
}