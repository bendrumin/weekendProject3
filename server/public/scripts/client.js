console.log('JS Sourced');

$(document).ready(function() {
  console.log('js');
  getTasks();
});
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
function saveTask( newTask ){
  console.log( 'in saveKoala', newTask );
  // ajax call to server to get tasks
  $.ajax({
    url: '/tasks',
    type: 'POST',
    data: newTask,
    success: function( data ){
      console.log( 'got some tasks: ', data );
    } // end success
  }); //end ajax
}
function appendToDom(tasks) {
  console.log('Koala Append Working');
  // Remove tasks that currently exist in the table
  $('#itemList').empty();
  for(var i = 0; i < tasks.length; i += 1) {
    var task = tasks[i];
    // For each book, append a new row to our table
    $tr = $('<tr></tr>');
    $tr.data('task', task);
    $tr.append('<td>' + task.item + '</td>');

    $tr.append('<td><button class="completeBtn" data-taskid="' + task.id + '">Complete</button></td>');
    $('#itemList').append($tr);
  }
}
