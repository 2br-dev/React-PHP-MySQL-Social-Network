<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/news.php';
include_once '../../verify.php';
require_once '../../vendor/autoload.php';
if (!verify()) header('location:/login');

$database = new Database();
$db = $database->getConnection();

$news = new News($db);

$news->author = __post('author');
$news->author_id = __post('author_id');
$news->text = __post('text');
$news->title = __post('title');
$news->date = __post('date');
$news->created_at = __post('created_at');
$news->importance = __post('importance');
$news->news_image = __post('newsImage');

if ($news->submitNews()){
  $news->id = Q("SELECT MAX(`id`) FROM `#_mdd_news` LIMIT 1")->row();
  http_response_code(201);
  echo json_encode($news->id);
} else {
  http_response_code(503);
  echo json_encode(array("message" => "Unable to create news."));
}
