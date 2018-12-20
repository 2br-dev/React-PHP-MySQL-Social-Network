<?php

$dir = '/upload_dir/';
 
$_FILES['file']['type'] = strtolower($_FILES['file']['type']);
 
if( in_array( $_FILES['file']['type'], array( 'image/png', 'image/jpg', 'image/gif', 'image/jpeg', 'image/pjpeg' ) ) )
{
	$file = $dir . md5(date('YmdHis')) . '.jpg';
 
	copy($_FILES['file']['tmp_name'], $_SERVER['DOCUMENT_ROOT'].$file);

	echo '<img src="'. $file .'" />';
}