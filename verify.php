<?php
  include_once 'define.php';
  
  use MiladRahimi\Jwt\Cryptography\Algorithms\Hmac\HS256;
  use MiladRahimi\Jwt\JwtParser;
  use MiladRahimi\Jwt\Exceptions\TokenParsingException;

  function verify() {
    $jwt = $_COOKIE['akv_jwt_token'];
    $key = JWT_KEY;
    $verifyer = new HS256($key);

    $parser = new JwtParser($verifyer);

    try {
        $parser->parse($jwt);  
        return true;
    } catch (TokenParsingException $e) {
        return false;
    }
  }

  function parseUserId() {
    $jwt = $_COOKIE['akv_jwt_token'];

    $key = JWT_KEY;
    $verifyer = new HS256($key);

    $parser = new JwtParser($verifyer);

    try {
        $claims = $parser->parse($jwt);  
        return $claims['user_id'];
    } catch (TokenParsingException $e) {
        return false;
    }
  }

