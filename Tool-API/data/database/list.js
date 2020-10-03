const { Pool } = require('pg');
const List = require('../../entity/List');

const QUERY_FIND_ALL_LISTS = 'SELECT ID, NAME, CREATED FROM LIST';
const QUERY_INSERT_LIST = 'INSERT INTO LIST(NAME) VALUES ($1)';
const QUERY_UPDATE_LIST = 'UPDATE LIST SET NAME = $2 WHERE ID = $1';
const QUERY_DELETE_LIST = 'DELETE FROM LIST WHERE ID = $1';

module.exports = class ListRepository {
    // next = func(err, lists)
    findAll(next) {
        const pool = new Pool();
        pool.query(QUERY_FIND_ALL_LISTS, (err, res) => {
            pool.end();
            if (err) {
                console.log(err);
                next(err, []);
            } else {
                const result = [];
                for(let row of res.rows) {
                    result.push(new List(row));
                }
                next(null, result);
            }
        });
    }

    // next = func(err)
    insert(name, next) {
        const pool = new Pool();
        pool.query(QUERY_INSERT_LIST, [name], (err, res) => {
            pool.end();
            if (err) {
                console.log(err);
                next(err, []);
            } else {
                next();
            }
        });
    }

    // next = func(err)
    update(id, name, next) {
        const pool = new Pool();
        pool.query(QUERY_UPDATE_LIST, [id, name], (err, res) => {
            pool.end();
            if (err) {
                console.log(err);
                next(err);
            } else {
                next();
            }
        });
    }

    // next = func(err)
    delete(id, next) {
        const pool = new Pool();
        pool.query(QUERY_DELETE_LIST, [id], (err, res) => {
            pool.end();
            if (err) {
                console.log(err);
                next(err);
            } else {
                next();
            }
        });
    }
}

