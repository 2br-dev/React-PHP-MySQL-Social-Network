<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/user.php';
include_once '../../verify.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');

// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare product object
$user = new User($db);
 
// set ID property of record to read
$user->id = isset($_GET['id']) ? $_GET['id'] : die();
 
// read the details of product to be edited
$user->readPersonal();
 
if($user->id!=null){
    // create array
    $user_arr = array(
        "id"          => $user->id,
        "position"    => $user->position,
        "name"        => $user->name,
        "surname"     => $user->surname,
        "avatar"      => $user->avatar,
        "background"  => $user->background,
        "phone"       => $user->phone,
        "birthday"    => $user->birthday,
        "status"      => $user->status,
        "city"        => $user->city,
        "district"    => $user->district,
        "adress"      => $user->adress,
        "fakultet"    => $user->fakultet,
        "vuz"         => $user->vuz,
        "army_country"=> $user->army_country,
        "army_type"   => $user->army_type,
        "sex"         => $user->sex,
        "childs"      => $user->childs,
    );

    // set response code - 200 OK
    http_response_code(200);
 
    // make it json format
    echo json_encode($user_arr);
}

else{
    // set response code - 404 Not found
    http_response_code(404);
 
    // tell the user product does not exist
    echo json_encode(array("message" => "User does not exist."));
}
?> 