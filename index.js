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

//db
const accounts = require('./database/mysql/accounts');
const lists = require('./database/mysql/lists');
const entries = require('./database/mysql/entries');
const chats = require('./database/mysql/chats');


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
	if (req.session.account.id) {
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
	accounts.findByName(req.body.username, function (account, err) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			console.log("valid");
			req.session.account = account;

			//Note: account.myListId can be omitted since id is in session.
			res.redirect("/list/" + account.myListId);
		}
	});
});

//GET overview
app.get('/list/:listid', function (req, res) {
	var listid = req.params.listid;
	req.session.listid = listid;
	if (req.session.account.id) {

		lists.findByAccountId(req.session.account.id, function (resList, err) {
			if (err) {
				console.log(err);
				res.send(err);
			} else {
				entries.findByListId(req.session.listid, function (resEntry, err) {
					if (err) {
						console.log(err);
						res.send(err);
					} else {
						chats.findByListId(req.session.listid, function (resChat, err) {
							if (err) {
								console.log(err);
								res.send(err);
							} else {
								res.render('list.html', {
									resList: resList,
									resEntry: resEntry,
									resChat: resChat,
									account: req.session.account
								});
							}
						});
					}
				});
			}
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
	entries.InsertEntry({
		listId: listid,
		name: req.body.newEntryName
	}, function (result, err) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			console.log('1 entry inserted');
		}

	});

	res.redirect('/list/' + listid);
});

//Delete Entry
app.post('/deleteEntry', function (req, res) {
	entries.DeleteById(req.body.deleteEntryId, function (result, err) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			console.log('1 entry deleted');
		}
	});
	res.redirect("/list/" + req.session.listid);
});

//Create List
app.post('/new-list', function (req, res) {

	lists.InsertList(req.body.newListName, function (result, err) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			lists.InsertListAccRel(req.session.account.id, result.insertId, function (result, err) {
				if (err) {
					console.log(err);
					res.send(err);
				} else {
					res.redirect('/list/' + result.insertId);
				}
			});
		}
	});
});

//Delete List
app.post('/deleteList', function (req, res) {

	lists.DeleteList(req.body.deleteListId, function (result, err) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			console.log('list deleted, wow');
		}

	});
	res.redirect("/list/" + req.session.account.myListId);
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

//Create Chat
app.post('/chat', function(req, res){
	chats.InsertChat({listId:req.session.listid,accId:req.session.account.id,message:req.body.chatmessage}, function(result, err){
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.redirect('/list/' + req.session.listid);
		}
	});
});

//Delete Chat
app.post('/deleteChat', function(req,res){
	chats.DeleteChatById(req.body.deleteChatId, function(result, err){
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.redirect('/list/' + req.session.listid);
		}
	});
});

//AddUserToList
app.post('/addUserToList', function(req, res){
	accounts.findByName(req.body.addUserName, function(account, err){
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			lists.InsertListAccRel(req.session.listid, account.id, function(result, err){
				if (err) {
					console.log(err);
					res.send(err);
				} else {
					res.redirect('/list/' + req.session.listid);
				}
			});
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
		entries.updateEntryStatus(msg.id, msg.st, function (result, err) {
			if (err) {
				console.log(err);
				res.send(err);
			} else {
				console.log('1 entry updated');
			}

		});
		io.emit('checkEntryChange', msg);
	});
});

http.listen(8080, function () {
	console.log("App Started on port 8080");
});