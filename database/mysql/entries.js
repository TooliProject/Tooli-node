'use strict';

const connection = require('./connection');
const Entry = require('../../entity/Entry');

const queryFindByListId = 'SELECT * FROM entry where list_id = ?;';
const queryFindById = 'SELECT * FROM entry where PI = ?';
const queryInsertEntry = 'INSERT INTO entry ( list_id , text , Status ) VALUES (?, ?, 0);';
const queryUpdateEntryStatus = 'UPDATE entry SET entry.Status = ? WHERE entry.PI = ?;';
const queryDeleteById = 'DELETE FROM entry WHERE PI = ?;';
const queryDeleteByListId = 'DELETE FROM entry WHERE list_id = ?;';
const queryUpdateEntryText = 'UPDATE entry SET entry.text = ? WHERE entry.PI = ?;';

module.exports = {
  findByListId: (listId, callback) => {
    connection.query(queryFindByListId, [listId], (err, results, fields) => {
      var result = [];

      if (err) {
        callback([], err);
      } else {
        //result = new Account(results[0].pi, results[0].text, results[0].mylist_id);
        results.forEach(element => {
          result.push(new Entry(element.PI, element.Name, element.Status, element.created));
        });
        callback(result, err);
      }
    });
  },
  findById: (entryid, callback) => {
    connection.query(queryFindById, [entryid], (err, results) => {
      var result = null;

      if (results.length <= 0) {
        callback(null, "No entry found with id '" + entryid + "'");
      } else if (results.length > 1) {
        callback(null, "Multiple entries with id '" + entryid + "' found");
      } else {
        result = new Entry(results[0].PI, results[0].text, results[0].Status, results[0].created);
        callback(result, err);
      }
    });
  },
  updateEntryStatus: (entryId, newStatus, callback) => {
    connection.query(queryUpdateEntryStatus, [newStatus, entryId], (err, result) => {
      callback(result, err);  //TODO: Gerrors
    });
  },
  InsertEntry: (newEntry, callback) => {
    connection.query(queryInsertEntry, [newEntry.listId, newEntry.text], (err, result) => {
      callback(result, err);
    });
  },
  DeleteById: (entryId, callback) => {
    connection.query(queryDeleteById, [entryId], (err, result) => {
      callback(result, err);
    });
  },
  DeleteByListId: (listId, callback) => {
    connection.query(queryDeleteByListId, [listId], (err, result) => {
      callback(result, err);
    });
  },
  updateEntryText: (entryId, newText, callback) => {
    connection.query(queryUpdateEntryText, [newText, entryId], (err, result) => {
      callback(result, err);
    });
  }
};
