// Preloader
// $(window).on('load', function () {
//    if ($('#preloader').length) {
//        $('#preloader').delay(1000).fadeOut('slow', function () {
//           $(this).remove();
//        });
//   }
//});

// On submit does not refresh page
$("#searchForm").submit(function (e) {
    e.preventDefault();
});

// Hides and shows the right pages
function showAll() {
    getEmployees();
    document.getElementById("employeePage").style.display = "block";
    document.getElementById("departmentsPage").style.display = "none";
    document.getElementById("locationsPage").style.display = "none";
}

function showAllDepartments() {
    getDepartments();
    document.getElementById("employeePage").style.display = "none";
    document.getElementById("departmentsPage").style.display = "block";
    document.getElementById("locationsPage").style.display = "none";
}


// Show all sorts of pages
$("#employeeEntry").click(function () {
    getEmployees();
    showEmployeeProfile();
});

$("#navAll").click(function () {
    showAll();
    document.getElementById("createEmployeeButton").innerHTML = "Add employee";
    document.getElementById("createDepartmentButton").innerHTML = "Add department";
    document.getElementById("createLocationButton").innerHTML = "Add location";

});

$("#navDepartments").click(function () {
    showAllDepartments();
    document.getElementById("createEmployeeButton").innerHTML = "Add employee";
    document.getElementById("createDepartmentButton").innerHTML = "Add department";
    document.getElementById("createLocationButton").innerHTML = "Add location";
});

$("#navLocations").click(function () {
    getLocations();
    document.getElementById("createEmployeeButton").innerHTML = "Add employee";
    document.getElementById("createDepartmentButton").innerHTML = "Add department";
    document.getElementById("createLocationButton").innerHTML = "Add location";
});


// Delete, create and edit employees
$(".deleteEmployee").click(function () {

    swal(`Are you sure you want to remove ${currentEmployeeName}?`, {
        icon: "warning",
        buttons: {
            cancel: "No",
            confirm: {
                text: "Yes",
                value: "confirm"
            },
        },
    })
        .then((value) => {
            switch (value) {

                case "confirm":
                    deleteEmployee(currentEmployeeID);

                    break;
            }
        })
});


$("#formEmployee").submit(function (e) {
    e.preventDefault();
    createEmployee();
    showAll();
    document.getElementById("formEmployee").reset();
    $("#createEmployeeModal").modal("hide");
});

$("#createEmployeeButton").click(function () {
    getDepartmentList();
});

$("#employeeEditForm").submit(function (e) {
    e.preventDefault();
    updateEmployee();
    $("#employeeProfileEditModal").modal("hide");
});

// Create new departments
$("#formDepartment").submit(function (e) {
    e.preventDefault();
    createDepartment();
    document.getElementById("formDepartment").reset();
    $("#createDepartmentModal").modal("hide");
});

$("#createDepartmentButton").click(function () {

    getLocationsList();

});

$("#departmentSaveButton").click(function () {
    updateDepartment();
    $("#departmentEditModal").modal("hide");
});

$("#departmentCancelButton").click(function () {
    showAllDepartments();
});


// create new locations
$("#formLocation").submit(function (e) {
    e.preventDefault();
    createLocation();
    document.getElementById("formLocation").reset();
    $("#createLocationModal").modal("hide")
});

$("#locationsEditForm").submit(function (e) {
    e.preventDefault();
    updateLocation();
    $("#locationEditModal").modal("hide")
});

$("#locationCancelButton").click(function () {
    showLocations();
});

// Search bar for all employees
$("#allSearchBar").submit(function (e) {
    e.preventDefault();
    showAllEmployees();
});

$("#departmentSearchBar").submit(function (e) {
    e.preventDefault();
    showDepartments();
});

$("#locationSearchBar").submit(function (e) {
    e.preventDefault();
    showLocations();
});

$(".backToAllButton").click(function () {
    showAll();
});

$(".backToDepartmentsButton").click(function () {
    showAllDepartments();
});

$(".backToLocationsButton").click(function () {
    showLocations();
});

let currentEmployeeID;
let allEmployees;
let allDepartments;
let allLocations;

