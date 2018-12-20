<?php

class CPInit extends Viewer
{
    use Tools, Singleton;

    public $path = [];
    public $page = [ 'id' => 0 ];
    public $mpath = [];
    public $query = null;
    public $domain = null;
    public $server = 'localhost';
    public $canonical = [ 'id' => 0 ];

    protected $url      = null;
    protected $isSPA = false;
    protected $locale   = null;
    protected $request  = null;
    protected $backuri  = null;

    protected $viewer = null;
    protected $template_dir = null;
    protected $template_root = null;
    protected $template_alias = [];
    protected $template_driver = null;
    protected $template_caching = false;

    protected $csrf_token = null;
    protected $csrf_param = 'authenticity_token';

    protected $cache = null;
    protected $cache_enable = false;
    protected $cache_driver = null;
    protected $cache_compress = MEMCACHE_COMPRESSED;
    protected $cache_expire = 3600;
    protected $cache_path = '';
    protected $enabled_caching = false;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->declaration();

        $this->domain   =   $_SERVER['HTTP_HOST'];
        $this->request  =   urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
        $this->backuri  =   base64_encode($this->request);
        $this->query    =   $_SERVER['QUERY_STRING'];
        $this->url      =   current(explode('?', $this->request));
        $this->locale   =   $this->getLocale($this->request);
        $this->path     =   preg_split('/\/+/', $this->url, -1, PREG_SPLIT_NO_EMPTY);

        if (defined('IS_SPA') && IS_SPA && (!isset($this->path[0]) || $this->path[0] !== ADMIN_DIR)) {
            $this->path = [];
            $this->isSPA = IS_SPA;
        }

        $this->cache_path = md5(implode(':', $this->path) . 'q:' . $this->query);

        $this->template_driver = strtolower($this->template_driver);

        if (strstr($this->template_dir, '#')) {
            $this->template_dir = str_replace('#', $this->template_driver, $this->template_dir);
        }

        $this->protectCSRF();

        $this->viewer = new Viewer(
            $this->template_driver,
            $this->template_dir,
            $this->template_alias,
            $this->template_caching,
            $this->template_root
        );

        if (isset($this->path[0]) && $this->path[0] == $this->locale)
        {
            array_shift($this->path);
        }

        $this->mpath = $this->path;

        if ($this->locale == DEFAULT_LANGUAGE && isset($this->mpath[0]) && $this->mpath[0] == DEFAULT_LANGUAGE) {
            $mpath = $this->mpath;
            array_shift($mpath);
            redirect('/' . implode('/', $mpath), 301);
        }

