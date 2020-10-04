const { Pool } = require('pg');
const List = require('../../entity/List');

const QUERY_FIND_ALL_LISTS = 'SELECT L.ID, L.NAME, L.CREATED FROM LIST L, ACCOUNT_LIST AL WHERE L.id = AL.LIST_ID and AL.ACCOUNT_ID = $1';
const QUERY_INSERT_LIST = 'INSERT INTO LIST(NAME) VALUES ($1) RETURNING ID';
const QUERY_INSERT_ACCOUNT_LIST = 'INSERT INTO ACCOUNT_LIST(ACCOUNT_ID, LIST_ID) VALUES ($1, $2)';
const QUERY_UPDATE_LIST = 'UPDATE LIST SET NAME = $2 WHERE LIST.ID = $1 AND LIST.ID IN (SELECT LIST_ID FROM ACCOUNT_LIST WHERE ACCOUNT_LIST.ACCOUNT_ID = $3)';
const QUERY_DELETE_LIST = 'DELETE FROM LIST WHERE LIST.ID = $1 AND LIST.ID IN (SELECT LIST_ID FROM ACCOUNT_LIST WHERE ACCOUNT_LIST.ACCOUNT_ID = $2)';

module.exports = class ListRepository {
    constructor(profileId) {
        this.profileId = profileId;
    }

    // next = func(err, lists)
    findAll(next) {
        const pool = new Pool();
        pool.query(QUERY_FIND_ALL_LISTS, [this.profileId], (err, res) => {
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
            if (err) {
                pool.end();
                console.log(err);
                next(err);
            } else {
                pool.query(QUERY_INSERT_ACCOUNT_LIST, [this.profileId, res.rows[0].id], (err) => {
                   pool.end();
                   if (err) {
                       console.log(err);
                       next(err);
                   } else {
                       next();
                   }
                });
            }
        });
    }

    // next = func(err)
    update(id, name, next) {
        const pool = new Pool();
        pool.query(QUERY_UPDATE_LIST, [id, name, this.profileId], (err) => {
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
        pool.query(QUERY_DELETE_LIST, [id, this.profileId], (err) => {
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

