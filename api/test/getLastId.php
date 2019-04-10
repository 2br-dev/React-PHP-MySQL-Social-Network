<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: *");
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
$stmt = $test->getLastId();

if ($stmt) {
  echo json_encode($stmt);
} else {
  echo json_encode(array("data" => "No tests."));
}
 