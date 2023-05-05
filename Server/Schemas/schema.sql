CREATE DATABASE social_network;

USE social_network;

CREATE TABLE users(user_id VARCHAR(256) PRIMARY KEY NOT NULL,
                   username VARCHAR(255) NOT NULL,
                   email VARCHAR(255) NOT NULL, 
                   password VARCHAR(256) NOT NULL);

CREATE TABLE auth(user_id VARCHAR(256),
                  auth_token VARCHAR(256) NOT NULL,
                  loggedin_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE);

CREATE TABLE connections(follower_id VARCHAR(256) NOT NULL,
                         following_id VARCHAR(256) NOT NULL,
                         start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (follower_id) REFERENCES users(user_id) ON DELETE CASCADE,
                         FOREIGN KEY (following_id) REFERENCES users(user_id) ON DELETE CASCADE);

CREATE TABLE posts(post_id VARCHAR(256) PRIMARY KEY NOT NULL,
                   creator_id VARCHAR(256) NOT NULL,
                   img_folder_name VARCHAR(128),
                   img_public_id VARCHAR(128),
                   img_version VARCHAR(128),
                   text_content VARCHAR(480),
                   time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                   likes INT DEFAULT 0,
                   dislikes INT DEFAULT 0,
                   FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE);

CREATE TABLE post_links(post_id VARCHAR(256),
                        link VARCHAR(255) NOT NULL,
                        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE);

CREATE TABLE post_tags(post_id VARCHAR(256),
                        tag VARCHAR(255) NOT NULL,
                        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE);


CREATE TABLE comments(post_id VARCHAR(256) NOT NULL,
                      commenter_id VARCHAR(256) NOT NULL,
                      comment_id VARCHAR(256) NOT NULL,
                      comment VARCHAR(240),
                      likes INT DEFAULT 0,
                      time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      PRIMARY KEY (commenter_id, post_id, comment_id),  
                      FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
                      FOREIGN KEY (commenter_id) REFERENCES users(user_id) ON DELETE CASCADE);

/* vote_type : Like -> 'l' , Dislike -> 'd' */
CREATE TABLE voters(user_id VARCHAR(256) NOT NULL,
                    post_id VARCHAR(256) NOT NULL,
                    vote_type VARCHAR(1) NOT NULL,
                    PRIMARY KEY (user_id, post_id),
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE);

/* Tables
    posts - strong entity,
    owners - strong entity,
    groups - strong entity,
    comments - weak entity,
*/