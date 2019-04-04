<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/database.php';
// instantiate product object
include_once '../objects/chat.php';
include_once '../../verify.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');

$database = new Database();
$db = $database->getConnection();

$chat = new Chat($db);
 
$chat->users     = __post('users');
$chat->last_msg  = __post('last_msg');
 
if($chat->addChat()){
  // set response code - 201 created
  http_response_code(201);
  // tell the user
  
}
else {
  // set response code - 503 service unavailable
  http_response_code(503);
  // tell the user
  echo json_encode(array("message" => "Unable to create Chat."));
}
