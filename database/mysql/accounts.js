'use strict';

const connection = require('./connection');
const Account = require('../../entity/Account');

const queryFindByName = 'select pi, name, mylist_id from account where name like ?;';
const queryFindById = 'SELECT pi, name FROM account WHERE pi = ?;'

const queryDeleteListAccRelByAccountId = 'DELETE FROM list_account WHERE account_id = ?;';

module.exports = {
  findByName: (name, callback) => {
    connection.query(queryFindByName, [name], (err, results, fields) => {
      var result = null;

      if(results.length <= 0){
        callback(null, "No accounts found with name '" + name + "'");
      } else if(results.length > 1) {
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

      if(results.length <= 0){
        callback(null, "No accounts found with id '" + accid + "'");
      } else if(results.length > 1) {
        callback(null, "Multiple accounts with id '" + accid + "' found");
      } else {
        result = new Account(results[0].pi, results[0].name, results[0].mylist_id);
        callback(result, null);
      }
    });
  }
};
