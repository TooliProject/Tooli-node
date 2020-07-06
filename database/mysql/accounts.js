'use strict';

const connection = require('./connection');
const Account = require('../../entity/Account');

const queryFindByName = 'select pi, name, mylist_id from account where name like ?;';
const queryFindById = 'SELECT pi, name, mylist_id FROM account WHERE pi = ?;';
const queryFindByListId = 'select account.pi, name, mylist_id from account, list_account where list_account.account_id=account.pi and list_account.list_id=?';
const queryInsertAccount = 'INSERT INTO account (Name) VALUES ( ? );'; //mylist is created by trigger

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
        result = new Account(results[0].pi, results[0].name, results[0].mylist_id);
        callback(result, null);
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
        result = new Account(results[0].pi, results[0].name, results[0].mylist_id);
        callback(result, null);
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
          result.push(new Account(element.pi, element.name, element.mylist_id));
        });
        callback(result, null);
      }
    });
  },
  InsertAccount: (name, callback) => {
    connection.query(queryInsertAccount, [name], (er, result, fields) => {
      callback(result, null);
    });
  }
};