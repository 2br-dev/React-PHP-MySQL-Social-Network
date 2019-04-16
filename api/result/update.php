<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
include_once '../config/database.php';
include_once '../objects/result.php';
include_once '../objects/question.php';
include_once '../objects/user.php';
include_once '../../verify.php';
include_once '../../setActivity.php';
require_once '../../vendor/autoload.php';
if (!verify()) header('location:/login');
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
$result = new Result($db);
$question = new Question($db);

$result->test_id = __post('test_id');
$result->estimated_time = __post('estimated_time');
$result->question_id = __post('question_id');
$result->variants = explode(",", __post('variants'));
$result->result = $question->getResult($result->question_id, $result->variants);

$stmt = $result->update(); 

if ($stmt) {
  echo json_encode(array("Success" => "Results was succesfully updated."));
} else {
  echo json_encode(array("Error" => "Results wasn`t updated."));
}
