<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/user.php';
 
// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$user = new User($db);
 
// query products
$stmt = $user->read();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
    $users_arr=array();
    $users_arr["data"]=array();
 
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
 
        $user_item=array(
            "id"      => $id,
            "login"   => $login,
            "name"    => $name,
            "surname" => $surname,
            "position" => $position,
            "avatar" => $avatar
        );
 
        array_push($users_arr["data"], $user_item);
    }
    http_response_code(200);
 
    // show products data in json format
    echo json_encode($users_arr);
}
 else
{
  // set response code - 404 Not found
  http_response_code(404);

  // tell the user no products found
  echo json_encode(
      array("message" => "No users found.")
  );

  header('location:/404');
}