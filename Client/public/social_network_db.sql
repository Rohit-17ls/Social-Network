-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 14, 2023 at 05:28 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `social_network`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `downvote` (IN `v_user_id` VARCHAR(256), IN `v_post_id` VARCHAR(256))   BEGIN
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

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `follow_user` (IN `v_follower_id` VARCHAR(256), IN `v_following_id` VARCHAR(256))   BEGIN
	DECLARE v_is_following INT DEFAULT 0;
    SELECT count(*) INTO v_is_following FROM connections WHERE follower_id = v_follower_id AND following_id = v_following_id;
    
    IF v_is_following = 1 THEN
    	DELETE FROM connections WHERE follower_id = v_follower_id AND following_id = v_following_id;
    ELSE
    	INSERT INTO connections(follower_id, following_id) VALUES (v_follower_id, v_following_id);
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `upvote` (IN `v_user_id` VARCHAR(256), IN `v_post_id` VARCHAR(256))   BEGIN
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

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `auth`
--

CREATE TABLE `auth` (
  `user_id` varchar(256) DEFAULT NULL,
  `auth_token` varchar(256) NOT NULL,
  `loggedin_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `auth`
--

INSERT INTO `auth` (`user_id`, `auth_token`, `loggedin_at`) VALUES
('6eaf78d3d8d1ded76149aec1d0f151ada52966197de03ad70289966b6923d217', 'e4c1a7e8d5bfec5baf7901574057ae1b537e90b2acc0ef294ac899f6af776779', '2023-04-27 23:04:12'),
('6eaf78d3d8d1ded76149aec1d0f151ada52966197de03ad70289966b6923d217', '175170f2ca70813fbda235ebc26f639111a68ce929822849d941ac3775bdd2e2', '2023-05-02 19:46:46'),
('db2b849f9cc6a7e61baae9b9e6b495db724bfbf10a2eecf335525f947d4bf525', '07e8d0252bbb1bc695c9e0188a8d3061a30562a74905fa393c5739f887b459f3', '2023-05-06 09:35:47'),
('5d48326e2172ffd9f206918f29dd744692de1bb4f3d1f0a19a96849794634154', '9472fc0c998627cfbab57851f2be5a14dc2ae4084a225755acffc9099f98cbac', '2023-05-08 14:20:08'),
('75833209005b32715c5c1b390d92a604ee67642c662738cda653613bda19edec', '97475d20769f4edfb29ae99e3ad144e3349640b8a3aa81018443978336439e9b', '2023-05-08 14:21:55'),
('6f6b3a65166fa902a3269ce1a7dfc73a1fc4ba0142423354bcc32dcb9152f43b', '574ab8e48cab0d8698d30cf6dfbd2a2743e8789fe296bfe53af4e252644a68d8', '2023-05-08 19:39:34'),
('0a342864e0d6d5ee8bb39ea3006f844e1f4054b73101af6e27b505c3f7609dd5', 'de874934184cd61c19e7aedd5d48d21c94c4ef6af5299ba6b0791b20130b1383', '2023-05-08 19:41:30'),
('7fe727e1d8c4c2538646309b4b23235b51e92cbb351a539fc48683cf202ca5b4', '107c51db5f2758cf0bc4c71160e15a735b28215abacf4f6620268480bd8ce03a', '2023-05-10 12:15:35'),
('4ed4e50a279d5adafe6cdacbfb33ef6288c5b07ec6b827bfda36ae6815336a21', 'adbc440148231c682a48a8031a4a21ca4ae088bc1727aaf9d36db019994221c6', '2023-05-10 12:19:02'),
('03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', 'd6e65f974b004e93ba1f16fb3983ada207e7fe442df784855c38e2822c5fad5f', '2023-05-12 10:39:17');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `post_id` varchar(256) NOT NULL,
  `commenter_id` varchar(256) NOT NULL,
  `comment_id` varchar(256) NOT NULL,
  `comment` varchar(240) DEFAULT NULL,
  `likes` int(11) DEFAULT 0,
  `time_stamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`post_id`, `commenter_id`, `comment_id`, `comment`, `likes`, `time_stamp`) VALUES
