CREATE TABLE roles (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       first_name VARCHAR(100) NOT NULL,
                       last_name VARCHAR(100) NOT NULL,
                       role_id BIGINT NOT NULL REFERENCES roles(id)
);

CREATE TABLE hostels (
                         id BIGSERIAL PRIMARY KEY,
                         name VARCHAR(255) NOT NULL,
                         address VARCHAR(500) NOT NULL,
                         description TEXT
);

CREATE TABLE rooms (
                       id BIGSERIAL PRIMARY KEY,
                       hostel_id BIGINT NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
                       room_number VARCHAR(50) NOT NULL,
                       type VARCHAR(50) NOT NULL,
                       capacity INT NOT NULL
);

CREATE TABLE beds (
                      id BIGSERIAL PRIMARY KEY,
                      room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
                      bed_number VARCHAR(20) NOT NULL
);

CREATE TABLE bookings (
                          id BIGSERIAL PRIMARY KEY,
                          user_id BIGINT NOT NULL REFERENCES users(id),
                          bed_id BIGINT NOT NULL REFERENCES beds(id),
                          check_in_date DATE NOT NULL,
                          check_out_date DATE NOT NULL,
                          status VARCHAR(50) NOT NULL
);

CREATE TABLE common_areas (
                              id BIGSERIAL PRIMARY KEY,
                              hostel_id BIGINT NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
                              name VARCHAR(255) NOT NULL,
                              capacity INT NOT NULL
);

CREATE TABLE area_reservations (
                                   id BIGSERIAL PRIMARY KEY,
                                   user_id BIGINT NOT NULL REFERENCES users(id),
                                   common_area_id BIGINT NOT NULL REFERENCES common_areas(id),
                                   start_time TIMESTAMP NOT NULL,
                                   end_time TIMESTAMP NOT NULL
);

INSERT INTO roles (name) VALUES ('ROLE_GUEST'), ('ROLE_ADMIN');