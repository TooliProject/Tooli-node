const { Pool } = require('pg');
const Task = require('../../entity/Task');

const QUERY_FIND_BY_LIST_ID = 'SELECT T.ID, T.DESCRIPTION, T.CREATED, T.DONE, T.LIST_ID FROM TASK T WHERE T.LIST_ID = $1 AND T.ID IN (SELECT TASK_ID FROM ACCOUNT_TASK WHERE ACCOUNT_TASK.ACCOUNT_ID = $2)';


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

}