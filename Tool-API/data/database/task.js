const { Pool } = require('pg');
const Task = require('../../entity/Task');

const QUERY_FIND_BY_LIST_ID = 'SELECT T.ID, T.DESCRIPTION, T.CREATED, T.DONE, T.LIST_ID FROM TASK T WHERE T.LIST_ID = $1 AND T.ID IN (SELECT TASK_ID FROM ACCOUNT_TASK WHERE ACCOUNT_TASK.ACCOUNT_ID = $2)';
const QUERY_INSERT_TASK = 'INSERT INTO TASK(DESCRIPTION, LIST_ID) VALUES ($1, $2) RETURNING ID';
const QUERY_INSERT_ACCOUNT_TASK = 'INSERT INTO ACCOUNT_TASK(ACCOUNT_ID, TASK_ID) VALUES ($1, $2)';
const QUERY_UPDATE_TASK = 'UPDATE TASK SET TASK.DESCRIPTION = $2, TASK.DONE = $3 WHERE TASK.ID = $1 AND TASK.ID IN (SELECT TASK_ID FROM ACCOUNT_TASK WHERE ACCOUNT_TASK.ACCOUNT_ID = $4)';
const QUERY_DELETE_TASK = 'DELETE FROM TASK WHERE TASK.ID = $1 AND TASK.ID IN (SELECT TASK_ID FROM ACCOUNT_TASK WHERE ACCOUNT_TASK.ACCOUNT_ID = $2)';

module.exports = class TaskRepository {
    constructor(profileId) {
        this.profileId = profileId;
    }

    //next = func(err, tasks)
    findByListId(listId, next){
        const pool = new Pool();
        pool.query(QUERY_FIND_BY_LIST_ID, [listId, this.profileId], (err, res) => {
            pool.end();
            if (err) {
                console.log(err);
                next(err, []);
            } else {
                const result = [];
                for(let row of res.rows) {
                    result.push(new Task(row));
                }
                next(null, result);
            }
        });
    }

    //next = func(err)
    insert(description, listId, next) {
        const pool = new Pool();
        pool.query(QUERY_INSERT_TASK, [description, listId], (err, res) => {
            if (err) {
                pool.end();
                console.log(err);
                next(err);
            } else {
                pool.query(QUERY_INSERT_ACCOUNT_TASK, [this.profileId, res.rows[0].id], (err) => {
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
    update(id, description, done, next) {
        const pool = new Pool();
        pool.query(QUERY_UPDATE_TASK, [id, description, done, this.profileId], (err) => {
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
        pool.query(QUERY_DELETE_TASK, [id, this.profileId], (err) => {
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