<?php

class Request_search extends CPInit
{
    public $site            =    '';
    public $hash            =    '';
    public $search_query    =    '';
    public $words           =    [];
    public $pager           =    [];
    public $stops           =    [];
    public $count           =    0;
    public $min_length      =    2;
    public $limit           =    10;
    public $table           =    '#__srch_links';

    public function __construct()
    {
        $this->site = $_SERVER['HTTP_HOST'];
    }

    public function find()
    {
        $query = str_replace(array('”', '“', '%', '&', '#', '$', '№', '@', '\/', '\\', '(', ')', '}', '{', '^', '[', ']', '|', '+', '<', '>', '«', '»', '`', '\'', '--', '"', "'", ',', '.', '!', '?', ':', ';', '*', '®', '©', '™', '℗', '§', '℠'), '', $this->search_query);

        if ($query && mb_strlen($query) >= $this->min_length) {
            $query = mb_strtolower($query);

            $this->words = preg_split('/\ +/', $query, -1, PREG_SPLIT_NO_EMPTY);
            $this->sample();

            if (!empty($this->words)) {
                $this->hash = md5(implode('|', $this->words));

                $sql = $this->Query($this->words);
                $sql = preg_replace('/^SELECT DISTINCT `id`/', 'SELECT DISTINCT `id`, `link`, `page_title`, `content_index`', $sql);

                $this->getResult($sql);
            }
        }
    }

    public function getResult($sql = '')
    {
        $this->result = Q($sql)->all();
        $this->count = count($this->result);
        $this->pager = $this->getPager();

        if (!empty($this->result)) {
            $i = 0;
            $diff = 100;
            $end_i = count($this->result);

            while ($i < $end_i) {
                if (substr($this->result[$i]['link'], -1) == '/') {
                    $this->result[$i]['link'] = substr($this->result[$i]['link'], 0, -1);
                }

                $this->result[$i]['content_index'] = implode(' ', preg_split('/[,\s]+/', $this->result[$i]['content_index']));

                $content = $this->result[$i]['content_index'];

                $_content = '';

                foreach ($this->words as $str) {
                    $length = mb_strlen($str);

                    $temp = mb_strtolower($content);
                    $position = mb_strpos($temp, $str);

                    $f_s = $position - $diff;

                    if ($f_s < 0) {
                        $f_s = 0;
                    }

                    $f_e = $position - $f_s;

                    $e_s = $position + $length;
                    $e_e = $diff;

                    $_content = mb_substr($content, $f_s, $f_e, 'UTF-8');
                    $_content .= '<b>' . mb_substr($content, $position, $length, 'UTF-8') . '</b>';
                    $_content .= mb_substr($content, $e_s, $e_e, 'UTF-8');

                    if (mb_strlen($content) > $e_e) {
                        $_content .= '...';
                    }

                    $content = $_content;
                }

                $this->result[$i]['content_index'] = $_content;

                $i++;
            }
        }
    }

    private function translit($string = '')
    {
        $string = preg_replace('/\s+/', '', $string);

        if ($string !== '') {
            $cyr = array( 'а','б','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ъ','ы','ь','э','ю','я','А','Б','В','Г','Д','Е','Ж','З','И','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ы','Ь','Э','Ю','Я' );
            $lat = array( 'a','b','v','g','d','e','e','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','ts','ch','sh','sht','a','i','y','e','yu','ya','A','B','V','G','D','E','Zh','Z','I','Y','K','L','M','N','O','P','R','S','T','U','F','H','Ts','Ch','Sh','Sht','A','Y','Yu','Ya');

            if (preg_match('/[^а-яА-Я0-9]/', $string)) {
                return strtolower(str_replace($cyr, $lat, $string));
            } elseif (preg_match('/[^a-zA-Z0-9]/', $string)) {
                return strtolower(str_replace($lat, $cyr, $string));
            }
        }
    }

    private function Query($words = [], $current = 0)
    {
        $translite = $this->translit($words[$current]);

        if ($current == (count($words) - 1)) {
            return Qb("SELECT DISTINCT `id` FROM `?e` AS `t?i` WHERE (`t?i`.`content_index` LIKE '%?e%' OR `t?i`.`content_index` LIKE '%?e%')", array(
                $this->table,
                $current,
                $current,
                $words[$current],
                $current,
                $translite
            ));
        }

        return Qb("SELECT DISTINCT `id` FROM `?e` AS `t?i` WHERE (`t?i`.`content_index` LIKE '%?e%' OR `t?i`.`content_index` LIKE '%?e%') AND `id` IN (?e)", array(
            $this->table,
            $current,
            $current,
            $words[$current],
            $current,
            $translite,
            $this->Query($words, $current + 1)
        ));
    }

    public function sample()
    {
        if (!empty($this->words)) {
            $lingua = new Lingua;

            foreach ($this->words as &$word) {
                if (mb_strlen($word) > 3) {
                    $word = $lingua->stem_word($word);
                }
            }

            $this->words = array_flip(array_flip($this->words));

            usort($this->words, function ($a, $b) {
                return (strlen($a) == strlen($b)) ? 0 : (strlen($a) > strlen($b)) ? -1 : 1;
            });

            $this->words = array_diff($this->words, $this->stops);

            $cache = [];

            foreach ($this->words as $k => $item) {
                if (!empty($cache)) {
                    foreach ($cache as $temp_word) {
                        if (mb_substr($temp_word, 0, mb_strlen($item)) == $item) {
                            unset($this->words[$k]);
                        }
                    }
                }

                $cache[] = $item;
            }

            unset($cache);
        }
    }

    private function distance($source = '', $dest = '')
    {
        if ($source == $dest) {
            return 0;
        }

        $slen = strlen($source);
        $dlen = strlen($dest);

        if ($slen == 0) {
            return $dlen;
        } elseif ($dlen == 0) {
            return $slen;
        }

        $dist = range(0, $dlen);

        for ($i = 0; $i < $slen; $i++) {
            $_dist = array($i + 1);
            $char = $source{$i};
            for ($j = 0; $j < $dlen; $j++) {
                $cost = $char == $dest{$j} ? 0 : 1;
                $_dist[$j + 1] = min(
                    $dist[$j + 1] + 1,   // deletion
                    $_dist[$j] + 1,      // insertion
                    $dist[$j] + $cost    // substitution
                );
            }
            $dist = $_dist;
        }
        return $dist[$j];
    }

    // $source = 'PHP';
    // $dest = 'new PHP test';

    // echo distance($source, $dest) . "\n";
    // echo levenshtein($source, $dest); // built-in PHP function

    public function getPager()
    {
        return [];

        $pager['limit']     = $this->limit;
        $pager['hashcat']   = 'search-result';
        $pager['count']     = $count;
        $pager['current']   = $current;
        $pager['pages']     = ceil($count / $limit);
        $pager['prev']      = $current - 1;
        $pager['next']      = $current + 1;
        $pager['step']      = 9;
        $pager['query']     = '&q=' . $query;

        $pager['begin_from']    = $current - $pager['step'];
        $pager['begin_to']    = $pager['begin_from'] + $pager['step'];

        if ($pager['begin_from'] < 1) {
            $pager['begin_from'] = 1;
        }

        if (($current+1) <= $pager['pages']) {
            $pager['end_from']        = $current + 1;
            $pager['end_to']        = $current + $pager['step'] + 1;

            if ($pager['end_to'] >= $pager['pages']) {
                $pager['end_to'] = $pager['pages'];
            }
        }
    }
}
