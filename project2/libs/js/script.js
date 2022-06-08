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
    document.getElementById("createLocation").style.display = "none";

}


// Show all sorts of pages
$("#employeeEntry").click(function() {
    showEmployeeProfile();
});

$("#navAll").click(function() {
    showAll();
    document.getElementById("createEmployeeButton").innerHTML = "Add employee";
    document.getElementById("createDepartmentButton").innerHTML = "Add department";
    document.getElementById("createLocationButton").innerHTML = "Add location";

});

$("#navDepartments").click(function() {
    showDepartments();
    document.getElementById("createEmployeeButton").innerHTML = "Add employee";
    document.getElementById("createDepartmentButton").innerHTML = "Add department";
    document.getElementById("createLocationButton").innerHTML = "Add location";
});

$("#navLocations").click(function() {
    showLocations();
    document.getElementById("createEmployeeButton").innerHTML = "Add employee";
    document.getElementById("createDepartmentButton").innerHTML = "Add department";
    document.getElementById("createLocationButton").innerHTML = "Add location";
});


// Delete and create new employees
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
    getDepartmentList();

    if (form.style.display == "block") {
        button.innerHTML = "Add employee";
        form.style.display = "none";
    } else {
        button.innerHTML = "Hide";
        form.style.display = "block";
    }

});


// Delete and create new departments
$("#deleteDepartment").click(function() {
    if (confirm('Are you sure you want to delete this department?')) {
        // Add dependencies 
        deleteDepartment();
    }
});

$("#formDepartment").submit(function (e) {
    e.preventDefault();
    createDepartment();
    document.getElementById("formDepartment").reset(); 
});

$("#createDepartmentButton").click(function() {

    let form = document.getElementById("createDepartment")
    let button = document.getElementById("createDepartmentButton");
    getLocationsList();

    if (form.style.display == "block") {
        button.innerHTML = "Add department";
        form.style.display = "none";
    } else {
        button.innerHTML = "Hide";
        form.style.display = "block";
    }
})


// Delete and create new locations
$("#deleteLocation").click(function() {
    if (confirm('Are you sure you want to delete this location?')) {
        // Add dependencies 
        deleteLocation();
    }
});

$("#formLocation").submit(function (e) {
    e.preventDefault();
    createLocation();
    document.getElementById("formLocation").reset(); 
});

$("#createLocationButton").click(function() {

    let form = document.getElementById("createLocation")
    let button = document.getElementById("createLocationButton");

    if (form.style.display == "block") {
        button.innerHTML = "Add location";
        form.style.display = "none";
    } else {
        button.innerHTML = "Hide";
        form.style.display = "block";
    }
})


// Show all employees on load in
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
                clonedDiv.getElementsByClassName('locationName')[0].innerText = department.location;

                $(clonedDiv.getElementsByClassName('deleteDepartment')[0]).click(function() {
                    if (confirm('Are you sure you want to delete this department?')) {
                        // Add dependencies 
                        deleteDepartment(department.id);
                    }
                })

            }
            
            document.getElementById("employeePage").style.display = "none";
            document.getElementById("employeeProfile").style.display = "none";
            document.getElementById("departmentsPage").style.display = "block";
            document.getElementById("locationsPage").style.display = "none";
            document.getElementById("createEmployee").style.display = "none";
            document.getElementById("createLocation").style.display = "none";
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

                $(clonedDiv.getElementsByClassName('deleteLocation')[0]).click(function() {
                    if (confirm('Are you sure you want to delete this location?')) {
                        // Add dependencies 
                        deleteLocation(location.id);
                    }
                })

            }
            
            document.getElementById("employeePage").style.display = "none";
            document.getElementById("employeeProfile").style.display = "none";
            document.getElementById("departmentsPage").style.display = "none";
            document.getElementById("locationsPage").style.display = "block";
            document.getElementById("createEmployee").style.display = "none";
            document.getElementById("createDepartment").style.display = "none";
            document.getElementById("createLocation").style.display = "none";
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
            document.getElementById("createLocation").style.display = "none";
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
            firstName: document.getElementById('formFirstName').value,
            lastName: document.getElementById('formLastName').value,
            jobTitle: document.getElementById('formJobTitle').value,
            email: document.getElementById('formEmail').value,
            departmentID: document.getElementById('formDepartmentDropdown').value,
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

            showDepartments();

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
            name: document.getElementById('formDepartmentName').value,
            locationID: document.getElementById('formLocationDropdown').value,
        },
        success: function (result) {

            showDepartments();

        }
    })
}

// Deletes location, but only possible when there are no departments in a location
function deleteLocation(locationID) {
    $.ajax({
        url: 'libs/php/deleteLocationByID.php',
        type: 'POST',
        datatype: 'json',
        data: {
            id: locationID,
        },
        success: function (result) {

            if (result.status.name == "ok") {
                showLocations();
            } else {
                alert("There are still departments in that location; you can not delete it.");
            }

        }
    })
}

function createLocation() {
    $.ajax({
        url: 'libs/php/insertLocation.php',
        type: 'POST',
        datatype: 'json',
        data: {
            name: document.getElementById('formLocationName').value,
        },
        success: function (result) {

            showLocations();

        }
    })
}

function getLocationsList() {
    $.ajax({
        url: 'libs/php/getAllLocations.php',
        type: 'POST',
        datatype: 'json',
        data: {},
        success: function (result) {

            document.getElementById("formLocationDropdown").innerHTML = "";

            const locations = result.data;

            const list = document.getElementById('formLocationDropdown');
            locations.sort();

            locations.forEach(function (item) {
                const option = document.createElement('option');
                option.value = item.id;
                option.innerText = item.name;
                list.appendChild(option);
            })

        }
    })
}

function getDepartmentList() {
    $.ajax({
        url: 'libs/php/getAllDepartments.php',
        type: 'POST',
        datatype: 'json',
        data: {},
        success: function (result) {

            document.getElementById("formDepartmentDropdown").innerHTML = "";

            const departments = result.data;

            const list = document.getElementById('formDepartmentDropdown');
            departments.sort();

            departments.forEach(function (item) {
                const option = document.createElement('option');
                option.value = item.id;
                option.innerText = item.name;
                list.appendChild(option);
            })

        }
    })
}