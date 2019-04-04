<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../define.php';
include_once '../config/database.php';
include_once '../objects/news.php';
include_once '../../verify.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');

$database = new Database();
$db = $database->getConnection();

$news = new News($db);

$news->id = __post('id');
$news->news_id = __post('news_id');

if ($news->deleteComment()) {

  // пересчитываем комментарии
  $news->countComments();

  http_response_code(200);
  echo json_encode(array("message" => "Comment was deleted.", "result" => 1));
} else {
  http_response_code(503);
  echo json_encode(array("message" => "Unable to delete comment.", "result" => 0));
}
 