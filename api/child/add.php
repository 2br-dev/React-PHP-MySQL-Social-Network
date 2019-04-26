<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/child.php';
include_once '../../verify.php';
require_once '../../vendor/autoload.php';
if (!verify()) header('location:/login');

$database = new Database();
$db = $database->getConnection();

$child = new Child($db);


$data = json_decode(file_get_contents("php://input"));

$child->parent = parseUserId();
$child->name   = __post('child_name');
$child->year   = __post('child_birthyear');

if ($child->addChild()) {
  $child_id = Q("SELECT MAX(`id`) FROM `#_mdd_childrens`")->row();
  http_response_code(201);
  echo json_encode($child_id);
} else {
  http_response_code(503);
  echo json_encode(array("message" => "Unable to add child."));
}
