<?php declare(strict_types = 1);

function strposa($haystack, $needle, $offset=0)
{
    if (!is_array($needle)) {
        $needle = array($needle);
    }

    foreach ($needle as $query) {
        if (strpos($haystack, $query, $offset) !== false) {
            return true;
        }
    }

    return false;
}

if (!function_exists('hash_equals')) {
    function hash_equals($str1, $str2)
    {
        if (strlen($str1) != strlen($str2)) {
            return false;
        } else {
            $res = $str1 ^ $str2;
            $ret = 0;
            for ($i = strlen($res) - 1; $i >= 0; $i--) {
                $ret |= ord($res[$i]);
            }
            return !$ret;
        }
    }
}

function checkUrlLink($path = [], $needle = [])
{
    $needle = str_replace(array("\r","\n"), '', $needle);
    $needle = preg_split('/\;+/', $needle, -1, PREG_SPLIT_NO_EMPTY);

    $valid = false;

    if (!empty($needle) && !empty($path)) {
        foreach ($needle as $item) {
            $compared = preg_split('/\/+/', $item, -1, PREG_SPLIT_NO_EMPTY);

            if (count($path) <= count($compared) || end($compared) == '*') {
                $difference = array_diff($compared, $path);

                if (!empty($difference)) {
                    $difference = array_values($difference);

                    if ($difference[0] == '*') {
                        $valid = true;
                    }
                } else {
                    $valid = true;
                }
            }
        }
    } elseif (empty($path) && in_array('main', $needle)) {
        $valid = true;
    }

    return $valid;
}

function _session_start()
{
    $sn = session_name();

    if (isset($_COOKIE[$sn])) {
        $sessid = $_COOKIE[$sn];
    } elseif (isset($_GET[$sn])) {
        $sessid = $_GET[$sn];
    } else {
        return session_start();
    }

    if (!preg_match('/^[a-zA-Z0-9,\-]{22,40}$/', $sessid)) {
        return false;
    }

    return session_start();
}

function simpleUpload($name = '', $group = '')
{
    if (!$group) {
        $group = 'upload_' . substr(md5(uniqid()), 3, 8)  . '_' . substr(md5(uniqid()), 5, 10);
    }

    $files = new Files();
    $flist = $files->upload($name, $group);

    return $flist;
}

function humanFileSize($size)
{
    if ($size >= 1073741824) {
        $fileSize = round($size / 1024 / 1024 / 1024, 1) . 'GB';
    } elseif ($size >= 1048576) {
        $fileSize = round($size / 1024 / 1024, 1) . 'MB';
    } elseif ($size >= 1024) {
        $fileSize = round($size / 1024, 1) . 'KB';
    } else {
        $fileSize = $size . ' bytes';
    }
    return $fileSize;
}

function clean_data($html)
{
    $html = str_replace("\n", " ", str_replace("\r", "", $html));

    $content = '';

    if ($content = strstr($html, '<!-- profile -->')) {
        $content = trim(substr($content, strlen('<!-- profile -->')));
        $content = trim(substr($content, 0, (0 - strlen($content) + strpos($content, '<!-- /profile -->'))));
    }

    $content = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', "", $content);
    $content = preg_replace("/\&[^\;]*\;/", "", $content);
    $content = str_replace('&quot;', '', $content);
    $content = trim($content);

    return $content;
}

function rrmdir($dir)
{
    if (is_dir($dir)) {
        $files = array_diff(scandir($dir), [ '.', '..', '.gitkeep', '.gitignore' ]);

        foreach ($files as $file) {
            if (is_dir($dir.DS.$file)) {
                rrmdir($dir.DS.$file);
            } else {
                unlink($dir.DS.$file);
            }
        }

        reset($files);
        rmdir($dir);
    }
}

