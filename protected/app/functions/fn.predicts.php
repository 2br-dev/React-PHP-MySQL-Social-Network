<?php declare(strict_types = 1);

function is_assoc($arr = [])
{
    return array_keys($arr) !== range(0, count($arr) - 1);
}

function is_url($url = '')
{
    return preg_match('|^http(s)?://[a-z0-9-]+(.[a-z0-9-]+)*(:[0-9]+)?(/.*)?$|i', $url);
}

function is_phone($phone = '')
{
    return (strlen(preg_replace("/[^0-9]/", '', $phone)) == 11);
}

function is_email($email = '')
{
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function checkLink($url = '')
{
    $handle = fopen($url, "r");
    if ($handle) {
        fclose($handle);
        return true;
    }
    return false;
}

function isValidTimeStamp($timestamp = '')
{
    return (is_numeric($timestamp) && (int)$timestamp == $timestamp);
}

function isValidURL($content = '')
{
    return preg_match('/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/', $content);
}

function is_spam($content = '')
{
    return isValidURL($content);
}