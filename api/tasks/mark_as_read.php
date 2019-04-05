<?php
 // required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// include database and object files
include_once '../config/database.php';
include_once '../objects/task.php';
include_once '../../verify.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');

// get database connection
$database = new Database();
$db = $database->getConnection();

// prepare product object
$task = new Task($db);
$task->id = __post('id');

// delete the task
if ($task->markAsRead()) {
  http_response_code(200);
  // tell the user
  echo json_encode(array("message" => "Task was readed."));
} else {
  http_response_code(503);
  // tell the user
  echo json_encode(array("message" => "Unable to mark task."));
}
 