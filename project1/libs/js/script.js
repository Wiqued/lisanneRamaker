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

                    document.getElementById('popUp').style.display = 'block';

                    console.log(currentCountry);

                    $('#countryName').html(result['data']['countryName']);
                    getCapitalCity();
                    getWikiPage();

                    document.getElementById('countryFlagImg').src = `https://countryflagsapi.com/svg/${currentCountryCode}`;

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


// Get Wiki link
function getWikiPage() {
    $.ajax({
        url: "libs/php/getWikiPage.php",
        type: 'POST',
        dataType: 'json',
        data: {
            q: currentCountry,
        },
        success: function(result) {

            JSON.stringify(result);
            
            if (result.status.name == "ok") {

                

                
                    let wikipediaURL = result['data'][0]['wikipediaUrl'];

                    document.getElementById('countryName').href = 'https://en.wikipedia.org/wiki/${countryName}';

                      console.log(wikipediaURL);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Get the wiki article isn't working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    }); 
};

// Datalist options
document.getElementById("countryOptions").options


