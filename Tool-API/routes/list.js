const ListRepository = require('../data/database/list');
const ErrorHandler = require('../error/error');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    new ListRepository().findAll((err, lists) => {
        if (err) {
            console.log(err);
            res.send({error: err});
        } else {
            res.send(lists);
        }
    });
});

router.post('/', (req, res) => {
    if (req.body && req.body.name) {
        const listName = req.body.name;
        new ListRepository().insert(listName, (err) => {
           if (err) {
               res.send({error: err});
           } else {
               res.send({})
           }
        });
    } else {
        new ErrorHandler().sendNoParameterError(res, 'name');
    }
});

router.put('/', (req, res) => {
    if (!req.body) {
        new ErrorHandler().sendEmptyBodyError(res);
    }
    else if (!req.body.id) {
        new ErrorHandler().sendNoParameterError(res, 'id');
    }
    else if (!req.body.name) {
        new ErrorHandler().sendNoParameterError(res, 'name');
    } else {
        const id = req.body.id;
        const name = req.body.name;

        new ListRepository().update(id, name, (err) => {
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
       new ListRepository().delete(id, (err) => {
           if (err) {
               new ErrorHandler().sendError(res, 500, err);
           } else {
               res.send({});
           }
       });
   }  else {
       res.send({});
   }
});

module.exports = router;
