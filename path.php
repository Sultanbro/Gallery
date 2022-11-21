<?php
$dir = 'img/';
$request = $_GET;
$files = array_slice(scandir($dir), 2);
$yers = [];

if(array_key_exists('event', $request)) {
    $event = $request['event'];
}else {
    echo json_encode(['message' => 'not event']);
    die;
}

foreach ($files as $fileName) {
    $dirYer = $dir . $fileName;
    $events = array_slice(scandir($dirYer), 2);
    if(in_array($request['event'], $events)) {
        $yers[] = $fileName;
    }
    if(!isset($yers[0])) {
        echo json_encode(['message' => 'not years']);
        die;
    }
}

$yer = array_key_exists('yer', $request) ? $request['yer'] : max($yers);

$imagesDir = $dir . $yer . '/' . $event . '/' ;
$images = glob($imagesDir."*{jpg,gif,png}", GLOB_BRACE);

$allFilesName  = [
    'event' => $event,
    'url' => $images,
    'yer' => $yer,
    'yers' => $yers];



if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

echo json_encode($allFilesName);
?>