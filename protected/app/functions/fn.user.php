<?php declare(strict_types = 1);

function splitInHalf($string)
{
    $middle = mb_strrpos(mb_substr($string, 0, floor(strlen($string) / 2), 'UTF-8'), ' ', null, 'UTF-8') + 1;

    return [
        mb_substr($string, 0, $middle - 1, 'UTF-8'),
        mb_substr($string, $middle, null, 'UTF-8')
    ];
}

function simpleMail($message ='', $subject ='', $to = '', $from = '')
{
    if (is_email($to))
    {
        if (!is_email($from))
        {
            $from = 'robot@' . $_SERVER['HTTP_HOST'];
        }

        $headers = 'From: ' . $from . "\r\n" . 'Reply-To: ' . $from . "\r\n" . 'X-Mailer: PHP/' . phpversion();

        mail($to, $subject, $message, $headers);
    }
}

function _json($data = [])
{
    return json_encode($data, 64 | 256); // JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
}

function convertCoords($coord, $type = 'N')
{
    if ($coord !== '') {
        $tmp = explode('.', $coord) ;
        $tmp1 = explode('.', (($coord - $tmp[0]) * 60)) ;

        //Градусы
        $degrees = $tmp[0] ;

        //Минуты
        $minutes = $tmp1[0] ;

        //Секунды
        $seconds = round(((implode('.', $tmp1) - $tmp1[0]) * 60), 2) ;

        return $degrees . '° ' . $minutes . '′ ' . $seconds . '″ ' . $type;
    }

    return '';
}

function lst_menu()
{
    return Q("SELECT `id`, `name` FROM `#__str_menu` ORDER BY `name`")->all();
}

function repairurl($url)
{
    $path = preg_split('/\/+/', $url, -1, PREG_SPLIT_NO_EMPTY);
    return '/' . implode('/', $path);
}

function updateCart()
{
    $result = array(
        'count' => 0,
        'money' => 0
    );

    if (!empty($_SESSION['cart']['item'])) {
        foreach ($_SESSION['cart']['item'] as $k=>$v) {
            $result['count'] += $v['count'];
            $result['money'] += $v['count'] * $v['price'];
        }
    }

    $_SESSION['cart']['result'] = $result;

    return $result;
}

function Month($m = 1, $locale = 'ru')
{
    $locale = !in_array($locale, [ 'ru', 'en', 'de' ]) ? 'ru' : $locale;

    $translate = [
        'ru' => [
            'month' => [
                1  => 'января',
                2  => 'февраля',
                3  => 'марта',
                4  => 'апреля',
                5  => 'мая',
                6  => 'июня',
                7  => 'июля',
                8  => 'августа',
                9  => 'сентября',
                10 => 'октября',
                11 => 'ноября',
                12 => 'декабря'
            ],
            'year' => 'года'
        ],
        'en' => [
            'month' => [
                1 => 'january',
                2 => 'february',
                3 => 'march',
                4 => 'april',
                5 => 'may',
                6 => 'june',
                7 => 'july',
                8 => 'august',
                9 => 'september',
                10 => 'october',
                11 => 'november',
                12 => 'december'
            ],
            'year' => 'year'
        ]
    ];

    return $translate[$locale]['month'][$m*1];
}

function Dates($date = '', $locale = 'ru', $time = true)
{
    if ($date !== '')
    {
        $locale = !in_array($locale, [ 'ru', 'en', 'de' ]) ? 'ru' : $locale;

        if (!isValidTimeStamp($date))
        {
            $date = strtotime($date);
        }

        $date = intval($date);

        $d = date('d', $date);
        $m = date('m', $date);
        $y = date('Y', $date);

        $h = date('H', $date);
        $i = date('i', $date);
        $s = date('s', $date);

        if (($h*1) >= 0 && ($i*1) >= 0 && ($s*1) >= 0 && $time)
        {
            return ($d*1) . ' ' . Month($m) . ' ' . $y . ', ' . $h . ':' . $i . ':' . $s ;
        }
        else
        {
            return ($d*1) . ' ' . Month($m) . ' ' . $y ;
        }
    }

    return $date;
}

function file_force_download($file)
{
    if (file_exists(PATH_ROOT . $file) && !in_array(@end(explode('.', $file)), [ 'php', 'phtml', 'tpl', 'html' ]))
    {
        if (ob_get_level())
        {
            ob_end_clean();
        }

        header('Content-Description: File Transfer');

        if (isset($_SERVER['HTTP_USER_AGENT']) and strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE'))
        {
            header('Content-Type: application/force-download');
        } else {
            header('Content-Type: application/octet-stream');
        }

        header('Content-Disposition: attachment; filename=' . basename($file));
        header('Content-Transfer-Encoding: binary');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize(PATH_ROOT . $file));

        readfile(PATH_ROOT . $file);
    }
}

function sortmulti($array, $index, $order, $natsort=false, $case_sensitive=false)
{
    if (is_array($array) && count($array)>0) {
        foreach (array_keys($array) as $key) {
            $temp[$key]=$array[$key][$index];
        }
        if (!$natsort) {
            if ($order=='asc') {
                asort($temp);
            } else {
                arsort($temp);
            }
        } else {
            if ($case_sensitive===true) {
                natsort($temp);
            } else {
                natcasesort($temp);
            }

            if ($order!='asc') {
                $temp=array_reverse($temp, true);
            }
        }
        foreach (array_keys($temp) as $key) {
            if (is_numeric($key)) {
                $sorted[]=$array[$key];
            } else {
                $sorted[$key]=$array[$key];
            }
        }
        return $sorted;
    }

    return $sorted;
}
