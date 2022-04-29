<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url='https://world-population.p.rapidapi.com/population?country_name=' . $_REQUEST['country'];
	$url = str_replace(' ', '%20', $url);

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	curl_setopt($ch, CURLOPT_HTTPHEADER, array(
		"X-RapidAPI-Host: world-population.p.rapidapi.com",
		"X-RapidAPI-Key: d1f9e689d2mshb30327b41ae892fp1621bfjsn7abde6eeeb2f"
	));

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>