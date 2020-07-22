'use strict';

const connection = require('./connection');
const Account = require('../../entity/Account');

const queryFindByName = 'select * from account where name like ?;';
const queryFindById = 'SELECT pi, name, mylist_id FROM account WHERE pi = ?;';
const queryFindByListId = 'select account.pi, name, mylist_id from account, list_account where list_account.account_id=account.pi and list_account.list_id=?';
const queryInsertAccount = 'INSERT INTO account (name, mylist_id, email, password) VALUES ( ?, 0, ?, ? );'; //mylist is created by trigger

module.exports = {
  findByName: (name, callback) => {
    connection.query(queryFindByName, [name], (err, results, fields) => {
      var result = null;
      if (err) {
        console.log(err);
        callback(null, err);
      }
      else if (results.length <= 0) {
        callback(null, "No accounts found with name '" + name + "'");
      } else if (results.length > 1) {
        callback(null, "Multiple accounts with name '" + name + "' found");
      } else {
        result = new Account(results[0].PI, results[0].name, results[0].mylist_id, results[0].email, results[0].password);
        callback(result, err);
      }
    });
  },
  findById: (accid, callback) => {
    connection.query(queryFindById, [accid], (err, results, fields) => {
      var result = null;

      if (results.length <= 0) {
        callback(null, "No accounts found with id '" + accid + "'");
      } else if (results.length > 1) {
        callback(null, "Multiple accounts with id '" + accid + "' found");
      } else {
        result = new Account(results[0].pi, results[0].name, results[0].mylist_id, null,null);
        callback(result, err);
      }
    });
  },
  findByListId: (listid, callback) => {
    connection.query(queryFindByListId, [listid], (err, results, fields) => {
      var result = [];
      if (results.length <= 0) {
        callback(null, "No accounts found in list '" + listid + "'");
      } else {
        results.forEach(element => {
          result.push(new Account(element.pi, element.name, element.mylist_id, null, null));
        });
        callback(result, err);
      }
    });
  },
  InsertAccount: (email,name,pw, callback) => {
    connection.query(queryInsertAccount, [name,email,pw], (err, result, fields) => {
      if (err) {
        callback(null, err);
      } else {
        callback(result, err);
      }
    });
  }
};