<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../verify.php';
require_once '../vendor/autoload.php';
if (!verify()) header('location:/login');

$categories = array();

$categories = Q("SELECT `id`, `var`, `value` FROM `db__mdd_lists` WHERE `list_name` = ?s", array('test_cat'))->all();

if (count($categories) > 0) {
  echo json_encode($categories);
} else {
  echo json_encode(array("message" => "No categories found.", "error" => 1));
}
