<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/database.php';
 
// instantiate news object
include_once '../objects/news.php';
include_once '../../verify.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');

$database = new Database();
$db = $database->getConnection();
 
$news = new News($db);

// set news property values
$news->author = __post('author');
$news->author_id = __post('author_id');
$news->text = __post('text');
$news->title = __post('title');
$news->date = __post('date');
$news->created_at = __post('created_at');
$news->importance = __post('importance');

// create the news
if($news->submitNews()){
    // set response code - 201 created
    http_response_code(201);
    // tell the user
    echo json_encode(array("message" => "news was added."));
  }
  // if unable to create the prodnewsuct, tell the user
  else{
  // set response code - 503 service unavailable
  http_response_code(503);
  // tell the user
  echo json_encode(array("message" => "Unable to create news."));
}
