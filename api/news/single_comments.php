<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/news.php';
include_once '../../verify.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');

// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare product object
$news = new News($db);
 
// set ID property of record to read
$news->id = isset($_GET['id']) ? $_GET['id'] : die();
 
if(isset($news->id)){
    
  $comments = Q("SELECT * FROM `#_mdd_comments` WHERE `news_id`=?s ORDER BY `id` DESC", array($_GET['id']))->all();

  for ($i = 0; $i < count($comments); $i++) {
    $user_data = Q("SELECT `avatar`, `name`, `surname` FROM `#_mdd_users` WHERE `id` = ?s", array($comments[$i]['author_id']))->row();
    $comments[$i]['who'] = $user_data['name'] . " " . $user_data['surname'];
    $comments[$i]['avatar'] = $user_data['avatar'];
  }

  echo json_encode($comments);
}
 
else{
    // set response code - 404 Not found
    http_response_code(404);

    // tell the user product does not exist
    echo json_encode(array("message" => "Comments does not exist.", "error" => 1));
}
?>