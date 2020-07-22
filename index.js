var express = require('express');
var session = require('express-session');
//var bodyParser = require('body-parser');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var path = require('path');
var bcrypt = require('bcrypt');
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

var saltRounds = 10;

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

function formatTimestamp(ts) {
	var d = new Date(ts);
	return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' ' + d.getDate() + '.' + (d.getMonth() + 1);
}

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
	var loginName = req.body.username.trim();
	console.log(loginName + " tried to log in");
	accounts.findByName(loginName, function (account, err) {
		if (err) {
			console.log(err);
			res.send({
				err: err
			});
			return;
		}
		if (account.id == 1 || account.id == 2) { //DasTool & Testtool need no password
			console.log("---TESTACCOUNT---");
			req.session.account = account;

			res.redirect("/list/" + account.myListId);
			return;
		}
		bcrypt.compare(req.body.password, account.password, function (err, result) {
			if (err) {
				res.send({
					err: err
				});
				return;
			}
			if (result) {
				console.log("valid");
				req.session.account = account;

				res.redirect("/list/" + account.myListId);
				return;
			} else {
				res.send({
					err: 'no'
				});
				return;
			}
		});

	});
});

//create Account
app.post('/register', function (req, res) { //TODO: Same username check
	console.log(req.body);
	console.log("new registration with uname " + req.body.newUserName);

	if (!(req.body.newUserName && req.body.newPassword && req.body.newEmail)) {
		res.send({
			err: 'pls fill out all pls'
		});
		return;
	}

	bcrypt.hash(req.body.newPassword, saltRounds, function (err, hash) {
		if (err) {
			res.send(err);
			return;
		}
		var confirmationLink = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
		accounts.InsertAccount(req.body.newEmail, req.body.newUserName, hash, confirmationLink, function (result, err) {
			if (err) {
				console.log(err);
				res.send({
					err: err
				});
				return;
			}
			console.log('ok');
			res.send('ok, pls confrim ' + confirmationLink);
		});
	});
});

app.get('/confirmAccount/:confirmationLink', function (req, res) {
	var confirmationLink = req.params.confirmationLink;
	accounts.findByConfirmationLink(confirmationLink, function (account, err) {
		if (err) {
			res.send({
				err: err
			});
			return;
		}
		console.log(account);
		if (account.status == 0) { //if account is unconfirmed = 0
			accounts.updateStatus(account.id, 1, function (result, err) { //set status to 1 = confirmed
				if (err) {
					res.send({
						err: err
					});
					return;
				}
			});

		}
		res.render('confirmAccount.html', {
			account: account
		});
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
								currentListId: req.session.listid
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
			nspLists.to('L' + req.session.listid).emit('newEntryMsg', {
				entryId: result.insertId,
				name: req.body.newEntryName,
				status: 0
			});
		}

	});
	res.end();
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
			entries.findById(entryid, function (updatedEntry, err) {
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
	res.end();
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
	res.end();
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
							console.log(insertedChat.timestamp);
							nspLists.to('L' + req.session.listid).emit('newChatMsg', {
								message: req.body.chatmessage,
								senderName: account.name,
								chatId: result.insertId,
								senderId: account.id,
								timestamp: formatTimestamp(insertedChat.timestamp)
							});
							/* test setting
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
							*/
						}
					});
				}
			});
		}
	});
	res.end();
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
			chats.findById(chatid, function (updatedChat, err) {
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
	res.end();
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
	res.end();
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
	var leaveListId = req.body.leaveListId;
	console.log(accId + ' trying to leave ' + leaveListId);
	if (accId == req.session.account.id && leaveListId == req.session.account.myListId) { //can't leave personal list
		console.log('cant');
		res.redirect('/list/' + req.session.listid);
	} else {
		lists.DeleteListAccRel(leaveListId, accId, function (result, err) {
			if (err) {
				console.log(err);
				res.send(err);
			} else {
				res.redirect('/list/' + req.session.account.myListId);
			}
		});
	}
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
});

http.listen(8080, function () {
	console.log("App Started on port 8080");
});