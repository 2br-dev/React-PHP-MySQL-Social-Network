<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
include_once '../config/database.php';
include_once '../../define.php'; 
include_once '../objects/user.php';
require_once '../../vendor/autoload.php';

use MiladRahimi\Jwt\Cryptography\Algorithms\Hmac\HS256;
use MiladRahimi\Jwt\JwtGenerator;

$key = JWT_KEY;
$signer = new HS256($key);
$generator = new JwtGenerator($signer);

$database = new Database();
$db = $database->getConnection();
 
$user = new User($db);
 
// get posted data
$data = json_decode(file_get_contents("php://input"));

$login 		  = __post('login');

if (strpos($login, '@')) {
  $user_login = Q("SELECT `login` FROM `#_mdd_users` WHERE `email` = '$login'",array())->row('login');
  $user_hash = Q("SELECT `password` FROM `#_mdd_users` WHERE `email` = '$login'",array())->row('password');
} else {
  $user_login = Q("SELECT `login` FROM `#_mdd_users` WHERE `login` = '$login'",array())->row('login');
  $user_hash = Q("SELECT `password` FROM `#_mdd_users` WHERE `login` = '$login'",array())->row('password');
}

$pass				= md5( __post('password') . md5($user_login));

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
  if ($result = mysqli_query($conn, "SELECT * FROM `db_mdd_users` WHERE `login` = '$login'")) 
  {
    /* определение числа рядов в выборке */
    $row_cnt = mysqli_num_rows($result);

    if ($row_cnt == 0) 
    {
      if ($result = mysqli_query($conn, "SELECT * FROM `db_mdd_users` WHERE `email` = '$login'")) 
      {
        $row_cnt = mysqli_num_rows($result);
        
        if ($row_cnt == 0) 
        {
          echo json_encode( array( 'result' => 0 ), 64 | 256 );
        } 
          else
        {
          $is_approved = Q("SELECT `approved` FROM `#_mdd_users` WHERE `email` = '$login'",array())->row('approved');
          if ($is_approved == 1 && password_verify($pass, $user_hash)) 
          {
            $user_id = Q("SELECT `id` FROM `#_mdd_users` WHERE `email` = '$login'",array())->row('id');
            $admin = Q("SELECT `admin` FROM `#_mdd_users` WHERE `email` = '$login'",array())->row('admin');
            $jwt = $generator->generate(['user_id' => $user_id, 'date' => date("Y-m-d H:i:s"), 'admin' => $admin]);
    
            echo json_encode( array( 'result' => 1, 'user_id' => $user_id, 'jwt' => $jwt ), 64 | 256 );	
          } 
            else 
          {
            if ($is_approved == 1) {
              echo json_encode( array( 'result' => 'error' ), 64 | 256 );	
            } else {
              echo json_encode( array( 'result' => 0.5 ), 64 | 256 );	
            }     
          }
        }
      }			
    } 
      else
    {  
      $is_approved = Q("SELECT `approved` FROM `#_mdd_users` WHERE `login` = '$login'",array())->row('approved');
      
      if ($is_approved == 1 && password_verify($pass, $user_hash)) 
      {
        $user_id = Q("SELECT `id` FROM `#_mdd_users` WHERE `login` = '$login'",array())->row('id');
        $admin = Q("SELECT `admin` FROM `#_mdd_users` WHERE `login` = '$login'",array())->row('admin');
        $jwt = $generator->generate(['user_id' => $user_id, 'date' => date("Y-m-d H:i:s"), 'admin' => $admin]);

        echo json_encode( array( 'result' => 1, 'user_id' => $user_id, 'jwt' => $jwt ), 64 | 256 );		
      } 
        else 
      {
        if ($is_approved == 1) {
          echo json_encode( array( 'result' => 'error' ), 64 | 256 );	
        } else {
          echo json_encode( array( 'result' => 0.5 ), 64 | 256 );	
        }     
      }	 
    }
    /* закрытие выборки */
    mysqli_free_result($result);
  }
} 	
?>