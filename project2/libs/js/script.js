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

function showDepartments() {
    document.getElementById("listOfAll").style.display = "none";
    document.getElementById("employeeProfile").style.display = "none";
    document.getElementById("departments").style.display = "block";
    document.getElementById("locations").style.display = "none";

}

function showLocations() {
    document.getElementById("listOfAll").style.display = "none";
    document.getElementById("employeeProfile").style.display = "none";
    document.getElementById("departments").style.display = "none";
    document.getElementById("locations").style.display = "block";
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
            document.getElementById("employeeDepartment").innerText = result.data.personnel[0].department;
            document.getElementById("employeeLocation").innerText = result.data.personnel[0].department;
            document.getElementById("employeeEmail").innerText = result.data.personnel[0].email;




            
            document.getElementById("listOfAll").style.display = "none";
            document.getElementById("employeeProfile").style.display = "block";
            document.getElementById("departments").style.display = "none";
            document.getElementById("locations").style.display = "none";
        }
    })
}
