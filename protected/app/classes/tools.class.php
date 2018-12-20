<?php

trait Tools
{

    /**
     * Helper function
     *
     * @param array   $tree   flat data, implementing a id/parent id (adjacency list) structure
     * @param mixed   $pid   root id, node to return
     * @param string  $parent  parent id index
     * @param string  $key   id index
     * @param string  $children   children index
     * @return array
     */
    public static function makeTree($tree = [], $pid = 0, $parent = 'pid', $key = 'id', $children = 'tree')
    {
        $result = [];

        if (!empty($tree))
        {
            $m = [];

            foreach ($tree as $node)
            {
                $id = $node['id'];

                isset($m[$node[$parent]]) ?: $m[$node[$parent]] = [];
                isset($m[$node[$key]]) ?: $m[$node[$key]] = [];

                $m[$node[$parent]][] = array_merge($node, [ $children => &$m[$node[$key]] ]);
            }

            $_pid = isset($tree[$pid][$parent]) ? $tree[$pid][$parent] : $pid;

            $result = isset($m[$_pid]) ? $m[$_pid] : '';
        }

        return $result;
    }

    public static function makePidTree($tree = [], $pid = 0, $parent = 'pid', $key = 'id', $children = 'tree')
    {
        $result = [];

        foreach ($tree as $sub)
        {
            $result[$sub[$parent]][] = $sub;
        }

        $fnBuilder = function($siblings) use (&$fnBuilder, $result, $children, $key) {
            foreach ($siblings as $k => $sibling)
            {
                $id = $sibling[$key];

                if(isset($result[$id]))
                {
                    $sibling[$children] = $fnBuilder($result[$id]);
                }

                $siblings[$k] = $sibling;
            }

            return $siblings;
        };

        if (isset($result[$pid]))
        {
            return $fnBuilder($result[$pid]);
        }

        return [];
    }

    public static function changeAvailability($source = '')
    {
        clearstatcache();

        $user = get_current_user();

        // $user = posix_getpwuid(fileowner($_SERVER['SCRIPT_FILENAME']));
        $group = filegroup($_SERVER['SCRIPT_FILENAME']);

        if (file_exists($source))
        {
            if (is_dir($source))
            {
                @chmod($source, 0755);
            }

            if (is_file($source))
            {
                @chmod($source, 0644);
            }

            @chown($source, $user);
            @chgrp($source, $group);
        }
    }

    public static function base_url($path = [], $length = 1, $start = 0)
    {
        $baseurl = '';

        if ($start !== $length) {
            $path = array_slice($path, $start, $length);

            $baseurl = '/' . implode('/', $path);
        }

        return $baseurl;
    }

