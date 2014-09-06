$(document).ready(function() {
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
    var data = $(this).serializeArray();
    var formURL = $(this).attr("action");

    $.ajax({
        url : formURL,
        type: "POST",
        data : data,
        success:function(task) {
          $task = $(task);
          $task.find('.task-delete').click(deleteHandler);
          $task.find('#completedForm').submit(completedHandler);
          $('ul.list-group').append($task);
        },
        error: function(error) {   
        }
    });

    event.preventDefault();
  });

  var completedHandler = function(event) {
    $target = $(event.target);

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
      contentType: "text/html; charset=utf-8",
      url: '/tasks',
      success: function(tasks) {
        $tasks = $(tasks);
        if ($tasks.is(':empty')) return;
        
        $tasks.find('.task-delete').click(deleteHandler);
        $tasks.find('#completedForm').submit(completedHandler);
        $('ul.list-group').append($tasks);
      },
      error: function(error) {
        $alert.trigger('error', error);
      }
    });    
  }

  showTasks();

  var deleteHandler = function(event) {
    $target = $(event.target)
    $.ajax({
      type: 'DELETE',
      url: '/tasks/' + $target.attr('data-task-id'),
      data: {
        _csrf: $target.attr('data-csrf')
      },
      success: function(response) {
        $target.parent().parent().remove();
        $alert.trigger('success', 'Task was removed.');
      },
      error: function(error) {
        $alert.trigger('error', error);
      }
    });
  };

  var $modal = $('#myModal');
  $('.item-name').on('click', function(event) {
    setTimeout(function() {
      $modal.modal('show');
    }, 1000);
  });
});