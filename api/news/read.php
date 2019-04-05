<?php
 // required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/database.php';
include_once '../objects/news.php';
include_once '../objects/user.php';
include_once '../../verify.php'; 
include_once '../../setActivity.php'; 
require_once '../../vendor/autoload.php';

if(!verify()) header('location:/login');

// get database connection
$database = new Database();
$db = $database->getConnection();

// initialize object
$user = new User($db);

if (setActivity()) {
  $user->id = setActivity();
  $user->last_activity = round(microtime(true) * 1000);
  $user->set_activity();
}

// initialize object
$news = new News($db);

// query news
$stmt = $news->read();

$num = $stmt->rowCount();
// check if more than 0 record found
if ($num > 0) {
    $news_arr = array();
    $news_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $user_data = Q("SELECT `avatar`, `name`, `surname` FROM `#_mdd_users` WHERE `id` = ?s", array($author_id))->row();
        $author = $user_data['name'] . " " . $user_data['surname'];

        $news_item = array(
            "id"          => $id,
            "author"      => $author,
            'author_id'   => $author_id,
            "title"       => $title,
            "text"        => $text,
            "date"        => $date,
            "importance"  => $importance,
            'likes'       => $likes,
            'liked_by'    => $liked_by,
            'comments'    => $comments,
            'avatar'      => $user_data['avatar']
        );

        array_push($news_arr["records"], $news_item);
    }
    http_response_code(200);

    // show news data in json format
    echo json_encode($news_arr);
} else {

    // tell the user no news found
    echo json_encode(array("message" => "No news found."));
}
