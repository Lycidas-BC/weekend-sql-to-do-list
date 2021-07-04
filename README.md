# Project Name

[Project Instructions](./INSTRUCTIONS.md), this line may be removed once you have updated the README.md

## Description

Your project description goes here. What problem did you solve? How did you solve it?

Additional README details can be found [here](https://github.com/PrimeAcademy/readme-template/blob/master/README.md).

## To-Do App checklist

    [ ] Front end allows user to create a Task
    [ ] Task is stored in an SQL database
    [ ] Front end refresh when task is created - shows all tasks
        [ ] "show all, show finished, show unfinished,..."
    [ ] each task should have an option "Complete" or "Delete"
    [ ] When task is complete, change its visual representation (green background vs red or gray background or something)
    [ ] complete option should be checked off (using CSS)
    [ ] store task status in database
    [ ] Deleting a task should remove it from the front end and database
    [ ] CSS to move page beyond vanilla HTML
        [ ] background color
        [ ] font family and size
        [ ] text color or background color to show whether tasks have been completed
    [X] think through logic prior to writing code:
        [X] HTML & CSS buttons:
            [X] input for task name
            [X] input for task description
            [X] "add task" button
            [ ] table of task names, descriptions, and current status
                [ ] STRETCH: change status of multiple tasks at the same time
                [ ] edit existing tasks
                [ ] confirmation (pretty)
            [x] bootstrap styling
        [ ] Client side
            [X] jQuery
            [ ] button functionality
            [ ] ajax client side for
                [ ] GET
                [ ] POST
                [ ] PUT
                [ ] DELETE
        [ ] Server side
            [X] pull in express, pg
            [X] set up database communication
            [X] set up communication with client
            [ ] server side functionality for
                [ ] GET
                [ ] POST
                [ ] PUT
                [ ] DELETE
        [X]  .gitignore
    [ ] STRETCH
        [ ] branches for specific tasks
        [ ] categories - color code tasks
        [ ] check if DB and table exist from JS; if not, create them from JS???
        [ ] when users add a new category, ask them what color
        [ ] use grid instead of putting inputs in table
        [ ] limit input lengths to match SQL varchar size
        [ ] generic check if exists function (takes table name)
        [ ] generic create table function (takes table name, array of {columnName: datatype} objects)