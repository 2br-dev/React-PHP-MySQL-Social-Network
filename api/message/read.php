<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/message.php';
include_once '../../verify.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');

// get database connection
$database = new Database();
$db = $database->getConnection();

// prepare product object
$message = new Message($db);

$message->chat = __post('chat');
// read the details of product to be edited
$stmt = $message->readByChat();
$num = $stmt->rowCount();

if ($num > 0) {
  $msg_arr = array();
  $msg_arr["messages"] = array();

  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    extract($row);

    $msg_item = array(
      "id"         => $id,
      "user"       => $user,
      "date"       => $date,
      "body"       => $body,
      "time"       => $time,
      "readed"     => $readed,
      "edited"     => $edited
    );

    array_push($msg_arr["messages"], $msg_item);
  }

  http_response_code(200);

  // make it json format
  echo json_encode($msg_arr);
} else {

  // tell the user product does not exist
  echo json_encode(array('noMessages' => 1));
}
 