<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../define.php';
include_once '../config/database.php';
include_once '../objects/user.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);
 
$data = json_decode(file_get_contents("php://input"));
 
$user->id           = __post('id');
$user->birthday     = __post('birthday');
$user->name         = __post('name');
$user->position     = __post('position');
$user->surname      = __post('surname');
$user->sex          = __post('sex');

if (__post('avatar') == '') {
    $user->avatar = Q("SELECT `avatar` FROM `#_mdd_users` WHERE `id` = ?s", array(__post('id')))->row('avatar');
} else {
    $user->avatar = __post('avatar');
}


// update the user
if($user->settings()){
    // set response code - 200 ok
    http_response_code(200);
    // tell the user
    echo json_encode(array("message" => "User was updated.", "result" => 1));
}
 
// if unable to update the user, tell the user
else{
    // set response code - 503 service unavailable
    http_response_code(503);
    // tell the user
    echo json_encode(array("message" => "Unable to update user.", "result" => 0));
}
?>