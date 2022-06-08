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
    document.getElementById("createEmployee").style.display = "none";
    document.getElementById("createDepartment").style.display = "none";

}

$("#employeeEntry").click(function() {
    showEmployeeProfile();
});

$("#navAll").click(function() {
    showAll();
    document.getElementById("createEmployeeButton").innerHTML = "Add employee";
    document.getElementById("createDepartmentButton").innerHTML = "Add department";

});

$("#navDepartments").click(function() {
    showDepartments();
    document.getElementById("createEmployeeButton").innerHTML = "Add employee";
    document.getElementById("createDepartmentButton").innerHTML = "Add department";
});

$("#navLocations").click(function() {
    showLocations();
    document.getElementById("createEmployeeButton").innerHTML = "Add employee";
    document.getElementById("createDepartmentButton").innerHTML = "Add department";
});

$("#deleteEmployee").click(function() {
    if (confirm('Are you sure you want to delete this person?')) {
        deleteEmployee(currentEmployeeID);
    }
});

$("#formEmployee").submit(function (e) {
    e.preventDefault();
    createEmployee();
    document.getElementById("formEmployee").reset(); 
});

$("#createEmployeeButton").click(function() {

    let form = document.getElementById("createEmployee")
    let button = document.getElementById("createEmployeeButton");

    if (form.style.display == "none") {
        button.innerHTML = "Hide";
        form.style.display = "block";
    } else {
        button.innerHTML = "Add employee";
        form.style.display = "none";
    }
})

$("#formDepartment").submit(function (e) {
    e.preventDefault();
    createDepartment();
    document.getElementById("formDepartment").reset(); 
});

$("#createDepartmentButton").click(function() {

    let form = document.getElementById("createDepartment")
    let button = document.getElementById("createDepartmentButton");

    if (form.style.display == "none") {
        button.innerHTML = "Hide";
        form.style.display = "block";
    } else {
        button.innerHTML = "Add department";
        form.style.display = "none";
    }
})


getAllEmployees();

let currentEmployeeID;

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
            document.getElementById("createEmployee").style.display = "none";
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
            document.getElementById("createEmployee").style.display = "none";
            document.getElementById("createDepartment").style.display = "none";
        }
    })
}

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
            document.getElementById("createEmployee").style.display = "none";
            document.getElementById("createDepartment").style.display = "none";
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
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            jobTitle: document.getElementById('jobTitle').value,
            email: document.getElementById('email').value,
            departmentID: 1,
        },
        success: function (result) {

            showEmployeeProfile(result.data);

        }
    })
}

// Deletes department, but only possible when there are no employees in the department
function deleteDepartment(departmentID) {
    $.ajax({
        url: 'libs/php/deleteDepartmentByID.php',
        type: 'POST',
        datatype: 'json',
        data: {
            id: departmentID,
        },
        success: function (result) {

        }
    })
}

// Creates new department, asks for department name and location
function createDepartment() {
    $.ajax({
        url: 'libs/php/insertDepartment.php',
        type: 'POST',
        datatype: 'json',
        data: {
            name: document.getElementById('departmentName').value,
            locationID: 1,
        },
        success: function (result) {

            showDepartments();

        }
    })
}
