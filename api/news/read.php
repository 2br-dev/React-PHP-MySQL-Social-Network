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
$stmt = $news->read();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
    $news_arr=array();
    $news_arr["records"]=array();
 
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
 
        $news_item=array(
            "id"          => $id,
            "author"      => $author,
            "title"       => $title,
            "text"        => $text,
            "date"        => $date,
            "importance"  => $importance,
            'likes'       => $likes,
            'liked_by'    => $liked_by
        );
 
        array_push($news_arr["records"], $news_item);
    }
    http_response_code(200);
 
    // show news data in json format
    echo json_encode($news_arr);
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