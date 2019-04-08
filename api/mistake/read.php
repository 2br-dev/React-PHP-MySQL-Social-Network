<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
include_once '../config/database.php';
include_once '../objects/mistake.php';
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
$mistake = new Mistake($db);

$stmt = $mistake->read();
$num = $stmt->rowCount();

if ($num > 0) {
  $mistake_arr = array();
  $mistake_arr["data"] = array();

  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    extract($row);

    $mistake_item = array(
      "test"          => $test,
      "count"         => $count,
      "desc"          => $desc,
    );

    array_push($mistake_arr["data"], $mistake_item);
  }

  http_response_code(200);
  echo json_encode($mistake_arr);
} else {
  echo json_encode(array("mistake" => "No mistakes."));
}
 