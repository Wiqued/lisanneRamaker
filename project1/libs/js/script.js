/*
1. Initialise map and current location on load in
2. Map design
3. Get Country name based on Lat/Lng
*/

// Initialise map and current location on load in
var map = L.map('map');

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
} else {
    document.getElementById("demo").innerHTML =
        "Geolocation is not supported by this browser.";
}

function showPosition(position) {
    map.setView([position.coords.latitude, position.coords.longitude], 6);
}

// Map design
var Thunderforest_Neighbourhood = L.tileLayer('https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=e24c409ff68c47bb974a643883a6842b', {
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    apikey: 'e24c409ff68c47bb974a643883a6842b',
    maxZoom: 22
});

L.tileLayer.provider('Thunderforest.Landscape', { apikey: 'e24c409ff68c47bb974a643883a6842b' }).addTo(map);

// Get Country name based on Lat/Lng
var currentCountry;
var currentCountryCode;

function getCountryName(lat, lng) {

    $.ajax({
        url: "libs/php/getCountry.php",
        type: 'GET',
        dataType: 'json',
        data: {
            lat: lat,
            lng: lng
        },
        success: function (result) {

            (JSON.stringify(result));

            if (result.status.name == "ok") {

                if ("countryName" in result.data) {

                    currentCountry = result['data']['countryName'];
                    currentCountryCode = result['data']['countryCode'];

                    popUp();

                    console.log(currentCountry);

                } else {
                    document.getElementById('popUp').style.display = 'none';
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Find the country isn't working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    });

};



// Shows the pop up and fills it
// Need to know currentCountry and currentCountryCode when we call it
function popUp() {
    document.getElementById('popUp').style.display = 'block';

    $('#countryName').html(currentCountry);

    getCapitalCity();
    getCountryBorders();

    document.getElementById('countryFlagImg').src = `https://countryflagsapi.com/svg/${currentCountryCode}`;
    document.getElementById('wikipediaLink').href = `https://en.wikipedia.org/wiki/${currentCountry}`;
}



// On submit does not refresh page
$("#searchForm").submit(function(e) {
    e.preventDefault();
});



// Get the capital city from a country
function getCapitalCity() {
    $.ajax({
        url: "libs/php/getCapital.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: currentCountryCode,
        },
        success: function (result) {

            (JSON.stringify(result));

            if (result.status.name == "ok") {

                let capital = result['data']['geonames'][0]['capital'];

                // innerHTML
                document.getElementById('capitalCity').innerHTML = capital;

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Get Capital city isn't working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    });

};



// Get Lat/Lng on click
function onMapClick(e) {
    getCountryName(e.latlng.lat, e.latlng.lng);
    console.log(e.latlng);
}

map.on('click', onMapClick);


// Datalist options
document.getElementById("countryOptions").options

function getCountryOptions() {
    $.ajax({
        url: "libs/php/getCountrySearchOptions.php",
        type: 'POST',
        dataType: 'json',
        data: {},
        success: function (result) {

            const countries = result.data;
            const list = document.getElementById('countryOptions');

            countries.forEach(function(item) {
                const option = document.createElement('option');
                option.value = item;
                list.appendChild(option);
                
            })
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Get Country Options not working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    });

};

$(document).ready(function(){
    getCountryOptions();
});


// Runs when you click on the search button
function onSearchClick() {
    console.log(document.getElementById("userCountryInput").value);
    currentCountry = document.getElementById("userCountryInput").value;
    getCountryCode();
}

// Get the current country code AND does the pop-up
function getCountryCode() {
    $.ajax({
        url: "libs/php/getCountryCode.php",
        type: 'GET',
        dataType: 'json',
        data: {
            currentCountry: currentCountry,
        },
        success: function (result) {

            (JSON.stringify(result));

            if (result.status.name == "ok") {

                currentCountryCode = result.data;
                popUp();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Get country code isn't working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    });

};



// Takes current country and returns that countries borders in an array
function getCountryBorders() {
    $.ajax({
        url: "libs/php/getCountryBorders.php",
        type: 'GET',
        dataType: 'json',
        data: {
            currentCountryCode: currentCountryCode,
        },
        success: function (result) {

            (JSON.stringify(result));

            if (result.status.name == "ok") {

                clearMap();

                const countryBorders = result.data;
                const polygon = L.polygon(countryBorders, {color: 'pink'}).addTo(map);

                // zoom the map to the polygon
                map.fitBounds(polygon.getBounds());

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Get country borders isn't working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    });

};

// Copied and modified from https://stackoverflow.com/questions/14585688/clear-all-polylines-from-leaflet-map
function clearMap() {
    for(i in map._layers) {
        if(map._layers[i]._path != undefined) {
            try {
                map.removeLayer(map._layers[i]);
            }
            catch(e) {
                console.log("problem with " + e + map._layers[i]);
            }
        }
    }
}