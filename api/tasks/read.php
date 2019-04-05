<?php
 // required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// include database and object files
include_once '../config/database.php';
include_once '../objects/task.php';
include_once '../objects/user.php';
include_once '../../verify.php'; 
include_once '../../setActivity.php'; 
require_once '../../vendor/autoload.php';

if(!verify()) header('location:/login');

// get database connection
$database = new Database();
$db = $database->getConnection();

if (setActivity()) {
  $user = new User($db);
  $user->id = setActivity();
  $user->last_activity = round(microtime(true) * 1000);
  $user->set_activity();
}

// prepare product object
$task = new Task($db);
// set ID property of record to read
$task->id = isset($_GET['id']) ? $_GET['id'] : die();

// read the details of product to be edited
$stmt = $task->read();
$num = $stmt->rowCount();

if ($num > 0) {
  $task_arr = array();
  $task_arr["data"] = array();

  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    extract($row);

    $task_item = array(
      "for"           => $for,
      "id"            => $id,
      "from"          => $from,
      "date"          => $date,
      "time"          => $time,
      "text"          => $text,
      "until_date"    => $until_date,
      "until_time"    => $until_time,
      "importance"    => $importance,
      "status"        => $status,
      "readed"        => $readed
    );

    array_push($task_arr["data"], $task_item);
  }

  http_response_code(200);

  // make it json format
  echo json_encode($task_arr);
} else {

  // tell the user product does not exist
  echo json_encode(array("message" => "No tasks."));
}
 