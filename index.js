var express = require('express');
var session = require('express-session');
//var bodyParser = require('body-parser');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var path = require('path');
require('console-stamp')(console, 'dd.mm.yyyy HH:MM:ss');

process.env.PWD = process.cwd();
app.use(express.static(process.env.PWD + '/public'));

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

/**
 * authentication function
 */
var authenticate = function (req, res) {
	if (!req.session.account) {
		res.redirect("/login");
		console.log('Authentication failed');
		return false; //NOT OK
	}
	return true; //OK
};

app.get('/', function (req, res) {
	if (req.session.account) {
		res.redirect('/list/' + req.session.listid);
	} else {
		res.redirect('/login');
	}
});
app.get('/login', function (req, res) {
	res.render('login.html');
});
app.get('/register', function (req, res) {
	res.render('register.html');
});

//login
app.post('/login', function (req, res) {
	console.log(req.body.username + " tried to log in");
	accounts.findByName(req.body.username, function (account, err) {
		if (err) {
			console.log(err);
			res.send({
				err: err
			});
		} else { //successful login
			console.log("valid");
			req.session.account = account;

			res.redirect("/list/" + account.myListId);
		}
	});
});

//GET overview
app.get('/list/:listid', function (req, res) {
	if (!authenticate(req, res)) {
		return;
	}
	var listid = req.params.listid;
	req.session.listid = listid;

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
								account: req.session.account,
								currentList: req.session.listid
							});
						}
					});
				}
			});
		}
	});
});

//Create Entry
app.post('/list/:listid', function (req, res) {
	if (!authenticate(req, res)) {
		return;
	}
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
});

//Edit Entry
app.post('/entry/:entryid', function (req, res) {
	if (!authenticate(req, res)) {
		return;
	}
	var entryid = req.params.entryid;

	entries.updateEntryName(entryid, req.body.entryContent, function (result, err) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			console.log('1 entry updated');
			entries.findById(entryid, function(updatedEntry, err){
				if (err) {
					console.log(err);
					res.send(err);
				} else {
					nspLists.to('L' + req.session.listid).emit('editEntryMsg', {
						updatedEntryId: updatedEntry.id,
						updatedEntryName: updatedEntry.name
					});
				}
			});
		}
	});
});

//Delete Entry
app.post('/deleteEntry', function (req, res) { // list owner?
	if (!authenticate(req, res)) {
		return;
	}
	entries.DeleteById(req.body.deleteEntryId, function (result, err) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			console.log('1 entry deleted');
			nspLists.to('L' + req.session.listid).emit('deleteEntryMsg', {
				deleteEntryId: req.body.deleteEntryId
			});

		}
	});
});

//Create List
app.post('/new-list', function (req, res) {
	console.log("in new list");
	if (!authenticate(req, res)) {
		return;
	}

	lists.InsertList(req.body.newListName, function (result, err) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			const newListId = result.insertId;
			lists.InsertListAccRel(result.insertId, req.session.account.id, function (result, err) {
				if (err) {
					console.log(err);
					res.send(err);
				} else {
					res.redirect('/list/' + newListId);
				}
			});
		}
	});
});

//Delete List
app.post('/deleteList', function (req, res) { //can only be done by list owner
	if (!authenticate(req, res)) {
		return;
	}

	console.log(req.session.account.id + ' is trying to delete ' + req.body.deleteListId);
	console.log('personal list: ' + req.session.account.myListId);

	if (req.body.deleteListId == req.session.account.myListId) { //can't delete personal list
		console.log('cant');
	} else {
		lists.DeleteList(parseInt(req.body.deleteListId), function (result, err) {
			if (err) {
				console.log(err);
				res.send(err);
			} else {
				console.log('list deleted, wow');
				if (req.body.deleteListId == req.session.listid) {
					res.redirect("/list/" + req.session.account.myListId);
				} else {
					res.redirect('/list/' + req.session.listid);
				}
			}
		});
	}
});

//GET new list 
app.get('/new-list', function (req, res) {
	if (!authenticate(req, res)) {
		return;
	}
	res.render('new_list.html');
});

//GET logout
app.get('/logout', function (req, res) {

	req.session.destroy(function (err) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/login');
		}
	});

});

