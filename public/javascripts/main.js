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
    var inputName = $.trim($('#name').val());
    if(inputName == '' || !inputName ) {
      alert('please input task name');
      return false;
    } else {
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


    } 

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
    $('ul.list-group').empty();
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
    
    var taskId = $target.attr('data-task-id');

    $.ajax({
        url : $target.attr("href"),
        type: "GET",
        success:function(task) {
          $('#taskId').val(taskId);
          $('#contents').val(task.contents);
          $('#title').val(task.name);
        },
        error: function(error) { 
          alert('error');   
        }
    }); 
    event.preventDefault();    
  };


  $('#saveBtn').on('click', function(event) {
    var taskId =  $('#taskId').val();
    var contents = $('#contents').val();
    var title = $('#title').val();
    var $target = $(event.target);

      $.ajax({
        url : '/tasks/' + $('#taskId').val(),
        type: "PUT",
        data: {
          name:title,
          contents:contents,
           _csrf: $('#asdf').val()
        },
        success:function(task) {
          $('#taskId').val('');
          $('#contents').val('');
          $('.modal-title').html('');
          $('#myModal').modal('hide');

          // reload list
          showTasks();

        },
        error: function(error) { 
          alert('error');  
        }
    }); 

    event.preventDefault();
  });

  var socket = io.connect('http://localhost:3000', {});


});