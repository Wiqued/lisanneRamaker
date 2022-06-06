// On submit does not refresh page
$("#searchForm").submit(function (e) {
    e.preventDefault();
});

// Hides and shows the right pages
function showAll() {
    getAllEmployees();
    document.getElementById("employeePage").style.display = "block";
    document.getElementById("employeeProfile").style.display = "none";
    document.getElementById("departmentsPage").style.display = "none";
    document.getElementById("locationsPage").style.display = "none";
}

$("#employeeEntry").click(function() {
    showEmployeeProfile();
});

$("#navAll").click(function() {
    showAll();
});

$("#navDepartments").click(function() {
    showDepartments();
});

$("#navLocations").click(function() {
    showLocations();
});

$("#deleteEmployee").click(function() {

    if (confirm('Are you sure you want to delete this person?')) {
        deleteEmployee(currentEmployeeID);
    }

});

$("createEmployee").click(function() {
    createEmployee();
})

getAllEmployees();

// Get list of all employees, name, department and location on load
function getAllEmployees() {
    $.ajax({
        url: 'libs/php/getAll.php',
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (result) {

            document.getElementById("employeeList").innerHTML = "";

            const employees = result.data

            for (const employee of employees) {

                const div = document.getElementById('employeeEntry');
                const clonedDiv = div.cloneNode(true);
                document.getElementById('employeeList').appendChild(clonedDiv);

                clonedDiv.getElementsByClassName('listName')[0].innerText = `${employee.firstName} ${employee.lastName}`;
                clonedDiv.getElementsByClassName('listDepartment')[0].innerText = employee.department;
                clonedDiv.getElementsByClassName('listLocation')[0].innerText = employee.location;

                $(clonedDiv).click(function() {
                    showEmployeeProfile(employee.id)
                })
            }
        }
    })
}

// Shows the list of departments
function showDepartments() {
    $.ajax({
        url: 'libs/php/getAllDepartments.php',
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (result) {

            document.getElementById("departmentsList").innerHTML = "";

            const departments = result.data

            for (const department of departments) {

                const div = document.getElementById('departmentsEntry');
                const clonedDiv = div.cloneNode(true);
                document.getElementById('departmentsList').appendChild(clonedDiv);

                clonedDiv.getElementsByClassName('departmentsName')[0].innerText = department.name;

            }
            
            document.getElementById("employeePage").style.display = "none";
            document.getElementById("employeeProfile").style.display = "none";
            document.getElementById("departmentsPage").style.display = "block";
            document.getElementById("locationsPage").style.display = "none";
        }
    })
}

// Shows the list of locations
function showLocations() {
    $.ajax({
        url: 'libs/php/getAllLocations.php',
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (result) {

            document.getElementById("locationsList").innerHTML = "";

            const locations = result.data

            for (const location of locations) {

                const div = document.getElementById('locationsEntry');
                const clonedDiv = div.cloneNode(true);
                document.getElementById('locationsList').appendChild(clonedDiv);

                clonedDiv.getElementsByClassName('locationsName')[0].innerText = location.name;

            }
            
            document.getElementById("employeePage").style.display = "none";
            document.getElementById("employeeProfile").style.display = "none";
            document.getElementById("departmentsPage").style.display = "none";
            document.getElementById("locationsPage").style.display = "block";
        }
    })
}

let currentEmployeeID;

// Shows the individual employee profile
function showEmployeeProfile(employeeId) {
    $.ajax({
        url: 'libs/php/getPersonnelByID.php',
        type: 'GET',
        dataType: 'json',
        data: {
            id: employeeId,
        },
        success: function (result) {

            document.getElementById("employeeName").innerText = `${result.data.personnel[0].firstName} ${result.data.personnel[0].lastName}`;
            document.getElementById("employeeLocation").innerText = result.data.personnel[0].location;
            document.getElementById("employeeEmail").innerText = result.data.personnel[0].email;
            document.getElementById("employeeDepartment").innerText = result.data.personnel[0].department;
            document.getElementById("employeeLocation").innerText = result.data.personnel[0].location;

            currentEmployeeID = result.data.personnel[0].id;

            
            document.getElementById("employeePage").style.display = "none";
            document.getElementById("employeeProfile").style.display = "block";
            document.getElementById("departmentsPage").style.display = "none";
            document.getElementById("locationsPage").style.display = "none";
        }
    })
}

// Deletes employee from database
function deleteEmployee(employeeID) {
    $.ajax({
        url: 'libs/php/deletePersonnelByID.php',
        type: 'POST',
        dataType: 'json',
        data: {
            id: employeeID,
        },
        success: function (result) {

            showAll();

        }
    })
}

// Creates new employee
function createEmployee() {
    $.ajax({
        url: 'libs/php/insertPersonnel.php',
        type: 'POST',
        dataType: 'json',
        data: {
            firstName: firstName,
            lastName: lastName,
            jobTitle: jobTitle,
            email: email,
            departmentID: departmentID,
        },
        success: function (result) {

            

        }
    })
}
