<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object files
include_once '../../define.php';
include_once '../config/database.php';
include_once '../objects/user.php';
include_once '../../verify.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');

// get database connection
$database = new Database();
$db = $database->getConnection();

// prepare user object
$user = new User($db);

// get id of user to be edited
$data = json_decode(file_get_contents("php://input"));

// set user property values
$user->id           = __post('id');
$user->adress       = __post('adress');
$user->army_country = __post('army_country');
$user->army_type    = __post('army_type');
$user->birthday     = __post('birthday');
$user->district     = __post('district');
$user->fakultet     = __post('fakultet');
$user->name         = __post('name');
$user->phone        = __post('phone');
$user->position     = __post('position');
$user->status       = __post('status');
$user->surname      = __post('surname');
$user->vuz          = __post('vuz');
$user->city         = __post('city');
$user->sex          = __post('sex');

// update the user
if ($user->update()) {
    http_response_code(200);
    // tell the user
    echo json_encode(array("message" => "User was updated.", "result" => 1));
}

// if unable to update the user, tell the user
else {
    http_response_code(503);
    // tell the user
    echo json_encode(array("message" => "Unable to update user.", "result" => 0));
}
