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

router.post('/', (req, res) => { //hmmmm
    if (!req.body) {
        new ErrorHandler().sendEmptyBodyError(res);
    } else if (!req.body.description) {
        new ErrorHandler().sendNoParameterInBodyError(res, 'description');
    } else if (!req.body.listId) {
        new ErrorHandler().sendNoParameterInBodyError(res, 'listId');
    } else {
        const taskDescription = req.body.description;
        new TaskRepository(req.session.email).insert(taskDescription, listId, (err) => {
            if (err) {
                res.send({
                    error: err
                });
            } else {
                res.send({})
            }
        });
    }
});

router.put('/', (req, res) => {
    if (!req.body) {
        new ErrorHandler().sendEmptyBodyError(res);
    } else if (!req.body.id) {
        new ErrorHandler().sendNoParameterInBodyError(res, 'id');
    } else if (!req.body.description) {
        new ErrorHandler().sendNoParameterInBodyError(res, 'description');
    } else if (!req.body.done) {
        new ErrorHandler().sendNoParameterInBodyError(res, 'done');
    } else {
        const id = req.body.id;
        const description = req.body.description;
        const done = req.body.done;

        new TaskRepository(req.session.email).update(id, description, done, (err) => {
            if (err) {
                new ErrorHandler().sendError(res, 500, err);
            } else {
                res.send({});
            }
        })
    }
});

router.delete('/:id', (req, res) => {
    if (req.params.id) {
        const id = req.params.id;
        new TaskRepository(req.session.email).delete(id, (err) => {
            if (err) {
                new ErrorHandler().sendError(res, 500, err);
            } else {
                res.send({});
            }
        });
    } else {
        res.send({});
    }
});

module.exports = router;