        parent::__construct();
    }

    # CSRF
    #
    protected function protectCSRF()
    {
        if (defined('CSRF_PROTECTION') && CSRF_PROTECTION)
        {
            if (empty($_SESSION[$this->csrf_param]))
            {
                $_SESSION[$this->csrf_param] = $this->generateToken(33);
            }

            $this->csrf_token = $_SESSION[$this->csrf_param];
        }
    }

    public function rememberMe($userid = null)
    {
        /*
        XSRF Secure
        $this->secureXSRF(12);
        $this->autoLogin();
        */

        $token = $this->generateToken(24);

        do {
            $selector = $this->generateToken(9);
        } while (Q("SELECT count(id) as `count` FROM `#__auth_tokens` WHERE `selector`=?s", array( $selector ))->row('count') > 0);

        $expires = new \DateTime('now');
        $expires->add(new \DateInterval('P14D'));

        Q("INSERT INTO `#__auth_tokens` SET `expires` = ?s, `selector` = ?s, `userid` = ?i, `token` = ?s", array(
            $expires->format('Y-m-d H:i:s'),
            $selector,
            $userid,
            hash('sha256', $token)
        ));

        setcookie(
            'auth',
            base64_encode($selector).':'.base64_encode($token),
            time() + 1209600,
            '/',
            '.' . $this->domain,
            false,
            true
        );
    }

    public function autoLogin()
    {
        if (!empty($_COOKIE['auth'])) {
            $split = explode(':', $_COOKIE['auth']);

            if (count($split) !== 2) {
                $this->logger->warn("Badly formed auth cookie!");
                return false;
            }

            list($selector, $token) = $split;

            $dbresult = Q("
                    SELECT
                        `id`, `token`, `userid`
                    FROM `#__auth_tokens`
                    WHERE
                        `selector` = ?s AND `expires` <= CURDATE()
                ", array(
                    $selector
                )
            )->row();

            if ($dbresult) {
                if (hash_equals(
                    $dbresult['token'],
                    // hash('sha256', base64_decode($token))
                    hash('sha256', Base64Url\Base64Url::decode($token))
                )) {
                    // Privilege escalation - get a new random session ID
                    session_regenerate_id(true);

                    // Let's remove our old token.
                    Q("DELETE FROM `#__auth_tokens` WHERE `id`=?i LIMIT 1", array(
                        $dbresult['id']
                    ));

                    // Let's set the session variable appropriately...
                    $_SESSION['auth_user'] = $dbresult['userid'];

                    // Generate a new token for future convenience...
                    $this->rememberMe($dbresult['userid']);

                    // We return true here.
                    return true;
                }
            }
        }

        return false;
    }

    public static function generateToken($length = 33)
    {
        if (function_exists('random_bytes')) {
            $token = bin2hex(random_bytes($length));
        } else {
            $token = bin2hex(openssl_random_pseudo_bytes($length));
        }

        return Base64Url\Base64Url::encode($token);
    }

    public function logger($t1 = 0, $save = true)
    {
        // Проверит на размер лог файла
        $t2 = microtime(true);

        if (defined('SYSTEM_DEBUG') && SYSTEM_DEBUG == 1)
        {
            echo  '<style>.cmsDebug-wrap{ position: fixed; left: 10px; bottom: 10px; z-index: 1000000; display: block; font-size: 0; } .cmsDebug { float: left; height: 18px; margin-right: 2px; font-size: 11px; line-height: 18px; font-style: normal; padding: 0 7px; color: #fff; } .cmsDebug span { padding: 0 5px; color: #ffffff; display: inline-block; } </style>'
                , '<span class="cmsDebug-wrap">'
                , '<span class="cmsDebug" style="background: #d666af;">' . $_SESSION['sql'] . ' sql.</span>'
                , '<span class="cmsDebug" style="background: #cbc457;">' . count(get_included_files()) . ' Inc. files</span>'
                , '<span class="cmsDebug" style="background: #e5752b;">' . number_format(memory_get_usage()/1048576, 3) . ' Mb' . PHP_EOL . '</span>'
                , '<span class="cmsDebug" style="background: #e5752b;">' . number_format(memory_get_usage(true)/1048576, 3) . ' Mb' . PHP_EOL . '</span>'
                , '<span class="cmsDebug" style="background: #6379b7;">' . number_format(memory_get_peak_usage()/1048576, 3) . ' Mb.</span>'
                , '<span class="cmsDebug" style="background: #6379b7;">' . number_format(memory_get_peak_usage(true)/1048576, 3) . ' Mb.</span>'
                , '<span class="cmsDebug" style="background: #6ab755;">' . number_format($t2-$t1, 3) . ' S.</span>'
                , '</span>';

            echo '<style>';
            echo '
            .debugger { border-top: 1px solid #999; padding: 5px 10px; height: 35px; font-size: 0; overflow-y: auto; overflow-x: hidden; line-height: 1.4; position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; background: #f2f2f2; text-align: right; }
            .debugger__button { height: 24px; cursor: pointer; display: inline-block; vertical-align: middle; }
            .debugger__code { display: none; font-size: 13px; }
            .debugger.is-open { height: 300px; text-align: left; }
            .debugger.is-open .debugger__code { display: block; padding: 25px; }
            .debugger.is-open .debugger__button { display: none; }
            ';
            echo '</style>';
            echo '<div class="debugger" id="debugger">';
            echo '<button type="button" class="debugger__button" onclick="document.getElementById(\'debugger\').classList.add(\'is-open\');">SQL LOG</button>';
            echo '<pre class="debugger__code">';
            print_r(isset($_SESSION['sql_log']) ? $_SESSION['sql_log'] : []);
            echo '</pre>';
            echo '</div>';
        }

        if ($save) {
            $json = json_encode([
                'url'       =>  $_SERVER['REQUEST_URI'],
                'sql'       =>  $_SESSION['sql'],
                'files'     =>  count(get_included_files()),
                'time'      =>  number_format($t2-$t1, 3),
                'memory'    =>  number_format(memory_get_usage()/1048576, 3),
                'memory_peak'   =>  number_format(memory_get_peak_usage()/1048576, 3)
            ]);

            $log_file = PATH_RUNTIME.DS.'logs'.DS.'log-time.txt';

            if (file_exists($log_file)) {
                clearstatcache(true, $log_file);

                if (filesize($log_file) > 1024 * 3) {
                    unlink($log_file);
                }
            }

            $handle = fopen($log_file, 'a+');
            fwrite($handle, $json.PHP_EOL);
            fclose($handle);

            /*
            $included_files = get_included_files();

            if (count($included_files))
            {
                echo '<style>';
                echo '.debugger { position: fixed;z-index: 9999;height: 250px;width: 100%;bottom: 35px;background-color: #2f27c1; color: #fff; border: 1px solid #443f9b; padding: 10px 30px;overflow: auto; }';
                echo '.debugger ul { list-style-type: none; }';
                echo '.debugger li { margin-bottom: 5px; font-size: 15px; }';
                echo '</style>';

                echo '<div class="debugger"><ul>';
                foreach ($included_files as $key => $value) {
                    echo '<li>', $key, ': ', str_replace(str_replace('/public_html', '', PATH_ROOT), '', $value), '</li>';
                }
                echo '</ul></div>';
            }
            */
        }
    }

    public static function headers($cache = false)
    {
        if (!$cache) {
            header("X-XSS-Protection: 1; mode=block");
        }

        header("Last-Modified: " . gmdate('D, d M Y H:i:s', (time() - 3600)) . " GMT");
        header("Cache-control: public");

        if ($cache) {
            header("Cache-control: max-age=31536000");
        } else {
            header("Strict-Transport-Security: max-age=31536000");
            header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0');
            header("Pragma: no-cache");
        }

        header("Expires: " . date("r", time() + 2592000));
    }

    protected function arguments()
    {
        $args = [];

        if (strstr($this->router, ':')) {
            $last = preg_split('/\/+/', $this->router, -1, PREG_SPLIT_NO_EMPTY);

            if (!empty($last)) {
                foreach ($this->path as $key => $value) {
                    if (!isset($last[ $key ]) || strstr($last[ $key ], ':')) {
                        $args[] = $value;
                    }
                }
            }
        }

        return $args;
    }

    protected function declaration()
    {
        $cache = PATH_CACHE.DS.'constants.json';

        if (file_exists($cache)) {
            $constants = json_decode(file_get_contents($cache), true);
        } else {
            $constants = Q("SELECT `var`, `value` FROM `#__sys_settings`")->all();
            file_put_contents($cache, json_encode($constants, 64 | 256));
        }

        if (!empty($constants)) {
            foreach ($constants as $arr) {
                if (!defined($arr['var'])) {
                    define($arr['var'], $arr['value']);
                }
            }
        }

        $this->enabled_caching = defined('ENABLECACHE') ? ENABLECACHE : false;
    }
}
