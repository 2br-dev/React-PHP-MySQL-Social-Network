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
include_once '../../verify.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');

// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare user object
$news = new News($db);
 
$current_stats= Q("SELECT `likes`, `liked_by` FROM `#_mdd_news` WHERE `id` = ?s", array(__post('id')))->row(); 
// set user property values
$news->id        = __post('id');
$news->likes     = $current_stats['likes'] - 1;
$news->liked_by  = str_replace(', ' . __post('liked_by'),"", $current_stats['liked_by']);
$liked_by = __post('liked_by');

// update the user
if($news->removeLike($liked_by)){
    // set response code - 200 ok
    http_response_code(200);
    // tell the user
    echo json_encode(array("message" => "Like was removed.", "result" => 1));
}
 
// if unable to update the user, tell the user
else{
    // set response code - 503 service unavailable
    http_response_code(503);
    // tell the user
    echo json_encode(array("message" => "Unable to remove like.", "result" => 0));
}
?>