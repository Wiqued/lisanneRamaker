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
        type: 'POST',
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
function popUp() {
    document.getElementById('popUp').style.display = 'block';

    $('#countryName').html(currentCountry);
    getCapitalCity();

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



function onSearchClick() {
    console.log(document.getElementById("userCountryInput").value);
    popUp();
}