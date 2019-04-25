<?php
 // required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object file
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
// set product id to be deleted
$news->id = __post('id');

// delete the news
if ($news->delete()) {

    // delete comments & likes by news_id
    $news->deleteComments();
    $news->deleteLikes();

    // set response code - 200 ok
    http_response_code(200);

    // tell the news
    echo json_encode(array("message" => "News was deleted."));
}

// if unable to delete the news
else {

    // set response code - 503 service unavailable
    http_response_code(503);

    // tell the user
    echo json_encode(array("message" => "Unable to delete news."));
}
 