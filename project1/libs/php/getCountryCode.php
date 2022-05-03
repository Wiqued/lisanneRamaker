<?php

    // We have a country name, send it here and ask what the county code is, send that back

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $myfile = fopen("../json/countryBorders.geo.json", "r") or die("Unable to open file!");
    $result = fread($myfile,filesize("../json/countryBorders.geo.json"));
    fclose($myfile);

	$decode = json_decode($result,true);

	$features = $decode['features'];

    $currentCountry = $_REQUEST['currentCountry'];
    $countryCode = "";


	foreach ($features as $country) {
        if ($currentCountry == $country['properties']['name']) {

            $countryCode = $country['properties']['iso_a2'];
        }
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $countryCode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>