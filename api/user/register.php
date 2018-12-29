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
/* $username   = __post('username');
$phone			= __post('phone'); */

if (isset($login) && isset($email) && isset($password)) {
  
  $check_login = Q("SELECT `login` FROM `#_mdd_users` WHERE `login` = ?s",array($login))->row('login');
  $check_email = Q("SELECT `email` FROM `#_mdd_users` WHERE `email` = ?s",array($email))->row('email');
  if(isset($check_login) || isset($check_email)) {
    echo json_encode( array( 'result' => 2 ), 64 | 256 );
    die;
  }

  $result = Q("INSERT INTO `#_mdd_users` SET `login`=?s, `password`=?s, `email`=?s, `admin`=?i, `created`=NOW()", 
    array($login, md5( $password ), $email, 0,));

  $user_id = Q("SELECT `id` FROM `#_mdd_users` WHERE `login`=?s",array($login))->row('id');

  
    $domen = str_replace([ 'http://', 'www.', 'www' ], '', $_SERVER['SERVER_NAME']);
    $subject = "Запрос на регистрацию на сайте " . $domen;
  
    $body  = '<h2 style="color:#000000; margin: 0;">Пользователь, запрашивает регистрацию:</h2>';
    $body .= '<p style="color: #444444; font-size: 14px;">Логин: '.$login.'</p>';
    $body .= '<p style="color: #444444; font-size: 14px;">Email: '.$email.'</a>';
    $body .= '<p><a href="'.$_SERVER['SERVER_NAME'].'/api/user/approve.php?id='.$user_id.'">Перейдите по ссылке, чтобы подтвердить регистрацию пользователя.</a></p>';
    $body .= '<p style="color: #444444; font-size: 14px;">Либо просто проигнорируйте это письмо, если регистрацию не подтверждаете.</p>';
    $body .= '<p style="color: #444444; font-size: 14px;">С уважением, <i>Искусственный Интеллект.</i></p>'; 

    // Create the Transport
    $transport = (new \Swift_SmtpTransport('smtp.mail.ru', 465, 'ssl'))
     ->setUsername('prog@2-br.ru')
     ->setPassword('123123prog');

    $emails = getfl('emails');
    // Create the Mailer using your created Transport
    $mailer = new \Swift_Mailer($transport);
     // Create a message
    $message = (new \Swift_Message($subject))
     ->setFrom(['prog@2-br.ru' => 'akvatory-robot'])
     ->setTo($emails)
     ->setBody($body, 'text/html');
}

if ($mailer->send($message)) {
  echo json_encode( array( 'send' => 1, 'result' => 1 ), 64 | 256 );
} else {
  echo json_encode( array( 'send' => 0, 'result' => 0 ), 64 | 256 );
} 

?>