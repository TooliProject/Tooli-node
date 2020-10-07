const TaskRepository = require('../data/database/task');
const ErrorHandler = require('../error/error');
const express = require('express');
const router = express.Router();

router.get('/:listId', (req, res) => {
    if (req.params.listId) {
        new TaskRepository(req.session.email).findByListId(req.params.listId, (err, tasks) => {
            if (err) {
                console.log(err);
                res.send({
                    error: err
                });
            } else {
                res.send(tasks);
            }
        });
    } else {
        new ErrorHandler().sendNoParameterError(res, 'listId');
    }
});


module.exports = router;
