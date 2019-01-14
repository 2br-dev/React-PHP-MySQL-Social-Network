<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object files
include_once '../../define.php';
include_once '../config/database.php';
include_once '../objects/news.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare user object
$news = new News($db);
 
$current_stats= Q("SELECT `likes`, `liked_by` FROM `#_mdd_news` WHERE `id` = ?s", array(__post('id')))->row(); 
// set user property values
$news->id        = __post('id');
$news->likes     = $current_stats['likes'] + 1;
$news->liked_by  = $current_stats['liked_by'] . ", " . __post('liked_by');

// update the user
if($news->addLike()){
    // set response code - 200 ok
    http_response_code(200);
    // tell the user
    echo json_encode(array("message" => "Like was added.", "result" => 1));
}
 
// if unable to update the user, tell the user
else{
    // set response code - 503 service unavailable
    http_response_code(503);
    // tell the user
    echo json_encode(array("message" => "Unable to commit like.", "result" => 0));
}
?>