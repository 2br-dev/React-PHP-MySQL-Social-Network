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
$calendar->creator = __post('creator');
$calendar->endDate = __post('endDate');
$calendar->startDate = __post('startDate');
$calendar->title = __post('title');

$calendar->max = __post('max') != null ? __post('max') : '';
$calendar->interval = __post('interval') != null ? __post('interval') : '';


$stmt = $calendar->addEvent();

if ($stmt) {
  echo json_encode(array("success" => "Event was succesfully created.", "id" => $calendar->id));
} else {
  echo json_encode(array("error" => "Event wasn`t created."));
}
 