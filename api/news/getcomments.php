<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/news.php';
 
// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$news = new News($db);
 
// query news
$stmt = $news->readComments();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
    $comments_arr=array();
    $comments_arr["records"]=array();
 
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
 
        $comments=array(
            "id"          => $id,
            "news_id"     => $news_id,
            "who"         => $who,
            "text"        => $text,
        );
 
        array_push($comments_arr["records"], $comments);
    }
    http_response_code(200);
 
    // show news data in json format
    echo json_encode($comments_arr);
}
 else
{
  // set response code - 404 Not found
  http_response_code(404);

  // tell the user no news found
  echo json_encode(
      array("message" => "No news found.")
  );
}