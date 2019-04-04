<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
include_once '../../define.php';
include_once '../../verify.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');

$message_id = Q("SELECT `id` FROM `#_mdd_messages` ORDER BY `id` DESC LIMIT 1")->row('id');

echo json_encode(array('message_id' => $message_id));