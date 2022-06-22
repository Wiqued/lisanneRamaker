// Preloader
$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').fadeOut('slow', function () {
            $(this).remove();
        });
    }
});

// Hides and shows the right pages
function showAll() {
    getEmployees();
    document.getElementById("employeePage").style.display = "block";
    document.getElementById("departmentsPage").style.display = "none";
    document.getElementById("locationsPage").style.display = "none";
    document.getElementById('allSearch').value = "";
}

function showAllDepartments() {
    getDepartments();
    document.getElementById("employeePage").style.display = "none";
    document.getElementById("departmentsPage").style.display = "block";
    document.getElementById("locationsPage").style.display = "none";
    document.getElementById('allSearch').value = "";
}

function showAllLocations() {
    getLocations();
    document.getElementById("employeePage").style.display = "none";
    document.getElementById("departmentsPage").style.display = "none";
    document.getElementById("locationsPage").style.display = "block";
    document.getElementById('allSearch').value = "";
}


// Show all sorts of pages
$("#employeeEntry").click(function () {
    getEmployees();
    fillEmployeeProfile();
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
    showAllLocations();
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
                    deleteEmployee(currentEmployeeID, currentEmployeeName);

                    break;
            }
        });
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
    searchAll();

});

$("#allSearch").keyup(function () {
    searchAll();
})


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
getLocations();

function searchAll() {
    getEmployees();
    getDepartments();
    getLocations();

    document.getElementById("employeePage").style.display = "block";
    document.getElementById("departmentsPage").style.display = "block";
    document.getElementById("locationsPage").style.display = "block";
}

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

            // // Puts a unique id on each row of the table
            clonedDiv.setAttribute('id', `emp${employee.id}`);


        }

        // Reads the current id from the row and fills the pop-up
        $('.employeeEntry').click(function () {

            const id = $(this).closest('[id]').attr('id').replace("emp", "");

            fillEmployeeProfile(id);
            $("#employeeProfileModal").modal("show");
        })


        // Reads the current ID from the row id and fills in the form
        $('.employeeEditButton').click(function (e) {

            const id = $(this).closest('[id]').attr('id').replace("emp", "");

            fillEmployeeProfile(id);
            $("#employeeProfileEditModal").modal("show");
            e.stopPropagation();
        })

        // Reads the current ID from the row id and checks to see if you can delete it
        $('.employeeDeleteButton').click(function (e) {

            const id = $(this).closest('[id]').attr('id').replace("emp", "");
            const employeeName = $(this).parents('tr').find('.listName').text();

            swal(`Are you sure you want to remove ${employeeName}?`, {
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
                            deleteEmployee(id, employeeName);

                            break;
                    }
                });
            e.stopPropagation();

        })



    }
};



// Show all employees in a department
function shouldShowEmployee(employee) {

    const search = document.getElementById('allSearch').value.toLowerCase();

    if (employee.firstName.toLowerCase().includes(search) || employee.lastName.toLowerCase().includes(search)) {
        return true;
    }

    if (employee.department.toLowerCase().includes(search)) {
        return true;
    }

    if (employee.location.toLowerCase().includes(search)) {
        return true;
    }

    if (employee.email.toLowerCase().includes(search)) {
        return true;
    }

    if (employee.jobTitle.toLowerCase().includes(search)) {
        return true;
    }

    return false;
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
            clonedDiv.getElementsByClassName('numOfEmployees')[0].innerText = department.num_of_employees;
            clonedDiv.getElementsByClassName('locationID')[0].innerText = department.locationID;

            // Puts a unique id on each row of the table
            clonedDiv.setAttribute('id', `dep${department.id}`);

        }
    }

    // Reads the current ID from the row id and fills in the form
    $('.departmentEditButton').click(function () {

        const id = $(this).closest('[id]').attr('id').replace('dep', '');
        const departmentName = $(this).parents('tr').children('.departmentsName').text();
        const locationID = $(this).parents('tr').children('.locationID').text();

        // sets global variable
        currentDepartmentID = id;

        // Pre-fill the form
        document.getElementById("departmentNameEdit").value = departmentName;
        document.getElementById("departmentEditHeader").innerText = `Editing ${departmentName}`;

        getLocationsListEdit(locationID);
    })


    // Reads the current ID from the row id and checks to see if you can delete it
    $('.departmentDeleteButton').click(function () {

        const id = $(this).closest('[id]').attr('id').replace('dep', '');
        const departmentName = $(this).parents('tr').children('.departmentsName').text();
        const numOfEmployees = $(this).parents('tr').children('.numOfEmployees').text();

        if (numOfEmployees > 0) {
            swal(`There are still employees in ${departmentName}; you can not delete it.`, {
                icon: "error",
            });
        } else {
            swal(`Are you sure you want to delete ${departmentName}?`, {
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

                            deleteDepartment(id, departmentName);
                            break;
                    }
                });
        }
    })

};

