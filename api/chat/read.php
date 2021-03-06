<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/chat.php';
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

// prepare product object
$chat = new Chat($db);

$chat->users = parseUserId();
// read the details of product to be edited
$stmt = $chat->read();
$num = $stmt->rowCount();

if ($num > 0) {
  $chat_arr = array();
  $chat_arr["chats"] = array();

  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    extract($row);

    $message = Q("SELECT * FROM `#_mdd_messages` WHERE `id` = ?s", array($last_msg))->row();

    $chat_item = array(
      "id"            => $id,
      "users"         => $users,
      "message"       => $message
    );

    array_push($chat_arr["chats"], $chat_item);
  }

  http_response_code(200);
  echo json_encode(array($chat_arr, 'user_id' => $chat->users));
} else {
  echo json_encode(array([], 'user_id' => $chat->users));
}
 