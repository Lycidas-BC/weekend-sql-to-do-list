# Project Name

[Project Instructions](./INSTRUCTIONS.md), this line may be removed once you have updated the README.md

## Description

Your project description goes here. What problem did you solve? How did you solve it?

Additional README details can be found [here](https://github.com/PrimeAcademy/readme-template/blob/master/README.md).

## To-Do App checklist

    [X] Front end allows user to create a Task
    [X] Task is stored in an SQL database
    [X] Front end refresh when task is created - shows all tasks
        [ ] "show all, show finished, show unfinished,..."
    [X] each task should have an option "Complete" or "Delete"
    [X] When task is complete, change its visual representation (green background vs red or gray background or something)
    [X] complete option should be checked off (using CSS)
    [X] store task status in database
    [X] Deleting a task should remove it from the front end and database
    [X] CSS to move page beyond vanilla HTML
        [X] background color
        [X] font family and size
        [X] text color or background color to show whether tasks have been completed
    [X] think through logic prior to writing code:
        [X] HTML & CSS buttons:
            [X] input for task name
            [X] input for task description
            [X] "add task" button
            [X] table of task names, descriptions, and current status
                [X] edit existing tasks
                [X] confirmation (pretty)
            [x] bootstrap styling
        [X] Client side
            [X] jQuery
            [X] button functionality
            [X] ajax client side for
                [X] GET
                [X] POST
                [X] PUT
                [X] DELETE
        [X] Server side
            [X] pull in express, pg
            [X] set up database communication
            [X] set up communication with client
            [ ] server side functionality for
                [X] GET
                [X] POST
                [X] PUT
                [X] DELETE
        [X]  .gitignore
    [ ] STRETCH
        [ ] branches for specific tasks
        [X] categories - color code tasks
        [X] status - color code tasks
        [X] check if DB and table exist from JS; if not, create them from JS???
        [X] when users add a new category, ask them what color
        [ ] use grid instead of putting inputs in table
        [ ] limit input lengths to match SQL varchar size
        [X] generic check if exists function (takes table name)
        [X] generic create table function (takes table name, array of {columnName: datatype} objects)
        [ ] allow users to expand or minimize task description
        [X] play: switch task to in progress; pause: switch task to paused
        [X] trash icon for delete button