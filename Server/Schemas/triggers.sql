DELIMITER //
CREATE TRIGGER notify_group_addition
AFTER INSERT ON user_groups
FOR EACH ROW
BEGIN
    DECLARE v_group_name VARCHAR(255);
    DECLARE v_owner_name VARCHAR(255);
    DECLARE v_notification_id VARCHAR(256);
    SET v_notification_id = SHA2(CONCAT(NEW.group_id, 'notification_id', 'added'), 256);
    SELECT groupname INTO v_group_name FROM groups WHERE group_id = NEW.group_id;
    INSERT INTO notifications(user_id, notification_id, status, message) VALUES(NEW.user_id, v_notification_id, 'unseen', CONCAT('You were added to group &', v_group_name));
    UPDATE groups SET member_count = member_count + 1 WHERE group_id = NEW.group_id;
END //

DELIMITER ;

DELIMITER //
CREATE TRIGGER notify_group_removal
AFTER DELETE ON user_groups
FOR EACH ROW
BEGIN
    DECLARE v_group_name VARCHAR(255);
    DECLARE v_owner_name VARCHAR(255);
    DECLARE v_notification_id VARCHAR(256);
    SET v_notification_id = SHA2(CONCAT(NEW.group_id, 'notification_id', 'added'), 256);
    SELECT groupname INTO v_group_name FROM groups WHERE group_id = NEW.group_id;
    INSERT INTO notifications(user_id, notification_id, status, message) VALUES(NEW.user_id, v_notification_id, 'unseen', CONCAT('You were removed from group &', v_group_name));
    UPDATE groups SET member_count = member_count - 1 WHERE group_id = NEW.group_id;
END //

DELIMITER ;