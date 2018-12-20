<?php

$t1 = microtime(true);

require 'define.php';

$app = new Fastest\Core\App();

$app->terminate($_SERVER);

if(!isset($_SESSION['username']) && $_SERVER['REQUEST_URI'] != '/login') {
  header('location:/login');
}; 
# Load time
// $app->logger($t1);
?>
