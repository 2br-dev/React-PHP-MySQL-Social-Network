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
$test->user_id = isset($_GET['byid']) ? parseUserId() : null;

if (!isset($test->user_id)) {
  $stmt = $test->read();
} else {
  $test->completed = 1;
  $stmt = $test->readById();
}

$num = $stmt->rowCount();

if ($num > 0) {
  $test_arr = array();
  $test_arr["data"] = array();

  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    extract($row);

    $user_info = Q("SELECT `name`, `surname`, `position` FROM `#_mdd_users` WHERE `id` = ?s ORDER BY `id` DESC", array($user_id))->row();
    $user_name =  $user_info['name'] . ' ' . $user_info['surname'];
    $position = $user_info['position'];

    $test_item = array(
      "id"            => $id,
      "time"          => $time,
      "date"          => $date,
      "user_id"       => $user_id,
      "user_name"     => $user_name,
      "time"          => $time,
      "position"      => $position,
      "estimated_time" => $estimated_time,
      "result"        => $result,
      "completed"     => $completed,
      "questions"     => $questions
    );

    array_push($test_arr["data"], $test_item);
  }

  http_response_code(200);
  echo json_encode($test_arr);
} else {
  echo json_encode(array("data" => array()));
}
 