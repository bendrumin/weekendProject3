console.log('JS Sourced');

$(document).ready(function() {
  console.log('js');
  getTasks();
  // add task button click
  $( '#submitBtn' ).on( 'click', function(){
    console.log( 'in addButton on click' );
    var newTask = {}
    newTask.item = $('#newTask').val();
    console.log(newTask);
    // call saveKoala with the new obejct
    saveTask( newTask );
  });
  //Task complete function
  $('#itemList').on('click', '.removeBtn' , function(){
    console.log('Delete task as been hit');
    var itemid = $(this).data('itemid');
    console.log($(this));
    console.log('Delete task with id of', itemid);
    completeTask(itemid);
    refreshTasks();

  });

  //Edit doesnt work, well, it DOES but doesnt...
  $('#itemList').on('click', '.editBtn', function(){
    // Set editng to true, used when we submit the form
    editingTask = true;
    // We attached the entire book object as data to our table row
    // $(this).parent() is the <td>
    // $(this).parent().parent() is the <tr> that we attached our data to
    var selectedTask = $(this).parent().parent().data('task');
    console.log(selectedTask);
    editingTask = selectedTask.id;
    console.log(selectedTask.id);

    // Set the form values to the thing we're editing
    $('#newTask').val(selectedTask.id);
  });
});
function saveTask( newTask ){
  console.log( 'in saveTask', newTask );
  // ajax call to server to get tasks
  $.ajax({
    url: '/tasks',
    type: 'POST',
    data: newTask,
    success: function( data ){
      console.log( 'got some tasks: ', data );
      refreshTasks();
    } // end success
  }); //end ajax
}
function getTasks(){
  console.log( 'in get tasks' );
  // ajax call to server to get
  $.ajax({
    url: '/tasks',
    type: 'GET',
    success: function( response ){
      console.log( 'got some tasks: ', response );
      appendToDom(response.tasklist);
    } // end success
  }); //end ajax
  // display on DOM with buttons that allow edit of each
} // end
function refreshTasks() {
  $.ajax({
    type: 'GET',
    url: '/tasks',
    success: function(response) {
      console.log(response);
      appendToDom(response.tasklist);
    }
  });

}
function updateTask(taskToUpdate) {

  // YOUR AJAX CODE HERE
  $.ajax({
    type: 'PUT',
    url: '/tasks',
    data: taskToUpdate,
    success: function(response) {
      console.log(response);
      console.log(taskToUpdate);
      refreshTasks();

    }
  });
}
function appendToDom(tasks) {
  console.log('List Append Working');
  // Remove tasks that currently exist in the table
  $('#itemList').empty();
  for(var i = 0; i < tasks.length; i += 1) {
    var task = tasks[i];
    // For each book, append a new row to our table
    $tr = $('<tr></tr>');
    $tr.data('task', task);
    $tr.append('<td class="itemDesc">' + task.item + '</td>');
    $tr.append('<td><button class="editBtn btn btn-info btn-lg disabled data-itemid="' + task.id + '"><span class="glyphicon glyphicon-edit"></span></button></td>');

    $tr.append('<td><button class="removeBtn btn btn-danger btn-lg   data-itemid="' + task.id + '"><i class="icon-remove-circle fa-4x"></i></button></td>');
    $('#itemList').append($tr);
  }
}
function completeTask(itemid) {
  console.log(itemid);
  $.ajax({
    type: 'DELETE',
    url: '/tasks/' + itemid,
    success: function(response) {
      console.log(response);
      console.log('I deleted the task');
      refreshTasks();

    }
  });
}
