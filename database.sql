-- create a database called ToDoList

-- ** NOTE: QUERIES TO CREATE AND POPULATE TABLES SHOULD RUN AUTOMATICALLY **
-- queries listed here just in case that fails

-- query to make tasks table
CREATE TABLE "tasks" (
    "id" serial PRIMARY KEY,
    "name" varchar(50) NOT NULL,
    "statusID" int DEFAULT '1',
    "categoryID" int,
    "description" varchar(250) 
);

-- query to make status table
CREATE TABLE "status" (
	"id" serial PRIMARY KEY,
    "status" varchar(50) NOT NULL
);

-- query to populate status table
INSERT INTO "status" ("status")
	VALUES ('Not started'),
	 	('In progress'),
	 	('Completed'),
	 	('Paused'),
	 	('Canceled');

-- query to make category table
CREATE TABLE "category" (
	"id" serial PRIMARY KEY,
    "category" varchar(50) NOT NULL,
    "color" varchar(25)
);


