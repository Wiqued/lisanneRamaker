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

function showAllDepartments() {
    getDepartments();
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


// Show all sorts of pages
$("#employeeEntry").click(function () {
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
    swal("Are you sure you want to delete this employee?", {
        icon: "warning",
        buttons: {
            cancel: "Cancel",
            confirm: {
                text: "Confirm",
                value: "confirm"
            },
        },
    })
        .then((value) => {
            switch (value) {

                case "confirm":
                    swal("You have successfully removed the employee.", {
                        icon: "success",
                    });
                    deleteEmployee(currentEmployeeID);
                    break;
            }
        })
});

$("#formEmployee").submit(function (e) {
    e.preventDefault();
    createEmployee();
    document.getElementById("formEmployee").reset();
});

$("#createEmployeeButton").click(function () {

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

$("#employeeEditButton").click(function () {
    document.getElementById("employeeProfile").style.display = "none";
    document.getElementById("employeeProfileEdit").style.display = "block";
});

$("#employeeSaveButton").click(function () {
    updateEmployee()
    document.getElementById("employeeProfile").style.display = "block";
    document.getElementById("employeeProfileEdit").style.display = "none";
});

$("#employeeCancelButton").click(function () {
    showEmployeeProfile(currentEmployeeID);
    document.getElementById("employeeProfileEdit").style.display = "none";
});

// Create new departments
$("#formDepartment").submit(function (e) {
    e.preventDefault();
    createDepartment();
    document.getElementById("formDepartment").reset();
});

$("#createDepartmentButton").click(function () {
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

$("#departmentSaveButton").click(function () {
    updateDepartment();
    document.getElementById("departmentsPage").style.display = "block";
    document.getElementById("departmentEdit").style.display = "none";
});

$("#departmentCancelButton").click(function () {
    showAllDepartments();
});


// Delete and create new locations
$("#deleteLocation").click(function () {
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

$("#createLocationButton").click(function () {

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

$("#locationSaveButton").click(function () {
    updateLocation();
    document.getElementById("locationsPage").style.display = "block";
    document.getElementById("locationsEdit").style.display = "none";
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
            clonedDiv.getElementsByClassName('listLocation')[0].innerText = employee.location;


            document.getElementById("employeePage").style.display = "block";
            document.getElementById("employeeProfile").style.display = "none";

            $(clonedDiv).click(function () {
                showEmployeeProfile(employee.id)
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
                swal("Are you sure you want to delete this department?", {
                    icon: "warning",
                    buttons: {
                        cancel: "Cancel",
                        confirm: {
                            text: "Confirm",
                            value: "confirm"
                        },
                    },
                })
                    .then((value) => {
                        switch (value) {

                            case "confirm":
                                deleteDepartment(department.id);
                                break;
                        }
                    });
            });

            $(clonedDiv.getElementsByClassName('departmentEditButton')[0]).click(function () {
                currentDepartmentID = department.id;
                document.getElementById("departmentsPage").style.display = "none";
                document.getElementById("departmentEdit").style.display = "block";

                // Pre-fill the page
                document.getElementById("departmentNameEdit").value = department.name;

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
            swal("Are you sure you want to delete this location?", {
                icon: "warning",
                buttons: {
                    cancel: "Cancel",
                    confirm: {
                        text: "Confirm",
                        value: "confirm"
                    },
                },
            })
                .then((value) => {
                    switch (value) {

                        case "confirm":
                            deleteLocation(location.id);
                            break;
                    }
                });
        });

        $(clonedDiv.getElementsByClassName('locationEditButton')[0]).click(function () {
            currentLocationID = location.id;
            document.getElementById("locationsPage").style.display = "none";
            document.getElementById("locationsEdit").style.display = "block";


            // Pre fill the page
            document.getElementById("locationNameEdit").value = location.name;
        });

    }
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
                getDepartments();
                swal("You have successfully deleted the department.",{
                    icon: "success",
                });
            } else {
                swal("There are still employees in that department; you can not delete it.",{
                    icon: "error",
                });
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

            getDepartments();

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
                getLocations();
                swal("You have successfully deleted the location.", {
                    icon: "success",
                });
            } else {
                swal("There are still departments in that location; you can not delete it.", {
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