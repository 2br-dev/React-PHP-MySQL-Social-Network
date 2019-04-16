<?php

$t1 = microtime(true);

require 'define.php';
require_once 'verify.php';
require_once 'setActivity.php';
require_once 'vendor/autoload.php';

$app = new Fastest\Core\App();

$app->terminate($_SERVER);

if (isset($_COOKIE['akv_jwt_token'])) setActivity();

// если восстанавливаем пароль, то проверяем AUTH-KEY, если не совпадает - то 404
if (strpos($_SERVER['REQUEST_URI'],'/restore') !== false) {
  $code = isset($_GET['auth']) ? $_GET['auth'] : null;
  $user_code = Q("SELECT `code` FROM `#_mdd_users` WHERE `code` = ?s",array($code))->row('code');
  if(!isset($user_code) || empty($user_code)) {
    header('location:/404');    
  }
  die;
}

// если токен не верифицирован - редирект на страницу авторизации.
if(!verify() && $_SERVER['REQUEST_URI'] != '/login') {
  // если страница restore или 404 то ничего не делаем
  if (strpos($_SERVER['REQUEST_URI'],'/restore') !== false || $_SERVER['REQUEST_URI'] == '/404' || $_SERVER['REQUEST_URI'] == '/approved') {
    die;
  } else {
    header('location:/login');
  }
};   

// редирект на главную страницу залогиненного профиля.
if ($_SERVER['REQUEST_URI'] == '/') {
  $id = parseUserId();
  $sex = Q("SELECT `sex` FROM `#_mdd_users` WHERE `id` = ?i",array($id))->row('sex');
  if($sex == '') {
    header('location:/settings');
  } else {
    header('location:/id'.$id);
  }  
}

# Load time
// $app->logger($t1);
?>
