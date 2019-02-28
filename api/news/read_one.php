<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/news.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare product object
$news = new News($db);

// set ID property of record to read
$news->id = isset($_GET['id']) ? $_GET['id'] : die();

// read the details of product to be edited
$news->readOne();
 
if (isset($news->id)) {
    // create array
    $array = Q("SELECT * FROM `#_mdd_news` WHERE `id` = ?s", array($news->id))->row();
 /*    $news_arr = array(
        "id"         => $news->id,
        "who"         => $news->who,
        "text"        => $news->text,
    );
 */
    // set response code - 200 OK
    http_response_code(200);
    // make it json format
    echo json_encode($array);
}
else {
    // tell the user product does not exist
    echo json_encode(array("message" => "news does not exist.", "error" => 1));
}
?>