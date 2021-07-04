$( document ).ready(onReady);

function onReady() {
    initializeDB();
    $( "#expandCategoryBtn" ).on("click", expandCategory);
    $( "#colors" ).on("click", "#addCategoryBtn", addCategory);
    $( "#addTaskBtn" ).on("click", addTask);
} //end onReady

//initialize any globals

//GENERAL DB FUNCTIONS (alphabetical)

/**
 * checks if a table with the name tableName exists in connected database
 * if not, calls createTable
 * @param {string} tableName
 * @param {objectArray} columns
 * @param {objectArray} values
 */
function checkIfTableExists(tableName, columns, values) {
    $.ajax({
        method: 'POST',
        url: `/task/tableExists`,
        data: {tableName: tableName}
    })
    .then((response) => {
        const existsResponse = response[0].exists;
        if (!existsResponse) {
            console.log('Creating table:', tableName);
            createTable(tableName, columns, values);
        } else {
            console.log(tableName, "already exists");
        }
    })
    .catch((error) => {
        console.log('checkIfTableExists error. Please confirm that database exists at expected host and port with the appropriate permissions.', error);
        alert('checkIfTableExists error. Please confirm that database exists at expected host and port with the appropriate permissions.');
    });
} //end checkIfTableExists

/**
 * create table with name tableName
 * and column names and datatypes as specified in columns
 * if values isn't empty, call insertToTable to insert
 * @param {string} tableName 
 * @param {objectArray} columns 
 * @param {objectArray} values 
 */
function createTable(tableName, columns, values) {
    $.ajax({
        method: 'POST',
        url: `/task/createTable`,
        data: {
            tableName: tableName,
            columns: columns
        }
    })
    .then((response) => {
        console.log(tableName, "table successfully created!");
        if (response && (typeof values !== 'undefined')) {
            insertToTable(tableName, values);
        }
    })
    .catch((error) => {
        console.log(`createTable error. If ${tableName} table doesn't exist, run create query from database.sql manually.`, error);
        alert(`createTable error. If ${tableName} table doesn't exist, run create query from database.sql manually.`);
    });
} //end createTables

/**
 * insert to tableName from objectarray values
 * @param {*} tableName 
 * @param {*} values 
 */
function insertToTable(tableName, values) {
    $.ajax({
        method: 'POST',
        url: `/task/insertToTable`,
        data: {
            tableName: tableName,
            values: values
        }
    })
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.log(`insertToTable error. Populate ${tableName} using query from database.sql instead.`, error);
        alert(`insertToTable error. Populate ${tableName} using query from database.sql instead.`);
    });
} //end insertToTable

/**
 * update tableName according to values where id = taskId
 * @param {string} tableName 
 * @param {objectarray} values 
 * @param {int} taskId 
 */
function updateTable(tableName, values, taskId) {
    $.ajax({
        method: 'PUT',
        url: `/task/updateTable/${taskId}`,
        data: {
            tableName: tableName,
            values: values
        }
    })
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.log(`updateTable error.`, error);
        alert(`updateTable error.`);
    });
} //end updateTable

//OTHER FUNCTIONS (alphabetical)

function addCategory() {
    console.log('in addCategory');
    const category=$( "#categoryNameIn" ).val();
    const color=$('input[name=optionsRadios]:checked').val();
    
    insertToTable("category",[{category: category, color: color}]);
} //end addCategory

function addTask() {
    console.log('in addTask');
} //end addTask

function expandCategory() {
    if ($( "#expandCategoryBtn" ).text() === "+") {
        //if users click "+", add html for creating a new category and change button to "-"
        $( "#expandCategoryBtn" ).text("-");
        $( "#inputTable" ).append(`
            <tr id="newCategoryRow">
                <td style="vertical-align:top; width: 100px">
                    <label for="categoryNameIn" class="form-inline col-form-label" style="margin-top: 25px;">New Category:</label>
                </td>
                <td style="vertical-align:top;">
                    <div class="form-group">
                        <div class="form-inline">
                            <input type="text" class="form-inline form-control" id="categoryNameIn" placeholder="New Category" style="margin-top: 25px;">
                    </div>
                </td>
            </tr>
        `);
        $( "#colors" ).append(`
            <legend class="mt-4" id="colorRowLegend">Category Color</legend>
            <table id="colorTable">
                <tr>
                    <fieldset class="form-group" id="categoryColorIn">
                        <td>
                            <div class="form-check" style="color:red;">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="optionsRadios" id="red" value="red" checked="true">
                                    Red
                                </label>
                            </div>
                        </td>
                        <td style="padding-left:25px;">
                            <div class="form-check" style="color:orange;">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="optionsRadios" id="orange" value="orange">
                                    Orange
                                </label>
                            </div>
                        </td>
                        <td style="padding-left:25px;">
                            <div class="form-check" style="color:gold;">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="optionsRadios" id="yellow" value="yellow">
                                    Yellow
                                </label>
                            </div>
                        </td>
                        <td style="padding-left:25px;">
                            <div class="form-check" style="color:green;">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="optionsRadios" id="green" value="green">
                                    Green
                                </label>
                            </div>
                        </td>
                        <td style="padding-left:25px;">
                            <div class="form-check" style="color:blue;">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="optionsRadios" id="blue" value="blue">
                                    Blue
                                </label>
                            </div>
                        </td>
                        <td style="padding-left:25px;">
                            <div class="form-check" style="color:indigo;">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="optionsRadios" id="indigo" value="indigo">
                                    Indigo
                                </label>
                            </div>
                        </td>
                        <td style="padding-left:25px;">
                            <div class="form-check" style="color:violet;">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="optionsRadios" id="violet" value="violet">
                                    Violet
                                </label>
                            </div>
                        </td>
                    </fieldset>
                </tr>
            </table>
            <button type="submit" class="btn btn-primary" id="addCategoryBtn" style="margin-bottom: 25px;">Add Category</button>
        `);
    } else {
        //if users click "-", remove html for creating a new category and change button to "-"
        $( "#expandCategoryBtn" ).text("+");
        $( "#newCategoryRow" ).remove();
        $( "#colorRowLegend" ).remove();
        $( "#colorTable" ).remove();
        $( "#addCategoryBtn" ).remove();
    };
} //end expandCategory

/**
 * check db communication
 * check existence of tasks table
 * check existence of categories table
 * check existence of primary keys
 * check existence of foreign keys
 * get tasks
 */
function initializeDB() {
    //Check if table "tasks" exists
    //If not, create table using array of {columnName: dataType} objects
    checkIfTableExists("tasks", [{name: "varchar(50) NOT NULL"}, {statusId: "int DEFAULT '1'"}, {categoryId: "int"}, {description: "varchar(250)"}]);

    //Check if table "status" exists
    //If not, create table using array of {columnName: dataType} objects
    //If not, populate using array of values
    checkIfTableExists("status", [{status: "varchar(50) NOT NULL"}], [{status: 'Not started'}, {status: 'In progress'}, {status: 'Completed'}, {status: 'Paused'}, {status: 'Canceled'}]);

    //Check if table "category" exists, if not run create
    //If not, create table using array of {columnName: dataType} objects
    checkIfTableExists("category", [{category: "varchar(50) NOT NULL"}, {color: "varchar(25) NOT NULL"}]);

} //end initializeDB