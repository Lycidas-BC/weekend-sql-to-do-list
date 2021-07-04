$( document ).ready(onReady);

function onReady() {
    initializationSequence();
    $( "#addCategoryBtn" ).on("click", addCategory);
} //end onReady

//initialize globals

//general database functions
/**
 * checks if a table with the name tableName exists in connected database
 * @param {string} tableName 
 */
function checkIfTableExists(tableName) {
    $.ajax({
        method: 'POST',
        url: `/task/tableExists`,
        data: {tableName: tableName}
    })
    .then((response) => {
        console.log((response[0].exists) ? `Table exists: ${tableName}` : `Table not found: ${tableName}`);
        return response[0].exists;
    })
    .catch((error) => {
        console.log('checkIfTableExists FAILED. Please confirm that database exists at expected host and port with the appropriate permissions.', error);
        alert('checkIfTableExists FAILED. Please confirm that database exists at expected host and port with the appropriate permissions.');
    });
} //end checkIfTableExists

function createTable(tableName, columns) {
    $.ajax({
        method: 'POST',
        url: `/task/createTable`,
        data: {
            tableName: tableName,
            columns: columns
        }
    })
    .then((response) => {
        console.log((response[0].exists) ? `Table exists: ${tableName}` : `Table not found: ${tableName}`);
        return response[0].exists;
    })
    .catch((error) => {
        console.log('There was an issue validating the task table. Please confirm that database ToDoList exists at expected host and port with the appropriate permissions.', error);
        alert('There was an issue validating the task table. Please confirm that database ToDoList exists at expected host and port with the appropriate permissions.');
    });
} //end createTables

//remaining functions listed alphabetically

function addCategory() {
    if ($( "#addCategoryBtn" ).text() === "+") {
        $( "#addCategoryBtn" ).text("-");
        $( "#inputTable" ).append(`
            <tr id="newCategoryRow">
                <td>
                </td>
                <td>
                </td>
                <td style="vertical-align:top;">
                    <label for="categoryNameIn" class="form-inline col-form-label" style="margin-left: 50px;">New Category:</label>
                </td>
                <td style="vertical-align:top;">
                    <div class="form-group">
                        <div class="form-inline">
                            <input type="text" class="form-inline form-control" id="categoryNameIn" placeholder="New Category">
                    </div>
                </td>
            </tr>
        `);
        $( "#colors" ).append(`
            <legend class="mt-4" id="colorRowLegend">Assign Color</legend>
            <table id="colorTable">
                <tr>
                    <fieldset class="form-group" id="categoryColorIn">
                        <td>
                            <div class="form-check" style="color:red;">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="optionsRadios" id="red" value="red" checked="">
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
        `);
    } else {
        $( "#addCategoryBtn" ).text("+");
        $( "#newCategoryRow").remove();
        $( "#colorRowLegend").remove();
        $( "#colorTable").remove();
    }
} //end addCategory

/**
 * check db communication
 * check existence of tasks table
 * check existence of categories table
 * check existence of primary keys
 * check existence of foreign keys
 * get tasks
 */
function initializationSequence() {
    //Check if table "tasks" exists, if not run create
    if( !checkIfTableExists("tasks") ) {
        createTable("tasks",[{name: "varchar(50) NOT NULL"}, {statusId: "int DEFAULT '1'"}, {categoryId: "int"}, {description: "varchar(250)"}]);
    }

    //Check if table "status" exists, if not run create, populate
    if( !checkIfTableExists("status") ) {
        createTable("status",[{status: "varchar(50) NOT NULL"}])
    }

    //Check if table "category" exists, if not run create
    if( !checkIfTableExists("category") ) {
        createTable("category",[{category: "varchar(50) NOT NULL"}, {color: "varchar(25) NOT NULL"}])
    }

} //end initializeDB