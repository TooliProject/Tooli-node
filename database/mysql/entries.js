'use strict';

const connection = require('./connection');
const Entry = require('../../entity/Entry');

const queryFindByListId = 'SELECT * FROM entry where list_id = ?;';
const queryInsertEntry = 'INSERT INTO entry ( list_id , Name , Status ) VALUES (?, ?, 0);';
const queryUpdateEntryStatus = 'UPDATE entry SET entry.Status = ? WHERE entry.PI = ?;';
const queryDeleteById = 'DELETE FROM entry WHERE PI = ?;';
const queryDeleteByListId = 'DELETE FROM entry WHERE list_id = ?;';
const queryUpdateEntryName = 'UPDATE entry SET entry.Name = ? WHERE entry.PI = ?;';

module.exports = {
  findByListId: (listId, callback) => {
    connection.query(queryFindByListId, [listId], (err, results, fields) => {
      var result = [];

      if (err) {
        callback([], err);
      } else {
        //result = new Account(results[0].pi, results[0].name, results[0].mylist_id);
        results.forEach(element => {
          result.push(new Entry(element.PI, element.Name, element.Status));
        });
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
    connection.query(queryInsertEntry, [newEntry.listId, newEntry.name], (err, result) => {
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
  updateEntryName: (entryId, newName, callback) => {
    connection.query(queryUpdateEntryName, [newName, entryId], (err, result) => {
      callback(result, err);
    });
  }
};
