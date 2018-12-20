<?php

class Module extends CPInit
{
    use Tools, Singleton;

    public $caching     =   1;
    public $limit       =   12;
    public $module      =   [];
    public $arguments   =   [];
    public $breadcrumbs =   [];
    public $module_root =   null;
    public $errorPage   =   [ 'page' => [ 'id' => 0 ] ];
    public $words       =   [ 'a', 'b', 'c', 'd', 'e', 'f', 'k', 'u', 'i' ];

    public $csrf_token  =   null;
    public $csrf_param  =   null;

    public function __construct()
    {
        $this->cache_enable = defined('ENABLECACHE') && ENABLECACHE;

        parent::__construct();
    }

    public function router()
    {
        if (!empty($this->arguments[1])) {
            return $this->errorPage;
        }

        if (!empty($this->arguments[0])) {
            return $this->itemMethod($this->arguments[0]);
        }

        return $this->listMethod();
    }

    public function setModuleRoot($_value = '')
    {
        $this->module_root = $_value;
    }

    public function setArguments($_value = [])
    {
        $this->arguments = $_value;
    }

    public function setModule($_value = [])
    {
        $this->module = $_value;
    }

    public function setLocale($_value = '')
    {
        $this->locale = $_value;
    }

    public function setPage($_value = '')
    {
        $this->page = $_value;
    }

    public function setCaching($_value = '')
    {
        if (isset($this->module['cache'])) {
            $this->caching = intval($this->module['cache']);
        }
    }

