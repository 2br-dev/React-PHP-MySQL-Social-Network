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
include_once '../objects/message.php';
 
$database = new Database();
$db = $database->getConnection();

$message = new Message($db);
 
$message->chat     = __post('chat');
$message->date     = __post('date');
$message->time     = __post('time');
$message->user     = __post('user');
$message->body     = __post('body');
$message->readed   = 0;
$message->edited   = 0;
 
if($message->sendMessage()){
  // set response code - 201 created
  http_response_code(201);
  // tell the user
  echo json_encode(array("message" => "Message was added."));
}
else {
  // set response code - 503 service unavailable
  http_response_code(503);
  // tell the user
  echo json_encode(array("message" => "Unable to add Message."));
}
