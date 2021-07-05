$( document ).ready(onReady);

function onReady() {
    //if necessary, create databases and populate with defaults
    initializeDb();

    //event-dependent function calls
    $( "#colors" ).on("click", "#addCategoryBtn", addCategory);
    $( "#addTaskBtn" ).on("click", addTask);
    $( "#expandCategoryBtn" ).on("click", expandCategory);
    $( "#taskCategorySelect" ).on("change", updateCategoryColor);
    $( "#toDoList" ).on("click", ".clickable", updateStatus)
} //end onReady

//INITIALIZE GLOBALS

//confirm that tables exist before running initial GET
let tasksExists = false;
let statusExists = false;
let categoryExists = false;

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
            //if tables already exist, update relevant globals
            if (tableName === "category") {
                categoryExists = true;
            }
            if (tableName === "status") {
                statusExists = true;
            }
            if (tableName === "tasks") {
                tasksExists = true;
            }
            if (categoryExists && statusExists && tasksExists) {
                //if all three tables already exist, GET from database
                //otherwise, wait until they've been created
                getFromDb();
            }
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
        console.log(response);
        if (response && (typeof values !== 'undefined')) {
            insertToTable(tableName, values);
        } else {
            console.log(tableName, "created");
            //if successfully created and there are no values to initialize it, update relevant globals
            if (tableName === "category") {
                categoryExists = true;
            }
            if (tableName === "status") {
                statusExists = true;
            }
            if (tableName === "tasks") {
                tasksExists = true;
            }
        }
    })
    .catch((error) => {
        console.log(`createTable error. If ${tableName} table doesn't exist, run create query from database.sql manually.`, error);
        alert(`createTable error. If ${tableName} table doesn't exist, run create query from database.sql manually.`);
    });
} //end createTables

/**
 * delete task from table tasks
 * @param {int} taskId 
 */
function deleteTask(taskId) {
    $.ajax({
        method: 'DELETE',
        url: `/task/${taskId}`
    })
    .then((response) => {
        console.log(response);
        populateToDoList();
    })
    .catch((error) => {
        console.log(`deleteTask error.`, error);
        alert(`deleteTask error.`);
    });
} //end deleteTask

/**
 * SELECT * from tableName
 * @param {string} tableName 
 */
 function getTable(tableName) {
    $.ajax({
        method: 'GET',
        url: `/task/getTable/${tableName}`
    })
    .then((response) => {
        console.log('getTable response:', response);
        if (tableName === 'category') {
            populateCategories(response);
        }
        if (tableName === 'tasks') {
            populateToDoList(response);
        }
    })
    .catch((error) => {
        console.log(`getTable error.`, error);
        alert(`getTable error.`);
    });
} //end getTable

/**
 * SELECT * from tableName
 * @param {string} tableName 
 */
function getTasks(category, status) {
    $.ajax({
        method: 'GET',
        url: `/task/getTasks/${category}/${status}`
    })
    .then((response) => {
        console.log('getTasks response:', response);
        populateToDoList(response);
    })
    .catch((error) => {
        console.log(`getTable error.`, error);
        alert(`getTable error.`);
    });
} //end getTasksTable

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
        //if table successfully initialized, update relevant globals
        if (tableName === "category") {
            categoryExists = true;
        }
        if (tableName === "status") {
            statusExists = true;
        }
        if (tableName === "tasks") {
            tasksExists = true;
        }
        if (categoryExists && statusExists && tasksExists) {
            //if all three tables already exist, GET from database
            //otherwise, wait until they've been created
            getFromDb();
        }
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
        populateToDoList();
    })
    .catch((error) => {
        console.log(`updateTable error.`, error);
        alert(`updateTable error.`);
    });
} //end updateTable

//OTHER FUNCTIONS (alphabetical)

function addCategory() {
    const category=$( "#categoryNameIn" ).val();
    const color=$('input[name=optionsRadios]:checked').val();
    insertToTable("category",[{category: category, color: color}]);
    expandCategory();
} //end addCategory

