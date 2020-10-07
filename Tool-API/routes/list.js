const ListRepository = require('../data/database/list');
const ErrorHandler = require('../error/error');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    new ListRepository(req.session.email).findAll((err, lists) => {
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
        new ListRepository(req.session.email).insert(listName, (err) => {
           if (err) {
               res.send({error: err});
           } else {
               res.send({})
           }
        });
    } else {
        new ErrorHandler().sendNoParameterInBodyError(res, 'name');
    }
});

router.put('/', (req, res) => {
    if (!req.body) {
        new ErrorHandler().sendEmptyBodyError(res);
    }
    else if (!req.body.id) {
        new ErrorHandler().sendNoParameterInBodyError(res, 'id');
    }
    else if (!req.body.name) {
        new ErrorHandler().sendNoParameterInBodyError(res, 'name');
    } else {
        const id = req.body.id;
        const name = req.body.name;

        new ListRepository(req.session.email).update(id, name, (err) => {
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
       new ListRepository(req.session.email).delete(id, (err) => {
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