('41c1ed9f4266cf2e6c3f36b725194c01a5694f404b3b215f44efc31535fd6ea7', '03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', 'f16d179cc4c868af6822db561bb0760e3ac18d39d02ca3e62ea8bcde359cb2fb', '@brian , couldn\'t agree more', 0, '2023-05-05 14:16:55'),
('babb5360d9692997f0c6301472ca4040c68593efd8a7b2689a5187221cca3268', '03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', '3fbaa7a5428bf26c7ae47cad2c004851e7584e10f3fb4a63560f90db151888d1', '@joe the T3 stack is my go to, thanks to @t3dotgg', 0, '2023-05-05 14:12:39'),
('babb5360d9692997f0c6301472ca4040c68593efd8a7b2689a5187221cca3268', '03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', '4189dab8fac208e8b4f8aee7f98510dc153189193d0eec4137424b8a55b6dc83', '@ThePrimeagen really shaped the way I use co-pilot btw', 0, '2023-05-05 14:13:51'),
('ae5e8c92e2936d07dc6328ec12f2a17ca082985aa7bf5d99de8f286944847e7e', '4ed4e50a279d5adafe6cdacbfb33ef6288c5b07ec6b827bfda36ae6815336a21', 'ab9d85136e3b22c33f57bacc0f518bdeda5de4a8c1e7754f0d002253cc6943ea', 'Nice @brian', 0, '2023-05-08 04:28:30'),
('41c1ed9f4266cf2e6c3f36b725194c01a5694f404b3b215f44efc31535fd6ea7', '7fe727e1d8c4c2538646309b4b23235b51e92cbb351a539fc48683cf202ca5b4', 'e0303ebee636fd516dbede98ed0fa259fbc47a35c87280312d37dbceade55b99', '@Cherno is a treat to watch', 0, '2023-05-05 13:32:49');

-- --------------------------------------------------------

--
-- Table structure for table `connections`
--