let currentDepartmentID;
let currentDepartmentFilter = null;

let currentLocationID;
let currentLocationFilter = null;

let currentEmployeeName;



// Show all employees on load in
getDepartments();
getEmployees();


// 
function getEmployees() {
    $.ajax({
        url: 'libs/php/getAll.php',
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (result) {

            document.getElementById("employeeList").innerHTML = "";

            allEmployees = result.data;

            document.getElementById('allEmployeeSearch').value = "";
            currentDepartmentFilter = null;

            showAllEmployees();
        }
    })
};

// Get list of all employees, name, department and location on load, and sorts if you search
function showAllEmployees() {

    document.getElementById("employeeList").innerHTML = "";



    for (const employee of allEmployees) {

        if (shouldShowEmployee(employee)) {

            const div = document.getElementById('employeeEntry');

            const clonedDiv = div.cloneNode(true);
            document.getElementById('employeeList').appendChild(clonedDiv);

            clonedDiv.getElementsByClassName('listName')[0].innerText = `${employee.firstName} ${employee.lastName}`;
            clonedDiv.getElementsByClassName('listJob')[0].innerText = employee.jobTitle;
            clonedDiv.getElementsByClassName('listDepartment')[0].innerText = employee.department;


            document.getElementById("employeePage").style.display = "block";

            $(clonedDiv).click(function () {
                showEmployeeProfile(employee.id)
            })

            $(clonedDiv.getElementsByClassName('employeeEditButton')[0]).click(function (e) {
                $("#employeeProfileEditModal").modal("show");
                e.stopPropagation();
            })
        }
    }
};



// Show all employees in a department
function shouldShowEmployee(employee) {

    if (currentDepartmentFilter != null && currentDepartmentFilter != employee.departmentID) {
        return false;
    };

    const search = document.getElementById('allEmployeeSearch').value;

    if (employee.firstName.toLowerCase().includes(search.toLowerCase()) || employee.lastName.toLowerCase().includes(search.toLowerCase())) {
        return true;
    } else {
        return false;
    };
}


// Shows the list of departments
function getDepartments() {
    $.ajax({
        url: 'libs/php/getAllDepartments.php',
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (result) {

            document.getElementById("departmentsList").innerHTML = "";

            allDepartments = result.data

            document.getElementById('allDepartmentSearch').value = "";
            currentLocationFilter = null;

            showDepartments();
        }
    })
};



function showDepartments() {

    document.getElementById("departmentsList").innerHTML = "";



    for (const department of allDepartments) {

        if (shouldShowDepartment(department)) {

            const div = document.getElementById('departmentsEntry');
            const clonedDiv = div.cloneNode(true);
            document.getElementById('departmentsList').appendChild(clonedDiv);

            clonedDiv.getElementsByClassName('departmentsName')[0].innerText = department.name;
            clonedDiv.getElementsByClassName('locationName')[0].innerText = department.location;


            $(clonedDiv.getElementsByClassName('deleteDepartment')[0]).click(function () {

                if (department.num_of_employees > 0) {
                    swal(`There are still employees in ${department.name}; you can not delete it.`, {
                        icon: "error",
                    });
                } else {
                    swal(`Are you sure you want to delete ${department.name}?`, {
                        icon: "warning",
                        buttons: {
                            cancel: "No",
                            confirm: {
                                text: "Yes",
                                value: "confirm"
                            },
                        },
                    })
                        .then((value) => {
                            switch (value) {

                                case "confirm":

                                    deleteDepartment(department.id, department.name);
                                    break;
                            }
                        });
                }

            });


            $(clonedDiv.getElementsByClassName('departmentEditButton')[0]).click(function () {
                currentDepartmentID = department.id;

                // Pre-fill the page
                document.getElementById("departmentNameEdit").value = department.name;
                document.getElementById("departmentEditHeader").innerText = `Editing ${department.name}`;

                getLocationsListEdit(department.locationID);
            });
        }
    }
}

function shouldShowDepartment(department) {

    if (currentLocationFilter != null && currentLocationFilter != department.locationID) {
        return false;
    }

    const search = document.getElementById('allDepartmentSearch').value;

    if (department.name.toLowerCase().includes(search.toLowerCase())) {
        return true;
    } else {
        return false;
    }
}



