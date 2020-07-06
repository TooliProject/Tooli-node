# Make mysql > v8 compatible with node connector
ALTER USER root IDENTIFIED WITH mysql_native_password BY 'admin';

# Create database
CREATE DATABASE IF NOT EXISTS tooli;
USE tooli;

# Drop tables and trigger if exist
DROP TRIGGER IF EXISTS create_account_list;

DROP TABLE IF EXISTS chat;
DROP TABLE IF EXISTS entry;
DROP TABLE IF EXISTS list_account;
DROP TABLE IF EXISTS list;
DROP TABLE IF EXISTS account;

# Create tables
CREATE TABLE account (
  pi INT PRIMARY KEY AUTO_INCREMENT,
  name varchar(255) NOT NULL UNIQUE,
  mylist_id INT
);

CREATE TABLE list (
    pi INT PRIMARY KEY AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    account_id INT,
    FOREIGN KEY (account_id) REFERENCES account(pi)
);

CREATE TABLE list_account(
    account_id INT NOT NULL,
    list_id INT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES account(pi),
    FOREIGN KEY (list_id) REFERENCES list(pi)
);

CREATE TABLE entry (
    pi INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    status INT,
    list_id INT NOT NULL,
    FOREIGN KEY (list_id) REFERENCES list(pi)
);

CREATE TABLE chat (
    pi INT PRIMARY KEY AUTO_INCREMENT,
    acc_id INT NOT NULL,
    list_id INT NOT NULL,
    message VARCHAR(1024),
    timestamp TIMESTAMP,
    FOREIGN KEY (acc_id) REFERENCES account(pi),
    FOREIGN KEY (list_id) REFERENCES list(pi)
);

# Create trigger
CREATE TRIGGER create_account_list BEFORE INSERT ON account
    FOR EACH ROW
    BEGIN
        DECLARE ls_id integer;
        DECLARE acc_id integer;

        SELECT AUTO_INCREMENT
        INTO acc_id
        FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = 'tooli'
          AND TABLE_NAME = 'account';

        SET foreign_key_checks = 0;

        INSERT INTO list (name, account_id)
            VALUES (CONCAT(NEW.name, '\'s-list'), acc_id);

        SELECT pi
            INTO ls_id
            FROM list
            WHERE account_id=acc_id;

        SET NEW.mylist_id = ls_id;

        INSERT INTO list_account (account_id, list_id)
            VALUES (acc_id, ls_id);

        SET foreign_key_checks = 1;
    END;

# Insert Test Data
INSERT INTO account (name) VALUES ('michael');
INSERT INTO account (name) VALUES ('simon');
