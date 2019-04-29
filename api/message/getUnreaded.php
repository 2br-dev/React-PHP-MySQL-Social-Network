<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/message.php';
include_once '../../verify.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');

$database = new Database();
$db = $database->getConnection();

$message = new Message($db);
$message->user = 'id' . parseUserId();

$userChats = Q("SELECT `id` FROM db_mdd_chats WHERE users LIKE '%$message->user%'")->all();

if (count($userChats > 0)) {
  $unreaded = array(
    'new' => 0
  );
  $messages = array();

  foreach ($userChats as $chat) {
    $new = Q("SELECT M.id, M.user, U.name, U.surname FROM db_mdd_messages M 
      LEFT JOIN db_mdd_users U ON M.user = U.id 
      WHERE M.chat = ?s 
      AND M.readed = ?s 
      AND M.user != ?s", 
      array($chat['id'], '0', parseUserId()))->all();

    if (count($new) > 0) {
      $chatUnreaded = array('chat_id' => $chat['id'], 'unreaded' => count($new));
      $unreaded['new'] += count($new);
      array_push($unreaded, $chatUnreaded);

      foreach ($new as $message) {
        $message['type'] = 'messages';
        array_push($messages, $message);
      }
    }
  }

} else {
  echo [];
}

echo json_encode(array('unreaded' => $unreaded, 'messages' => $messages));