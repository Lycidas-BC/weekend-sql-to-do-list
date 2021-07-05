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
    "status" varchar(50) NOT NULL,
    "color" varchar(25)
);

-- query to populate status table
INSERT INTO "status" ("status", "color")
	VALUES ('Not started', 'red'),
	 	('In progress', 'yellow'),
	 	('Completed', 'green'),
	 	('Paused', 'gray'),
	 	('Canceled', 'black');

-- query to make category table
CREATE TABLE "category" (
	"id" serial PRIMARY KEY,
    "category" varchar(50) NOT NULL,
    "color" varchar(25)
);

-- select all data relevant to specific task
SELECT "tasks"."id", "tasks"."name", "status"."status", "status"."color" AS "statusColor", "category"."category", "category"."color" AS "categoryColor", "tasks"."description"
FROM "tasks"
INNER JOIN "status" ON "status"."id" = "tasks"."statusId"
INNER JOIN "category" ON "category"."id" = "tasks"."categoryId";

