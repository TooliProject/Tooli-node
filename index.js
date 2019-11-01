var express = require('express');
var session = require('express-session');
//var bodyParser = require('body-parser');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var path = require('path');

process.env.PWD = process.cwd()
app.use(express.static(process.env.PWD + '/public'));

var sqlCon = mysql.createConnection({
	host: "192.168.1.15",
	user: "root",
	password: "admin",
	database: "tooli"
});

app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// register the session with it's secret ID
app.use(session({
	secret: 'toolicooli',
	resave: true,
	saveUninitialized: true
}));



// register the bodyParser middleware for processing forms
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

app.get('/', function (req, res) {
	if (req.session.userid) {
		res.redirect('/list/' + req.session.listid);
	} else {
		res.redirect('/login');
	}
});
app.get('/login', function (req, res) {
	res.render('login.html');
});

app.post('/login', function (req, res) {

	console.log(req.body.username + " tried to log in");
	var sql = "SELECT PI,Name,mylist_id FROM account WHERE Name like '" + req.body.username + "'";
	sqlCon.query(sql, function (err, result, fields) {
		if (err) throw err;
		//res.render('index',{result: result});
		//console.log(result);
		if (result.length == 1) {
			console.log("valid");
			req.session.username = req.body.username;
			req.session.userid = result[0].PI;
			//console.log(req.session);
			res.redirect("/list/" + result[0].mylist_id);
		} else {
			console.log("invalid");
			res.end("");
		}
	});
});

app.get('/list-overview', function (req, res) { //unused

	if (req.session.userid) {
		var sql = "SELECT list.PI, list.name FROM list INNER JOIN list_account ON list_account.list_id=list.PI WHERE list_account.account_id=" + req.session.userid;
		sqlCon.query(sql, function (err, result, fields) {
			if (err) throw err;
			//console.log(result);
			res.render('list_overview.html', {
				result: result
			});
			//res.send(result);
		});
	} else {
		res.write('<h1>Please login first.</h1>');
		res.write('<a href="/">Login</a>');
		res.end();
	}
});

//GET overview
app.get('/list/:listid', function (req, res) {
	var listid = req.params.listid;
	req.session.listid = listid;
	if (req.session.userid) {
		var sql = "SELECT list.PI, list.name FROM list INNER JOIN list_account ON list_account.list_id=list.PI WHERE list_account.account_id=" + req.session.userid;
		sqlCon.query(sql, function (err, result, fields) {
			if (err) throw err;
			var selData = {
				resList: result,
				resEntry: null,
				resChat: null
			};
			sql = "SELECT * FROM entry where list_id = " + listid;
			sqlCon.query(sql, function (err, result, fields) {
				if (err) throw err;
				selData.resEntry = result;
				//console.log(selData);
				sql = "SELECT account.name as sender, chat.message FROM chat,account WHERE chat.acc_id = account.PI AND chat.list_id = " + listid;
				sqlCon.query(sql, function (err, result, fields) {
					if (err) throw err;
					selData.resChat = result;
					//console.log(selData);
					res.render('list.html', selData);
				});
			});
		});

	} else {
		res.write('<h1>Please login first.</h1>');
		res.write('<a href="/">Login</a>');
		res.end();
	}
});



//Create Entry
app.post('/list/:listid', function (req, res) {
	var listid = req.params.listid;
	console.log(listid + " : add entry : " + req.body.newEntryName);
	var sql = "INSERT INTO `entry` ( `list_id` , `Name` , `Status` ) VALUES ('" + listid + "','" + req.body.newEntryName + "','0')";
	console.log(sql);

	sqlCon.query(sql, function (err, result) {
		if (err) throw err;
		console.log("1 record inserted");
	});

	res.redirect('/list/' + listid);
});

//Delete Entry
app.post('/deleteEntry', function (req, res) {
	var sql = "DELETE FROM entry WHERE PI = " + req.body.deleteEntryId;
	sqlCon.query(sql, function (err, result) {
		if (err) throw err;
		console.log("1 record deleted");
	});
	res.redirect("/list/" + req.session.listid);
});

//Create List
app.post('/new-list', function (req, res) {
	console.log(req.body.newListName + " created by " + req.session.userid);
	var sql = "INSERT INTO `list` ( `name` ) VALUES ('" + req.body.newListName + "')";
	console.log(sql);

	sqlCon.query(sql, function (err, result) {
		if (err) throw err;
		console.log("1 record inserted");
		sql = "INSERT INTO `list_account` ( `account_id`, `list_id` ) VALUES ('" + req.session.userid + "','" + result.insertId + "')";
		console.log(sql);
		sqlCon.query(sql, function (err, result) {
			if (err) throw err;
			console.log("1 record inserted");
		});
		res.redirect('/list/' + result.insertId);
	});
});

//Delete List
app.post('/deleteList', function (req, res) {
	var sql = "DELETE FROM list WHERE PI = " + req.body.deleteListId;
	sqlCon.query(sql, function (err, result) {
		if (err) throw err;
		console.log("1 record deleted");
	});
	sql = "DELETE FROM entry WHERE list_id = " + req.body.deleteListId;
	sqlCon.query(sql, function (err, result) {
		if (err) throw err;
		console.log(result.affectedRows + " record(s) deleted");
	});
	sql = "DELETE FROM list_account WHERE list_id = " + req.body.deleteListId;
	sqlCon.query(sql, function (err, result) {
		if (err) throw err;
		console.log(result.affectedRows + " record(s) deleted");
	});
	res.redirect("/list/" + req.session.listid);
});

//GET new list 
app.get('/new-list', function (req, res) {
	res.render('new_List.html');
});

app.get('/logout', function (req, res) {

	req.session.destroy(function (err) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});

});

io.on('connection', function (socket) {
	console.log('a user connected to socket');
	socket.on('disconnect', function () {
		console.log('user has disconnected from socket');
	});
	/* socket msgs here*/
	socket.on('checkEntryChange', function (msg) {
		var sql = "UPDATE entry SET entry.Status=" + msg.st + " WHERE entry.PI=" + msg.id;
		sqlCon.query(sql, function (err, result) {
			if (err) throw err;
			//console.log("1 record updated");
		});
		io.emit('checkEntryChange', msg);
	});
});

http.listen(8080, function () {
	console.log("App Started on port 8080");
});