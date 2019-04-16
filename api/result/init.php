<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
include_once '../config/database.php';
include_once '../objects/result.php';
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
$alreadyInitialized = Q("SELECT * FROM `#_mdd_results` WHERE `test_id` = ?s", array(__post('test_id')))->all();

if (count($alreadyInitialized) == 0) {
  $result = new Result($db);
  $result->user_id = __post('user_id');
  $result->test_id = __post('test_id');
  $result->user_name = __post('user_name');
  $result->estimated_time = __post('estimated_time');
  $result->date = __post('date');
  $stmt = $result->init();

  if ($stmt) {
    echo json_encode(array("Success" => "Results was succesfully initialized."));
  } else {
    echo json_encode(array("Error" => "Results wasn`t initialized."));
  }
} else {
  echo json_encode(array("Error" => "Already initialized."));
}


 