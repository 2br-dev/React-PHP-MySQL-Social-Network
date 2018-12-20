<?php

declare(strict_types=1);

namespace Fastest\Core;

class Kernel extends \Fastest\Core\Init
{
    use \Tools, \Singleton;

    protected $viewer = null;
    protected $template = [];

    protected $nonceToken = null;

    protected $csrf_token = null;
    protected $csrf_param = 'authenticity_token';

    protected $errorPage = [
        'id' => 0,
        'pid' => 0,
        'tid' => 0,
        'dynamic' => 0,
        'lang' => 'ru',
        'name' => 'Страница не найдена',
        'title' => 'Страница не найдена (404)',
        'robots' => '',
        'keywords' => '',
        'referer' => '',
        'description' => '',
        'content' => '',
        'system' => '',
    ];

    public function __construct()
    {
        $this->template['driver'] = strtolower($this->template['driver']);

        if (strstr($this->template['dir'], '#')) {
            $this->template['dir'] = str_replace('#', $this->template['driver'], $this->template['dir']);
        }

        $this->setCSRF();

        $this->setNONCE();

        $this->viewer = new Viewer(
            $this->template['driver'],
            $this->template['dir'],
            [],
            null,
            null,
            $this->nonceToken
        );

        parent::__construct();
    }

    /**
     * Set HTTP headers.
     *
     * @param $cache
     */
    public function headers($cache = false)
    {
        return new \Fastest\Core\Headers($cache, $this->nonceToken);
    }

    /**
     * Assign vars.
     *
     * @param $data
     * @param $module
     */
    public function assignVars($data = [], $module = '')
    {
        if (!empty($data)) {
            $systemKeys = ['page', 'meta', 'assets', 'breadcrumbs'];

            foreach ($data as $key => $vars) {
                if (in_array($key, $systemKeys)) {
                    if ($key === 'assets' && $module) {
                        foreach ($vars as &$file) {
                            $file = PATH_MODULE.DS.$module.DS.$file;
                        }
                    }

                    $this->{$key} = array_merge($this->{$key}, $vars);
                } else {
                    if (is_object($vars)) {
                        $vars = get_object_vars($vars);
                    }

                    $this->viewer->assign($key, $vars, false);
                }
            }
        }

        $this->viewer->assign('_nonceToken', $this->nonceToken, true);

        # Variables associated with a url
        #
        $this->viewer->assign('uri', $this->path, true);
        $this->viewer->assign('_locale', $this->locale, true);
        $this->viewer->assign('_backuri', $this->backuri, true);

        # Path variables
        #
        $this->viewer->assign('PATH_ROOT', PATH_ROOT, false);
        $this->viewer->assign('PATH_MODULE', PATH_MODULE, false);
        $this->viewer->assign('PATH_THEMES', PATH_THEMES, false);

        if (!is_null($this->csrf_token)) {
            $this->viewer->assign('_csrf_token', $this->csrf_token, true);
            $this->viewer->assign('_csrf_param', $this->csrf_param, true);
        }
    }

    public function isAdmin()
    {
        if (isset($_SESSION['userinf']['gid']) && in_array($_SESSION['userinf']['gid'], [1, 10])) {
            return true;
        }

        return false;
    }

    public function logger($t1 = 0, $save = true)
    {
        if ($this->isAdmin()) {
            $t2 = microtime(true);

            $template = include PATH_RESOURCE.DS.'panel/template.php';

            $template(
                $_SESSION['sql'],
                $_SESSION['sql_log'],
                $this->backuri,
                $this->page,
                count(get_included_files()),
                number_format(memory_get_usage() / 1048576, 5),
                number_format(memory_get_peak_usage() / 1048576, 5),
                number_format($t2 - $t1, 5)
            );

            echo '<style>'.file_get_contents(PATH_RESOURCE.DS.'panel/style.css').'</style>',
                 '<script nonce="'.$this->nonceToken.'">var PANEL_API_URL = "/'.ADMIN_DIR.'/api";</script>',
                 '<script nonce="'.$this->nonceToken.'">'.file_get_contents(PATH_RESOURCE.DS.'panel/libs.js').'</script>',
                 '<script nonce="'.$this->nonceToken.'">'.file_get_contents(PATH_RESOURCE.DS.'panel/script.js').'</script>',
                 '<script nonce="'.$this->nonceToken.'">'.file_get_contents(PATH_RESOURCE.DS.'panel/init.js').'</script>';
        }
    }

    /**
     * Generate content security policy nonce-* token for script injection protect.
     */
    protected function setNONCE()
    {
        $this->nonceToken = $this->generateToken(16);
    }

    /**
     * Generate CSRF protection token.
     */
    protected function setCSRF()
    {
        if (defined('CSRF_PROTECTION') && CSRF_PROTECTION) {
            if (empty($_SESSION[$this->csrf_param])) {
                $_SESSION[$this->csrf_param] = $this->base64Token(33);
            }

            $this->csrf_token = $_SESSION[$this->csrf_param];
        }
    }

    /**
     * Check equal generated CSRF token and user POST token.
     *
     * @param $post
     */
    protected function checkCSRF($post = [])
    {
        if (!defined('CSRF_PROTECTION') || !CSRF_PROTECTION) {
            return true;
        }

        $status = false;

        if (isset($post[$this->csrf_param])) {
            $token = $post[$this->csrf_param];

            if (!hash_equals($token, $this->csrf_token)) {
                $status = false;
            }

            $status = true;

            unset($_SESSION[$this->csrf_param]);
        }

        return $status;
    }

    protected function declare()
    {
        $cache = PATH_CACHE.DS.'constants.json';

        if (file_exists($cache)) {
            $constants = json_decode(file_get_contents($cache), true);
        } else {
            $constants = Q('SELECT `var`, `value` FROM `#__sys_settings`')->all();
            file_put_contents($cache, json_encode($constants, 64 | 256));
        }

        if (!empty($constants)) {
            foreach ($constants as $constant) {
                if (!defined($constant['var'])) {
                    define($constant['var'], $constant['value']);
                }
            }
        }
    }
}
