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
    console.log('in /tableExists');

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
            console.log('error in /tableExists', err);
            res.sendStatus(500);
        });
}); //end /tableExists POST route

taskRouter.post('/createTable', (req, res) => {
    console.log('in /createTable');
    
    //construct CREATE TABLE query
    //name table, add id as primary key
    let query = `CREATE TABLE "${req.body.tableName}" (
        "id" serial PRIMARY KEY`;

    //add columns, specify data types
    for (const column of req.body.columns) {
        const [columnName, columnDataType] = Object.entries(column)[0];
        query += `,
        "${columnName}" ${columnDataType}`
    }

    // close parentheses
    query += ");";
    
    // post to database
    pool.query(query)
        .then(result => {
            // table created successfully
            res.send(true);
        })
        .catch(err => {
            console.log('error in /createTable', err);
            res.sendStatus(500);
        });
}); //end /createTable POST route

taskRouter.post('/insertToTable', (req, res) => {
    console.log('in /insertToTable');
    console.log(req.body.tableName);
    console.log(req.body.values);
    // const tableName = req.body.tableName;

    // let qText = `
    //     SELECT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES
    //     WHERE TABLE_NAME = $1);
    // `;

    // pool.query(qText, [tableName])
    //     .then(result => {
    //         res.send(result.rows);
    //     })
    //     .catch(err => {
    //         console.log('error in /tableExists', err);
    //         res.sendStatus(500);
    //     });
    res.sendStatus(201);
}); //end /tableExists POST route

// PUT ROUTES

// DELETE ROUTES

module.exports = taskRouter;