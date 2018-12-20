<?php

$dir = dirname(dirname(__DIR__));

$_FILES['file']['type'] = strtolower($_FILES['file']['type']);

if(in_array( $_FILES['file']['type'], ['image/png', 'image/jpg', 'image/gif', 'image/jpeg', 'image/pjpeg']))
{
	$ext = explode('.', $_FILES['file']['name']);
	$ext = end($ext);

    $file = '/upload_dir/' . md5(date('YmdHis').uniqid()) . '.' . $ext;

    // copying
    move_uploaded_file($_FILES['file']['tmp_name'], $dir . $file);

    // displaying file
    $response = [
        'url' => $file
    ];

    echo stripslashes(json_encode($response));
}