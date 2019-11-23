//name options: chatS chats chatZ chatz nig..
'use strict';

const connection = require('./connection');
const Chat = require('../../entity/Chat');

const queryFindbyListId = 'SELECT chat.PI, account.PI as senderId, account.name as sender, chat.message, chat.timestamp' +
  ' FROM chat,account WHERE chat.acc_id = account.PI AND chat.list_id = ?' +
  ' ORDER BY chat.timestamp;';
const queryInsertChat = 'INSERT INTO chat (list_id, acc_id, message) VALUES (?, ?, ?);';
const queryUpdateChatMsg = 'UPDATE chat SET chat.message = ? WHERE chat.PI = ?;';
const queryDeleteChatById = 'DELETE FROM chat WHERE PI = ?;';
const queryDeleteChatByListId = 'DELETE FROM chat WHERE list_id = ?;';

module.exports = {
  findByListId: (listId, callback) => {
    connection.query(queryFindbyListId, [listId], (err, results, fields) => {
      var result = [];

      results.forEach(element => {
        result.push(new Chat(element.PI, element.senderId, element.sender, element.message, element.timestamp));
      });
      callback(result, null);
    });
  },
  InsertChat: (newChatMsg, callback) => {
    connection.query(queryInsertChat, [newChatMsg.listId, newChatMsg.accId, newChatMsg.message], (err, result) => {
      callback(result, null);
    });
  },
  UpdateChatMsg: (newMsg, chatId, callback) => {
    connection.query(queryUpdateChatMsg, [newMsg,chatId], (err, result) => {
      callback(result, null);
    });
  },
  DeleteChatById: (chatId, callback) => {
    connection.query(queryDeleteChatById, [chatId], (err, result) => {
      callback(result, null);
    });
  },
  DeleteChatByListId: (listId, callback) => {
    connection.query(queryDeleteChatByListId, [listId], (err, result) => {
      callback(result, null);
    });
  }
};
