const { Pool } = require('pg');

const QUERY_FIND_ACCOUNT_BY_ID = 'SELECT PROFILE_ID, PROVIDER FROM ACCOUNT WHERE PROFILE_ID = $1 AND PROVIDER = $2';
const QUERY_INSERT_ACCOUNT = 'INSERT INTO ACCOUNT(PROFILE_ID, PROVIDER) VALUES ($1, $2)';

module.exports = class AccountRepository {
    // next => func(err);
    insertIfNotExists(profileId, provider, next) {
        const pool = new Pool();
        pool.query(QUERY_FIND_ACCOUNT_BY_ID, [profileId, provider], (err, res) => {
            if (err)  {
                pool.end();
                console.log(err);
                next(err);
            } else {
                if (res.rowCount <= 0) {
                    pool.query(QUERY_INSERT_ACCOUNT, [profileId, provider], (err) => {
                        pool.end();
                       if (err) {
                           console.log(err);
                           next(err);
                       } else {
                           next();
                       }
                    });
                } else {
                    next();
                }
            }
        });
    }
}
