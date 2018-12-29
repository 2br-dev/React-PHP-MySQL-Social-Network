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
 
$credentials 		= __post('credentials');
$servername     = DB_HOST;
$username 	    = DB_USER;
$password 	    = DB_PASS;
$dbname 		    = DB_BASE;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
} 

if (isset($credentials)) {
  if ($result = mysqli_query($conn, "SELECT * FROM `db_mdd_users` WHERE `login` = '$credentials'")) {
    /* определение числа рядов в выборке */
    $row_cnt = mysqli_num_rows($result);

    if ($row_cnt == 0) {
      if ($result = mysqli_query($conn, "SELECT * FROM `db_mdd_users` WHERE `email` = '$credentials'")) {
        $row_cnt = mysqli_num_rows($result);
        if ($row_cnt == 0) {
          echo json_encode( array( 'result' => 0 ), 64 | 256 );
        } 
          else 
        {
    
          $code = createRandomCode();
          $query = "UPDATE `db_mdd_users` SET `code` = '$code' WHERE `email` = '$credentials'";
          $stmt = $conn->prepare($query);
          $stmt->execute(); 

          $domen = str_replace([ 'http://', 'www.', 'www' ], '', $_SERVER['SERVER_NAME']);
          $subject = "Восстановление пароля, на сайте " . $domen;
          $body  = '<h2 style="color:#000000; margin: 0;">Здравствуйте,</h2>';
          $body .= '<p style="color: #444444; font-size: 14px;">Вы получили это письмо, потому что было запрошено восстановление пароля для этого аккаунта.</p>';
          $body .= '<a href="'.$_SERVER['SERVER_NAME'].'/restore?auth='.$code.'">восстановить пароль можете по ссылке</a>';
          $body .= '<p style="color: #444444; font-size: 14px;">Если вы не запрашивали восстановление, то просто проигнорируйте это письмо.</p>';
          $body .= '<p style="color: #444444; font-size: 14px;">С уважением, <i>Искусственный Интеллект.</i></p>'; 
      
          // Create the Transport
          $transport = (new \Swift_SmtpTransport('smtp.mail.ru', 465, 'ssl'))
           ->setUsername('prog@2-br.ru')
           ->setPassword('123123prog');
      
          // Create the Mailer using your created Transport
          $mailer = new \Swift_Mailer($transport);
           // Create a message
          $message = (new \Swift_Message($subject))
           ->setFrom(['prog@2-br.ru' => 'akvatory-robot'])
           ->setTo($credentials)
           ->setBody($body, 'text/html');
          
          if ($mailer->send($message)) {
              echo json_encode( array( 'send' => 1, 'result' => 1 ), 64 | 256 );
          } else {
              echo json_encode( array( 'send' => 0, 'result' => 0 ), 64 | 256 );
          } 
        }
      }			
    } 
      else
    {

      $user_email = Q("SELECT `email` FROM `#_mdd_users` WHERE `login` = ?s", array($credentials))->row('email');
      
      // prepare query statement
      $code = createRandomCode();
      $query = "UPDATE `db_mdd_users` SET `code` = '$code' WHERE `login` = '$credentials'"; 
      $stmt = $conn->prepare($query); 
      $stmt->execute();  

      $domen = str_replace([ 'http://', 'www.', 'www' ], '', $_SERVER['SERVER_NAME']);
      $subject = "Восстановление пароля, на сайте " . $domen;
      $body  = '<h2 style="color:#000000; margin: 0;">Здравствуйте,</h2>';
      $body .= '<p style="color: #444444; font-size: 14px;">Вы получили это письмо, потому что было запрошено восстановление пароля для этого аккаунта.</p>';
      $body .= '<a href="'.$_SERVER['SERVER_NAME'].'/restore?auth='.$code.'">восстановить пароль можете по ссылке</a>';
      $body .= '<p style="color: #444444; font-size: 14px;">Если вы не запрашивали восстановление, то просто проигнорируйте это письмо.</p>';
      $body .= '<p style="color: #444444; font-size: 14px;">С уважением, <i>Искусственный Интеллект.</i></p>'; 
  
      // Create the Transport
      $transport = (new \Swift_SmtpTransport('smtp.mail.ru', 465, 'ssl'))
       ->setUsername('prog@2-br.ru')
       ->setPassword('123123prog');
  
      // Create the Mailer using your created Transport
      $mailer = new \Swift_Mailer($transport);
       // Create a message
      $message = (new \Swift_Message($subject))
       ->setFrom(['prog@2-br.ru' => 'akvatory-robot'])
       ->setTo("serallek@gmail.com")
       ->setBody($body, 'text/html');
      
      if ($mailer->send($message)) {
          echo json_encode( array( 'send' => 1, 'result' => 1 ), 64 | 256 );
      } else {
          echo json_encode( array( 'send' => 0, 'result' => 0 ), 64 | 256 );
      } 

    }
    /* закрытие выборки  и БД*/
    $conn->close();
    mysqli_free_result($result);
  }
} 	
?>