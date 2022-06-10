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
    document.getElementById("employeeProfileEdit").style.display = "none";
    document.getElementById("departmentEdit").style.display = "none";
    document.getElementById("locationsEdit").style.display = "none";
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


// Delete, create and edit employees
$(".deleteEmployee").click(function() {
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

$("#employeeEditButton").click(function() {
    document.getElementById("employeeProfile").style.display = "none";
    document.getElementById("employeeProfileEdit").style.display = "block";
});

$("#employeeSaveButton").click(function() {
    updateEmployee()
    document.getElementById("employeeProfile").style.display = "block";
    document.getElementById("employeeProfileEdit").style.display = "none";
});

$("#employeeCancelButton").click(function() {
    showEmployeeProfile(currentEmployeeID);
    document.getElementById("employeeProfileEdit").style.display = "none";
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
});

$("#departmentSaveButton").click(function() {
    updateDepartment();
    document.getElementById("departmentsPage").style.display = "block";
    document.getElementById("departmentEdit").style.display = "none";
});

$("#departmentCancelButton").click(function() {
    showDepartments();
});


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
});

$("#locationSaveButton").click(function() {
    updateLocation();
    document.getElementById("locationsPage").style.display = "block";
    document.getElementById("locationsEdit").style.display = "none";
});

$("#locationCancelButton").click(function() {
    showLocations();
});


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

let currentDepartmentID;

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
                clonedDiv.getElementsByClassName('employeeCount')[0].innerText = `${department.num_of_employees} employee(s)`;


                $(clonedDiv.getElementsByClassName('deleteDepartment')[0]).click(function() {
                    if (confirm('Are you sure you want to delete this department?')) {
                        // Add dependencies 
                        deleteDepartment(department.id);
                    }
                });

                $(clonedDiv.getElementsByClassName('departmentEditButton')[0]).click(function() {
                    currentDepartmentID = department.id;
                    document.getElementById("departmentsPage").style.display = "none";
                    document.getElementById("departmentEdit").style.display = "block";
                    
                    // Pre-fill the page
                    document.getElementById("departmentNameEdit").value = department.name;

                    getLocationsListEdit(department.locationID);
                });

            }
            
            document.getElementById("employeePage").style.display = "none";
            document.getElementById("employeeProfile").style.display = "none";
            document.getElementById("departmentsPage").style.display = "block";
            document.getElementById("locationsPage").style.display = "none";
            document.getElementById("createEmployee").style.display = "none";
            document.getElementById("createDepartment").style.display = "none";
            document.getElementById("createLocation").style.display = "none";
            document.getElementById("employeeProfileEdit").style.display = "none";
            document.getElementById("departmentEdit").style.display = "none";
            document.getElementById("locationsEdit").style.display = "none";
        }
    })
}

