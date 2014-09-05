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

  var addTasks = function() {
    $.ajax({
      type: 'GET',
      contentType: "text/html; charset=utf-8",
      url: '/api/tasks',
      success: function(tasks) {
        var tasks = $(tasks);
        $('.list').append(tasks);
        $('.task-delete').click(deleteHandler);
      },
      error: function(error) {
        $alert.trigger('error', error);
      }
    });    
  }

  addTasks();

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