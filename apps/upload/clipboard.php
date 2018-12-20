<?php

$dir = dirname(dirname(__DIR__));

$contentType = $_POST['contentType'];
$data = base64_decode($_POST['data']);

$filename = '/upload_dir/' . md5(date('YmdHis').uniqid()) . '.jpg';
$file = $dir . $filename;

file_put_contents($file, $data);

$array = [
    'url' => $filename
];

echo stripslashes(json_encode($array));