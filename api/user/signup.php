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
$pass				= md5(__post('password'));
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

if (isset($login) && isset($password)) 
{
  if ($result = mysqli_query($conn, "SELECT * FROM `db_mdd_users` WHERE `login` = '$login' AND `password` = '$pass'")) 
  {
    /* определение числа рядов в выборке */
    $row_cnt = mysqli_num_rows($result);

    if ($row_cnt == 0) 
    {
      if ($result = mysqli_query($conn, "SELECT * FROM `db_mdd_users` WHERE `email` = '$login' AND `password` = '$pass'")) 
      {
        $row_cnt = mysqli_num_rows($result);
        
        if ($row_cnt == 0) 
        {
          echo json_encode( array( 'result' => 0 ), 64 | 256 );
        } 
          else
        {
          $is_approved = Q("SELECT `approved` FROM `#_mdd_users` WHERE `login` = '$login' AND `password` = '$pass'",array())->row('approved');
          if ($is_approved == 1) 
          {
            $_SESSION['username'] = $login;
            $user_id = Q("SELECT `id` FROM `#_mdd_users` WHERE `login` = '$login' AND `password` = '$pass'",array())->row('id');
            echo json_encode( array( 'result' => 1, 'user_id' => intval($user_id) ), 64 | 256 );	
          } 
            else 
          {
            echo json_encode( array( 'result' => 0.5 ), 64 | 256 );	
          }
        }
      }			
    } 
      else
    {  
      $is_approved = Q("SELECT `approved` FROM `#_mdd_users` WHERE `login` = '$login' AND `password` = '$pass'",array())->row('approved');
      
      if ($is_approved == 1) 
      {
        $_SESSION['username'] = $login;
        $user_id = Q("SELECT `id` FROM `#_mdd_users` WHERE `login` = '$login' AND `password` = '$pass'",array())->row('id');
        echo json_encode( array( 'result' => 1, 'user_id' => intval($user_id) ), 64 | 256 );	
      } 
        else 
      {
        echo json_encode( array( 'result' => 0.5 ), 64 | 256 );	
      }	 
    }
    /* закрытие выборки */
    mysqli_free_result($result);
  }
} 	
?>