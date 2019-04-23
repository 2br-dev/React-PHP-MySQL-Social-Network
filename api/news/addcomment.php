<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
include_once '../../define.php';
include_once '../config/database.php';
include_once '../../verify.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');

$database = new Database();
$db = $database->getConnection();
 
$news_id      = __post('news_id');
$who          = __post('who');
$date         = __post('date');
$visible      = __post('visible');
$time         = __post('time');
$text         = __post('text');
$author_id    = __post('author_id');
$created_at    = __post('created_at');
$count = Q("SELECT `comments` FROM `#_mdd_news` WHERE `id`=?s",array($news_id))->row('comments') + 1;
   
// update the comments
if(isset($news_id) && isset($who) && isset($text)) {

    O('_mdd_comments')->create(array(
      'news_id' => $news_id,
      'who' => $who,
      'date' => $date,
      'visible' => $visible,
      'time' => $time,
      'text' => $text,
      'author_id' => $author_id,
      'created_at' => $created_at
    ));	

    $sql = "UPDATE `db_mdd_news` SET `comments`='$count' WHERE `id`='$news_id'";
    $db->query($sql);

    // set response code - 200 ok
    http_response_code(200);
    // tell the user
    echo json_encode(array("message" => "Comment was added.", "result" => 1));
}
 
// if unable to update the user, tell the user
else{
    // set response code - 503 service unavailable
    http_response_code(503);
    // tell the user
    echo json_encode(array("message" => "Unable to commit comment.", "result" => 0));
}
?>