const express = require('express');

const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
    // SELECT * FROM accounts 
    // db.select('*').from('posts');
    db('accounts')
    .then(account => {
        console.log('checking accounts: ', account)
        res.status(200).json(account);
    })
    .catch(err => {
        res.status(500).json({ message: 'Failed to get accounts' })
    })
});

router.get('/:id', (req, res) => {
    // SELECT * FROM accounts WHERE id = param.id
    const { id } = req.params;
    db('accounts')
        .where({ id })
        .then(account => {
            if (account) {
                res.status(200).json(account);
            } else {
                res.status(404).json({ message: 'invalid account id'})
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to get account by id'})
        })
});

// {
// 	"name": "account-name",
// 	"budget": 33000.33
// }

router.post('/', (req, res) => {
    // INSERT INTO accounts () VALUE ()
    if (accountIsValid(req.body)) {
        db('accounts')
            .insert(req.body, 'id')
            .then(([id]) => id)
            .then(id => {
                db('accounts')
                .where({ id })
                .then(account => {
                    res.status(201).json(account);
                });
            })
            .catch(() => {
                res.status(500).json({ message: 'Could not add the account' });
            });
        } else {
            res.status(400).json({
            message: 'Please provide name and budget of zero or more for the account',
            });
        }
    // without middleware -- accountIsValid
    // const newAccount = req.body;
    // db('accounts').insert(newAccount)
    //     .then(account => {
    //         res.status(201).json(account);
    //     })
    //     .catch(err => {
    //         res.status(500).json({ message: 'Failed to insert new account'})
    //     })
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db('accounts')
        .where({ id }).del()
        .then(account => {
            if (count) {
                res.status(200).json({ message: `${count} record(s) deleted` })
            } else {
                res.status(404).json({ message: 'invalid account id'})
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'failed to delete account'})
        })
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const updated = req.body;
    db('accounts')
        .where({ id }).update(updated)
        .then(count => {
            if (count) {
                res.json({ updated: count })
            } else {
                res.status(404).json({ message: 'invalid account id' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'failed to update accounts'})
        })
});

function accountIsValid({ name, budget }) {
    return name && typeof budget === 'number' && budget >= 0;
}

module.exports = router;