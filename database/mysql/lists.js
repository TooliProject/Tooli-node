'use strict';

const connection = require('./connection');
const List = require('../../entity/List');

const queryFindByAccountId = 'SELECT list.PI, list.name FROM list INNER JOIN list_account ON list_account.list_id=list.PI WHERE list_account.account_id=?;';
const queryInsertList = 'INSERT INTO list ( name ) VALUES ( ? );';
const queryDeleteList = 'DELETE FROM list WHERE PI = ?;';

const queryInsertListAccRel = 'INSERT INTO list_account ( account_id, list_id ) VALUES (?, ?);';
const queryDeleteListAccRel = 'DELETE FROM list_account WHERE list_id = ? AND account_id = ?;';
const queryDeleteListAccRelByListId = 'DELETE FROM list_account WHERE list_id = ?;';
const queryDeleteChatByListId = 'DELETE FROM chat WHERE list_id = ?;';
const queryDeleteEntryByListId = 'DELETE FROM entry WHERE list_id = ?;';

module.exports = {
  findByAccountId: (aid, callback) => {
    connection.query(queryFindByAccountId, [aid], (err, results, fields) => {
      var result = [];
      if (err) {
        callback(null, err);
      }
      else if(results.length <= 0){
        callback(null, "No lists found for '" + aid + "'");
      } else {
        //result = new Account(results[0].pi, results[0].name, results[0].mylist_id);
        results.forEach(element => {
            result.push(new List(element.PI, element.name));
        });
        callback(result, null);
      }
    });
  },
  InsertList: (newListName, callback) => {
    connection.query(queryInsertList, [newListName], (err, result) => {
      callback(result, null);
    });
  },
  DeleteList: (listId, callback) => { //Not needed -> DB trigger
    connection.query(queryDeleteList + queryDeleteListAccRelByListId + queryDeleteChatByListId + queryDeleteEntryByListId, [listId,listId,listId,listId], (err, result) => {
      callback(result, null);
    });
  },
  DeleteListAccRel: (listId, accountId, callback) => { //Leave list
    connection.query(queryDeleteListAccRel, [listId, accountId], (err, result) => {
      callback(result, null);
    });
  },
  InsertListAccRel: (listId, accountId, callback) => {
    connection.query(queryInsertListAccRel, [accountId,listId], (err, result) => {
      callback(result, null);
    });
  },
};
