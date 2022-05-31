// On submit does not refresh page
$("#searchForm").submit(function (e) {
    e.preventDefault();
});

// Hides and shows the right pages
function showAll() {
    document.getElementById("listOfAll").style.display = "block";
    document.getElementById("employeeProfile").style.display = "none";
    document.getElementById("departments").style.display = "none";
    document.getElementById("locations").style.display = "none";
}

$("#listProfile").click(function() {
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

getAllEmployees();

// Get list of all employees, name, department and location on load
function getAllEmployees() {
    $.ajax({
        url: 'libs/php/getAll.php',
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (result) {

            const employees = result.data

            for (const employee of employees) {

                const div = document.getElementById('listProfile');
                const clonedDiv = div.cloneNode(true);
                document.getElementById('listOfAll').appendChild(clonedDiv);

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


function showDepartments() {
    $.ajax({
        url: 'libs/php/getAllDepartments.php',
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (result) {

            const departments = result.data

            for (const department of departments) {

                const div = document.getElementById('departmentsList');
                const clonedDiv = div.cloneNode(true);
                document.getElementById('departments').appendChild(clonedDiv);

                clonedDiv.getElementsByClassName('departmentsName')[0].innerText = department.name;

            }
            
            document.getElementById("listOfAll").style.display = "none";
            document.getElementById("employeeProfile").style.display = "none";
            document.getElementById("departments").style.display = "block";
            document.getElementById("locations").style.display = "none";
        }
    })
}

function showLocations() {
    $.ajax({
        url: 'libs/php/getAllLocations.php',
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (result) {

            const locations = result.data

            for (const location of locations) {

                const div = document.getElementById('locationsList');
                const clonedDiv = div.cloneNode(true);
                document.getElementById('locations').appendChild(clonedDiv);

                clonedDiv.getElementsByClassName('locationsName')[0].innerText = location.name;

            }
            
            document.getElementById("listOfAll").style.display = "none";
            document.getElementById("employeeProfile").style.display = "none";
            document.getElementById("departments").style.display = "none";
            document.getElementById("locations").style.display = "block";
        }
    })
}

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

            
            document.getElementById("listOfAll").style.display = "none";
            document.getElementById("employeeProfile").style.display = "block";
            document.getElementById("departments").style.display = "none";
            document.getElementById("locations").style.display = "none";
        }
    })
}

