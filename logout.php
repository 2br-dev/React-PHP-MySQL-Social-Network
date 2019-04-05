<?php
  session_start();
  session_unset();
  session_destroy();
  setcookie("akv_jwt_token", "", time() - 3600);
  header('location:/login');
  die;
?>