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

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                if ("countryName" in result.data) {

                    document.getElementById('popUp').style.display = 'block';
                    console.log(result['data']['countryName']);
                    $('#countryName').html(result['data']['countryName']);
                    // $('#capitalCity').html(result['geonames'][0]['capitalCity']);

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

function getCapitalCity() {
    $.ajax({
        url: "libs/php/getCapital.php",
        type: 'POST',
        dataType: 'json',
        data: {
            q: $('#q').val(),
        },
        success: function (result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                if ("capitalCity" in result.data.geonames) {

                    $('#capitalCity').html(result['data']['geonames'][0]['capital']);

                } 
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
    getCapitalCity(e.capitalCity);
    console.log(e.latlng);
}

map.on('click', onMapClick);


// Get Wiki link
/*
    $.ajax({
        url: "libs/php/getWikiPage.php",
        type: 'POST',
        dataType: 'json',
        data: {
            q: q,
        },
        success: function(result) {

            console.log(JSON.stringify(result));
            
            if (result.status.name == "ok") {

                if (result.data.length == 0) {

                    $('#results').html("Place name not recognised, please try again.")
                    

                } else {

                    $('#results').html(result['data'][0]['wikipediaUrl']);

                }

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Get the wiki article isn't working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    }); 
}; */

// Get Country Flag
/* function getCountryFlag(countryName) {
    $.ajax({
        url: "libs/php/getCountryFlag.php",
        type: 'GET',
        dataType: 'image/svg',
        data: {
            countryName: countryName,
        },
        success: function (result) {

            // console.log(JSON.stringify(result));

            
            
        
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Get the country flag isn't working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    });

}; */

// Capital City
