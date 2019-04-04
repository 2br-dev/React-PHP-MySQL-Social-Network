<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/database.php';
include_once '../../verify.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');

// instantiate product object
include_once '../objects/task.php';
 
$database = new Database();
$db = $database->getConnection();

$task = new Task($db);
 
$task->from = __post('from');
$task->date = __post('date');
$task->for = __post('for');
$task->time = __post('time');
$task->until_date   = __post('until_date');
$task->text   = __post('text');
$task->until_time = __post('until_time');
$task->importance   = __post('importance');
$task->status   = 0;
 
if($task->addTask()){
  // set response code - 201 created
  http_response_code(201);
  // tell the user
  echo json_encode(array("message" => "Task was added."));
}
else {
  // set response code - 503 service unavailable
  http_response_code(503);
  // tell the user
  echo json_encode(array("message" => "Unable to add task."));
}