//Create Chat
app.post('/chat', function (req, res) {
	if (!authenticate(req, res)) {
		return;
	}
	console.log('Create Chat');
	console.log({
		listId: req.session.listid,
		accId: req.session.account.id,
		message: req.body.chatmessage
	});
	chats.InsertChat({
		listId: req.session.listid,
		accId: req.session.account.id,
		message: req.body.chatmessage
	}, function (result, err) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			chats.findById(result.insertId, function (insertedChat, err) {
				if (err) {
					console.log(err);
					res.send(err);
				} else {
					accounts.findById(req.session.account.id, function (account, err) {
						if (err) {
							console.log(err);
							res.send(err);
						} else {
							nspLists.to('L' + req.session.listid).emit('chatMsg', {
								message: req.body.chatmessage,
								senderName: account.name,
								chatId: result.insertId,
								senderId: account.id,
								timestamp: insertedChat.timestamp
							});
							accounts.findByListId(req.session.listid, function (accsInList, err) {
								if (err) {
									console.log(err);
									res.send(err);
								} else {
									accsInList.forEach(element => {
										nspUsers.to('U' + element.id).emit('notifMsg', {
											message: req.body.chatmessage,
											sender: account.name,
											mid: result.insertId,
											listid: req.session.listid,
										});
									});
								}
							});
						}
					});
				}
			});
		}
	});
});

//Edit Chat
app.post('/chat/:chatid', function (req, res) {
	if (!authenticate(req, res)) {
		return;
	}
	var chatid = req.params.chatid;

	chats.UpdateChatMsg(chatid, req.body.chatContent, function (result, err) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			console.log('1 chat updated');
			chats.findById(chatid, function(updatedChat, err){
				if (err) {
					console.log(err);
					res.send(err);
				} else {
					nspLists.to('L' + req.session.listid).emit('editChatMsg', {
						updatedChatId: updatedChat.id,
						updatedChatMessage: updatedChat.message
					});
				}
			});
		}
	});
});

//Delete Chat
app.post('/deleteChat', function (req, res) {
	if (!authenticate(req, res)) {
		return;
	}
	console.log('Delete Chat');
	console.log(req.body.deleteChatId);
	chats.DeleteChatById(req.body.deleteChatId, function (result, err) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			nspLists.to('L' + req.session.listid).emit('deleteChatMsg', {
				deleteChatId: req.body.deleteChatId
			});
		}
	});
});

//AddUserToList
app.post('/addUserToList', function (req, res) { //TODO: can only be done by list owner
	if (!authenticate(req, res)) {
		return;
	}
	accounts.findByName(req.body.addUserName, function (account, err) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			lists.InsertListAccRel(req.session.listid, account.id, function (result, err) {
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

//Remove User from List/leave
app.post('/removeUserFromList', function (req, res) { //TODO: can only be done by list owner
	if (!authenticate(req, res)) {
		return;
	}
	var accId = req.body.accountId;
	var leaveListId = req.session.listid;
	console.log(req.body.accountId + ' trying to leave ' + req.session.listid);
	if (accId == req.session.account.id && leaveListId == req.session.account.myListId) { //can't leave personal list
		console.log('cant');
		res.redirect('/list/' + req.session.listid);
	} else {
		lists.DeleteListAccRel(leaveListId, accId, function (account, err) {
			if (err) {
				console.log(err);
				res.send(err);
			} else {
				res.redirect('/list/' + req.session.account.myListId);
			}
		});
	}
});

//create Account
app.post('/register', function (req, res) { //TODO: Same username check
	console.log(req);
	console.log("new registration with uname " + req.body.newUserName);
	accounts.InsertAccount(req.body.newUserName, function (result, err) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			//login
			accounts.findById(result.insertId, function (account, err) {
				if (err) {
					console.log(err);
					res.send(err);
				} else {
					console.log("valid");
					req.session.account = account;

					res.redirect("/list/" + account.myListId);
				}
			});
		}
	});
});


const nspLists = io.of('/listNsp');
const nspUsers = io.of('/userNsp');
io.on('connection', function (socket) {
	//console.log('a user connected to the global socket');
	socket.on('disconnect', function () {
		//console.log('user has disconnected from the global socket');
	});
});
//Controls userspecific rooms U<userid>
nspUsers.on('connection', function (socket) {
	socket.on('connectUser', function (msg) {
		socket.join(msg.rid);
		console.log('User joined Room: ' + msg.rid);
	});
	socket.on('disconnect', function () {
		console.log('disconnectU');
	});
});
//Controls listspecific rooms L<listid>
nspLists.on('connection', function (socket) {
	//console.log('a user connected to the nsp socket');
	socket.on('disconnect', function () {});
	/* socket msgs here*/
	socket.on('joinRoom', function (msg) {
		socket.join(msg.rid);
		console.log('User joined Room: ' + msg.rid);
	});
	socket.on('checkEntryChange', function (msg) {
		entries.updateEntryStatus(msg.id, msg.st, function (result, err) {
			if (err) {
				console.log(err);
				res.send(err);
			} else {
				console.log('1 entry updated');
			}
		});
		nspLists.emit('checkEntryChange', msg);
	});
	socket.on('chatMsg', function (msg) {
		console.log('chat message received');
		console.log(msg);
		console.log('is this used?');
		nspLists.emit('chatMsg', msg);
	});
});

http.listen(8080, function () {
	console.log("App Started on port 8080");
});