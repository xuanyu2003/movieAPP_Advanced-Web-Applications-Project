-- Active: 1733414769068@@movie-app-db.postgres.database.azure.com@5432@movieapp
DROP TABLE IF EXISTS groupmovie;
DROP TABLE IF EXISTS groupmember;
DROP TABLE IF EXISTS usergroup;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS favorite CASCADE;
DROP TABLE IF EXISTS movie CASCADE;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS otp;
DROP TABLE IF EXISTS sharedfavorite;

CREATE TABLE users (
  users_id SERIAL PRIMARY KEY,
  users_email VARCHAR(100) UNIQUE NOT NULL,
  users_password VARCHAR(255) NOT NULL
);


CREATE TABLE movie (
    movie_id INTEGER PRIMARY KEY,
    movie_image VARCHAR(255),
    movie_title VARCHAR(255),
    movie_description TEXT
);

CREATE TABLE favorite (
    favorite_id SERIAL PRIMARY KEY,
    favorite_users_id INTEGER,
    favorite_movie_id INTEGER,
    favorite_added_at TIMESTAMP,
    FOREIGN KEY (favorite_users_id) REFERENCES "users"(users_id),
    FOREIGN KEY (favorite_movie_id) REFERENCES movie(movie_id)
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
    FOREIGN KEY (groupmember_users_id) REFERENCES "users"(users_id),
    UNIQUE(groupmember_group_id, groupmember_users_id) );

CREATE TABLE groupmovie (
    groupmovie_id SERIAL PRIMARY KEY,
    groupmovie_group_id INTEGER,
    groupmovie_movie_id INTEGER,
    FOREIGN KEY (groupmovie_group_id) REFERENCES usergroup(group_id),
    FOREIGN KEY (groupmovie_movie_id) REFERENCES movie(movie_id)
);

CREATE TABLE groupmoviereview (
    groupmoviereview_id SERIAL PRIMARY KEY,
    groupmoviereview_group_id INTEGER,
    groupmoviereview_movie_id INTEGER,
    groupmoviereview_users_id INTEGER,
    groupmoviereview_review TEXT,
    FOREIGN KEY (groupmoviereview_group_id) REFERENCES usergroup(group_id),
    FOREIGN KEY (groupmoviereview_movie_id) REFERENCES movie(movie_id),
    FOREIGN KEY (groupmoviereview_users_id) REFERENCES "users"(users_id)
);

CREATE TABLE otp(
    otp_id SERIAL PRIMARY KEY,
    otp_users_id INTEGER,
    otp_code VARCHAR(6),
    otp_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    otp_validated BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (otp_users_id) REFERENCES "users"(users_id)
);

CREATE TABLE sharedfavorite (
  shared_favorite_id SERIAL PRIMARY KEY,
  shared_favorite_movie_id INTEGER,
  favorite_users_id INTEGER,
  FOREIGN KEY (favorite_users_id) REFERENCES "users"(users_id),
  FOREIGN KEY (shared_favorite_id) REFERENCES "favorite"(favorite_id)
);

CREATE TABLE notification (
    notification_id SERIAL PRIMARY KEY,
    notification_users_id INTEGER NOT NULL, 
    notification_group_id INTEGER, 
    notification_message TEXT NOT NULL, 
    notification_type VARCHAR(50) CHECK (notification_type IN ('invitation', 'status_change', 'other')) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (notification_users_id) REFERENCES "users"(users_id),
    FOREIGN KEY (notification_group_id) REFERENCES usergroup(group_id)
);


ALTER TABLE favorite
ADD CONSTRAINT unique_favorite_user_movie
UNIQUE (favorite_users_id, favorite_movie_id);

ALTER TABLE notification
ADD COLUMN notification_req_users_id INTEGER,
ADD COLUMN notification_groupmember_id INTEGER,
ADD CONSTRAINT fk_notification_req_users FOREIGN KEY (notification_req_users_id) REFERENCES users(users_id),
ADD CONSTRAINT fk_notification_groupmember FOREIGN KEY (notification_groupmember_id) REFERENCES groupmember(groupmember_id);

ALTER TABLE usergroup
ADD COLUMN group_introduction TEXT
