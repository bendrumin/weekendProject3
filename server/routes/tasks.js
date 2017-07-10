var express = require('express');
var router = express.Router();
var pg = require('pg');
var poolModule = require('../modules/pool.js');
var pool = poolModule;

// request to retrieve tasks from db
router.get('/', function(req, res){
  pool.connect(function(errorConnect, db, done){
    // if connection fails...
    if(errorConnect) {
      console.log('Error connecting to the tasksDb.');
      res.sendStatus(500); // interal server error
      // if connection successful...
    } else {
      console.log('connected to db!');
      //query to retrieve all tasks from the db
      var queryText = 'SELECT * FROM "tasks" ORDER BY "id" DESC;';
      // execute query
      db.query(queryText, function(errorQuery, result){
        done();
        //if query fails...
        if(errorQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
          //if query is successful...
        } else {
          // Send back stored tasks
          res.send({tasks: result.rows});
        }
      }); // end query
    } // end if
  }); // end pool
}); // end GET

// request to add a new task to the db
router.post('/', function(req, res) {
  // verify new task object
  console.log(req.body);
  var task = req.body.newTask;
  var complete = req.body.complete;
  var notes = req.body.notes;
  // connect to pool
  pool.connect(function(errorConnect, db, done){
    // if error connecting...
    if(errorConnect) {
      console.log('Error connecting to the database.');
      res.sendStatus(500); // internal server error
      // if connect successful...
    } else {
      console.log('connected to db!');
      // query to add a new task to the db
      var queryText = 'INSERT INTO "tasks" ("task", "complete", "notes")' +
                      ' VALUES ($1, $2, $3);';
      // execute query
      db.query(queryText, [task, complete, notes], function(errorQuery, result){
        // disconnect from pool after query is executed
        done();
        // if query fails...
        if(errorQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500); // internal server error
          // if query is successful...
        } else {
          // Send back success message
          res.sendStatus(200); // OK
        }
      }); // end query
    } // end if
  }); // end pool
}); // end POST

//request to delete task from db
router.delete('/', function(req, res) {
  //verify task id sent from client based on 'delete' click
  var taskId = req.body.taskId;
  console.log(taskId);
  // connect to pool
  pool.connect(function(errorConnect, db, done){
    // if error connecting...
    if(errorConnect) {
      console.log('Error connecting to the database.');
      res.sendStatus(500); // internal server error
      // if connect successful...
    } else {
      console.log('connected to db!');
      // query to delete a task from the db
      var queryText = 'DELETE FROM "tasks"' +
                      ' WHERE "id" = $1;';
      // execute query
      db.query(queryText, [taskId], function(errorQuery, result){
        // disconnect from pool after query is executed
        done();
        // if query fails...
        if(errorQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500); // internal server error
          // if query is successful...
        } else {
          // Send back success message
          res.send({message: 'deleted task!'});
        }
      }); // end query
    } // end if
  }); // end pool
}); // end DELETE
//request to edit task from db
router.connect('/', function(req, res) {
  //verify task id sent from client based on 'delete' click
  var taskId = req.body.taskId;
  console.log(taskId);
  // connect to pool
  pool.connect(function(errorConnect, db, done){
    // if error connecting...
    if(errorConnect) {
      console.log('Error connecting to the database.');
      res.sendStatus(500); // internal server error
      // if connect successful...
    } else {
      console.log('Data connected');
      // query to delete a task from the db
      var queryText = 'UPDATE "tasks" SET ("task", "complete", "notes");';
      // execute query
      db.query(queryText, [tasks.task, tasks.complete, tasks.notes], function(errorQuery, result){
        // disconnect from pool after query is executed
        done();
        // if query fails...
        if(errorQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500); // internal server error
          // if query is successful...
        } else {
          // Send back success message
          res.send({message: 'deleted task!'});
        }
      }); // end query
    } // end if
  }); // end pool
}); // end DELETE

//request to change completion status of task in db
router.put('/', function(req, res) {
  //verify id of task status being changed
  var taskId = req.body.taskId;
  var status = req.body.status;
  console.log(req.body);
  // connect to pool
  pool.connect(function(errorConnect, db, done){
    // if error connecting...
    if(errorConnect) {
      console.log('Error connecting to the database.');
      res.sendStatus(500); // internal server error
      // if connect successful...
    } else {
        console.log('connected to db!');
        // query to change status in db
          if(status == 'true') {
            var queryText = 'UPDATE "tasks" SET "complete" = true WHERE "id" = $1;';
            // execute query
            db.query(queryText, [taskId], function(errorQuery, result){
              // disconnect from pool after query is executed
              done();
            // if query fails...
            if(errorQuery) {
              console.log('Attempted to query with', queryText);
              console.log('Error making query');
              res.sendStatus(500); // internal server error
              // if query is successful...
            } else {
              // Send back success message
              console.log('Changed status');
              res.send({message: 'changed status to true'});
              }
            });//end query
          }//end if true

          else if(status == 'false') {
            var otherQueryText = 'UPDATE "tasks" SET "complete" = false WHERE "id" = $1;';
            // execute query
            db.query(otherQueryText, [taskId], function(errorQuery, result){
              // disconnect from pool after query is executed
              done();
              // if query fails...
              if(errorQuery) {
                console.log('Attempted to query with', queryText);
                console.log('Error making query');
                res.sendStatus(500); // internal server error
                // if query is successful...
              } else {
                // Send back success message
                console.log('Changed status');
                res.send({message: 'changed status to false'});
              }
            });//end query
            }//end else false
          }//end else connected
    });//end pool
});//end PUT

module.exports = router;