function addTask() {
    console.log('in addTask');
    const taskName = $( "#taskNameIn" ).val();
    const categoryId = $( "#taskCategorySelect option:selected" ).data("id");
    const taskDescription = $( "#taskDescriptionIn").val();
    insertToTable("tasks",[{name: taskName, statusId: 1, categoryId: categoryId, description: taskDescription}]);
    populateToDoList();
    $( "#taskNameIn" ).val("");
    $( "#taskDescriptionIn").val("");
    $( "#taskCategorySelect" ).val("");
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
            <button type="button" class="btn btn-primary" id="addCategoryBtn" style="margin-bottom: 25px;">Add Category</button>
        `);
    } else {
        //if users click "-", remove html for creating a new category and change button to "-"
        $( "#expandCategoryBtn" ).text("+");
        $( "#newCategoryRow" ).remove();
        $( "#colorRowLegend" ).remove();
        $( "#colorTable" ).remove();
        $( "#addCategoryBtn" ).remove();
    }
} //end expandCategory

function getFromDb() {
    console.log("in getFromDb");
    populateCategories();
    populateToDoList();
} //end getFromDb

/**
 * check db communication
 * check existence of tasks table
 * check existence of categories table
 * check existence of primary keys
 * check existence of foreign keys
 * get tasks
 */
function initializeDb() {
    //Check if table "tasks" exists
    //If not, create table using array of {columnName: dataType} objects
    checkIfTableExists("tasks", [{name: "varchar(50) NOT NULL"}, {statusId: "int DEFAULT '1'"}, {categoryId: "int"}, {description: "varchar(250)"}]);

    //Check if table "status" exists
    //If not, create table using array of {columnName: dataType} objects
    //If not, populate using array of values
    checkIfTableExists("status", [{status: "varchar(50) NOT NULL"}, {color: "varchar(25) NOT NULL"}], [{status: 'Not started', color: 'red'}, {status: 'In progress', color: 'yellow'}, {status: 'Completed', color: 'green'}, {status: 'Paused', color: 'gray'}, {status: 'Canceled', color: 'black'}]);

    //Check if table "category" exists, if not run create
    //If not, create table using array of {columnName: dataType} objects
    checkIfTableExists("category", [{category: "varchar(50) NOT NULL"}, {color: "varchar(25) NOT NULL"}],[{category: "work (default)", color: "red"}, {category: "home", color: "green"}]);
} //end initializeDb

function populateCategories(categoriesArray) {
    console.log('in populateCategories');
    if (typeof categoriesArray === 'undefined') {
        getTable("category");
    } else {
        $( "#taskCategorySelect" ).empty();
        $( "#taskCategorySelect" ).css({color:categoriesArray[0].color});
        for(const category of categoriesArray) {
            $( "#taskCategorySelect" ).append(`
                <option data-id="${category.id}" data-color="${category.color}">${category.category}</option>
            `);
        }
    }
} //end populateCategories

function populateToDoList(tasksArray) {
    console.log('in populateToDoList');
    if (typeof tasksArray === 'undefined') {
        getTasks("all", "all");
    } else {
        updateBackgroundImage(tasksArray.length);
        $( "#toDoList" ).empty();
        console.log("tasksArray:", tasksArray);
        for(const task of tasksArray) {
            console.log("task", task.id);
            // add button that allows people to switch paused or not started tasks to in progress
            // or in progress tasks to paused
            let playPauseButton = `<button class="nothing"></button>`;
            if (task.status === 'Not started' || task.status === 'Paused'){
                playPauseButton = `<button class="clickable button play playPauseButton" data-id="${task.id}" data-status="2"></button>`;
            } else if (task.status === 'In progress'){
                playPauseButton = `<button class="clickable button pause playPauseButton" data-id="${task.id}" data-status="4"></button>`;
            }
            // cross out canceled tasks
            
            let cancelDeleteButton = "";
            let lineThrough = "";
            if (task.status === 'Canceled') {
                lineThrough = `style="text-decoration: line-through; text-decoration-style: wavy;"`;
            }
            // add icon for canceling or deleting tasks
            if (task.status === 'Canceled' || task.status === 'Completed' ) {
                cancelDeleteButton = `<span class="clickable trash" data-id="${task.id}" data-status="delete"><img src="images/trash.png"></span>`;
            } else {
                cancelDeleteButton = `<span class="clickable cancel" data-id="${task.id}" data-status="5"><img src="images/cancel.png"></span>`;
            }
            // add check off completed tasks
            let completedString = `data-status="3"`;
            if (task.status === 'Completed' ) {
                completedString = `data-status="2" checked=""`;
            } 
            $( "#toDoList" ).append(`
                <div class="form-check" style="color:${task.categoryColor};">
                    <input class="clickable form-check-input" type="checkbox" data-id="${task.id}" ${completedString}>
                    ${playPauseButton} ${cancelDeleteButton} <div class="circle" style="background-color:${task.statusColor};"></div>
                    <label class="form-check-label" for="flexCheckDefault" ${lineThrough}>
                        ${task.name}:  ${task.description} (${task.category}, ${task.status})
                    </label>
                </div>
            `);
        }
    }
} //end populateToDoList

function updateBackgroundImage(numberOfTasks) {
    if (numberOfTasks !== 0) {
        let backgroundSize = 70/Math.sqrt(numberOfTasks);
        //background image
        $( "body" ).css( "background-position", "top left");
        $( "body" ).css( "background-repeat", "repeat");
        $( "body" ).css( "background-size", `${backgroundSize}%`);
    }
} //end updateBackgroundImage

function updateCategoryColor() {
    let color = $( "#taskCategorySelect option:selected" ).data("color");
    //gold looks better than yellow
    const newColor = (color === 'yellow') ? 'gold' : color;
    $( "#taskCategorySelect" ).css({"color":newColor});
} //end updateCategoryColor

function updateStatus() {
    console.log('in updateStatus');
    const newStatus = $(this).data("status");
    const taskId = $(this).data("id");
    if (newStatus === 'delete') {
        if (confirm("Are you sure you want to delete this task?")) {
            deleteTask(taskId);
        }
    } else {
        updateTable("tasks", [{statusId:newStatus}], taskId);
    }
} //end updateStatus
