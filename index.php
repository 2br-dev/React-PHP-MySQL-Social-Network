<?php

$t1 = microtime(true);

require 'define.php';

$app = new Fastest\Core\App();

$app->terminate($_SERVER);

// если в сессии не записан USERNAME - редирект на страницу авторизации.
if(!isset($_SESSION['username']) && $_SERVER['REQUEST_URI'] != '/login') {
  header('location:/login');
}; 

// редирект на главную страницу залогиненного профиля.
if ($_SERVER['REQUEST_URI'] == '/') {
  $id = $_COOKIE['user_id'];
  header('location:/id'.$id);
}

# Load time
// $app->logger($t1);
?>
