<?php
    // Fill an array of polygons with currentCountry borders

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $myfile = fopen("../json/countryBorders.geo.json", "r") or die("Unable to open file!");
    $result = fread($myfile,filesize("../json/countryBorders.geo.json"));
    fclose($myfile);

	$decode = json_decode($result,true);

    $currentCountryCode = $_REQUEST['currentCountryCode'];
	$features = $decode['features'];

	foreach ($features as $country) {
        if ($currentCountryCode == $country['properties']['iso_a2']) {

            break;

        }
	}


	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $country;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>