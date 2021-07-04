const { Router } = require('express');
const express = require('express');
const taskRouter = express.Router();

// DB CONNECTION
const pg = require('pg');
const Pool = pg.Pool;
const config = {
    database: 'ToDoList',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
};

const pool = new Pool(config);

pool.on('connect', (client) => {
    console.log('PostgeSQL connected');
});

pool.on('error', (err, client) => {
    console.log('Unexpected error client are you there?', err);
});

// GET ROUTES

// POST ROUTES
taskRouter.post('/tableExists', (req, res) => {
    console.log('req.body:', req.body);

    const tableName = req.body.tableName;

    let qText = `
        SELECT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_NAME = $1);
    `;

    pool.query(qText, [tableName])
        .then(result => {
            res.send(result.rows);
        })
        .catch(err => {
            console.log('Error trying to get koala list from DB', err);
            res.sendStatus(500);
        });
});

// PUT ROUTES

// DELETE ROUTES

module.exports = taskRouter;