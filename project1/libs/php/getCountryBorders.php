<?php
    // Fill an array of polygons with currentCountry borders

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $myfile = fopen("../json/countryBorders.geo.json", "r") or die("Unable to open file!");
    $result = fread($myfile,filesize("../json/countryBorders.geo.json"));
    fclose($myfile);

	$decode = json_decode($result,true);

	$features = $decode['features'];

    $currentCountryCode = $_REQUEST['currentCountryCode'];
    $countryBordersArray = [];

	foreach ($features as $country) {
        if ($currentCountryCode == $country['properties']['iso_a2']) {

            $countryBorders = $country['geometry']['coordinates'];

            // Reverses the long/lat order, because leaflet uses lat/long
            if ($country['geometry']['type'] == 'Polygon') {
            
                foreach ($countryBorders as &$landMass) {

                    foreach ($landMass as &$lnglat) {

                        $lng = $lnglat[0];
                        $lat = $lnglat[1];
                        
                        $lnglat[0] = $lat;
                        $lnglat[1] = $lng;

                    }
                }
            } else if ($country['geometry']['type'] == 'MultiPolygon') {

                foreach ($countryBorders as &$landMass) {

                    foreach ($landMass as &$coordinateList) {

                        foreach ($coordinateList as &$lnglat) {


                            $lng = $lnglat[0];
                            $lat = $lnglat[1];
                            
                            $lnglat[0] = $lat;
                            $lnglat[1] = $lng;
                        
                        }
                    }
                }
            }

            array_push($countryBordersArray, $countryBorders);
        }
	}


	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $countryBordersArray;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>