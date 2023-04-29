CREATE DATABASE social_network;

USE social_network;

CREATE TABLE users(user_id VARCHAR(256) PRIMARY KEY NOT NULL,
                   username VARCHAR(255) NOT NULL,
                   email VARCHAR(255) NOT NULL, 
                   password VARCHAR(256) NOT NULL);

CREATE TABLE auth(user_id VARCHAR(256),
                  auth_token VARCHAR(256) NOT NULL,
                  loggedin_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users(user_id));

CREATE TABLE connections(follower_id VARCHAR(256) NOT NULL,
                         following_id VARCHAR(256) NOT NULL,
                         start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (follower_id) REFERENCES users(user_id),
                         FOREIGN KEY (following_id) REFERENCES users(user_id));

/* To be altered , not created yet*/
CREATE TABLE posts(post_id VARCHAR(256) PRIMARY KEY NOT NULL,
                   creator_id VARCHAR(256) NOT NULL,
                   FOREIGN KEY (creator_id) REFERENCES users(user_id));

/* Tables
    posts - strong entity,
    owners - strong entity,
    groups - strong entity,
    comments - weak entity,
*/