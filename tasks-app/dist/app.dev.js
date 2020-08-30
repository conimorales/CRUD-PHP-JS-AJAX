"use strict";

$(document).ready(function () {
  var edit = false;
  console.log('jQuery is working');
  $('#task-result').hide();
  fetchTasks();
  $('#search').keyup(function (e) {
    if ($('#search').val()) {
      var search = $('#search').val();
      $.ajax({
        url: '/task-search.php',
        type: 'POST',
        data: {
          search: search
        },
        success: function success(response) {
          var tasks = JSON.parse(response);
          var template = ''; //recorre tareas

          tasks.forEach(function (task) {
            template += "<li> ".concat(task.name, " </li>");
          });
          $('#container').html(template);
          $('#task-result').show();
        }
      });
    }
  });
  $('#task-form').submit(function (e) {
    //guardar como objeto
    var postData = {
      name: $('#name').val(),
      description: $('#description').val(),
      id: $('#taskId').val()
    };
    var url = edit === false ? 'task-add.php' : 'task-edit.php';
    console.log(url);
    $.post(url, postData, function (response) {
      console.log(response);
      fetchTasks();
      $('#task-form').trigger('reset');
    });
    e.preventDefault();
  }); //se ejecuta cuando la página se inicia

  function fetchTasks() {
    $.ajax({
      url: 'task-list.php',
      type: 'GET',
      success: function success(response) {
        var tasks = JSON.parse(response);
        var template = '';
        tasks.forEach(function (task) {
          template += "\n                    <tr taskId = \"".concat(task.id, "\" >\n                        <td> ").concat(task.id, " </td>\n                        <td><a href=\"#\" class=\"task-item\">").concat(task.name, "</a></td>\n                        <td>").concat(task.description, "</td>\n                        <td> <button class=\"task-delete btn btn-danger\"> Delete</button> </td >\n                    </tr>\n                ");
        });
        $('#tasks').html(template);
      }
    });
  }

  $(document).on('click', '.task-delete', function () {
    if (confirm('Are you sure you want to delete it?')) {
      var element = $(this)[0].parentElement.parentElement;
      var id = $(element).attr('taskId');
      $.post('task-delete.php', {
        id: id
      }, function (response) {
        fetchTasks();
      });
    }
  });
  $(document).on('click', '.task-item', function () {
    var element = $(this)[0].parentElement.parentElement;
    var id = $(element).attr('taskId');
    $.post('task-single.php', {
      id: id
    }, function (response) {
      var task = JSON.parse(response);
      $('#name').val(task.name);
      $('#description').val(task.description);
      $('#taskId').val(task.id);
      edit = true;
    });
  });
});