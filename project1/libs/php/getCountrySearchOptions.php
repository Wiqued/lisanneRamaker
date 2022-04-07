<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $myfile = fopen("../json/countryBorders.geo.json", "r") or die("Unable to open file!");
    $result = fread($myfile,filesize("../json/countryBorders.geo.json"));
    fclose($myfile);

	$decode = json_decode($result,true);

	$features = $decode['features'];

	$countries = [];

	foreach ($features as $country) {
		$countryName = $country['properties']['name'];
		array_push($countries, $countryName);
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $countries;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>