function shouldShowDepartment(department) {

    const search = document.getElementById('allSearch').value.toLowerCase();

    if (department.name.toLowerCase().includes(search)) {
        return true;
    }

    if (department.location.toLowerCase().includes(search)) {

        return true;
    }

    return false;

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
            clonedDiv.getElementsByClassName('numOfDepts')[0].innerText = location.num_of_depts;

            // Puts a unique id on each row of the table
            clonedDiv.setAttribute('id', `loc${location.id}`);

        }
    }

    // Reads the current ID from the row id and fills in the form
    $('.locationEditButton').click(function () {

        const id = $(this).closest('[id]').attr('id').replace("loc", "");
        const locationName = $(this).parents('tr').children('.locationsName').text();

        // Set global variable
        currentLocationID = id;

        // Pre-fill the form
        document.getElementById("locationNameEdit").value = locationName;
        document.getElementById("locationEditHeader").innerText = `Editing ${locationName}`;
    })


    // Reads the current ID from the row id and checks to see if you can delete it
    $('.locationDeleteButton').click(function () {

        const id = $(this).closest('[id]').attr('id').replace("loc", "");
        const locationName = $(this).parents('tr').children('.locationsName').text();
        const numOfDepts = $(this).parents('tr').children('.numOfDepts').text();

        if (numOfDepts > 0) {
            swal(`There are still departments in ${locationName}; you can not delete it.`, {
                icon: "error",
            });
        } else {
            swal(`Are you sure you want to delete ${locationName}?`, {
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

                            deleteLocation(id, locationName);
                            break;
                    }
                });
        }
    })

};

function shouldShowLocation(location) {

    const search = document.getElementById('allSearch').value;

    if (location.name.toLowerCase().includes(search.toLowerCase())) {
        return true;
    } else {
        return false;
    }
}

// Fill and shows the individual employee profile
function fillEmployeeProfile(employeeId) {
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

            document.getElementById("employeeNameEdit").innerText = `Editing ${result.data.personnel[0].firstName} ${result.data.personnel[0].lastName}`;


            currentEmployeeName = `${result.data.personnel[0].firstName} ${result.data.personnel[0].lastName}`;
            currentEmployeeID = result.data.personnel[0].id;

            getDepartmentListEdit(result.data.personnel[0].departmentID);

        }
    })
}

// Deletes employee from database
function deleteEmployee(employeeID, employeeName) {
    $.ajax({
        url: 'libs/php/deletePersonnelByID.php',
        type: 'POST',
        dataType: 'json',
        data: {
            id: employeeID,
        },
        success: function (result) {

            if (result.status.name == "ok") {
                swal(`You have successfully removed ${employeeName}.`, {
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

            fillEmployeeProfile(result.data);
            $("#employeeProfileModal").modal("show");

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

            showAllDepartments();

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
                showAllLocations();
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

            showAllLocations();

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

            showAllLocations();

        }
    })
}