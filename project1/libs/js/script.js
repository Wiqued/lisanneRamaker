/* INDEX
- Initialise map and current location on load in
- Map design
- Get Country name based on Lat/Lng
- Shows the pop-up and fills it.
- On submit does not refresh page
- Get the capital city from a country
- Get Lat/Lng on click
- Datalist options
- Runs when you click on the search button
- When user selects a country from the list, it calls the pop-up with that country
- Get the current country code AND does the pop-up
- Takes current country and returns that countries borders in an array
- Clears the polylines from the map when clicking or searching for another country
*/

// Initialise map and current location on load in
var map = L.map('map');

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
} else {
    document.getElementById("demo").innerText =
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

// Language code to language name
const languageNames = new Intl.DisplayNames(['en'], {
    type: 'language'
});


var currentCountry;
var currentCountryCode;
var currentCurrency;
var currentCapital;
var lon;
var lat;


// Get current country based on lat/lng
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

                    document.getElementById("countryOptions").value = currentCountry;

                    popUp();


                    console.log(currentCountry);

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

    document.getElementById('countryFlagImg').src = `https://countryflagsapi.com/svg/${currentCountryCode}`;
    document.getElementById('countryFlagImg2').src = `https://countryflagsapi.com/svg/${currentCountryCode}`;
    document.getElementById('countryFlagImg3').src = `https://countryflagsapi.com/svg/${currentCountryCode}`;

    document.getElementById('wikipediaLink').href = `https://en.wikipedia.org/wiki/${currentCountry}`;
    document.getElementById('wikipediaLink2').href = `https://en.wikipedia.org/wiki/${currentCountry}`;
    document.getElementById('wikipediaLink3').href = `https://en.wikipedia.org/wiki/${currentCountry}`;
}



// On submit does not refresh page
$("#searchForm").submit(function (e) {
    e.preventDefault();
});



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
                const surface = result['data']['geonames']['0']['areaInSqKm'];
                currentCurrency = result['data']['geonames']['0']['currencyCode'];

                const allLanguages = languages.split(',');

                const languageCombined = [];

                for (language of allLanguages) {

                    const languageName = languageNames.of(language);
                    languageCombined.push(languageName);


                }

                getExchangeRate();
                getCurrentWeather();
                console.log(currentCapital);

                document.getElementById('capitalCity').innerText = currentCapital;
                document.getElementById('capitalCity2').innerText = currentCapital;
                document.getElementById('population').innerText = parseInt(population).toLocaleString('en-GB');
                document.getElementById('languagesSpoken').innerText = languageCombined.join(', ');
                document.getElementById('continentName').innerText = continent;
                document.getElementById('countrySurface').innerText = `${surface} km2`;
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
    getCountryName(e.latlng.lat, e.latlng.lng);
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
                    <section><a class ="text-decoration-none" href="${articleLink}" target="_blank"><img src="${articleImage}" alt=""></a></section>
                    <section><h3>${articleTitle}</h3></section>
                    <section><p>${articleDescription}</p></section>
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
                const polygon = L.polygon(countryBorders, { color: 'pink' }).addTo(map);

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

                document.getElementById('currentTemp').innerText = Math.round(currentTemp);
                
                console.log(`Current temp: ${currentTemp}`);

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
        success: function(result) {

            if (result.status.name == "ok" ) {

                // First time stamp
                let time1 = result.data.list[0]['dt'];
                let tempForecast1 = result.data.list[0].main['temp'];

                let date1 = new Date(time1 * 1000);
                let fullHour1 = date1.getHours();
                let hour1 = `${fullHour1}:00`;

                console.log(`Forecast at ${hour1}:00 = ${tempForecast1}`);

                document.getElementById('time1').innerText = hour1;
                document.getElementById('temp1').innerText = Math.round(tempForecast1);

                // Second time stamp, 3 hours later
                let time2 = result.data.list[1]['dt'];
                let tempForecast2 = result.data.list[1].main['temp'];

                let date2 = new Date(time2 * 1000);
                let fullHour2 = date2.getHours();
                let hour2 = `${fullHour2}:00`;

                console.log(`Forecast at ${hour2}:00 = ${tempForecast2}`);

                document.getElementById('time2').innerText = hour2;
                document.getElementById('temp2').innerText = Math.round(tempForecast2);

                // Third time stamp, 3 hours later
                let time3 = result.data.list[2]['dt'];
                let tempForecast3 = result.data.list[2].main['temp'];

                let date3 = new Date(time3 * 1000);
                let fullHour3 = date3.getHours();
                let hour3 = `${fullHour3}:00`;

                console.log(`Forecast at ${hour3}:00 = ${tempForecast3}`);

                document.getElementById('time3').innerText = hour3;
                document.getElementById('temp3').innerText = Math.round(tempForecast3);

                // Icons
                let icon2 = result.data.list[0].weather[0]['icon'];
                document.getElementById('weatherIcon2').src = `http://openweathermap.org/img/wn/${icon2}@2x.png`;

                let icon3 = result.data.list[1].weather[0]['icon'];
                document.getElementById('weatherIcon3').src = `http://openweathermap.org/img/wn/${icon3}@2x.png`;

                let icon4 = result.data.list[2].weather[0]['icon'];
                document.getElementById('weatherIcon4').src = `http://openweathermap.org/img/wn/${icon4}@2x.png`;

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

