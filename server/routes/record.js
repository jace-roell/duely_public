const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the tasks.
recordRoutes.route("/task").get(function (req, res) { // Changed route to /task
  let db_connect = dbo.getDb("toDoList"); // Changed database name to "toDoList"
  db_connect
    .collection("objectives") // Changed collection name to "objectives"
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single task by id
recordRoutes.route("/task/:id").get(function (req, res) { // Changed route to /task/:id
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect
    .collection("objectives") // Changed collection name to "objectives"
    .findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you create a new task.
recordRoutes.route("/task/add").post(function (req, response) { // Changed route to /task/add
  let db_connect = dbo.getDb();
  let myobj = {
    name: req.body.name,
    description: req.body.description, // Added description field
    dueDate: req.body.dueDate, // Added dueDate field
    urgency: req.body.urgency, // Added urgency field
    completed: false,
  };
  db_connect.collection("objectives").insertOne(myobj, function (err, res) { // Changed collection name to "objectives"
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a task by id.
recordRoutes.route("/task/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };

  // Instead of setting completed to false, toggle its value
  let newvalues = {
    $set: {
      name: req.body.name,
      description: req.body.description,
      dueDate: req.body.dueDate,
      urgency: req.body.urgency,
      completed: req.body.completed // Use the provided completed value
    },
  };

  db_connect
    .collection("objectives")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

// This section will help you delete a task
recordRoutes.route("/task/delete/:id").delete((req, response) => { // Changed route to /task/delete/:id
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("objectives").deleteOne(myquery, function (err, obj) { // Changed collection name to "objectives"
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = recordRoutes;