    public static function xssclean($input = '')
    {
        // Remove tags
        $input = preg_replace('#</*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|i(?:frame|layer)|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|title|xml)[^>]*+>#i', '', $input);

        // Remove namespaced elements
        $input = preg_replace('#</*\w+:\w[^>]*+>#i', '', $input);

        // Fix &entity\n;
        $input = str_replace(array('&amp;','&lt;','&gt;'), array('&amp;amp;','&amp;lt;','&amp;gt;'), $input);
        $input = preg_replace('/(&#*\w+)[\x00-\x20]+;/u', '$1;', $input);
        $input = preg_replace('/(&#x*[0-9A-F]+);*/iu', '$1;', $input);
        $input = html_entity_decode($input, ENT_COMPAT, 'UTF-8');

        // Remove any attribute starting with "on" or xmlns
        $input = preg_replace('#(<[^>]+?[\x00-\x20"\'])(?:on|xmlns)[^>]*+[>\b]?#iu', '$1>', $input);

        // Remove javascript: and vbscript: protocols
        $input = preg_replace('#([a-z]*)[\x00-\x20]*=[\x00-\x20]*([`\'"]*)[\x00-\x20]*j[\x00-\x20]*a[\x00-\x20]*v[\x00-\x20]*a[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2nojavascript...', $input);
        $input = preg_replace('#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*v[\x00-\x20]*b[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2novbscript...', $input);
        $input = preg_replace('#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*-moz-binding[\x00-\x20]*:#u', '$1=$2nomozbinding...', $input);

        // Only works in IE: <span style="width: expression(alert('Ping!'));"></span>
        $input = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?expression[\x00-\x20]*\([^>]*+>#i', '$1>', $input);
        $input = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?behaviour[\x00-\x20]*\([^>]*+>#i', '$1>', $input);
        $input = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:*[^>]*+>#iu', '$1>', $input);

        return $input;
    }

    /**
     * Checks associativity of array
     *
     * @param array $array  Array to be checked
     *
     * @return bool
     */
    public static function is_assoc($arr = [])
    {
        return array_keys($arr) !== range(0, count($arr) - 1);
    }

    public static function clean_data($html = '')
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

    public static function _curl($url)
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

    public static function convertToObject($a = [])
    {
        if (is_array($a) && !empty($a)) {
            $object = new stdClass();

            foreach ($a as $k => $v) {
                if (is_array($v)) {
                    $v = self::convertToObject($v);
                }

                $object->$k = $v;
            }

            $a = $object;
        }

        return $a;
    }

    public static function rrmdir($dir = '')
    {
        if (is_dir($dir)) {
            $files = array_diff(scandir($dir), array('.', '..', '.gitkeep', '.gitignore'));

            foreach ($files as $file) {
                if (is_dir($dir.DIRECTORY_SEPARATOR.$file)) {
                    rrmdir($dir.DIRECTORY_SEPARATOR.$file);
                } else {
                    unlink($dir.DIRECTORY_SEPARATOR.$file);
                }
            }

            reset($files);
            rmdir($dir);
        }
    }

    public static function array_chunk_column(array $input, $size)
    {
        $data = array_fill(0, $size, []);
        $size = round(count($input) / $size, PHP_ROUND_HALF_UP);
        $i = 0;
        $j = 0;
        foreach ($input as $k => $one) {
            if ($j >= $size) {
                $i++;
                $j = 0;
            }
            $data[$i][$k] = $one;
            $j++;
        }

        return $data;
    }

    public static function formatPhone($phone = '')
    {
        return preg_replace('~.*(\d{3})[^\d]*(\d{3})[^\d]*(\d{2})(\d{2})(?:[ \D#\-]*(\d{3,6}))?.*~', '+7 ($1) $2-$3-$4', trim($phone));
    }

    public static function phone($phone = '')
    {
        if ($phone) {
            $phone = str_replace(array('-', ' ', '+', '(', ')'), '', trim($phone));
        }

        return $phone;
    }

    public static function dateFormat($time = 0, $format = 'd.m.Y')
    {
        if ($time) {
            return date($format, $time);
        }
    }

    public static function timestamp($time = 0, $format = '%d.%m.%Y')
    {
        if ($time) {
            if (function_exists('strtotime')) {
                return strtotime($time);
            } else {
                $a = strptime($time, $format);
                return mktime($a['tm_hour'], $a['tm_min'], $a['tm_sec'], $a['tm_mon']+1, $a['tm_mday'], $a['tm_year']+1900);
            }
        }

        if (!$time) {
            $time = 0;
        }

        return $time;
    }

    protected function _prepareArray($array = [])
    {
        $result = [];

        if (is_array($array)) {
            foreach ($array as $key => $arr) {
                if (is_array($arr)) {
                    foreach ($arr as $k => $v) {
                        $result[$k][$key] = $v;
                    }
                }
            }
        }

        return $result;
    }

    public static function array_sort($array, $on, $order = ASC)
    {
        $new_array = [];
        $sortable_array = [];

        if (count($array) > 0) {
            foreach ($array as $k => $v) {
                if (is_array($v)) {
                    foreach ($v as $k2 => $v2) {
                        if ($k2 == $on) {
                            $sortable_array[$k] = $v2;
                        }
                    }
                } else {
                    $sortable_array[$k] = $v;
                }
            }

            switch ($order) {
                case ASC:
                    asort($sortable_array);
                    break;
                case DESC:
                    arsort($sortable_array);
                    break;
            }

            foreach ($sortable_array as $k => $v) {
                $new_array[$k] = $array[$k];
            }
        }

        return $new_array;
    }

    public static function getLocale($url = '')
    {
        if ($url != '') {
            if (strstr($url, '/')) {
                $path = preg_split('/\/+/', $url, -1, PREG_SPLIT_NO_EMPTY);

                return isset($path[0]) && in_array($path[0], array('ru', 'en', 'fr', 'sp', 'de')) ? $path[0] : 'ru' ;
            }
        }

        return 'ru';
    }

    /**
     * Возвращает сумму прописью
     * @author runcore
     * @usesmorph(...)
     */
    public static function num2str($num)
    {
        $nul='ноль';
        $ten=array(
            array('','один','два','три','четыре','пять','шесть','семь', 'восемь','девять'),
            array('','одна','две','три','четыре','пять','шесть','семь', 'восемь','девять'),
        );
        $a20=array('десять','одиннадцать','двенадцать','тринадцать','четырнадцать' ,'пятнадцать','шестнадцать','семнадцать','восемнадцать','девятнадцать');
        $tens=array(2=>'двадцать','тридцать','сорок','пятьдесят','шестьдесят','семьдесят' ,'восемьдесят','девяносто');
        $hundred=array('','сто','двести','триста','четыреста','пятьсот','шестьсот', 'семьсот','восемьсот','девятьсот');
        $unit=array( // Units
            array('копейка' ,'копейки' ,'копеек',     1),
            array('рубль'   ,'рубля'   ,'рублей'    ,0),
            array('тысяча'  ,'тысячи'  ,'тысяч'     ,1),
            array('миллион' ,'миллиона','миллионов' ,0),
            array('миллиард','милиарда','миллиардов',0),
        );
        //
        list($rub, $kop) = explode('.', sprintf("%015.2f", floatval($num)));
        $out = [];
        if (intval($rub)>0) {
            foreach (str_split($rub, 3) as $uk=>$v) { // by 3 symbols
                if (!intval($v)) {
                    continue;
                }
                $uk = sizeof($unit)-$uk-1; // unit key
                $gender = $unit[$uk][3];
                list($i1, $i2, $i3) = array_map('intval', str_split($v, 1));
                // mega-logic
                $out[] = $hundred[$i1]; # 1xx-9xx
                if ($i2>1) {
                    $out[]= $tens[$i2].' '.$ten[$gender][$i3];
                } # 20-99
                else {
                    $out[]= $i2>0 ? $a20[$i3] : $ten[$gender][$i3];
                } # 10-19 | 1-9
                // units without rub & kop
                if ($uk>1) {
                    $out[]= $this->morph($v, $unit[$uk][0], $unit[$uk][1], $unit[$uk][2]);
                }
            } //foreach
        } else {
            $out[] = $nul;
        }
        $out[] = $this->morph(intval($rub), $unit[1][0], $unit[1][1], $unit[1][2]); // rub
        $out[] = $kop.' '.$this->morph($kop, $unit[0][0], $unit[0][1], $unit[0][2]); // kop
        return trim(preg_replace('/ {2,}/', ' ', join(' ', $out)));
    }

    /**
     * Склоняем словоформу
     * @ author runcore
     */
    public function morph($n, $f1, $f2, $f5)
    {
        $n = abs(intval($n)) % 100;
        if ($n>10 && $n<20) {
            return $f5;
        }
        $n = $n % 10;
        if ($n>1 && $n<5) {
            return $f2;
        }
        if ($n==1) {
            return $f1;
        }
        return $f5;
    }

    public static function validate($data = [], $type = '')
    {
        return true;

        /*
        address:
        Array
        (
            [postal_code] => 11
            [country] => 11
            [region] => 22
            [area] => 33
            [city] =>
            [settlement] =>
            [street] =>
            [house] =>
            [flat] =>
        )
        */
    }

    public static function getRoot($url)
    {
        if ($url !== '' && strstr($url, '/')) {
            return current(preg_split('/\/+/', $url, -1, PREG_SPLIT_NO_EMPTY));
        }

        return '';
    }

    /**
     * Recursively remove directory
     *
     * @param string $dirname Path to directory
     *
     * @return bool
     */
    public static function rmdir_recursive($dirname = '')
    {
        if (!is_dir($dirname)) {
            return true;
        }

        // get_files_list(
        //  $dirname,
        //  false,
        //  'fd',
        //  true,
        //  true,
        //  false,
        //  false,
        //  true,
        //  function ($item) {
        //      if (is_dir($item)) {
        //          @rmdir($item);
        //      } else {
        //          @unlink($item);
        //      }
        //  }
        // );
        // return @rmdir($dirname);
    }

    /**
     * Get file extension from filename
     *
     * @param string    $filename
     *
     * @return string
     */
    public static function file_extension($filename)
    {
        return mb_substr(mb_strrchr($filename, '.'), 1);
    }

    /**
     * Like system function, but accept arrays of strings
     *
     * @param string|string[]   $string
     *
     * @return string|string[]
     */
    public static function _strtolower($string)
    {
        if (is_array($string)) {
            return array_map('strtolower', $string);
        }
        return strtolower($string);
    }

    /**
     * Like system function, but accept arrays of strings
     *
     * @param string|string[]   $string
     *
     * @return string|string[]
     */
    public static function _strtoupper($string)
    {
        if (is_array($string)) {
            return array_map('strtoupper', $string);
        }
        return strtoupper($string);
    }

    /**
     * Works similar to the system function, but adds JSON_UNESCAPED_UNICODE and JSON_UNESCAPED_SLASHES options
     *
     * @param mixed     $value
     *
     * @return bool|string
     */
    public static function _json_encode($value)
    {
        return @json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Works similar to the system function, but always returns array, not object
     *
     * @param string    $in
     * @param int       $depth
     *
     * @return bool|mixed
     */
    public static function _json_decode($in, $depth = 512)
    {
        return @json_decode($in, true, $depth);
    }

    /**
     * XSS Attack Protection. Returns secure string using several types of filters
     *
     * @param string|string[]   $in     HTML code
     * @param bool|string       $html   <b>text</b> - text at output (default)<br>
     *                                  <b>true</b> - processed HTML at output<br>
     *                                  <b>false</b> - HTML tags will be deleted
     * @param bool              $iframe Whether to allow iframes without inner content (for example, video from youtube)<br>
     *                                  Works only if <i>$html === true</i>
     * @return string|string[]
     */
    public static function xap($in, $html = 'text', $iframe = false)
    {
        if (is_array($in)) {
            foreach ($in as &$item) {
                $item = xap($item, $html, $iframe);
            }
            return $in;
        /**
         * Make safe HTML
         */
        } elseif ($html === true) {
            $in = preg_replace(
                '/
                    <[^a-z=>]*(link|script|object|applet|embed|[a-z0-9]+-[a-z0-9]+)[^>]*>?  # Open tag
                    (
                        .*                                                                  # Some content
                        <\/[^>]*\\1[^>]*>                                                   # Close tag (with reference for tag name to open tag)
                    )?                                                                      # Section is optional
                /xims',
                '',
                $in
            );
            /**
             * Remove iframes (regular expression the same as previous)
             */
            if (!$iframe) {
                $in = preg_replace(
                    '/
                        <[^a-z=>]*iframe[^>]*>?     # Open tag
                        (
                            .*                      # Some content
                            <\/[^>]*iframe[^>]*>    # Close tag
                        )?                          # Section is optional
                    /xims',
                    '',
                    $in
                );
            /**
             * Allow iframes without inner content (for example, video from youtube)
             */
            } else {
                $in = preg_replace(
                    '/
                        (<[^a-z=>]*iframe[^>]*>\s*) # Open tag
                        [^<\s]+                     # Search if there something that is not space or < character
                        (<\/[^>]*iframe[^>]*>)?     # Optional close tag
                    /xims',
                    '',
                    $in
                );
                $in = preg_replace_callback(
                    '/
                        <[^\/a-z=>]*iframe[^>]*>
                    /xims',
                    function ($matches) {
                        $result = preg_replace('/sandbox\s*=\s*([\'"])?[^\\1>]*\\1?/ims', '', $matches[0]);
                        $result = str_replace(
                            '>',
                            ' sandbox="allow-same-origin allow-forms allow-popups allow-scripts">',
                            $result
                        );
                        return $result;
                    },
                    $in
                );
            }
            $in = preg_replace(
                '/(script|data|vbscript):/i',
                '\\1&#58;',
                $in
            );
            $in = preg_replace(
                '/(expression[\s]*)\(/i',
                '\\1&#40;',
                $in
            );
            $in = preg_replace(
                '/<[^>]*\s(on[a-z]+|dynsrc|lowsrc|formaction|is)=[^>]*>?/ims',
                '',
                $in
            );
            $in = preg_replace(
                '/(href[\s\t\r\n]*=[\s\t\r\n]*["\'])((?:http|https|ftp)\:\/\/.*?["\'])/ims',
                '\\1redirect/\\2',
                $in
            );
            return $in;
        } elseif ($html === false) {
            return strip_tags($in);
        } else {
            return htmlspecialchars($in, ENT_NOQUOTES | ENT_HTML5 | ENT_DISALLOWED | ENT_SUBSTITUTE | ENT_HTML5);
        }
    }

    /**
     * Checks whether string is an md5 hash
     *
     * @param string    $string
     *
     * @return bool
     */
    public static function is_md5($string)
    {
        return is_string($string) && preg_match('/^[0-9a-z]{32}$/', $string);
    }

    /**
     * Truncates text
     *
     * Cuts a string to the length of <i>$length</i> and replaces the last characters
     * with the ending if the text is longer than length.
     * Function from CakePHP
     *
     * @license Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
     *
     * @param string    $text           String to truncate
     * @param int       $length         Length of returned string, including ellipsis
     * @param string    $ending         Ending to be appended to the trimmed string
     * @param bool      $exact          If <b>false</b>, $text will not be cut mid-word
     * @param bool      $considerHtml   If <b>true</b>, HTML tags would be handled correctly
     * @return string                   Trimmed string
     */
    public static function truncate($text, $length = 1024, $ending = '...', $exact = false, $considerHtml = true)
    {
        $open_tags    = [];
        if ($considerHtml) {
            // if the plain text is shorter than the maximum length, return the whole text
            if (strlen(preg_replace('/<.*?>/', '', $text)) <= $length) {
                return $text;
            }
            // splits all html-tags to scanable lines
            preg_match_all('/(<.+?>)?([^<>]*)/s', $text, $lines, PREG_SET_ORDER);
            $total_length    = mb_strlen($ending);
            $truncate        = '';
            foreach ($lines as $line_matchings) {
                // if there is any html-tag in this line, handle it and add it (uncounted) to the output
                if (!empty($line_matchings[1])) {
                    // if it's an "empty element" with or without xhtml-conform closing slash (f.e. <br/>)
                    if (preg_match('/^<(\s*.+?\/\s*|\s*(img|br|input|hr|area|base|col|frame|link|meta|param)(\s.+?)?)>$/is', $line_matchings[1])) {
                        // do nothing
                        // if tag is a closing tag (f.e. </b>)
                    } elseif (preg_match('/^<\s*\/([^\s]+?)\s*>$/s', $line_matchings[1], $tag_matchings)) {
                        // delete tag from $open_tags list
                        $pos = array_search($tag_matchings[1], $open_tags);
                        if ($pos !== false) {
                            unset($open_tags[$pos]);
                        }
                        // if tag is an opening tag (f.e. <b>)
                    } elseif (preg_match('/^<\s*([^\s>!]+).*?>$/s', $line_matchings[1], $tag_matchings)) {
                        // add tag to the beginning of $open_tags list
                        array_unshift($open_tags, mb_strtolower($tag_matchings[1]));
                    }
                    // add html-tag to $truncate'd text
                    $truncate .= $line_matchings[1];
                }
                // calculate the length of the plain text part of the line; handle entities as one character
                $content_length = mb_strlen(preg_replace('/&[0-9a-z]{2,8};|&#[0-9]{1,7};|&#x[0-9a-f]{1,6};/i', ' ', $line_matchings[2]));
                if ($total_length + $content_length > $length) {
                    // the number of characters which are left
                    $left = $length - $total_length;
                    $entities_length = 0;
                    // search for html entities
                    if (preg_match_all('/&[0-9a-z]{2,8};|&#[0-9]{1,7};|&#x[0-9a-f]{1,6};/i', $line_matchings[2], $entities, PREG_OFFSET_CAPTURE)) {
                        // calculate the real length of all entities in the legal range
                        foreach ($entities[0] as $entity) {
                            if ($entity[1] + 1 - $entities_length <= $left) {
                                $left--;
                                $entities_length += mb_strlen($entity[0]);
                            } else {
                                // no more characters left
                                break;
                            }
                        }
                    }
                    $truncate .= mb_substr($line_matchings[2], 0, $left + $entities_length);
                    // maximum length is reached, so get off the loop
                    break;
                } else {
                    $truncate        .= $line_matchings[2];
                    $total_length    += $content_length;
                }
                // if the maximum length is reached, get off the loop
                if ($total_length >= $length) {
                    break;
                }
            }
        } else {
            if (mb_strlen($text) <= $length) {
                return $text;
            } else {
                $truncate = mb_substr($text, 0, $length - mb_strlen($ending));
            }
        }
        // if the words shouldn't be cut in the middle...
        if (!$exact) {
            // ...search the last occurrence of a space...
            $spacepos = mb_strrpos($truncate, ' ');
            if (isset($spacepos)) {
                // ...and cut the text in this position
                $truncate = mb_substr($truncate, 0, $spacepos);
            }
        }
        // add the defined ending to the text
        $truncate .= $ending;
        if ($considerHtml) {
            // close all unclosed html-tags
            foreach ($open_tags as $tag) {
                $truncate .= "</$tag>";
            }
        }
        return $truncate;
    }

    // public static function ($dir = '')
    // {
    //  if (!is_dir($dir)) {
    //      $old_umask = umask(0);
    //      if (!mkdir($dir, 0777, true)) {
    //          return false;
    //      }
    //      umask($old_umask);
    //  }
    // }

    // function recursiveBC($parent, $result = [], $base = '', $fields = [], $needle = 'parent', $stop = 0)
    // {
    //     if (!empty($fields))
    //     {
    //         $item = Q("SELECT `" . implode('`, `', $fields) . "` FROM `". $base ."` WHERE `id`=?i LIMIT 1", array($parent))->row();
    //         $result[] = $item;
    //         return $item[$needle] == $stop ? array_reverse($result) : recursiveBC($item[$needle], $result, $base, $fields, $needle, $stop);
    //     }
    // }
}
