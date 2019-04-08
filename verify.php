<?php
  include_once 'define.php';
  
  use MiladRahimi\Jwt\Cryptography\Algorithms\Hmac\HS256;
  use MiladRahimi\Jwt\JwtParser;
  use MiladRahimi\Jwt\Exceptions\TokenParsingException;

  function verify() {
    $jwt = isset($_COOKIE['akv_jwt_token']) ? $_COOKIE['akv_jwt_token'] : '';
   /*  $jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjUiLCJkYXRlIjoiMjAxOS0wNC0wNSAwOToyMDoyMSJ9.iBIggrsQt2gdPXfvRxfcgU2TQlVo5Uz9sHBj1kGMqhU";  */
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
    $jwt = isset($_COOKIE['akv_jwt_token']) ? $_COOKIE['akv_jwt_token'] : '';

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

