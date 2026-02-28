package com.example.kyrsach.repository;

import com.example.kyrsach.domain.Hostel;
import com.example.kyrsach.repository.custom.HostelQueryRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HostelRepository extends JpaRepository<Hostel, Long>, HostelQueryRepository {
}