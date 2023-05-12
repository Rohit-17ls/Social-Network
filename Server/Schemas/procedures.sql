/* Upvote */

DELIMITER //
CREATE PROCEDURE upvote(IN v_user_id VARCHAR(256), IN v_post_id VARCHAR(256))
BEGIN
	DECLARE is_upvoted INT DEFAULT 0;
	DECLARE is_downvoted INT DEFAULT 0;

    SELECT count(*) into is_upvoted from votes where user_id = v_user_id AND post_id = v_post_id AND vote_type = 'l';
    SELECT count(*) into is_downvoted from votes where user_id = v_user_id AND post_id = v_post_id AND vote_type = 'd';
    DELETE from votes WHERE user_id = v_user_id AND post_id = v_post_id;
    
    IF is_upvoted = 1 THEN
    	UPDATE posts SET likes = likes - 1 WHERE post_id = v_post_id;
    ELSEIF is_downvoted = 1 THEN
    	UPDATE posts SET dislikes = dislikes-1, likes = likes + 1 WHERE post_id = v_post_id;
        INSERT INTO votes VALUES(v_user_id, v_post_id, 'l');
    ELSE
    	UPDATE posts SET likes = likes + 1 WHERE post_id = v_post_id;
        INSERT INTO votes VALUES(v_user_id, v_post_id, 'l');
    END IF;

END //

DELIMITER ;

/* -------------------------------------------------------------------------------------------------------------------------------*/


/* Downvote */

DELIMITER //
CREATE PROCEDURE downvote(IN v_user_id VARCHAR(256), IN v_post_id VARCHAR(256))
BEGIN
	DECLARE is_upvoted INT DEFAULT 0;
	DECLARE is_downvoted INT DEFAULT 0;

    SELECT count(*) into is_upvoted from votes where user_id = v_user_id AND post_id = v_post_id AND vote_type = 'l';
    SELECT count(*) into is_downvoted from votes where user_id = v_user_id AND post_id = v_post_id AND vote_type = 'd';
    DELETE from votes WHERE user_id = v_user_id AND post_id = v_post_id;
    
    IF is_upvoted = 1 THEN
    	UPDATE posts SET likes = likes - 1, dislikes = dislikes + 1 WHERE post_id = v_post_id;
        INSERT INTO votes VALUES(v_user_id, v_post_id, 'd');
    ELSEIF is_downvoted = 1 THEN
    	UPDATE posts SET dislikes = dislikes-1 WHERE post_id = v_post_id;
    ELSE
    	UPDATE posts SET dislikes = dislikes + 1 WHERE post_id = v_post_id;
        INSERT INTO votes VALUES(v_user_id, v_post_id, 'd');
    END IF;

END //

DELIMITER ;


/* -------------------------------------------------------------------------------------------------------------------------------*/

/* Follow User */

DELIMITER //
CREATE OR REPLACE PROCEDURE follow_user(IN v_follower_id VARCHAR(256), IN v_following_id  VARCHAR(256))
BEGIN
	DECLARE v_is_following INT DEFAULT 0;
    SELECT count(*) INTO v_is_following FROM connections WHERE follower_id = v_follower_id AND following_id = v_following_id;
    
    IF v_is_following = 1 THEN
    	DELETE FROM connections WHERE follower_id = v_follower_id AND following_id = v_following_id;
    ELSE
    	INSERT INTO connections(follower_id, following_id) VALUES (v_follower_id, v_following_id);
    END IF;
END //

DELIMITER ;

