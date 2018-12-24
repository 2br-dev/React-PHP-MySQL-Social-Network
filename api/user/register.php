<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/database.php';
include_once '../../define.php'; 
// instantiate product object
include_once '../objects/user.php';
 
$database = new Database();
$db = $database->getConnection();
 
$user = new User($db);
 
// get posted data
$data = json_decode(file_get_contents("php://input"));

$login 		  = __post('login');
$password 	= __post('password');
$email 			= filter_var(__post('email'), FILTER_VALIDATE_EMAIL);
$username   = __post('username');
$phone			= __post('phone');

if (isset($username) && isset($login) && isset($phone) && isset($email) && isset($login)) {
  
  $result = Q("INSERT INTO `#_mdd_users` SET `login`=?s, `password`=?s, `email`=?s, `username`=?s, `phone`=?s, `admin`=?i, `created`=NOW()", 
    array($login, md5( $password ), $email, $username, $phone, 0));

  $current = Q("SELECT MAX(`id`) FROM `#_mdd_users`")->row(`id`);

  foreach($current as $value) {
    $id = $value;
  }

  echo json_encode( array( 'result' => 1, 'user_id' => intval($id) ), 64 | 256 );
} else {
  echo json_encode( array( 'result' => 0 ), 64 | 256 );
}

?>