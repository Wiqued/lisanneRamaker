function showAll() {
    document.getElementById("listOfAll").style.display = "block";
    document.getElementById("employeeProfile").style.display = "none";
    document.getElementById("departments").style.display = "none";
    document.getElementById("locations").style.display = "none";
}

function showEmployeeProfile() {
    document.getElementById("listOfAll").style.display = "none";
    document.getElementById("employeeProfile").style.display = "block";
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

$("#listOfAll").click(function() {
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