    public function countItem()
    {
        $cache = 'module.count.'.$this->module['func_name'];

        if (!$this->cache_enable || ($this->caching == 1 && !($count = $this->getCache($cache)))) {
            $count = Q("SELECT COUNT(`id`) AS `count`
                        FROM `#_mdd_" . $this->module['func_name'] . "`
                        WHERE `visible`=1
                        LIMIT 1")->row('count');

            $this->setCache($cache, $count);
        }

        return $count;
    }

    public function setCSRF($token = '', $param = '')
    {
        if (defined('CSRF_PROTECTION') && CSRF_PROTECTION)
        {
            $this->csrf_token = $token;
            $this->csrf_param = $param;
        }
    }

    protected function checkCSRF($data = [])
    {
        if (!defined('CSRF_PROTECTION') || !CSRF_PROTECTION) {
            return true;
        }

        $status = false;

        if (isset($data[$this->csrf_param]))
        {
            $token = $data[$this->csrf_param];

            if (hash_equals($token, $this->csrf_token))
            {
                $status = true;
            }

            unset($_SESSION[$this->csrf_param]);
        }

        return $status;
    }

    protected function checkRECAPTCHA($data = [], $secret = '')
    {
        $status = false;

        if (!empty($data['g-recaptcha-response']))
        {
            $url = 'https://www.google.com/recaptcha/api/siteverify';
            $response = $data['g-recaptcha-response'];

            $data = [
                'secret' => $secret,
                'response' => $response
            ];

            $options = [
                'http' => [
                    'method' => 'POST',
                    'content' => http_build_query($data)
                ]
            ];

            $verify = file_get_contents($url.'?secret='.$secret.'&response='.$response.'&remoteip='.$_SERVER['REMOTE_ADDR']);

            $captcha_success = json_decode($verify);

            $status = $captcha_success->success;
        }

        return $status;
    }

    public function listAction($fields = [], $where = [], $group = [], $order = [], $limit = [ 0, 10 ])
    {
        $result = [];

        $hash = '_module_' . strtolower(get_class($this)) . $this->cache_path;

        if (!$this->cache_enable || ($this->caching == 1 && !($result = $this->getCache($hash)))) {
            if (!empty($fields)) {
                $_sql = '';
                $_inc = '';

                $_join = [];

                $_files = '#__sys_files';
                $_table = '#_mdd_' . $this->module['func_name'];

                $_buf[$_table] = array_shift($this->words);
                $_buf[$_files] = array_shift($this->words);
                $_grp[$_table] = [];

                foreach ($fields as $_field) {
                    if (is_array($_field)) {
                        $_t = $_field;

                        // [column] => photo
                     //    [from] => #__sys_files
                     //    [as] => alt

                        if (isset($_t[1]) && in_array(strtolower($_t[1]), [ 'date_format', 'empty', 'file', 'photo_title' ])) {
                        }

                        __debug($_t, 's');
                    }

                    if (strstr($_field, ':')) {
                        $_t = explode(':', $_field);

                        __debug($_t);

                        if (isset($_t[1]) && in_array(strtolower($_t[1]), [ 'date_format', 'empty', 'file', 'photo_title' ])) {
                            $_inc .= "\n\t";

                            switch ($_t[1]) {

                                case 'date_format':

                                    $_inc .= "DATE_FORMAT(STR_TO_DATE(`" . $_buf[$_table] . "`.`" . $_t[0] . "`, '%d.%m.%Y'), '%Y-%m-%d') AS `" . $_t[2] . "`";

                                break;

                                case 'empty':

                                    $_inc .= "if (TRIM(COALESCE(`" . $_buf[$_table] . "`.`" . $_t[0] . "`, '')) !='', 1, 0) AS `" . $_t[2] . "`";

                                break;

                                case 'file':

                                    $_inc .= "`" . $_buf[$_files] . "`.`file` AS `" . $_t[2] . "`";

                                    $_join[$_buf[$_files]] = [
                                        'db'    =>    $_files,
                                        'field'    =>    'gid',
                                        'file'    =>    $_t[0]
                                    ];

                                break;

                                case 'photo_title':

                                    $_inc .= "`" . $_buf[$_files] . "`.`alt` AS `" . $_t[2] . "`";

                                    $_join[$_buf[$_files]] = [
                                        'db'    =>    $_files,
                                        'field'    =>    'gid',
                                        'file'    =>    $_t[0]
                                    ];

                                break;
                            }
                        }
                    } else {
                        $_inc .= '`' . $_buf[$_table] . '`.' . '`' . $_field . '`';
                    }

                    if (next($fields)) {
                        $_inc .= ', ';
                    }
                }

                $_sql .= "SELECT " . $_inc ."\nFROM `" . $_table . "` AS `" . $_buf[$_table] . "` " . "\n";

                if (!empty($_join)) {
                    foreach ($_join as $_key => $_data) {
                        $_sql .= "LEFT JOIN `" . $_data['db'] . "` AS `" . $_key . "` ON `" . $_key . "`.`" . $_data['field'] . "` LIKE `" . $_buf[$_table] . "`.`" . $_data['file'] . "` " . "\n";
                    }
                }

                if (!empty($where)) {
                    foreach ($where as $_key => $_value) {
                        $_sql .= "WHERE `" . $_buf[$_table] . "`.`" . $_key . "`=" . $_value . " " . "\n";
                    }
                }

                if (!empty($group)) {
                    $_sql .= "GROUP BY ";

                    foreach ($group as $_value) {
                        $_sql .= "`" . $_buf[$_table] . "`.`" . $_value . "`" . "\n";
                    }
                }

                if (!empty($order)) {
                    $_sql .= "ORDER BY ";

                    foreach ($order as $_key => $_value) {
                        $_sql .= "`" . $_buf[$_table] . "`.`" . $_key . "` " . strtoupper($_value) . "";

                        if (next($order)) {
                            $_sql .= ', ';
                        }
                    }
                }

                if (!empty($limit)) {
                    if (is_array($limit) && count($limit) == 2) {
                        $_sql .= " LIMIT " . $limit[0] . "," . $limit[1];
                    } elseif (is_numeric($limit) && $limit > 0) {
                        $_sql .= " LIMIT " . $limit;
                    }
                }

                $result = Q($_sql)->all();
                __debug($result, $_sql);
            }

            $this->setCache($hash, $result);
        }

        return $result;
    }

    public function itemAction()
    {
        $news = [];

        if (empty($news)) {
            return $this->errorPage;
        }

        return [];
    }

    public function prepareSEO(&$data = [], $time = '')
    {
        if (!empty($data['date']))
        {
            $timestamp = strtotime($data['date']);

            $date = date('Y-m-d', $timestamp);

            if ($time)
            {
                $date .= 'T'.$time;
            }

            $data['date_seo'] = $date;
        }
    }

    public function compiled($cache = '')
    {
        if (!$this->cache_enable || $this->caching === 0 || ($this->caching === 1 && !($data = $this->getCache($cache)))) {
            return false;
        }

        return $data;
    }

    public function pager($pages = 0, $limit = 10, $hash = '#content')
    {
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;

        if ($page == 0) {
            $page = 1;
        }

        $start = ($page - 1) * $limit;

        $count = ceil($pages / $limit);

        $pager = new StdClass();

        $pager->hash = $hash;
        $pager->page = $page;
        $pager->count = $count;
        $pager->total = $pages;
        $pager->limit = $limit;
        $pager->start = $start;

        if ($page > 1) {
            $pager->prev = $page - 1;
        }

        if ($page < $count) {
            $pager->next = $page + 1;
        }

        return $pager;
    }

    public function linkCreate()
    {
        $url = $this->module_root;
        $arguments = func_get_args();

        if (!empty($arguments)) {
            foreach ($arguments as $uri) {
                $url .= '/' . trim($uri);
            }
        }

        return $url;
    }

    public function metaData(&$item = [])
    {
        $meta = [];
        $keys = [ 'meta_title', 'meta_robots', 'meta_keywords', 'meta_description' ];

        foreach ($keys as $key) {
            if (isset($item[$key])) {
                $meta[str_replace('meta_', '', $key)] = $item[$key];
                unset($item[$key]);
            }
        }

        return $meta;
    }

    public function addBreadCrumbs($item = [], $keys = [ 'id', 'pid', 'name', 'system', 'link' ])
    {
        $needle = [
            'id',
            'pid',
            'name',
            'sys_name',
            'link'
        ];

        $instance = [];

        foreach ($needle as $key => $name) {
            $system = isset($keys[$key]) ? $keys[$key] : '';
            $data = '';

            if (isset($item[$system])) {
                $data = stripslashes($item[$system]);
            }

            $instance[$name] = $data;
        }

        if (!$instance['link']) {
            $instance['link'] = $this->linkCreate($instance['sys_name']);
        }

        $this->breadcrumbs[] = $instance;
    }
}
