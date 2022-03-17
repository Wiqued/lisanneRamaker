$(window).on('load', function () { 
    if ($('#preloader').length) { 
        $('#preloader').delay(1000).fadeOut('slow', function () { 
            $(this).remove(); 
        }); 
    } 
});

// Country Neighbours
$('#button1').click(function () {

    $.ajax({
        url: "libs/php/getNeighbours.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#selectCountry').val()
        },
        success: function (result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                let countryList = ""

                result['data'].forEach(country => {
                    const countryName = country["countryName"];

                    countryList += `${countryName}, `;
                    
                });
                
                $('#results').html(countryList);

                
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Get neighbours isn't working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    });

});

// Country Name of certain place in the world
$('#button2').click(function () {

    $.ajax({
        url: "libs/php/getCountry.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#lat').val(),
            lng: $('#lng').val()
        },
        success: function (result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                if ("countryName" in result.data) {

                    $('#results').html(result['data']['countryName']);
                    
                } else {

                    $('#results').html("No country found, probably the ocean")

                } 

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Find the country isn't working")
            console.log(textStatus)
            console.log(errorThrown)
        }
    });

});

// Third API
$('#button3').click(function() {

    $.ajax({
        url: "libs/php/getWikiPage.php",
        type: 'POST',
        dataType: 'json',
        data: {
            q: $('#q').val(),
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

});