function _curl($url)
{
    $user_agent='Mozilla/5.0 (Windows NT 6.1; rv:8.0) Gecko/20100101 Firefox/8.0';

    $options = array(
        CURLOPT_CUSTOMREQUEST  => "GET",        //set request type post or get
        CURLOPT_POST           => false,        //set to GET
        CURLOPT_USERAGENT      => $user_agent, //set user agent
        CURLOPT_COOKIEFILE     => "cookie.txt", //set cookie file
        CURLOPT_COOKIEJAR      => "cookie.txt", //set cookie jar
        CURLOPT_RETURNTRANSFER => true,     // return web page
        CURLOPT_HEADER         => false,    // don't return headers
        CURLOPT_FOLLOWLOCATION => true,     // follow redirects
        CURLOPT_ENCODING       => "",       // handle all encodings
        CURLOPT_AUTOREFERER    => true,     // set referer on redirect
        CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
        CURLOPT_TIMEOUT        => 120,      // timeout on response
        CURLOPT_MAXREDIRS      => 10,       // stop after 10 redirects
   );

    $ch      = curl_init($url);
    curl_setopt_array($ch, $options);
    $content = curl_exec($ch);
    $err     = curl_errno($ch);
    $errmsg  = curl_error($ch);
    $header  = curl_getinfo($ch);
    curl_close($ch);

    $header['errno']   = $err;
    $header['errmsg']  = $errmsg;
    $header['content'] = $content;

    return $header;
}

if (!function_exists('json_encode')) {
    function json_encode($data)
    {
        $json = new Services_JSON();
        return($json->encode($data));
    }
}

if (!function_exists('json_decode')) {
    function json_decode($data, $bool)
    {
        if ($bool) {
            $json = new Services_JSON(SERVICES_JSON_LOOSE_TYPE);
        } else {
            $json = new Services_JSON();
        }
        return($json->decode($data));
    }
}

function to_money($number = 0, $d = 0)
{
    return number_format(floatval($number), $d, ',', ' ');
}

function __get($val)
{
    return isset($_GET[$val])?$_GET[$val]:false;
}

function __post($key = '', $post = [])
{
    $result = false;

    if (isset($post) && !empty($post)) {
        if (isset($post[$key])) {
            $result = $post[$key];
        }
    } elseif (!empty($_POST)) {
        if (isset($_POST[$key])) {
            $result = $_POST[$key];
        }
    }

    return $result;
}

function __cookie($val)
{
    return isset($_COOKIE[$val])?$_COOKIE[$val]:false;
}

/**
 * Check that URL is valid and exists.
 * @param string $url Url to check
 * @return bool TRUE when valid | FALSE anyway
 */
function urlExists($url)
{
    // Remove all illegal characters from a url
    $url = filter_var($url, FILTER_SANITIZE_URL);

    // Validate URI
    if (filter_var($url, FILTER_VALIDATE_URL) === false
        // check only for http/https schemes.
        || !in_array(strtolower(parse_url($url, PHP_URL_SCHEME)), ['http','https'], true)
    ) {
        return false;
    }

    // Check that url exists
    $file_headers = @get_headers($url);
    return !!(!is_array($file_headers) || strpos($file_headers[0], '404') === false);
}

function to_base($string)
{
    if (is_string($string)) {
        $string = trim($string);
        return addslashes($string);
    }

    return $string;
}

function from_base($string)
{
    return $string ? stripslashes($string) : $string;
}

function scanDIRR($dir)
{
    if (is_dir($dir)) {
        return array_diff(scandir($dir), [ '.', '..', '.gitkeep', '.gitignore' ]);
    }

    return [];
}

function rDir($dir)
{
    $arr = [];
    $d = scandir($dir);
    foreach ($d as $v) {
        if ($v != "." and $v != "..") {
            $arr[] = array(
                "name" => iconv("windows-1251", "UTF-8", $v),
                "info" => getImageSize(PATH_ROOT.IMPORT_DIR.$v),
           );
        }
    }

    return $arr;
}
