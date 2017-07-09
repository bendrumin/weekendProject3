$(document).ready(function() {
  console.log('JQ linked');
  //on page load...
  getTasks();
  $('#addButton').on('click', addTask);
  $('#tasksDiv').on('click', '.delete', deleteTask);
  $('#tasksDiv').on('click', '.status', markedComplete);
});//end onready

//GET tasks stored in db to display on DOM
function getTasks() {
  $.ajax({
    type: 'GET',
    url: '/tasks',
    //on success...
    success: function(response) {
      //verify data from db
      console.log('Retrieved tasks from db: ', response);
      //call to display tasks on DOM
      displayOnDom(response);
    }//end success
  });//end GET
}//end getTasks

//send a new task to the server to POST in db
function addTask() {
  //retrieve user input and format as obj
  var newTask = $('#taskIn').val();
  var taskNotes = $('#notesIn').val();
  console.log(newTask);
  //check if input fields are empty, ifos propmt user to fill them
  if($('#taskIn').val() === '') {
    alert('Be sure to add your task!');
  }
  else {
    //send task obj to server
    $.ajax({
      type: 'POST',
      url: '/tasks',
      data: {
        newTask: newTask,
        complete: false,
        notes: taskNotes
      },
      //on success...
      success: function(response) {
        //confirm success through logging message
        console.log('task sent to server: ' + response);
        getTasks();
        $('#taskIn').val('');
        $('#notesIn').val('');
      }//end success
    });//end POST
  }//end if
}//end addTask

//request to delete a task from the db
function deleteTask() {
  console.log($(this).parent().parent().data('singleId'));
  var taskId = $(this).parent().parent().data('singleId');
  //trigger alert for user to verify delete
  var answer = confirm("Are you sure?");
    if (answer) {
      $.ajax({
        type: 'DELETE',
        url: '/tasks',
        data: {
          taskId: taskId
        },
        success: function(response) {
          console.log('Deleted task with id: ' + taskId + ' from the db');
          getTasks();
        }//end success
        });//end DELETE
        getTasks();
    } else{
        return false;
      }//end if
}//end deleteTask

//change completion status of a task
function markedComplete() {
  var status = $(this)[0].checked;
  console.log(status);
  var task = $(this).parent().parent();
  var taskId = $(this).parent().parent().data('singleId');
  if(status) {
    $(this).parent().parent().addClass('statusComplete');
    status = true;
    $('#taskContainer').append(task);
    console.log('task added');
    alert('Task has been marked complete!');
  }
    else {
      $(this).parent().parent().removeClass('statusComplete');
      status = false;
      $('#taskContainer').prepend(task);
  }//end if
  $.ajax({
    type: 'PUT',
    url: '/tasks',
    data: {
      taskId: taskId,
      status: status
    },
    success: function(response) {
      console.log('status changed: ', response);
    }//end success
  });//end PUT
}//end markedComplete

//append tasks to DOM
function displayOnDom(taskTable) {
  //clear div before appending updated task list
  $('#taskContainer').empty();
  //append tasks to DOM
  for (var i = 0; i < taskTable.tasks.length; i++) {
    var singleTask = taskTable.tasks[i].task;
    var singleNote = taskTable.tasks[i].notes;
    var singleId = taskTable.tasks[i].id;
    var $tr = $('<tr class="taskRow"></tr>');
    // var $td = $('<td></td>');
    $tr.data('singleId', singleId);
    $tr.append('<td class="completeBox"><input type="checkbox" class="status" data-id="' + singleId + '"></td>');
    $tr.append('<td>' + singleTask + '</td>');
    $tr.append('<td>' + singleNote + '</td>');
    $tr.append('<td class="actionButton"><button class="editbtn disabled btn btn-info " data-id="' + singleId + '"><span class="glyphicon glyphicon-edit"></span></button></td>');
    $tr.append('<td class="actionButton"><button class="delete btn btn-info" data-id="' + singleId + '"><span class="glyphicon glyphicon-trash"></span></button></td>');
    $('#taskContainer').append($tr);
  }//end for
}//end displayOnDom
