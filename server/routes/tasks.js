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
router.put('/edit', function(req, res) {
  console.log(taskId);
  var taskId = req.body.taskId;

  var task = req.body.editTask;
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
      console.log('Data connected');
      // query to delete a task from the db
      var queryText = 'UPDATE "tasks" SET "task" =$1, "complete" = $2, "notes"= $3 WHERE "id" = $4;';
      // execute query
      db.query(queryText, [task, complete, notes, taskId], function(errorQuery, result){
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

//request to edit task in db
router.put('/:id', function(req, res){
  console.log('Edit has been hit');
  var tasks = req.body; //Task of thing to delete
  console.log('put routed called id of', id);
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database'); //Sends error code
      res.sendStatus(500);//Sends a 500 status
    } else {
      //We connected, now we GET things
      var queryText = 'UPDATE "tasks" SET "task" =$1, "notes"= $2 WHERE "id" = $3;';
      console.log(req.params); //Allows you to see what you are bringing in
      console.log(req.body);
      var task = req.body;
      //ONLY THING YOU WOULD HAVE TO change
      db.query(queryText, [tasks.editTask, tasks.editNote, tasks.taskId], function(errorMakingQuery, result){
        done(); //Call the function when your done (closes connection)
        //console.log(result);
        if(errorMakingQuery){ //errorMakingQuery is a bool, result is an object
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          // Send back results of the query
          res.sendStatus(200);
        }
      }); //end query
    } // end if
  }) // end pool
});//end PUT
//request to change completion status of task in db
router.put('/:id', function(req, res){
  var id = req.body; //id of thing to delete
  console.log('put routed called id of', id);
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database'); //Sends error code
      res.sendStatus(500);//Sends a 500 status
    } else {
      //We connected, now we GET things
      var queryText = 'UPDATE "tasks" SET "task" =$1, "complete" = $2, "notes"= $3 WHERE "id" = $4;';
      console.log(req.params); //Allows you to see what you are bringing in
      console.log(req.body);
      var task = req.body;
      //ONLY THING YOU WOULD HAVE TO change
      db.query(queryText, [tasks.task, tasks.complete, tasks.notes], function(errorMakingQuery, result){
        done(); //Call the function when your done (closes connection)
        //console.log(result);
        if(errorMakingQuery){ //errorMakingQuery is a bool, result is an object
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          // Send back results of the query
          res.sendStatus(200);
        }
      }); //end query
    } // end if
  }) // end pool
});//end PUT

module.exports = router;
