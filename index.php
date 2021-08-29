<?php
// This file is only accessed in a 'live' environment
// in order to force all requests through a single file

$detectedURL = $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$detectedURL = explode("/ample", $detectedURL);
$detectedURL = "='//" . $detectedURL[0] . "/ample/public/";

$indexPage = file_get_contents('../ample/public/index.html');
$indexPage = str_replace("='/", $detectedURL, $indexPage);

echo $indexPage;

return;