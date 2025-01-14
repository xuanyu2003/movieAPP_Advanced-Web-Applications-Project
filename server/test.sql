DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS favorite CASCADE;
DROP TABLE IF EXISTS usergroup CASCADE;
DROP TABLE IF EXISTS groupmember CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS sharedfavorite CASCADE;

CREATE TABLE users (
  users_id SERIAL PRIMARY KEY,
  users_email VARCHAR(100) UNIQUE NOT NULL,
  users_password VARCHAR(255) NOT NULL
);

CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    review_users_id INTEGER,
    review_users_email TEXT,
    review_movie_id INTEGER,
    review_text TEXT,
    review_rating INTEGER,
    review_created_at TIMESTAMP,
    FOREIGN KEY (review_users_id) REFERENCES "users"(users_id)
);

CREATE TABLE usergroup (
    group_id  SERIAL PRIMARY KEY,
    group_users_id INTEGER,
    group_name VARCHAR(255),
    group_owner_id INTEGER,
    FOREIGN KEY (group_users_id) REFERENCES "users"(users_id),
    FOREIGN KEY (group_owner_id) REFERENCES "users"(users_id)
);

CREATE TABLE groupmember (
    groupmember_id SERIAL PRIMARY KEY,
    groupmember_group_id INTEGER,
    groupmember_users_id INTEGER,
    groupmember_status VARCHAR(50) CHECK (groupmember_status IN ('active', 'inactive', 'pending')),
    FOREIGN KEY (groupmember_group_id) REFERENCES usergroup(group_id),
    FOREIGN KEY (groupmember_users_id) REFERENCES "users"(users_id)
);

CREATE TABLE favorite (
    favorite_id SERIAL PRIMARY KEY,
    favorite_users_id INTEGER,
    favorite_movie_id INTEGER,
    favorite_added_at TIMESTAMP,
    FOREIGN KEY (favorite_users_id) REFERENCES "users"(users_id)
);

CREATE TABLE sharedfavorite (
  shared_favorite_id SERIAL PRIMARY KEY,
  shared_favorite_movie_id INTEGER,
  favorite_users_id INTEGER,
  FOREIGN KEY (favorite_users_id) REFERENCES "users"(users_id),
  FOREIGN KEY (shared_favorite_id) REFERENCES "favorite"(favorite_id)
);

