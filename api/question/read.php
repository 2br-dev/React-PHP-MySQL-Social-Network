<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
include_once '../config/database.php';
include_once '../objects/question.php';
include_once '../objects/user.php';
include_once '../../verify.php'; 
include_once '../../setActivity.php'; 
require_once '../../vendor/autoload.php';
if(!verify()) header('location:/login');
// get database connection
$database = new Database();
$db = $database->getConnection();
// initialize object
$user = new User($db);
if (setActivity()) {
  $user->id = setActivity();
  $user->last_activity = round(microtime(true) * 1000);
  $user->set_activity();
}

/*
** BODY
*/
$question = new Question($db);

$stmt = $question->read();
$num = $stmt->rowCount();

if ($num > 0) {
  $question_arr = array();
  $question_arr["data"] = array();

  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    extract($row);

    $question_item = array(
      "correct_answer"  => $correct_answer,
      "question"        => $question,
      "test"            => $test,
      "answer1"         => $answer1,
      "answer2"         => $answer2,
      "answer3"         => $answer3,
      "answer4"         => $answer4,
      "answer5"         => $answer5,
      "answer6"         => $answer6
    );

    array_push($question_arr["data"], $question_item);
  }

  http_response_code(200);
  echo json_encode($question_arr);
} else {
  echo json_encode(array("mistake" => "No mistakes."));
}
 