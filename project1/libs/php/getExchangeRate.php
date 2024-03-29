<?php

    // We have a currency. We send it here and ask what its value is, and send it back

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$app_id = 'API_KEY';
    $oxr_url = "https://openexchangerates.org/api/latest.json?app_id=" . $app_id;

	$ch = curl_init($oxr_url);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $json = curl_exec($ch);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);
    $rates = $decode['rates'];
	$oxr_latest = json_decode($json);

    $currentCurrency = $_REQUEST['currentCurrency'];
    $currencyValue = "";

    // If the current currency is in the result.rates list, return that value

	$currencyValue = $rates[$currentCurrency];

    

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $currencyValue;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>