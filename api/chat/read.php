<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/chat.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// prepare product object
$chat = new Chat($db);

$chat->users = __post('user_id');
// read the details of product to be edited
$stmt = $chat->read();
$num = $stmt->rowCount();

if ($num > 0) {
  $chat_arr = array();
  $chat_arr["chats"] = array();

  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    extract($row);

    $chat_item = array(
      "id"            => $id,
      "users"         => $users,
      "last_msg"      => $last_msg
    );

    array_push($chat_arr["chats"], $chat_item);
  }

  http_response_code(200);

  // make it json format
  echo json_encode($chat_arr);
} else {

  // tell the user product does not exist
  echo json_encode(array('noChats' => 1));
}
 