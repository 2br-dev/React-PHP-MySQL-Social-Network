<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/task.php';
include_once '../../verify.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');

$database = new Database();
$db = $database->getConnection();
$task = new Task($db);

// set product id to be deleted
$task->id = __post('id');

// delete the task
if ($task->delete()) {
  http_response_code(200);
  // tell the user
  echo json_encode(array("message" => "Task was deleted."));
} else {
  http_response_code(503);
  // tell the user
  echo json_encode(array("message" => "Unable to delete produtaskct."));
}
 