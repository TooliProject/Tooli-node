const express = require('express');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "192.168.1.15",
	user: "root",
	password: "admin",
	database: "tooli",
	multipleStatements: true
});

module.exports = connection; 