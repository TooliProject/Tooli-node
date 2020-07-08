-- phpMyAdmin SQL Dump
-- version 4.0.10.20
-- https://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 07. Jul 2020 um 00:57
-- Server Version: 5.1.73
-- PHP-Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `tooli`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `account`
--

CREATE TABLE IF NOT EXISTS `account` (
  `PI` int(8) NOT NULL AUTO_INCREMENT,
  `Name` varchar(30) NOT NULL,
  `mylist_id` int(8) NOT NULL,
  PRIMARY KEY (`PI`),
  KEY `mylist_id` (`mylist_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=20 ;

--
-- Daten für Tabelle `account`
--

INSERT INTO `account` (`PI`, `Name`, `mylist_id`) VALUES
(1, 'DasTool', 1),
(2, 'Testtool', 2);

--
-- Trigger `account`
--
DROP TRIGGER IF EXISTS `createPersonalListForAccount`;
DELIMITER //
CREATE TRIGGER `createPersonalListForAccount` BEFORE INSERT ON `account`
 FOR EACH ROW BEGIN
INSERT INTO list ( name ) VALUES ( 'My First List');
SET NEW.mylist_id=LAST_INSERT_ID();
END
//
DELIMITER ;
DROP TRIGGER IF EXISTS `deletePersonalListAndListLinks`;
DELIMITER //
CREATE TRIGGER `deletePersonalListAndListLinks` AFTER DELETE ON `account`
 FOR EACH ROW BEGIN
DELETE FROM list WHERE PI = OLD.mylist_id;
DELETE FROM list_account WHERE account_id = OLD.PI;
END
//
DELIMITER ;
DROP TRIGGER IF EXISTS `linkAccountWithPersonalList`;
DELIMITER //
CREATE TRIGGER `linkAccountWithPersonalList` AFTER INSERT ON `account`
 FOR EACH ROW BEGIN
INSERT INTO list_account (account_id, list_id) VALUES (NEW.PI,NEW.mylist_id);
END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `chat`
--

CREATE TABLE IF NOT EXISTS `chat` (
  `PI` int(8) NOT NULL AUTO_INCREMENT,
  `list_id` int(8) NOT NULL,
  `acc_id` int(8) NOT NULL,
  `message` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`PI`),
  KEY `list_id` (`list_id`,`acc_id`,`timestamp`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=779 ;

--
-- Daten für Tabelle `chat`
--

INSERT INTO `chat` (`PI`, `list_id`, `acc_id`, `message`, `timestamp`) VALUES
(535, 0, 1, 'asdf', '2019-11-30 17:03:05'),
(536, 0, 1, 'wer', '2019-11-30 17:03:10'),
(564, 2, 2, 'asd', '2020-01-22 20:01:33'),
(24, 2, 2, 'asd', '2019-11-23 01:21:21'),
(547, 3, 2, 'not empty', '2019-12-02 19:45:55'),
(539, 0, 1, 'sadf', '2019-11-30 17:04:17'),
(540, 0, 1, 'sadf', '2019-11-30 17:04:22'),
(530, 1, 1, '1', '2019-11-30 00:46:46'),
(602, 3, 1, 'a', '2020-01-22 21:11:26'),
(776, 3, 2, 'dh', '2020-01-28 18:33:58'),
(777, 1, 1, 'sdf', '2020-01-28 18:34:35'),
(778, 3, 1, 'wer', '2020-01-28 18:34:41');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `entry`
--

CREATE TABLE IF NOT EXISTS `entry` (
  `PI` int(8) NOT NULL AUTO_INCREMENT,
  `list_id` int(8) NOT NULL,
  `Name` varchar(30) NOT NULL,
  `Status` int(1) NOT NULL,
  PRIMARY KEY (`PI`),
  KEY `list_id` (`list_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=244 ;

--
-- Daten für Tabelle `entry`
--

INSERT INTO `entry` (`PI`, `list_id`, `Name`, `Status`) VALUES
(1, 1, 'Tooli entwickeln', 0),
(4, 2, 'Task 1', 1),
(5, 2, 'Task 2', 0),
(6, 2, 'Task 3', 0),
(185, 1, 'DESIGN', 0),
(186, 1, 'accounts anlegen', 1),
(236, 3, 'shared', 0),
(240, 3, 'wow', 1),
(239, 1, 'Passwörter für user', 0),
(242, 1, 'entries erweitern', 0),
(243, 1, 'notification in db', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `list`
--

CREATE TABLE IF NOT EXISTS `list` (
  `PI` int(8) NOT NULL AUTO_INCREMENT,
  `Name` varchar(30) NOT NULL,
  PRIMARY KEY (`PI`),
  KEY `PI` (`PI`),
  KEY `PI_2` (`PI`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=52 ;

--
-- Daten für Tabelle `list`
--

INSERT INTO `list` (`PI`, `Name`) VALUES
(1, 'DasTool''s Liste'),
(2, 'Tooltest''s Liste'),
(3, 'shared list');

--
-- Trigger `list`
--
DROP TRIGGER IF EXISTS `deleteEntryAndChat`;
DELIMITER //
CREATE TRIGGER `deleteEntryAndChat` AFTER DELETE ON `list`
 FOR EACH ROW BEGIN
	DELETE FROM chat WHERE list_id=OLD.PI;
	DELETE FROM entry WHERE list_id=OLD.PI;
END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `list_account`
--

CREATE TABLE IF NOT EXISTS `list_account` (
  `PI` int(8) NOT NULL AUTO_INCREMENT,
  `account_id` int(8) NOT NULL,
  `list_id` int(8) NOT NULL,
  PRIMARY KEY (`PI`),
  KEY `account_id` (`account_id`,`list_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=58 ;

--
-- Daten für Tabelle `list_account`
--

INSERT INTO `list_account` (`PI`, `account_id`, `list_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 1, 3),
(38, 2, 3);

--
-- Trigger `list_account`
--
DROP TRIGGER IF EXISTS `deleteUnusedList`;
DELIMITER //
CREATE TRIGGER `deleteUnusedList` AFTER DELETE ON `list_account`
 FOR EACH ROW BEGIN
DECLARE links INT;
SET links = (SELECT count(*) FROM list_account WHERE list_id=OLD.list_id);
IF links=0 THEN
	DELETE FROM list WHERE PI=OLD.list_id;
END IF;
END
//
DELIMITER ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
