<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
include_once '../config/database.php';
include_once '../objects/calendar.php';
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
$calendar = new Calendar($db);
$data = $calendar->read();

if (count($data) > 0) {
  echo json_encode($data);
} else {
  echo json_encode(array("error" => "No events found."));
}
 