let currentLocationID;

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
                clonedDiv.getElementsByClassName('departmentCount')[0].innerText = `${location.num_of_depts} department(s)`;

                $(clonedDiv.getElementsByClassName('deleteLocation')[0]).click(function() {
                    if (confirm('Are you sure you want to delete this location?')) {
                        // Checks to see if possible in php
                        deleteLocation(location.id);
                    }
                });

                $(clonedDiv.getElementsByClassName('locationEditButton')[0]).click(function() {
                    currentLocationID = location.id;
                    document.getElementById("locationsPage").style.display = "none";
                    document.getElementById("locationsEdit").style.display = "block";

                    
                    // Pre fill the page
                    document.getElementById("locationNameEdit").value = location.name;
                });


            }
            
            document.getElementById("employeePage").style.display = "none";
            document.getElementById("employeeProfile").style.display = "none";
            document.getElementById("departmentsPage").style.display = "none";
            document.getElementById("locationsPage").style.display = "block";
            document.getElementById("createEmployee").style.display = "none";
            document.getElementById("createDepartment").style.display = "none";
            document.getElementById("createLocation").style.display = "none";
            document.getElementById("employeeProfileEdit").style.display = "none";
            document.getElementById("departmentEdit").style.display = "none";
            document.getElementById("locationsEdit").style.display = "none";
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
            document.getElementById("employeeJobTitle").innerText = result.data.personnel[0].jobTitle;

            // Pre-fill for the edit page
            document.getElementById("employeeFirstNameEdit").value = result.data.personnel[0].firstName;
            document.getElementById("employeeLastNameEdit").value = result.data.personnel[0].lastName;
            document.getElementById("employeeEmailEdit").value = result.data.personnel[0].email;
            document.getElementById("employeeJobTitleEdit").value = result.data.personnel[0].jobTitle;


            currentEmployeeID = result.data.personnel[0].id;

            getDepartmentListEdit(result.data.personnel[0].departmentID);

            
            document.getElementById("employeePage").style.display = "none";
            document.getElementById("employeeProfile").style.display = "block";
            document.getElementById("departmentsPage").style.display = "none";
            document.getElementById("locationsPage").style.display = "none";
            document.getElementById("createEmployee").style.display = "none";
            document.getElementById("createDepartment").style.display = "none";
            document.getElementById("createLocation").style.display = "none";
            document.getElementById("employeeProfileEdit").style.display = "none";
            document.getElementById("departmentEdit").style.display = "none";
            document.getElementById("locationsEdit").style.display = "none";
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

            if (result.status.name == "ok") {
                showDepartments();
            } else {
                alert("There are still employees in that department; you can not delete it.");
            }

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
            document.getElementById("formDepartmentDropdownEdit").innerHTML = "";

            const departments = result.data;

            const list = document.getElementById('formDepartmentDropdown');
            departments.sort();

            departments.forEach(function (item) {
                const option = document.createElement('option');
                option.value = item.id;
                option.innerText = item.name;
                list.appendChild(option);
            })

            const listEdit = document.getElementById('formDepartmentDropdownEdit');

            departments.forEach(function (item) {
                const option = document.createElement('option');
                option.value = item.id;
                option.innerText = item.name;
                listEdit.appendChild(option);
            })

        }
    })
}

function getDepartmentListEdit(selectedDepartmentId) {
    $.ajax({
        url: 'libs/php/getAllDepartments.php',
        type: 'POST',
        datatype: 'json',
        data: {},
        success: function (result) {

            document.getElementById("formDepartmentDropdownEdit").innerHTML = "";

            const departments = result.data;
            departments.sort();

            const listEdit = document.getElementById('formDepartmentDropdownEdit');

            departments.forEach(function (item) {
                const option = document.createElement('option');
                option.value = item.id;
                option.innerText = item.name;
                listEdit.appendChild(option);
            });

            document.getElementById("formDepartmentDropdownEdit").value = selectedDepartmentId;

        }
    })
}

// Edit
function updateEmployee() {
    $.ajax({
        url: 'libs/php/updatePersonnelByID.php',
        type: 'POST',
        dataType: 'json',
        data: {
            firstName: document.getElementById("employeeFirstNameEdit").value,
            lastName: document.getElementById("employeeLastNameEdit").value,
            email: document.getElementById("employeeEmailEdit").value,
            jobTitle: document.getElementById("employeeJobTitleEdit").value,
            departmentID: document.getElementById("formDepartmentDropdownEdit").value,
            id: currentEmployeeID,
        },
        success: function (results) {

            showEmployeeProfile(currentEmployeeID);

        }
    })
}

function getLocationsListEdit(selectedLocationId) {
    $.ajax({
        url: 'libs/php/getAllLocations.php',
        type: 'POST',
        datatype: 'json',
        data: {},
        success: function (result) {

            document.getElementById("formLocationDropdownEdit").innerHTML = "";

            const locations = result.data;

            const listEdit = document.getElementById('formLocationDropdownEdit');
            locations.sort();

            locations.forEach(function (item) {
                const option = document.createElement('option');
                option.value = item.id;
                option.innerText = item.name;
                listEdit.appendChild(option);
            });

            document.getElementById("formLocationDropdownEdit").value = selectedLocationId;

        }
    })
}

function updateDepartment() {
    $.ajax({
        url: 'libs/php/updateDepartmentByID.php',
        type: 'POST',
        dataType: 'json',
        data: {
            name: document.getElementById("departmentNameEdit").value,
            locationID: document.getElementById("formLocationDropdownEdit").value,
            id: currentDepartmentID,
        },
        success: function (results) {

            showDepartments();

        }
    })
}

function updateLocation() {
    $.ajax({
        url: 'libs/php/updateLocationByID.php',
        type: 'POST',
        dataType: 'json',
        data: {
            name: document.getElementById("locationNameEdit").value,
            id: currentLocationID,
        },
        success: function (results) {

            showLocations();

        }
    })
}