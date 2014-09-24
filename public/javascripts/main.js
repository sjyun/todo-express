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
    $target = $(event.target);

    $.ajax({
        url : $target.attr("action"),
        type: "POST",
        data: $target.serializeArray(),
        success:function(task) {
          $task = $(task);
          $task.find('.task-delete').click(deleteHandler);
          $task.find('#showTask').click(showHandler);
          $task.find('#completedForm').submit(completedHandler);
          $('ul.list-group').append($task);

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
        $target.parent().parent().remove();
        $alert.trigger('success', 'Task was removed.');
      },
      error: function(error) {
        $alert.trigger('error', error);
      }
    });
  };

  var showHandler = function(event) {
    var $target = $(event.target);
    alert($target);

    alert($target.attr('data-task-id'));

    $.ajax({
        url : $target.attr("href"),
        type: "GET",
        success:function(task) {
          $('#taskId').val($target.attr('data-task-id'));
          $('.modal-title').html(task.name);
        },
        error: function(error) {   
        }
    }); 
    event.preventDefault();    
  };


  $('#saveBtn').on('click', function(event) {
    var contents = $('#contents').val();
    var $target = $(event.target);
    //alert($('#asdf').val());
  /* TODO task id 넘겨줘야함. 
      $.ajax({
        url : '/tasks/update/',
        type: "POST",
        data: {
          task_id:$('#taskId').val(),
          contents:contents,
           _csrf: $('#asdf').val()
        },
        success:function(task) {
          alert('su');
        },
        error: function(error) {   
          alert('err');
        }
    }); 
*/
    event.preventDefault();
    })
});