<?php

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: *");
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
 
$pass				= md5(__post('password'));
$user_code  = __post('auth');
$servername = DB_HOST;
$username 	= DB_USER;
$password 	= DB_PASS;
$dbname 		= DB_BASE;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
} 

$query = "UPDATE `db_mdd_users` SET `password` = '$pass' WHERE `code` = '$user_code'"; 
$stmt = $conn->prepare($query); 

if($stmt->execute()) {
  echo json_encode( array( 'result' => 1 ), 64 | 256 );
} else {
  echo json_encode( array( 'result' => 0 ), 64 | 256 );
}

$conn->close();

?>