//name options: chatS chats chatZ chatz nig..
'use strict';

const connection = require('./connection');
const Chat = require('../../entity/Chat');

const queryFindbyListId = 'SELECT chat.PI, account.PI as senderId, account.name as sender, chat.message, chat.timestamp' +
  ' FROM chat,account WHERE chat.acc_id = account.PI AND chat.list_id = ?' +
  ' ORDER BY chat.timestamp;';
const queryFindById = 'SELECT pi, list_id, acc_id, message, timestamp FROM chat WHERE pi = ?;';
const queryInsertChat = 'INSERT INTO chat (list_id, acc_id, message) VALUES (?, ?, ?);';
const queryUpdateChatMsg = 'UPDATE chat SET chat.message = ? WHERE chat.PI = ?;';
const queryDeleteChatById = 'DELETE FROM chat WHERE PI = ?;';
const queryDeleteChatByListId = 'DELETE FROM chat WHERE list_id = ?;';

module.exports = {
  findByListId: (listId, callback) => {
    connection.query(queryFindbyListId, [listId], (err, results, fields) => {
      var result = [];

      if (err) {
        callback([], err);
      } else {
        results.forEach(element => {
          result.push(new Chat(element.PI, element.senderId, element.sender, element.message, element.timestamp));
        });
        callback(result, err);
      }
    });
  },
  findById: (chatId, callback) => {
    connection.query(queryFindById, [chatId], (err, results) => {
      var result = null;

      if (results.length <= 0) {
        callback(null, "No chats found with id '" + chatId + "'");
      } else if (results.length > 1) {
        callback(null, "Multiple chats with id '" + chatId + "' found");
      } else {
        result = new Chat(results[0].pi, null,null,results[0].message, results[0].timestamp);
        callback(result, err);
      }
    });
  },
  InsertChat: (newChatMsg, callback) => {
    connection.query(queryInsertChat, [newChatMsg.listId, newChatMsg.accId, newChatMsg.message], (err, result) => {
      callback(result, err);
    });
  },
  UpdateChatMsg: (chatId, newMsg, callback) => {
    connection.query(queryUpdateChatMsg, [newMsg,chatId], (err, result) => {
      callback(result, err);
    });
  },
  DeleteChatById: (chatId, callback) => {
    connection.query(queryDeleteChatById, [chatId], (err, result) => {
      callback(result, err);
    });
  },
  DeleteChatByListId: (listId, callback) => {
    connection.query(queryDeleteChatByListId, [listId], (err, result) => {
      callback(result, err);
    });
  }
};
