package com.example.kyrsach.repository.custom;

import com.example.kyrsach.web.dto.HostelResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class HostelQueryRepositoryImpl implements HostelQueryRepository {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public List<HostelResponse> searchHostelsCustom(String keyword) {
        String sql = "SELECT id, name, address, description FROM hostels WHERE name ILIKE ? OR address ILIKE ?";
        String searchParam = "%" + keyword + "%";

        return jdbcTemplate.query(sql, new Object[]{searchParam, searchParam}, (rs, rowNum) ->
                new HostelResponse(
                        rs.getLong("id"),
                        rs.getString("name"),
                        rs.getString("address"),
                        rs.getString("description")
                )
        );
    }
}