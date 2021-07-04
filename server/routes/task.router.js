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
            console.log('error in /tableExists', err, 'query:', qText);
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
            console.log('error in /createTable', err, 'query:', query);
            res.sendStatus(500);
        });
}); //end /createTable POST route

taskRouter.post('/insertToTable', (req, res) => {
    console.log('in /insertToTable');

    //extract columns from first object
    const columns = Object.keys(req.body.values[0]).join(", ");
   
    //construct INSERT INTO TABLE query
    //specify table and columns
    let query = `INSERT INTO "${req.body.tableName}" ("${columns}")
        VALUES `;

    //list insert values in parentheses - (VALUE1, VALUE2, VALUE3...) - and append to array
    //rows collects lines of form ($1, $2); values is the array of corresponding values (to protect against SQL injection)
    let rows = [];
    let values = [];
    let inputCount = 0;
    for (const rowOfValues of req.body.values) {
        let row = [];
        for (const value of Object.values(rowOfValues)){
            inputCount += 1;
            row.push(`$${inputCount}`);
            values.push(value);
        }
        rows.push( "(" + row.join(", ") + ")" );
    }

    //Join array - (ROW 1 Values), (ROW 2 Values), (ROW 3 Values)...; - and append to query
    query += rows.join(', ') + ';';
    pool.query(query, values)
        .then(result => {
            res.send(`inserted ${result.rowCount} rows into ${req.body.tableName}`);
        })
        .catch(err => {
            console.log('error in /insertToTable', err, 'query:', query);
            res.sendStatus(500);
        });
}); //end /insertToTable POST route

// PUT ROUTES

taskRouter.put('/updateTable/:id', (req, res) => {
    console.log('in /updateTable');
    //make id is valid
    if (req.params.id === 'undefined') {
        console.log('error in /updateTable: invalid taskId,', req.params.id);
        res.sendStatus(500);
    } else {

        //grab id
        const taskId = req.params.id;

        
        //construct UPDATE query
        //specify table
        let query = `UPDATE "${req.body.tableName}"
            SET `;

        //parse values object array into "column1" = 'value1', "column2" = 'value2', ...
        //and append to query
        let rows = []
        for (const columnValuePair of req.body.values) {
            rows.push(`"${Object.keys(columnValuePair)[0]}" = '${Object.values(columnValuePair)[0]}'`)
        }
        query += rows.join(', ');

        //add WHERE condition
        query += `
            WHERE "id" = '${taskId}';`;
        
        //run query
        pool.query(query)
            .then(result => {
                console.log('updateTable query:', query);
                res.send(`updated ${req.body.tableName}, ${result}`);
            })
            .catch(err => {
                console.log('error in /updateTable', err, 'query:', query);
                res.sendStatus(500);
            });
    }
}); //end /updateTable PUT route

// DELETE ROUTES

module.exports = taskRouter;