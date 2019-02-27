<?php
 // required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// include database and object files
include_once '../config/database.php';
include_once '../objects/task.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// prepare product object
$task = new Task($db);
// set ID property of record to read
$task->id = isset($_GET['id']) ? $_GET['id'] : die();

// read the details of product to be edited
$stmt = $task->read();
$num = $stmt->rowCount();

echo json_encode($num);

 