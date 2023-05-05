/*
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


CREATE TABLE posts(post_id VARCHAR(256) PRIMARY KEY NOT NULL,
                   creator_id VARCHAR(256) NOT NULL,
                   img_folder_name VARCHAR(128),
                   img_public_id VARCHAR(128),
                   img_version VARCHAR(128),
                   text_content VARCHAR(480),
                   time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                   FOREIGN KEY (creator_id) REFERENCES users(user_id));
*/

CREATE TABLE post_links(post_id VARCHAR(256),
                        link VARCHAR(255) NOT NULL,
                        FOREIGN KEY (post_id) REFERENCES posts(post_id));

CREATE TABLE post_tags(post_id VARCHAR(256),
                        tags VARCHAR(255) NOT NULL,
                        FOREIGN KEY (post_id) REFERENCES posts(post_id));