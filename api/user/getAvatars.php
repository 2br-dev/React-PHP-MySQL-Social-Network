<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
include_once '../config/database.php';

// get database connection
$database = new Database();
$db = $database->getConnection();
 
$likedBy = explode(',', __post('likedBy'));

$avatars = array();
foreach ($likedBy as $id) {
  if($id != '') {
    $avatar = Q("SELECT `avatar` FROM `#_mdd_users` WHERE `id` = ?s", array($id))->row('avatar');
    $name = Q("SELECT `name` FROM `#_mdd_users` WHERE `id` = ?s", array($id))->row('name');
    $surname = Q("SELECT `surname` FROM `#_mdd_users` WHERE `id` = ?s", array($id))->row('surname');
    array_push($avatars, array('avatar' => $avatar, 'id' => $id, 'name' => $name, 'surname' => $surname));
  }
}

echo json_encode($avatars);
 
?>