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

taskRouter.get('/getTable/:tableName', (req, res) => {
    console.log('in getTable', req.params.tableName);
    const tableName = req.params.tableName;
    let qtext = qText = `Select * FROM "${tableName}" ORDER BY id;`;
    
    pool.query(qText)
        .then(result => {
            res.send(result.rows);
        })
        .catch(err => {
            console.log(`Error trying to get ${tableName}`, err);
            res.sendStatus(500);
        });
}); //end getTable

taskRouter.get('/getTasks/:category/:status', (req, res) => {
    const category = req.params.category;
    const status = req.params.status;
    let qText = `
        SELECT "tasks"."id", "tasks"."name", "status"."status", "status"."color" AS "statusColor", "category"."category", "category"."color" AS "categoryColor", "tasks"."description"
        FROM "tasks"
        INNER JOIN "status" ON "status"."id" = "tasks"."statusId"
        INNER JOIN "category" ON "category"."id" = "tasks"."categoryId"
        
    `;
    if (category === 'all' && status === 'all') {
        //no need to add WHERE clause
    } else if (category === 'all') {
        //add WHERE clause for status
        qText += `
            WHERE "status"."status" LIKE '${status}'
        `;
    } else if (status === 'all') {
        //add WHERE clause for category
        qText += `
            WHERE "category"."category" LIKE '${category}'
        `;
    } else {
        //add WHERE clause for status and category
        qText += `
            WHERE "category"."category" LIKE '${category}'
            AND "status"."status" LIKE '${status}'
        `;
    }
    
    qText += `ORDER BY "tasks"."id"`;

    pool.query(qText)
        .then(result => {
            res.send(result.rows);
        })
        .catch(err => {
            console.log(`Error trying to get ${tableName}`, err);
            res.sendStatus(500);
        });
}); //end getTasks

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
    const columns = Object.keys(req.body.values[0]).join(`", "`);
   
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

    //useful console logs:
    // console.log(query);
    // console.log(values);
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

        //parse values object array into "column1" = $1, "column2" = $2, ...
        //and append to query
        //values array tracks corresponding value inputs to protect against SQL injection
        let rows = [];
        let values = [];
        let counter = 0;
        for (const columnValuePair of req.body.values) {
            counter += 1;
            rows.push(`"${Object.keys(columnValuePair)[0]}" = $${counter}`)
            values.push(`${Object.values(columnValuePair)[0]}`);
        }
        query += rows.join(', ');

        //add WHERE condition
        query += `
            WHERE "id" = '${taskId}';`;
        
        //run query
        pool.query(query, values)
            .then(result => {
                res.send(`updated ${req.body.tableName}, ${result}`);
            })
            .catch(err => {
                console.log('error in /updateTable', err, 'query:', query);
                res.sendStatus(500);
            });
    }
}); //end /updateTable PUT route

// DELETE ROUTES
taskRouter.delete('/:id', (req, res) => {
    const taskId = req.params.id
    console.log('in delete. taskId:', taskId);

    const qText = `DELETE FROM "tasks" WHERE id = $1;`;

    pool.query(qText, [taskId])
        .then(dbResponse => {
            console.log(`${dbResponse.rowCount} was deleted from database`);
            res.sendStatus(201)
        })
        .catch(error => {
            console.log(`Could not delete task with id ${taskId}.`, error);
            res.sendStatus(500);
        });
});

module.exports = taskRouter;