$(document).ready(function () {
  getEmployees();
  getTotalMonthlySalary();

  $('#submitEmployee').on('click', postEmployee);

//Function to delete selected employee information on the DOM.
  $('#container').on('click', '.delete', function () {
    var empID = getEmployeeID($(this));
    deleteEmployee(empID);
    $(this).closest('div').remove();
    console.log('Deleted');
  });

});

//Posts employee information to the database
function postEmployee() {

  var employeeValues = {};

  $.each($('#employeeInfo').serializeArray(), function (i, field) {
      employeeValues[field.name] = field.value;
    });

  console.log(employeeValues);

  $.ajax({
    type: 'POST',
    url: '/salaries',
    data: employeeValues,
    success: function (data) {
      console.log('Successful post!');
      $('#container').empty();
      getEmployees();
      getTotalMonthlySalary();
    },
  });
}

//Gets employee information from the database and appends it to the DOM.
function getEmployees() {
  console.log('getting employees');
  $.ajax({
    type: 'GET',
    url: '/salaries',
    success: function (employees) {
      $('#container').empty();
      employees.forEach(function (employees) {
      $separator = $('<div></div>');
      $separator.data('employeeId', employees.emp_id);
      var $el = $('<p> Employee Name: ' + employees.first_name + ' ' + employees.last_name + '</p>' + '<p> Employee ID: ' + employees.emp_id + '</p>' + '<p> Job Title: ' + employees.job_title + '</p>' + '<p> Annual Salary: $' + employees.annual_salary + '</p>' + '<button type="button" class="delete" name="delete">Delete Info</button>');
      $separator.append($el);
      $('#container').append($separator);
      getTotalMonthlySalary();
      });
    },
  });
}

//Gets the total monthly salary for all employees from the database.
function getTotalMonthlySalary() {
  $.ajax({
    type: 'GET',
    url: '/total',
    success: function (employees) {
      console.log(employees);
      var total = Number(employees.sum);
      var totalRound = total.toFixed(2);
        $('#total').text('Total Monthly Salary: $' + totalRound);
    },
  });
}

//Gets the employee ID information from the database.
function getEmployeeID(button) {
  // get the employee ID
  var employeeId = button.parent().data('employeeId');
  console.log('getEmployeeId', employeeId);
  return employeeId;
}

//Deletes an employee from the database.
function deleteEmployee(event) {

  var empId = event;
  console.log(empId);

  $.ajax({
    type: 'DELETE',
    url: '/salaries/' + empId,
    success: function (data) {
      getEmployees();
    },
  });
}
