<?php
// required headers
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
if (!verify()) header('location:/login');

$database = new Database();
$db = $database->getConnection();

$news = new News($db);
$current_stats = Q("SELECT `likes`, `liked_by` FROM `#_mdd_news` WHERE `id` = ?s", array(__post('id')))->row();
$news->id        = __post('id');
$news->likes     = $current_stats['likes'] + 1;
$news->liked_by  = $current_stats['liked_by'] . ", " . __post('liked_by');

$user          = __post('liked_by');
$created_at    = __post('created_at');

O('_mdd_likes')->create(array(
    'news_id' => $news->id,
    'user' => $user,
    'created_at' => $created_at
));

if ($news->addLike()) {
    http_response_code(200);
    echo json_encode(array("message" => "Like was added.", "result" => 1));
} else {
    http_response_code(503);
    echo json_encode(array("message" => "Unable to commit like.", "result" => 0));
}
