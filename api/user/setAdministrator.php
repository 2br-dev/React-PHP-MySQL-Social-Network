<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/database.php';
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

$id = __post('id');
$stmt = $user->setAdministrator($id);

if ($stmt) {
    http_response_code(200);
    echo json_encode(
      array("message" => "Succesfully set as administrator.")
  );
} else {
    echo json_encode(
        array("message" => "Succesfully unset administrator.")
    );
}

