<?php
$settings = array();

$settings['baseUrl'] = 'http://chat.website.com/';
$settings['nodeUrl'] = "http://chat-1east.website.com/";
	
$settings['sessionTimeout'] = 60*60*5;
$settings['nodeJSPath'] = './../BabelChat/';

return (object)$settings;
