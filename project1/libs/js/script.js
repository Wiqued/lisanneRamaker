// Initialise map and current location on load in
var map = L.map('map');

map.setView([52.132, 5.291], 6);

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
} else {
    document.getElementById("demo").innerText =
        "Geolocation is not supported by this browser.";
}

function showPosition(position) {
    getPopUp(position.coords.latitude, position.coords.longitude);
}

// Preloader
$(window).on('load', function () { 
    if ($('#preloader').length) { 
        $('#preloader').delay(1000).fadeOut('slow', function () { 
            $(this).remove(); 
        }); 
    } 
});



// Map design
var Thunderforest_Neighbourhood = L.tileLayer('https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=e24c409ff68c47bb974a643883a6842b', {
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    apikey: 'e24c409ff68c47bb974a643883a6842b',
    maxZoom: 22
});

L.tileLayer.provider('Thunderforest.Landscape', { apikey: 'e24c409ff68c47bb974a643883a6842b' }).addTo(map);

// Language code to language name
const languageNames = new Intl.DisplayNames(['en'], {
    type: 'language'
});


// On submit does not refresh page
$("#searchForm").submit(function (e) {
    e.preventDefault();
});


var currentCountry;
var currentCountryCode;
var currentCurrency;
var currentCapital;
var lon;
var lat;


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
            countries.sort();

            countries.forEach(function (item) {
                const option = document.createElement('option');
                option.value = item;
                option.innerText = item;
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

$(document).ready(function () {
    getCountryOptions();
});

// Get current country based on lat/lng and shows pop-up
function getPopUp(lat, lng) {

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

                    // Displays current country in select on click, and calls popup
                    $("#countryOptions").val(currentCountry).trigger('change');

                    $('#newPopUp.modal-backdrop').remove();

                } else {
                    document.getElementById('newPopUp').style.display = 'none';
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


// Buttons side bar modal
L.easyButton( 'fa-regular fa-sun', function(){
    let weatherModal = new bootstrap.Modal(document.getElementById('openWeatherToggle'));
    weatherModal.show();
}).addTo(map);

L.easyButton( 'fa-regular fa-newspaper', function(){
    let newsModal = new bootstrap.Modal(document.getElementById('openNewsToggle'));
    newsModal.show();
}).addTo(map);

var newPopUp = new bootstrap.Modal(document.getElementById('newPopUp'));


// Shows the pop up and fills it
// Need to know currentCountry and currentCountryCode when we call it
function popUp() {
    newPopUp.show();

    $('#countryName').html(currentCountry);
    $('#countryName2').html(currentCountry);
    $('#countryName3').html(currentCountry);

    getCountryInfo();
    getCountryBorders();
    getCurrentNews();
    getNeighbours();
    getRestInfo();

    document.getElementById('countryFlagImg').src = `https://countryflagsapi.com/svg/${currentCountryCode}`;
    document.getElementById('countryFlagImg2').src = `https://countryflagsapi.com/svg/${currentCountryCode}`;
    document.getElementById('countryFlagImg3').src = `https://countryflagsapi.com/svg/${currentCountryCode}`;

    document.getElementById('wikipediaLink').href = `https://en.wikipedia.org/wiki/${currentCountry}`;
    document.getElementById('wikipediaLink2').href = `https://en.wikipedia.org/wiki/${currentCountry}`;
    document.getElementById('wikipediaLink3').href = `https://en.wikipedia.org/wiki/${currentCountry}`;
}



// Takes current country code and returns capital city, population, languages
function getCountryInfo() {
    $.ajax({
        url: "libs/php/getCountryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: currentCountryCode,
        },
        success: function (result) {

            (JSON.stringify(result));

            if (result.status.name == "ok") {

                currentCapital = result['data']['geonames'][0]['capital'];
                const population = result['data']['geonames']['0']['population'];
                const languages = result['data']['geonames']['0']['languages'];
                const continent = result['data']['geonames']['0']['continentName'];
                let surface = result['data']['geonames']['0']['areaInSqKm'];
                currentCurrency = result['data']['geonames']['0']['currencyCode'];

                const allLanguages = languages.split(',');

                const languageCombined = [];

                for (language of allLanguages) {

                    const languageName = languageNames.of(language);
                    languageCombined.push(languageName);


                }

                getExchangeRate();
                getCurrentWeather();
                getCapitalCoords();
                getWebcam();

                surface = parseInt(surface).toLocaleString('en-GB');

                document.getElementById('capitalCity').innerText = currentCapital;
                document.getElementById('capitalCity2').innerText = currentCapital;
                document.getElementById('population').innerText = parseInt(population).toLocaleString('en-GB');
                document.getElementById('languagesSpoken').innerText = languageCombined.join(', ');
                document.getElementById('continentName').innerText = continent;
                document.getElementById('countrySurface').innerText = `${surface} km²`;
                document.getElementById('currency').innerText = currentCurrency;


            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Get country info isn't working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    });

};



// Get Lat/Lng on click
function onMapClick(e) {
    getPopUp(e.latlng.lat, e.latlng.lng);
}

map.on('click', onMapClick);

// When user selects a country from the list, it calls the pop-up with that country
$("#countryOptions").change(function () {
    currentCountry = document.getElementById("countryOptions").value;
    getCountryCode();
});



// Get the current country code ISO2 AND does the pop-up
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

// Takes the currency and returns the exchange rate based on USD
function getExchangeRate() {
    $.ajax({
        url: "libs/php/getExchangeRate.php",
        type: 'GET',
        dataType: 'json',
        data: {
            currentCurrency: currentCurrency,
        },
        success: function (result) {

            const resultData = result.data
            const currencyValue = `1 USD equals ${resultData} ${currentCurrency}.`;

            document.getElementById("exchangeRate").innerText = currencyValue;

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Get exchange rate isn't working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    });
}

// Takes the current country code and returns the news headlines
function getCurrentNews() {
    $.ajax({
        url: "libs/php/getCurrentNews.php",
        type: 'GET',
        dataType: 'json',
        data: {
            country: currentCountryCode,
        },
        success: function (result) {

            let newsHTML = "";

            for (article in result.data.articles) {

                const articleImage = result.data.articles[article]['urlToImage'];
                const articleTitle = result.data.articles[article]['title'];
                const articleDescription = result.data.articles[article]['description'];
                const articleLink = result.data.articles[article]['url']

                if (articleImage != null && articleTitle != null && articleDescription != null) {

                    const newsArticle =
                        `
                    <div>
                    <section><a class="text-decoration-none" href="${articleLink}" target="_blank"><img src="${articleImage}" alt=""></a></section>
                    <section><h3><a href="${articleLink}" target="_blank">${articleTitle}</a></h3></section>
                    <section><p><a href="${articleLink}" target="_blank">${articleDescription}</a></p></section>
                    </div>
                    `
                    newsHTML += newsArticle;

                }
            }

            document.getElementById("newsArticle").innerHTML = newsHTML;
        }
    })
}



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
                const geojson = L.geoJSON(countryBorders, { color: 'pink' }).addTo(map);

                // zoom the map to the geoJSON
                map.fitBounds(geojson.getBounds());

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Get country borders isn't working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    });

};

// Takes current capital city and returns the weather
function getCurrentWeather() {
    $.ajax({
        url: "libs/php/getCurrentWeather.php",
        type: 'GET',
        dataType: 'json',
        data: {
            capital: currentCapital,
        },
        success: function (result) {

            if (result.status.name == "ok") {

                let currentTemp = result.data.main['temp'];
                lon = result.data.coord['lon'];
                lat = result.data.coord['lat'];

                document.getElementById('currentTemp').innerText = `${Math.round(currentTemp)}°C`;

                let icon1 = result.data.weather[0]['icon'];
                document.getElementById('weatherIcon1').src = `http://openweathermap.org/img/wn/${icon1}@2x.png`;

                getWeatherForecast();

            }

            // From this function, I get the coordinates. 
            // We pass the coordinates back into another function getWeatherForecast() and get the rest of the information


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Get current weather isn't working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    })
}

// Takes the current capital cities' coordinates and returns the weather for the next couple of hours
function getWeatherForecast() {
    $.ajax({
        url: 'libs/php/getWeatherForecast.php',
        type: 'GET',
        dataType: 'json',
        data: {
            lat: lat,
            lon: lon,
        },
        success: function (result) {

            if (result.status.name == "ok") {

                // First time stamp
                let time1 = result.data.list[0]['dt'];
                let tempForecast1 = result.data.list[0].main['temp'];

                let date1 = new Date(time1 * 1000);
                let fullHour1 = date1.getHours();
                let hour1 = `${fullHour1}:00`;

                document.getElementById('time1').innerText = hour1;
                document.getElementById('temp1').innerText = `${Math.round(tempForecast1)}°C`;

                // Second time stamp, 3 hours later
                let time2 = result.data.list[1]['dt'];
                let tempForecast2 = result.data.list[1].main['temp'];

                let date2 = new Date(time2 * 1000);
                let fullHour2 = date2.getHours();
                let hour2 = `${fullHour2}:00`;

                document.getElementById('time2').innerText = hour2;
                document.getElementById('temp2').innerText = `${Math.round(tempForecast2)}°C`;

                // Third time stamp, 3 hours later
                let time3 = result.data.list[2]['dt'];
                let tempForecast3 = result.data.list[2].main['temp'];

                let date3 = new Date(time3 * 1000);
                let fullHour3 = date3.getHours();
                let hour3 = `${fullHour3}:00`;

                document.getElementById('time3').innerText = hour3;
                document.getElementById('temp3').innerText = `${Math.round(tempForecast3)}°C`;

                // Icons
                let icon2 = result.data.list[0].weather[0]['icon'];
                document.getElementById('weatherIcon2').src = `https://openweathermap.org/img/wn/${icon2}@2x.png`;

                let icon3 = result.data.list[1].weather[0]['icon'];
                document.getElementById('weatherIcon3').src = `https://openweathermap.org/img/wn/${icon3}@2x.png`;

                let icon4 = result.data.list[2].weather[0]['icon'];
                document.getElementById('weatherIcon4').src = `https://openweathermap.org/img/wn/${icon4}@2x.png`;

            }
        }
    })
}

function getNeighbours() {
    $.ajax({
        url: "libs/php/getNeighbours.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: currentCountryCode,
        },
        success: function (result) {

            if (result.status.name == "ok") {
                let countryList = [];

                result['data'].forEach(country => {
                    const countryName = country["countryName"];

                    countryList.push(countryName);

                });
                
                document.getElementById('countryNeighbours').innerText = countryList.join(', ');

                
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Get neighbours isn't working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    });
}

function getRestInfo() {
    $.ajax({
        url: 'libs/php/getRestInfo.php',
        type: 'POST',
        dataType: 'json',
        data: {
            currentCountryCode: currentCountryCode,
        },
        success: function(result) {

            if (result.status.name == "ok") {

                let nativeName = Object.values(result.data[0].name.nativeName)[0]['common'];
                let currencySymbol = Object.values(result.data[0].currencies)[0]['symbol'];
                let drivingSide = result.data[0].car['side'];

                if (result.data[0].postalCode) {
                    let postalCode = result.data[0].postalCode['format'];
                    document.getElementById('postalCode').innerText = postalCode.split('|').join(', ');
                } else {
                    document.getElementById('postalCode').innerText = `Info not available`;

                }

                let domainFormat = result.data[0].tld['0'];

                document.getElementById('nativeName').innerText = nativeName;
                document.getElementById('currencySymbol').innerText = currencySymbol;
                document.getElementById('drivingSide').innerText = drivingSide;
                document.getElementById('domainFormat').innerText = domainFormat;

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Get rest info isn't working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    })
}

// Takes the currentCapital and returns its coordinates, using it with leaflet.extra-markers
function getCapitalCoords() {
    $.ajax({
        url: 'libs/php/getCapitalCoords.php',
        type: 'POST',
        dataType: 'json',
        data: {
            currentCapital: currentCapital,
        },
        success: function(result) {

            if (result.status.name == "ok" ) {

                const lat = result.data.results[0].geometry['lat'];
                const lng = result.data.results[0].geometry['lng'];

                function onCapitalClick(e) {
                    let capitalModal = new bootstrap.Modal(document.getElementById('openCapitalToggle'));
                    const callingCode = result.data.results[0].annotations['callingcode'];
                    const timezone = result.data.results[0].annotations.timezone['short_name'];
                    const state = result.data.results[0].components['state'];
                    capitalModal.show();
                
                    document.getElementById('cityCapital').innerText = currentCapital;
                    document.getElementById('callingCode').innerText = `+${callingCode}`;
                    document.getElementById('timezone').innerText = timezone;
                    document.getElementById('capitalState').innerText = state;
                }

                var redMarker = L.ExtraMarkers.icon({
                    icon: 'fa-thumbtack',
                    markerColor: 'cyan',
                    shape: 'circle',
                    prefix: 'fa'
                });

                let layerGroup = L.layerGroup().addTo(map);

                L.marker([lat, lng], {icon: redMarker}).addTo(layerGroup).on('click', onCapitalClick);

                // How to delete layers after clicking on another country?
                // layerGroup.clearLayers();

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Get capital coords isn't working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    })
}

function getWebcam() {
    $.ajax({
        url: 'libs/php/getWebcam.php',
        type: 'GET',
        dataType: 'json',
        data: {
            currentCountryCode: currentCountryCode,
        },
        success: function(result) {

            if (result.status == "OK") {

                // Go through ALL results and place them on the map with marker?

            }

        }
    })
}

   

// Clears the polylines from the map when clicking or searching for another country
// Copied and modified from https://stackoverflow.com/questions/14585688/clear-all-polylines-from-leaflet-map
function clearMap() {
    for (i in map._layers) {
        if (map._layers[i]._path != undefined) {
            try {
                map.removeLayer(map._layers[i]);
            }
            catch (e) {
                console.log("problem with " + e + map._layers[i]);
            }
        }
    }
}

$("select").on("click", function () {

    $(this).parent(".select-box").toggleClass("open");

});

$(document).mouseup(function (e) {
    var container = $(".select-box");

    if (container.has(e.target).length === 0) {
        container.removeClass("open");
    }
});


$("select").on("change", function () {

    var selection = $(this).find("option:selected").text(),
        labelFor = $(this).attr("id"),
        label = $("[for='" + labelFor + "']");

    label.find(".label-desc").html(selection);

});