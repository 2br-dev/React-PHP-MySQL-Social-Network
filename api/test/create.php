<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
include_once '../config/database.php';
include_once '../objects/test.php';
include_once '../objects/user.php';
include_once '../../verify.php'; 
include_once '../../setActivity.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');
// get database connection
$database = new Database();
$db = $database->getConnection();
// initialize object
$user = new User($db);
if (setActivity()) {
  $user->id = setActivity();
  $user->last_activity = round(microtime(true) * 1000);
  $user->set_activity();
}

/*
** BODY
*/
$test = new Test($db);
$test->questions = __post('questions');
$test->user_name = __post('user_name');
$test->user_id   = __post('user_id');
$test->date      = __post('date');
$test->time      = __post('time');
$test->estimated_time = __post('time') . ':00';

$stmt = $test->create();

if ($stmt) {
  echo json_encode(array("Success" => "Test was succesfully created."));
} else {
  echo json_encode(array("Error" => "Test was not created."));
}
 