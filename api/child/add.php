<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/database.php';
 
// instantiate product object
include_once '../objects/child.php';
 
$database = new Database();
$db = $database->getConnection();
 
$child = new Child($db);
 
// get posted data
$data = json_decode(file_get_contents("php://input"));
 
// set product property values
$child->parent = __post('parent');
$child->name   = __post('name');
$child->year   = __post('year');
 
if($child->addChild()){
  // set response code - 201 created
  http_response_code(201);
  // tell the user
  echo json_encode(array("message" => "Child was added."));
}
else {
  // set response code - 503 service unavailable
  http_response_code(503);
  // tell the user
  echo json_encode(array("message" => "Unable to add child."));
}
?>