// Shows the list of locations

function getLocations() {
    $.ajax({
        url: 'libs/php/getAllLocations.php',
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (result) {

            document.getElementById("locationsList").innerHTML = "";

            allLocations = result.data;

            document.getElementById('allLocationSearch').value = "";
            currentLocationFilter = null;

            showLocations();

        }
    })
};

function showLocations() {

    document.getElementById("locationsList").innerHTML = "";



    for (const location of allLocations) {

        if (shouldShowLocation(location)) {

            const div = document.getElementById('locationsEntry');
            const clonedDiv = div.cloneNode(true);
            document.getElementById('locationsList').appendChild(clonedDiv);

            clonedDiv.getElementsByClassName('locationsName')[0].innerText = location.name;

            $(clonedDiv.getElementsByClassName('deleteLocation')[0]).click(function () {

                if (location.num_of_depts > 0) {
                    swal(`There are still departments in ${location.name}; you can not delete it.`, {
                        icon: "error",
                    });
                } else {
                    swal(`Are you sure you want to delete ${location.name}?`, {
                        icon: "warning",
                        buttons: {
                            cancel: "No",
                            confirm: {
                                text: "Yes",
                                value: "confirm"
                            },
                        },
                    })
                        .then((value) => {
                            switch (value) {

                                case "confirm":

                                    deleteLocation(location.id, location.name);
                                    break;
                            }
                        });
                }
            });



            $(clonedDiv.getElementsByClassName('locationEditButton')[0]).click(function () {
                currentLocationID = location.id;

                // Pre fill the page
                document.getElementById("locationNameEdit").value = location.name;
                document.getElementById("locationEditHeader").innerText = `Editing ${location.name}`;
            });

        }
    }

    document.getElementById("employeePage").style.display = "none";
    document.getElementById("departmentsPage").style.display = "none";
    document.getElementById("locationsPage").style.display = "block";

};

function shouldShowLocation(location) {

    const search = document.getElementById('allLocationSearch').value;

    if (location.name.toLowerCase().includes(search.toLowerCase())) {
        return true;
    } else {
        return false;
    }
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

            currentEmployeeName = `${result.data.personnel[0].firstName} ${result.data.personnel[0].lastName}`;
            currentEmployeeID = result.data.personnel[0].id;

            getDepartmentListEdit(result.data.personnel[0].departmentID);

            $("#employeeProfileModal").modal("show");

            document.getElementById("departmentsPage").style.display = "none";
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

            if (result.status.name == "ok") {
                swal(`You have successfully removed ${currentEmployeeName}.`, {
                    icon: "success",
                });
                showAll();
                $("#employeeProfileModal").modal("hide");
            } else {
                swal("Something has gone wrong. Please try again.", {
                    icon: "error",
                });
                showAll();
            }
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
function deleteDepartment(departmentID, departmentName) {
    $.ajax({
        url: 'libs/php/deleteDepartmentByID.php',
        type: 'POST',
        datatype: 'json',
        data: {
            id: departmentID,
        },
        success: function (result) {


            if (result.status.name == "ok") {

                getDepartments();
                swal(`You have successfully deleted ${departmentName}.`, {
                    icon: "success",
                });

            } else {
                swal(`There are still employees in ${departmentName}; you can not delete it.`, {
                    icon: "error",
                })
            };
        }
    }
    )
};



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

            getDepartments();

        }
    })
}

// Deletes location, but only possible when there are no departments in a location
function deleteLocation(locationID, locationName) {
    $.ajax({
        url: 'libs/php/deleteLocationByID.php',
        type: 'POST',
        datatype: 'json',
        data: {
            id: locationID,
        },
        success: function (result) {


            if (result.status.name == "ok") {
                getLocations();
                swal(`You have successfully deleted ${locationName}.`, {
                    icon: "success",
                });
            } else {
                swal(`There are still departments in ${locationName}; you can not delete it.`, {
                    icon: "error",
                });
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

            getLocations();

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

            showAll();

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

            getDepartments();

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

            getLocations();

        }
    })
}