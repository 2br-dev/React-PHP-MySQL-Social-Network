<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
// include database and object files
include_once '../../define.php';
include_once '../config/database.php';
include_once '../objects/user.php';
include_once '../../verify.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');

// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare product object
$user = new User($db);
 
// set ID property of record to read
$user->id = isset($_GET['id']) ? $_GET['id'] : die();
$user->approved = 1;
// read the details of product to be edited

$user_approved = Q('SELECT `approved` FROM `#_mdd_users` WHERE `id` = ?s', array($_GET['id']))->row('approved');
if ($user_approved == 1) {
  echo json_encode(array("message" => "Already approved."));
  header("location:/approved");
  die; 
}

if($user->approve_user()){
  // set response code - 200 ok
  http_response_code(200);
  // tell the user
  echo json_encode(array("message" => "User was updated."));
}
// if unable to update the user, tell the user
else{
  // set response code - 503 service unavailable
  http_response_code(503);
  // tell the user
  echo json_encode(array("message" => "Unable to update user."));
}
 
$user_email = Q('SELECT `email` FROM `#_mdd_users` WHERE `id` = ?s', array($_GET['id']))->row('email');

$subject = "Ваша учетная запись в социальной сети подтверждена.";
$body  = '<h2 style="color:#000000; margin: 0;">Поздравляем, ваша учётная запись была подтверждена!</h2>';
$body .= '<p><a href="http://службадоставкиводы.рф/login">Перейдите по ссылке, чтобы войти в систему.</a></p>';
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
 ->setTo($user_email)
 ->setBody($body, 'text/html');

$mailer->send($message);

header("location:/approved");
?>