CREATE TABLE `connections` (
  `follower_id` varchar(256) NOT NULL,
  `following_id` varchar(256) NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `connections`
--

INSERT INTO `connections` (`follower_id`, `following_id`, `start_time`) VALUES
('7fe727e1d8c4c2538646309b4b23235b51e92cbb351a539fc48683cf202ca5b4', '03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', '2023-05-10 12:18:21'),
('7fe727e1d8c4c2538646309b4b23235b51e92cbb351a539fc48683cf202ca5b4', '4ed4e50a279d5adafe6cdacbfb33ef6288c5b07ec6b827bfda36ae6815336a21', '2023-05-10 12:19:26'),
('03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', '7fe727e1d8c4c2538646309b4b23235b51e92cbb351a539fc48683cf202ca5b4', '2023-05-11 17:23:30'),
('03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', '4ed4e50a279d5adafe6cdacbfb33ef6288c5b07ec6b827bfda36ae6815336a21', '2023-05-12 11:47:22');

--
-- Triggers `connections`
--
DELIMITER $$
CREATE TRIGGER `notify_follow` AFTER INSERT ON `connections` FOR EACH ROW BEGIN
	DECLARE v_notification_id VARCHAR(256);
    DECLARE v_follower_name VARCHAR(255);
    SET v_notification_id = SHA2(CONCAT(NEW.follower_id, NEW.following_id, CURRENT_TIMESTAMP()), 256);
    SELECT username INTO v_follower_name FROM users WHERE user_id = NEW.follower_id;
	INSERT INTO notifications(user_id, notification_id, status, message) VALUES (NEW.following_id, v_notification_id, 'unseen', CONCAT('@', v_follower_name, ' started following you'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `group_id` varchar(256) NOT NULL,
  `groupname` varchar(255) NOT NULL,
  `description` varchar(480) DEFAULT NULL,
  `img_folder_name` varchar(128) DEFAULT NULL,
  `img_public_id` varchar(128) DEFAULT NULL,
  `img_version` varchar(128) DEFAULT NULL,
  `member_count` int(11) DEFAULT 1,
  `owner_id` varchar(256) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`group_id`, `groupname`, `description`, `img_folder_name`, `img_public_id`, `img_version`, `member_count`, `owner_id`, `created_at`) VALUES
('5e9bbdf90b1ea577548535060248dafd3dd6ca616b5a1a6ce7514c1afb9ead72', 'groupone', 'First group on the platform. Feels Surreal', 'groupprofile', 'nt9vvndyhxghhd0ylhm7.png', 'v1683416733', 3, '03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', '2023-05-06 23:45:33'),
('e88779fbcea217bfef5ac496ad35ddf971d3733e51b3a6ab77189ea531a4dbc3', 'VimEnthusiasts', 'Just a small private group of vim users', '0', '0', '0', 4, '7fe727e1d8c4c2538646309b4b23235b51e92cbb351a539fc48683cf202ca5b4', '2023-05-06 23:47:13');

-- --------------------------------------------------------

--
-- Table structure for table `group_posts`
--

CREATE TABLE `group_posts` (
  `group_id` varchar(256) NOT NULL,
  `post_id` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `group_posts`
--

INSERT INTO `group_posts` (`group_id`, `post_id`) VALUES
('5e9bbdf90b1ea577548535060248dafd3dd6ca616b5a1a6ce7514c1afb9ead72', 'ae5e8c92e2936d07dc6328ec12f2a17ca082985aa7bf5d99de8f286944847e7e'),
('e88779fbcea217bfef5ac496ad35ddf971d3733e51b3a6ab77189ea531a4dbc3', '1fe27fe590048a91ae8bc8a16ee5b064adc4f83e2565470046510770288b201b'),
('e88779fbcea217bfef5ac496ad35ddf971d3733e51b3a6ab77189ea531a4dbc3', '9ab6904093cd642918eb8d31009c9fc9023fb108ca884c40dfaf4d8f406721ff'),
('e88779fbcea217bfef5ac496ad35ddf971d3733e51b3a6ab77189ea531a4dbc3', 'ae5e8c92e2936d07dc6328ec12f2a17ca082985aa7bf5d99de8f286944847e7e');

--
-- Triggers `group_posts`
--
DELIMITER $$
CREATE TRIGGER `notify_group_post` AFTER INSERT ON `group_posts` FOR EACH ROW BEGIN
	DECLARE v_user_id VARCHAR(256);
	DECLARE v_notification_id VARCHAR(256);
	FOR v_user_row IN (SELECT user_id from user_groups WHERE group_id = NEW.group_id) DO
        SET v_user_id = v_user_row.user_id;
        SET v_notification_id = SHA2(CONCAT(NEW.group_id, NEW.post_id, v_user_id, 'notification_id', CURRENT_TIMESTAMP()), 256);
		INSERT INTO notifications(user_id, notification_id, status, message) VALUES(v_user_id, v_notification_id, 'unseen', CONCAT('New post in group &', (SELECT groupname FROM groups WHERE group_id = NEW.group_id)));
    END FOR;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `moderators`
--

CREATE TABLE `moderators` (
  `moderator_id` varchar(256) NOT NULL,
  `group_id` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `user_id` varchar(256) NOT NULL,
  `notification_id` varchar(256) NOT NULL,
  `status` varchar(10) DEFAULT NULL,
  `message` varchar(140) NOT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`user_id`, `notification_id`, `status`, `message`, `time_stamp`) VALUES
('03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', '1143a1756b56c08a71b3dabc008827dd98a4f7f4dd4370bf3a02c0ab8e5f3faf', 'unseen', 'New post in group &groupone', '2023-05-08 04:20:12'),
('03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', '25bb25ae3d19999d48f1fb28fa5af232537d8e484208ec5d5b82ad400781dde3', 'unseen', 'New post in group &VimEnthusiasts', '2023-05-12 14:07:27'),
('03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', '415ebaea61130546459f7a055bddbe63b04f313bc7d6a872ec09418fdd1ac2a6', 'unseen', 'New post in group &VimEnthusiasts', '2023-05-08 04:20:12'),
('03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', '583baa8a3e2af39e644d7eb46a024d90fadf0ba8713f0a179e317c24b4bcc57f', 'unseen', 'You were added to group &groupone', '2023-05-07 08:01:31'),
('03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', '6eeec1e8cf31ca3968fc07f1c7f3bf011227ca0192716c45c97cc39080b935b7', 'unseen', 'New post in group &VimEnthusiasts', '2023-05-08 04:39:49'),
('03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', '888c6af8a944e77d1f1d008e0df5be52ac42090a2db8b0ba335ef686a16bfcbd', 'unseen', '@brian started following you', '2023-05-10 12:18:21'),
('03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', 'c583835803cdc62dfae93cb6cff5ea64cdba9c71cde68bb5e532fa3d4ee3b4d7', 'unseen', 'You were added to group &VimEnthusiasts', '2023-05-06 23:47:13'),
('4ed4e50a279d5adafe6cdacbfb33ef6288c5b07ec6b827bfda36ae6815336a21', '0426e241601ef06ba74dfaf8ab74a789f19c55fe6fe989d4422369cf3eeafe63', 'unseen', 'New post in group &VimEnthusiasts', '2023-05-12 14:07:27'),
('4ed4e50a279d5adafe6cdacbfb33ef6288c5b07ec6b827bfda36ae6815336a21', '0db519dfd32edbadfe54f77de2fa1d1213783afbd28f5d661deeed6d93bb5f52', 'unseen', '@brian started following you', '2023-05-10 12:19:26'),
('4ed4e50a279d5adafe6cdacbfb33ef6288c5b07ec6b827bfda36ae6815336a21', '4ecee8ca5ca6702a7fa8c3f7e5f6678370a287042f501adbb577bd8a7f2b52e0', 'unseen', '@giannis started following you', '2023-05-12 11:47:22'),
('7fe727e1d8c4c2538646309b4b23235b51e92cbb351a539fc48683cf202ca5b4', '65f0d2b935e12cd0f158051dabde6213037bb46f14549e9789783e826a48a5df', 'unseen', 'New post in group &VimEnthusiasts', '2023-05-12 14:07:27'),
('7fe727e1d8c4c2538646309b4b23235b51e92cbb351a539fc48683cf202ca5b4', 'd244137f9786f92b1b01bfc43ece421ddce39bfecbcd32a289c9dc8dfb175e04', 'unseen', '@giannis started following you', '2023-05-11 17:23:30'),
('db2b849f9cc6a7e61baae9b9e6b495db724bfbf10a2eecf335525f947d4bf525', '10c3e17a5fd8d164b79431557277e5dffa98fa644bc39ea16c90d3049dc19374', 'unseen', 'New post in group &VimEnthusiasts', '2023-05-08 04:39:49'),
('db2b849f9cc6a7e61baae9b9e6b495db724bfbf10a2eecf335525f947d4bf525', 'c583835803cdc62dfae93cb6cff5ea64cdba9c71cde68bb5e532fa3d4ee3b4d7', 'unseen', 'You were added to group &VimEnthusiasts', '2023-05-06 23:47:13'),
('db2b849f9cc6a7e61baae9b9e6b495db724bfbf10a2eecf335525f947d4bf525', 'd95dd813fde5de105ed5c7baca2acb29b5e7624195bb42aa5628ddba7a5329ee', 'unseen', 'New post in group &VimEnthusiasts', '2023-05-12 14:07:27'),
('db2b849f9cc6a7e61baae9b9e6b495db724bfbf10a2eecf335525f947d4bf525', 'fa51c98ed2bfab86a1de1a7ec6ba49f2177e0a6c3f54f8e81f2a092015ee8e03', 'unseen', 'New post in group &VimEnthusiasts', '2023-05-08 04:20:12');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `post_id` varchar(256) NOT NULL,
  `creator_id` varchar(256) NOT NULL,
  `img_folder_name` varchar(128) DEFAULT NULL,
  `img_public_id` varchar(128) DEFAULT NULL,
  `img_version` varchar(128) DEFAULT NULL,
  `text_content` varchar(480) DEFAULT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `likes` int(11) DEFAULT 0,
  `dislikes` int(11) DEFAULT 0,
  `is_private` char(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`post_id`, `creator_id`, `img_folder_name`, `img_public_id`, `img_version`, `text_content`, `time_stamp`, `likes`, `dislikes`, `is_private`) VALUES
('1fe27fe590048a91ae8bc8a16ee5b064adc4f83e2565470046510770288b201b', '4ed4e50a279d5adafe6cdacbfb33ef6288c5b07ec6b827bfda36ae6815336a21', '0', '0', '0', 'What is your customization on Vim. I have recently discovered some interesting key bindings thanks to @giannis . Drop yours in the comments.', '2023-05-08 04:39:49', 2, 0, '1'),
('41c1ed9f4266cf2e6c3f36b725194c01a5694f404b3b215f44efc31535fd6ea7', '7fe727e1d8c4c2538646309b4b23235b51e92cbb351a539fc48683cf202ca5b4', 'postimages', 'vvbpky4qkrc5ckx0qlgt.png', 'v1683278501', 'Hello @TSPriyan asdfklasd\n', '2023-05-05 09:21:43', 1, 0, '0'),
('4aa94a88d8ae9d883c2672202a4cbc1314512b18a5323246a7987ebabed3b6b3', '6eaf78d3d8d1ded76149aec1d0f151ada52966197de03ad70289966b6923d217', 'postimages', 'kihqghlgezzlzrx8g8hf.jpg', 'v1683217546', 'There\'s a chance that LoRA finetunes work so well that it dramatically alters the finetuning vs. retrieval + few-shot prompting power dynamic in favor of the former for many applications.\n\nPEFT (Parameter Efficient Finetuning, LoRA included) are emerging techniques that make it very cheap to finetune LLMs because most of the parameters can be kept frozen and in very low precision during training. The cost of pretraining and finetuning decouple.', '2023-05-04 16:25:47', 0, 0, '0'),
('63d8e26340db21392bd2c7dd54061b80f0b39a7ea3394c9941d9ff3122e037af', '6eaf78d3d8d1ded76149aec1d0f151ada52966197de03ad70289966b6923d217', '0', '0', '0', 'Had a great day out with @Brian, looking forward to meeting again', '2023-05-04 18:57:07', 0, 0, '0'),
('9ab6904093cd642918eb8d31009c9fc9023fb108ca884c40dfaf4d8f406721ff', '03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', 'postimages', 'bdyneazrdgd7rqgeejrm.png', 'v1683900446', 'How\'s the latest CI build going? Pass, fail, in progress? If you use Neovim and github actions, this plugin gives you that info right inside the editor: ', '2023-05-12 14:07:27', 1, 0, '1'),
('a011ae6058e1ff93fc46bb482643f84c00be0cb5c7d12316577a84a9f6c8fe1f', '03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', 'postimages', 'dr4zomztl5axiaxjmhzf.png', 'v1683216555', NULL, '2023-05-06 07:29:48', 2, 0, '0'),
('ae5e8c92e2936d07dc6328ec12f2a17ca082985aa7bf5d99de8f286944847e7e', '7fe727e1d8c4c2538646309b4b23235b51e92cbb351a539fc48683cf202ca5b4', 'postimages', 'github-img_hbeeal.jpg', 'v1683829482', 'Just a post to illustrate the work done by github', '2023-05-08 04:20:12', 3, 0, '0'),
('babb5360d9692997f0c6301472ca4040c68593efd8a7b2689a5187221cca3268', '6eaf78d3d8d1ded76149aec1d0f151ada52966197de03ad70289966b6923d217', 'postimages', 'dr4zomztl5axiaxjmhzf.png', 'v1683216555', 'Who are the people I should chat with to learn more about the “AngularJS -> Angular 2” moment?', '2023-05-04 16:09:16', 1, 0, '0'),
('df035dab153bf216637b868b22808fb868c770055a1250ca0609c91585dda302', '6eaf78d3d8d1ded76149aec1d0f151ada52966197de03ad70289966b6923d217', 'undefined', '0', '0', 'How good was @TheCherno at the LUDUM DARE last week? Pretty sick I\'d say.\nCheck it out down below !!', '2023-05-04 18:04:32', 0, 0, '0');

-- --------------------------------------------------------

--
-- Table structure for table `post_links`
--

CREATE TABLE `post_links` (
  `post_id` varchar(256) DEFAULT NULL,
  `link` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `post_links`
--

INSERT INTO `post_links` (`post_id`, `link`) VALUES
('babb5360d9692997f0c6301472ca4040c68593efd8a7b2689a5187221cca3268', 'https://twitter.com/t3dotgg'),
('babb5360d9692997f0c6301472ca4040c68593efd8a7b2689a5187221cca3268', 'https://console.cloudinary.com/console/c-8301acc4459b673277686ab9056dc9'),
('babb5360d9692997f0c6301472ca4040c68593efd8a7b2689a5187221cca3268', 'https://console.cloudinary.com/console/c-8301acc4459b673277686ab9056dc9/media_library/search?q'),
('4aa94a88d8ae9d883c2672202a4cbc1314512b18a5323246a7987ebabed3b6b3', 'https://twitter.com/karpathy/status/1649127655122550784?cxt=HHwWgIDSja238OItAAAA'),
('df035dab153bf216637b868b22808fb868c770055a1250ca0609c91585dda302', 'https://www.youtube.com/watch?v=qk205Lp2A10&t=5s'),
('41c1ed9f4266cf2e6c3f36b725194c01a5694f404b3b215f44efc31535fd6ea7', 'https://meet.google.com/kso-uodk-tzs?pli=1'),
('ae5e8c92e2936d07dc6328ec12f2a17ca082985aa7bf5d99de8f286944847e7e', 'https://twitter.com/github/status/1654502210523242500?cxt=HHwWiICxpdO__PUtAAAA'),
('1fe27fe590048a91ae8bc8a16ee5b064adc4f83e2565470046510770288b201b', 'https://blog.codepen.io/2014/02/21/vim-key-bindings/'),
('9ab6904093cd642918eb8d31009c9fc9023fb108ca884c40dfaf4d8f406721ff', 'https://t.co/ifixoE65zX'),
('9ab6904093cd642918eb8d31009c9fc9023fb108ca884c40dfaf4d8f406721ff', 'https://github.com/topaxi/gh-actions.nvim');

-- --------------------------------------------------------

--
-- Table structure for table `post_tags`
--

CREATE TABLE `post_tags` (
  `post_id` varchar(256) DEFAULT NULL,
  `tag` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `post_tags`
--

INSERT INTO `post_tags` (`post_id`, `tag`) VALUES
('babb5360d9692997f0c6301472ca4040c68593efd8a7b2689a5187221cca3268', 't3dotgg'),
('babb5360d9692997f0c6301472ca4040c68593efd8a7b2689a5187221cca3268', 'ThePrimeagen'),
('4aa94a88d8ae9d883c2672202a4cbc1314512b18a5323246a7987ebabed3b6b3', 'Karpathy'),
('df035dab153bf216637b868b22808fb868c770055a1250ca0609c91585dda302', 'TheCherno'),
('df035dab153bf216637b868b22808fb868c770055a1250ca0609c91585dda302', 'LUDUM_DARE'),
('63d8e26340db21392bd2c7dd54061b80f0b39a7ea3394c9941d9ff3122e037af', 'Brian'),
('41c1ed9f4266cf2e6c3f36b725194c01a5694f404b3b215f44efc31535fd6ea7', 'TSPriyan'),
('ae5e8c92e2936d07dc6328ec12f2a17ca082985aa7bf5d99de8f286944847e7e', 'brian'),
('ae5e8c92e2936d07dc6328ec12f2a17ca082985aa7bf5d99de8f286944847e7e', 'davis'),
('1fe27fe590048a91ae8bc8a16ee5b064adc4f83e2565470046510770288b201b', 'giannis');

-- --------------------------------------------------------

--
-- Table structure for table `private_groups`
--

CREATE TABLE `private_groups` (
  `group_id` varchar(256) NOT NULL,
  `agenda` varchar(800) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `private_groups`
--

INSERT INTO `private_groups` (`group_id`, `agenda`) VALUES
('e88779fbcea217bfef5ac496ad35ddf971d3733e51b3a6ab77189ea531a4dbc3', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `public_groups`
--

CREATE TABLE `public_groups` (
  `group_id` varchar(256) NOT NULL,
  `moderator_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `public_groups`
--

INSERT INTO `public_groups` (`group_id`, `moderator_count`) VALUES
('5e9bbdf90b1ea577548535060248dafd3dd6ca616b5a1a6ce7514c1afb9ead72', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` varchar(256) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(256) NOT NULL,
  `img_folder_name` varchar(128) DEFAULT NULL,
  `img_public_id` varchar(128) DEFAULT NULL,
  `img_version` varchar(128) DEFAULT NULL,
  `description` varchar(480) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `img_folder_name`, `img_public_id`, `img_version`, `description`) VALUES
('03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', 'giannis', 'giannis@gmail.com', '1ea7c21488ea872f16b1b278ce7993a7d49d8545f4ffa900ee74c8a098128366', 'profileimages', 'peb2xdkfwwqm7xrn1u6r.jpg', 'v1683916927', 'Founder of &groupone. I enjoy posting latest trends. Come along for the ride!!'),
('0a342864e0d6d5ee8bb39ea3006f844e1f4054b73101af6e27b505c3f7609dd5', 'lance191', 'lancedev@gmail.com', 'ecd9424b1aa457485e813466fac0dee661aceaae651fc29765f7963d162ba483', NULL, NULL, NULL, ''),
('4ed4e50a279d5adafe6cdacbfb33ef6288c5b07ec6b827bfda36ae6815336a21', 'laura', 'laura@gmail.com', '1ea7c21488ea872f16b1b278ce7993a7d49d8545f4ffa900ee74c8a098128366', 'profileimages', 'snvttzgxmeqyrm6yaaxy.jpg', 'v1683917696', ''),
('5d48326e2172ffd9f206918f29dd744692de1bb4f3d1f0a19a96849794634154', 'jason12', 'jason_12@outlook.com', '1ea7c21488ea872f16b1b278ce7993a7d49d8545f4ffa900ee74c8a098128366', NULL, NULL, NULL, ''),
('6eaf78d3d8d1ded76149aec1d0f151ada52966197de03ad70289966b6923d217', 'Joe', 'joe@gmail.cpm', '1ea7c21488ea872f16b1b278ce7993a7d49d8545f4ffa900ee74c8a098128366', NULL, NULL, NULL, ''),
('6f6b3a65166fa902a3269ce1a7dfc73a1fc4ba0142423354bcc32dcb9152f43b', 'todd', 'todd393@gmail.com', 'ecd9424b1aa457485e813466fac0dee661aceaae651fc29765f7963d162ba483', NULL, NULL, NULL, ''),
('75833209005b32715c5c1b390d92a604ee67642c662738cda653613bda19edec', 'scurry30', 'scurry30@gmail.com', 'ecd9424b1aa457485e813466fac0dee661aceaae651fc29765f7963d162ba483', NULL, NULL, NULL, ''),
('7fe727e1d8c4c2538646309b4b23235b51e92cbb351a539fc48683cf202ca5b4', 'brian', 'brian@gmail.com', '1ea7c21488ea872f16b1b278ce7993a7d49d8545f4ffa900ee74c8a098128366', NULL, NULL, NULL, ''),
('db2b849f9cc6a7e61baae9b9e6b495db724bfbf10a2eecf335525f947d4bf525', 'davis', 'davis@outlook.com', '1ea7c21488ea872f16b1b278ce7993a7d49d8545f4ffa900ee74c8a098128366', NULL, NULL, NULL, '');

-- --------------------------------------------------------

--
-- Table structure for table `user_groups`
--

CREATE TABLE `user_groups` (
  `group_id` varchar(256) NOT NULL,
  `user_id` varchar(256) NOT NULL,
  `group_type` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_groups`
--

INSERT INTO `user_groups` (`group_id`, `user_id`, `group_type`) VALUES
('5e9bbdf90b1ea577548535060248dafd3dd6ca616b5a1a6ce7514c1afb9ead72', '03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', 'public'),
('5e9bbdf90b1ea577548535060248dafd3dd6ca616b5a1a6ce7514c1afb9ead72', '4ed4e50a279d5adafe6cdacbfb33ef6288c5b07ec6b827bfda36ae6815336a21', 'public'),
('5e9bbdf90b1ea577548535060248dafd3dd6ca616b5a1a6ce7514c1afb9ead72', '7fe727e1d8c4c2538646309b4b23235b51e92cbb351a539fc48683cf202ca5b4', 'public'),
('e88779fbcea217bfef5ac496ad35ddf971d3733e51b3a6ab77189ea531a4dbc3', '03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', 'private'),
('e88779fbcea217bfef5ac496ad35ddf971d3733e51b3a6ab77189ea531a4dbc3', '4ed4e50a279d5adafe6cdacbfb33ef6288c5b07ec6b827bfda36ae6815336a21', 'private'),
('e88779fbcea217bfef5ac496ad35ddf971d3733e51b3a6ab77189ea531a4dbc3', '7fe727e1d8c4c2538646309b4b23235b51e92cbb351a539fc48683cf202ca5b4', 'private'),
('e88779fbcea217bfef5ac496ad35ddf971d3733e51b3a6ab77189ea531a4dbc3', 'db2b849f9cc6a7e61baae9b9e6b495db724bfbf10a2eecf335525f947d4bf525', 'private');

--
-- Triggers `user_groups`
--
DELIMITER $$
CREATE TRIGGER `notify_group_addition` AFTER INSERT ON `user_groups` FOR EACH ROW BEGIN
    DECLARE v_group_name VARCHAR(255);
    DECLARE v_owner_name VARCHAR(255);
    DECLARE v_notification_id VARCHAR(256);
    SET v_notification_id = SHA2(CONCAT(NEW.group_id, 'notification_id', 'added', CURRENT_TIMESTAMP()), 256);
    SELECT groupname INTO v_group_name FROM groups WHERE group_id = NEW.group_id;
    INSERT INTO notifications(user_id, notification_id, status, message) VALUES(NEW.user_id, v_notification_id, 'unseen', CONCAT('You were added to group &', v_group_name));
    UPDATE groups SET member_count = member_count+1 WHERE group_id = NEW.group_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `notify_group_removal` AFTER DELETE ON `user_groups` FOR EACH ROW BEGIN
    DECLARE v_group_name VARCHAR(255);
    DECLARE v_owner_name VARCHAR(255);
    DECLARE v_notification_id VARCHAR(256);
    SET v_notification_id = SHA2(CONCAT(OLD.group_id, 'notification_id', 'removed', CURRENT_TIMESTAMP()), 256);
    SELECT groupname INTO v_group_name FROM groups WHERE group_id = OLD.group_id;
    INSERT INTO notifications(user_id, notification_id, status, message) VALUES(OLD.user_id, v_notification_id, 'unseen', CONCAT('You were removed from group &', v_group_name));
    UPDATE groups SET member_count = member_count - 1 WHERE group_id = OLD.group_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
  `user_id` varchar(256) NOT NULL,
  `post_id` varchar(256) NOT NULL,
  `vote_type` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`user_id`, `post_id`, `vote_type`) VALUES
('03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', '1fe27fe590048a91ae8bc8a16ee5b064adc4f83e2565470046510770288b201b', 'l'),
('03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', '41c1ed9f4266cf2e6c3f36b725194c01a5694f404b3b215f44efc31535fd6ea7', 'l'),
('03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', 'a011ae6058e1ff93fc46bb482643f84c00be0cb5c7d12316577a84a9f6c8fe1f', 'l'),
('03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', 'ae5e8c92e2936d07dc6328ec12f2a17ca082985aa7bf5d99de8f286944847e7e', 'l'),
('03468c57e6a2081aa0d1fa21af5dd03d43a936f29724c8b9b2652bb9a6773b8b', 'babb5360d9692997f0c6301472ca4040c68593efd8a7b2689a5187221cca3268', 'l'),
('4ed4e50a279d5adafe6cdacbfb33ef6288c5b07ec6b827bfda36ae6815336a21', '9ab6904093cd642918eb8d31009c9fc9023fb108ca884c40dfaf4d8f406721ff', 'l'),
('4ed4e50a279d5adafe6cdacbfb33ef6288c5b07ec6b827bfda36ae6815336a21', 'a011ae6058e1ff93fc46bb482643f84c00be0cb5c7d12316577a84a9f6c8fe1f', 'l'),
('4ed4e50a279d5adafe6cdacbfb33ef6288c5b07ec6b827bfda36ae6815336a21', 'ae5e8c92e2936d07dc6328ec12f2a17ca082985aa7bf5d99de8f286944847e7e', 'l'),
('75833209005b32715c5c1b390d92a604ee67642c662738cda653613bda19edec', '1fe27fe590048a91ae8bc8a16ee5b064adc4f83e2565470046510770288b201b', 'l'),
('7fe727e1d8c4c2538646309b4b23235b51e92cbb351a539fc48683cf202ca5b4', 'ae5e8c92e2936d07dc6328ec12f2a17ca082985aa7bf5d99de8f286944847e7e', 'l');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth`
--
ALTER TABLE `auth`
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`commenter_id`,`post_id`,`comment_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `connections`
--
ALTER TABLE `connections`
  ADD KEY `follower_id` (`follower_id`),
  ADD KEY `following_id` (`following_id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`group_id`),
  ADD KEY `owner_id` (`owner_id`);

--
-- Indexes for table `group_posts`
--
ALTER TABLE `group_posts`
  ADD PRIMARY KEY (`group_id`,`post_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `moderators`
--
ALTER TABLE `moderators`
  ADD PRIMARY KEY (`moderator_id`,`group_id`),
  ADD KEY `group_id` (`group_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`user_id`,`notification_id`,`message`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `creator_id` (`creator_id`);

--
-- Indexes for table `post_links`
--
ALTER TABLE `post_links`
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `post_tags`
--
ALTER TABLE `post_tags`
  ADD KEY `fk_post_id` (`post_id`);

--
-- Indexes for table `private_groups`
--
ALTER TABLE `private_groups`
  ADD PRIMARY KEY (`group_id`);

--
-- Indexes for table `public_groups`
--
ALTER TABLE `public_groups`
  ADD PRIMARY KEY (`group_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_groups`
--
ALTER TABLE `user_groups`
  ADD PRIMARY KEY (`group_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`user_id`,`post_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth`
--
ALTER TABLE `auth`
  ADD CONSTRAINT `auth_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`commenter_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `connections`
--
ALTER TABLE `connections`
  ADD CONSTRAINT `connections_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `connections_ibfk_2` FOREIGN KEY (`following_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `group_posts`
--
ALTER TABLE `group_posts`
  ADD CONSTRAINT `group_posts_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`),
  ADD CONSTRAINT `group_posts_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE;

--
-- Constraints for table `moderators`
--
ALTER TABLE `moderators`
  ADD CONSTRAINT `moderators_ibfk_1` FOREIGN KEY (`moderator_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `moderators_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `post_links`
--
ALTER TABLE `post_links`
  ADD CONSTRAINT `post_id` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_links_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`);

--
-- Constraints for table `post_tags`
--
ALTER TABLE `post_tags`
  ADD CONSTRAINT `fk_post_id` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_tags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`);

--
-- Constraints for table `private_groups`
--
ALTER TABLE `private_groups`
  ADD CONSTRAINT `private_groups_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`);

--
-- Constraints for table `public_groups`
--
ALTER TABLE `public_groups`
  ADD CONSTRAINT `group_id` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `public_groups_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`);

--
-- Constraints for table `user_groups`
--
ALTER TABLE `user_groups`
  ADD CONSTRAINT `user_groups_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_groups_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE;

--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
