const express = require('express');

const AccountRouter = require('./accounts/account-router.js');

const server = express();

server.use(express.json());

server.use('/api/accounts', AccountRouter);

server.get('/', (req, res) => {
    res.send('<h3>Accounts DB checking</h3>')
});

module.exports = server;