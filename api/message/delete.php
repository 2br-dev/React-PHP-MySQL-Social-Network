<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/message.php';

$database = new Database();
$db = $database->getConnection();
$message = new Message($db);

// set product id to be deleted
$message->id = __post('id');

// delete the task
if ($message->delete()) {
  http_response_code(200);
  // tell the user
  echo json_encode(array("message" => "Message was deleted."));
} else {
  http_response_code(503);
  // tell the user
  echo json_encode(array("message" => "Unable to delete message."));
}
 