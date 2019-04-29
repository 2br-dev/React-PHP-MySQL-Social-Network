<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/message.php';
include_once '../../verify.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');

$database = new Database();
$db = $database->getConnection();

$message = new Message($db);
 
$message->chat = __post('chat_id');
$message->user = parseUserId();

$stmt = $message->read_messages();

if ($stmt) {
  http_response_code(201);
  echo json_encode(array("message" => "messages was readed"));
}
else {
  http_response_code(503);
  echo json_encode(array("message" => "error reading chat"));
}
