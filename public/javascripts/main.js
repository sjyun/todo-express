$(document).ready(function() {
  var socket = io();
  var $alert = $('.alert');
  $alert.hide();

  $alert.on('error', function(event, data){
    $alert.html(data)
    $alert.addClass('alert-danger');
    $alert.show();
  });

  $alert.on('success', function(event, data) {
    $alert.html(data);
    $alert.addClass('alert-info');
    $alert.show();
  });

  $('#addTaskForm').submit(function(event) {
    $target = $(event.target);

    $.ajax({
        url : $target.attr("action"),
        type: "POST",
        data: $target.serializeArray(),
        success:function(task) {
          socket.emit('add todo', task);
          $target.find("input[name='name']").val('');
        },
        error: function(error) {   
        }
    });

    event.preventDefault();
  });

  $('#allDoneForm').submit(function(event) {
    $target = $(event.target);

    $.ajax({
        url : $target.attr("action"),
        type: "POST",
        data: $target.serializeArray(),
        success:function(response) {
          $('ul.list-group').empty();
          $alert.trigger('success', 'Task was completed.');
        },
        error: function(error) {   
        }
    }); 
    event.preventDefault();
  });

  var completedHandler = function(event) {
    var $target = $(event.target);

    $.ajax({
        url : $target.attr("action"),
        type: "POST",
        data: $target.serializeArray(),
        success:function(task) {
          $target.parent().parent().remove();
          $alert.trigger('success', 'Task was completed.');
        },
        error: function(error) {   
        }
    }); 
    event.preventDefault(); 
  };

  var showTasks = function() {
    $.ajax({
      type: 'GET',
      url: '/tasks',
      success: function(tasks) {
        $tasks = $(tasks);
        if ($tasks.is(':empty')) return;
        
        $tasks.find('#completedForm').submit(completedHandler);
        $tasks.find('#showTask').click(showHandler);
        $tasks.find('.task-delete').click(deleteHandler);
        $('ul.list-group').append($tasks);
      },
      error: function(error) {
        $alert.trigger('error', error);
      }
    });    
  }

  showTasks();

  var deleteHandler = function(event) {
    var $target = $(event.target);
    $.ajax({
      type: 'DELETE',
      url: '/tasks/' + $target.attr('data-task-id'),
      data: {
        _csrf: $target.attr('data-csrf')
      },
      success: function(response) {
        socket.emit('delete todo', $target.attr('data-task-id'));
      },
      error: function(error) {
        $alert.trigger('error', error);
      }
    });
  };

  var showHandler = function(event) {
    var $target = $(event.target);

    $.ajax({
        url : $target.attr("href"),
        type: "GET",
        success:function(task) {
          $('.modal-title').html(task.name);
        },
        error: function(error) {   
        }
    }); 
    event.preventDefault();    
  };

  socket.on('add todo', function(task){
    $task = $(task);
    $task.find('.task-delete').click(deleteHandler);
    $task.find('#showTask').click(showHandler);
    $task.find('#completedForm').submit(completedHandler);
    $('ul.list-group').append($task);
  });

  socket.on('delete todo', function(msg) {
    $("a[data-task-id='" + msg + "']").parent().parent().remove();
  });
});