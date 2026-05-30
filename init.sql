CREATE EXTENSION postgis;

DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM (
  'user',
  'admin',
  'sdm'
);

DROP TYPE IF EXISTS trip_status CASCADE;
CREATE TYPE trip_status AS ENUM (
    'pending',
    'approved',
    'declined'
)

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(255)        NOT NULL,
    username      VARCHAR(255)        NOT NULL UNIQUE,
    password_hash VARCHAR(255)        NOT NULL DEFAULT '',
    role          user_role           NOT NULL DEFAULT 'user',
    created_at    TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP           NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS cities CASCADE;
CREATE TABLE cities (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255)          NOT NULL UNIQUE,
    province    VARCHAR(100)          NOT NULL DEFAULT '',
    island      VARCHAR(100)          NOT NULL DEFAULT '',
    is_abroad   BOOLEAN               NOT NULL DEFAULT FALSE,
    location    GEOMETRY(point, 4326) NOT NULL,
    created_at  TIMESTAMP             NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP             NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS official_travel CASCADE;
CREATE TABLE official_travels (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    departure_date      DATE        NOT NULL,
    return_date         DATE        NOT NULL,
    origin_city_id      BIGINT      NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    destination_city_id BIGINT      NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    trip_duration       INT         NOT NULL,
    allowance           DECIMAL     NOT NULL,
    status              trip_status NOT NULL DEFAULT 'pending',
    created_at          TIMESTAMP   NOT NULL,
    updated_at          TIMESTAMP   NOT NULL
)

CREATE INDEX idx_cities_location ON cities USING GIST(location);