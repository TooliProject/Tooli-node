const express = require('express');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "0.0.0.0",
	user: "root",
	password: "admin",
	database: "tooli",
	multipleStatements: true
});

module.exports = connection; 