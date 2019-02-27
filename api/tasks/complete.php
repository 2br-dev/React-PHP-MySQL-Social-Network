<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/task.php';

$database = new Database();
$db = $database->getConnection();
$task = new Task($db);

// set product id to be deleted
$task->id        = __post('id');
$task->done_time = __post('done_time');
$task->done_date = __post('done_date');
$task->status = '1';

// complete the task
if ($task->complete()) {

  http_response_code(200);
  echo json_encode(array("message" => "Task was completed."));
} else {

  http_response_code(503);
  echo json_encode(array("message" => "Unable to complete task."));
}
 