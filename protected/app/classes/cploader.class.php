<?php

class CPLoader extends CPInit
{
    use Singleton, Tools;

    private $user = null;
    private $config = null;
    private $controller = '';

    protected $isAjax = false;
    protected $submenu = [];
    protected $pattern = '';
    protected $tpl_path = '';
    protected $include_path = '';
    protected $tpl_exbody = 'index';
    protected $info_array = [];

    protected $module = 'meta';
    protected $action = 'index';
    protected $method = 'list';
    protected $content = '';
    protected $transfer = [];
    protected $element = null;
    protected $argument = 0;
    protected $base_path = '';
    protected $page_root = '';
    protected $request_path = '';
    protected $templateExtension = '';

    public $tpl = ['base' => 'base', 'new' => 'new', 'auth' => 'auth'];
    public $parts = [];
    public $locale = 'ru';
    public $localize = [];

    public $error_hdr = 'Ошибка';
    public $error_msg = 'Ошибка. Путь для модуля не задан.';

    public function __construct()
    {
        $this->template_dir = 'admin-template';
        $this->template_root = PATH_CORE;
        $this->template_driver = 'smarty';
        $this->templateExtension = '.tpl';
        $this->template_caching = false;

        // $this->template_dir = 'admin-template-twig';
        // $this->template_root = PATH_CORE;
        // $this->template_driver = 'Twig';
        // $this->templateExtension = '.twig';
        // $this->template_caching = false;
        // $this->template_alias = $this->getAliases();

        parent::__construct();

        $this->user = new Person;

        $this->declaration();

        if (defined('SYSTEM_LOCALE')) {
            $this->locale = SYSTEM_LOCALE;
        }

        if (isset($this->path[1])) {
            $this->module = $this->path[1];
        }

        if (isset($this->path[2])) {
            $this->action = str_replace('-', '_', $this->path[2]);
        }

        if (isset($this->path[3])) {
            $this->method = $this->path[3];
        }

        if (isset($this->path[4])) {
            $this->element = $this->path[4];
        }

        if (isset($this->path[5])) {
            $this->argument = $this->path[5];
        }

        $this->base_path = DS.ADMIN_DIR.DS.$this->module;
        $this->page_root = DS.ADMIN_DIR.DS.$this->module.DS.$this->action;

        if (count($_POST) && $this->module !== 'ajax' && (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest')) {
            $this->action = 'post';
            $this->transfer = $_POST;
        }

        if ($this->module == 'api' && $this->action) {
            $this->loadAPI();
        }

        $this->tpl_path = PATH_CORE.DS.$this->template_dir.DS.'view'.DS.$this->module;
        $this->include_path = DS.'view'.DS.$this->module;

        $this->request_path = DS.implode(DS, $this->path);

        if ($this->query) {
            $this->request_path .= '?'.$this->query;
        }
    }

    private function loadController()
    {
        $this->controller = $this->module . 'Controller';

        if (!class_exists($this->controller)) {
            $this->errorPage();
        } else {
            $controller = new $this->controller;

            if (method_exists($controller, $this->action)) {
                $data = $controller->{$this->action}($this->transfer);

                if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
                    exit(json_encode($data, 64 | 256));
                }

                if ($this->module == 'ajax') {
                    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
                        exit($data);
                    }

                    return true;
                }

                $tpl_exbody = '';

                if (!empty($data) && is_array($data)) {
                    foreach ($data as $key => $value) {
                        $this->viewer->assign($key, $value, false);
                    }

                    if (isset($data['tpl_exbody'])) {
                        $tpl_exbody = $data['tpl_exbody'];
                    }
                }

                $this->info_array = [];

                if (isset($this->localize[$this->action . '_name'])) {
                    $this->info_array['name']    = $this->localize[$this->action . '_name'];
                } elseif (isset($this->localize[$this->module . '_name'])) {
                    $this->info_array['name']    = $this->localize[$this->module . '_name'];
                }

                if (isset($this->localize[$this->action . '_header'])) {
                    $this->info_array['header']    = $this->localize[$this->action . '_header'];
                } elseif (isset($this->localize[$this->module . '_header'])) {
                    $this->info_array['header']    = $this->localize[$this->module . '_header'];
                }

                foreach ($this->info_array as $k=>$v) {
                    $this->viewer->assign($k, $v);
                }

                $tpl_exbody = $this->moduleTemplate($tpl_exbody);

                if (!file_exists($tpl_exbody . $this->templateExtension)) {
                    $this->errorPage();
                } else {
                    $this->content = $this->viewer->fetch($tpl_exbody);
                }
            }
        }
    }

    private function getAliases()
    {
        $aliases = [];

        $root = $this->template_root.DS.$this->template_dir;

        $dirs = array_diff(scandir($root), ['..', '.']);

        if (!empty($dirs))
        {
            foreach($dirs as $name)
            {
                if (is_dir($root.DS.$name)) {
                    $aliases[$name] = $root.DS.$name;
                }
            }
        }

        return $aliases;
    }

    private function moduleTemplate($tpl_exbody = '')
    {
        if ($tpl_exbody) {
            $this->tpl_exbody = $tpl_exbody;
        } else {
            if ($this->action == 'list' && !$this->method) {
                $this->tpl_exbody = $this->tpl_exbody;
            } else {
                $action = $this->action;

                if ($this->action == 'post') {
                    $action = 'index';
                }

                if ($this->method == 'list') {
                    $this->tpl_exbody =  $action.DS.'index';
                } else {
                    $this->tpl_exbody =  $action.DS.$this->method;
                }
            }
        }

        if (!file_exists($this->tpl_path.DS.$this->tpl_exbody) && !in_array($this->method, array('visible', 'del', 'delete'))) {
            //exit($this->tpl_path.DS.$this->tpl_exbody);
        }

        return $this->tpl_path.DS.$this->tpl_exbody;
    }

    private function errorPage()
    {
        $this->viewer->assign('header', $this->error_hdr);
        $this->viewer->assign('content', $this->error_msg);
    }

    protected function getTemplate()
    {
        if ($this->user->getAdminAccess())
        {
            $this->pattern = $this->tpl['base'];
        }
        else {
            $this->pattern = $this->tpl['auth'];
        }
    }

    /**
     * @return string
     */
    public function navigation($pid = 0)
    {
        if (!$this->cache_enable || ($this->cache_enable && !$slice = $this->getCache('cp_structure_' . $pid))) {
            $slice = Q("SELECT `id`, `name`, `sys_name` as `root`, `icon`, `dir`, `bonds`, `groups` as `group` FROM `#__cp_structure` WHERE `visible`=1 AND `pid`=?i ORDER BY `ord`", array( $pid ))->all('root');

            if (!empty($slice)) {
                foreach ($slice as $k => &$str) {
                    if (isset($this->localize[$str['name']])) {
                        $str['name'] = $this->localize[$str['name']];
                    }

                    if ($str['group'] !== '' && isset($_SESSION['userinf']['gid']) && !in_array($_SESSION['userinf']['gid'], explode(',', $str['group']))) {
                        unset($slice[$k]);
                    }

                    if ($str['root'] == 'tasks' || $str['root'] == 'shopping') {
                        $str['count'] = Q("SELECT COUNT(*) AS `count` FROM `#__cp_tasks` LIMIT 1")->row('count');
                    }
                }
            }

            if ($this->cache_enable) {
                $this->setCache('cp_structure_' . $pid, $slice);
            }
        }

        if ($pid == 0) {
            $this->parts = $slice;
        }

        return $slice;
    }

    private function localization()
    {
        if (!$this->cache_enable || ($this->cache_enable && !$this->localize = $this->getCache('localization')))
        {
            $this->localize = Q("SELECT `key`, `val` FROM `#__str_dictionary` WHERE `locale`=?s AND `system`=?i", array(
                $this->locale, 1
            ))->all('key');

            if (!empty($this->localize))
            {
                foreach ($this->localize as $key => $arr)
                {
                    $this->localize[$key] = $arr['val'];
                }
            }

            if ($this->cache_enable) {
                $this->setCache('localization', $this->localize);
            }
        }
    }

    public function configure()
    {
        if (!isset($_SESSION['configuration']) || empty($_SESSION['configuration'])) {
            if (file_exists(PATH_ADMIN.DS.'json'.DS.'config.json')) {
                $_SESSION['configuration'] = json_decode(file_get_contents(PATH_ADMIN.DS.'json'.DS.'config.json'), true);
            } else {
                $_SESSION['configuration'] = [];
            }
        }

        $this->config = $_SESSION['configuration'];
    }

    private function loadAPI()
    {
        $this->isAjax = true;

        $response = [];

        switch ($this->action) {
            case 'clearcache':

                $response['status'] = $this->clearCache();

                break;

            case 'enable':

                if ($this->method === 'cache') {
                    Q("UPDATE `#__sys_settings` SET `value`=1 WHERE `var` LIKE 'ENABLECACHE' LIMIT 1");
                }

                break;

            case 'disable':

                if ($this->method === 'cache') {
                    Q("UPDATE `#__sys_settings` SET `value`=0 WHERE `var` LIKE 'ENABLECACHE' LIMIT 1");
                }

                break;

            default:
                break;
        }

        header('Content-Type: application/json');

        exit(json_encode($response, 64 | 256));
    }

    public function clearCache($request = [])
    {
        $clearcache = '';

        if (!empty($request['server'])) {
            $this->server = $request['server'];
        }

        if (isset($_GET['cleancache']) && !empty($_GET['cleancache']))
        {
            $clearcache = $_GET['cleancache'];
        }

        if ($this->module == 'api' && $this->action == 'clearcache')
        {
            $clearcache = $this->method;
        }

        if ($clearcache)
        {

            $allow = [ 'task', 'config', 'smarty', 'template', 'scripts', 'styles', 'memory', 'data', 'all' ];

            if (in_array($clearcache, $allow))
            {
                $cache = new Cache;

                switch ($clearcache) {
                    case 'all':

                        $cache->clearFiles(['php', 'css', 'json', 'js']);
                        $cache->clearMemory();
                        $cache->clearSession(['site_menu', 'configuration']);

                    break;

                    case 'smarty':
                    case 'template':

                        $cache->clearTemplate();

                    break;

                    case 'styles':

                        $cache->clearStyles();

                    break;

                    case 'scripts':

                        $cache->clearScripts();

                    break;

                    case 'data':
                    case 'memory':

                        $cache->clearMemory();

                    break;

                    case 'task':

                    break;

                    case 'config':

                        $cache->clearSession(['site_menu', 'configuration']);

                    break;
                }
            }

            if (!$this->isAjax)
            {
                $backuri = DS.ADMIN_DIR.DS.'meta';

                if (isset($_GET['backuri']) && $_GET['backuri'] !== '')
                {
                    $backuri = base64_decode($_GET['backuri']);
                }

                redirect($backuri);
            }

            return true;
        }

        return false;
    }

    public function breadcrumbs()
    {
        $bc = [];
        $link = '';
        $index = 0;

        foreach ($this->path as $system) {
            $name = '';
            $link .= DS.$system;

            if ($index == 0) {
                $name = '<i class="zmdi zmdi-view-dashboard"></i>';
            }

            if ($index == 1 && isset($this->parts[$system]['name'])) {
                $name = $this->parts[$system]['name'];
            }

            if ($index == 2 && isset($this->submenu[$system]['name'])) {
                $name = $this->submenu[$system]['name'];
            }

            if ($name !== '') {
                $bc[] = array(
                    'name' => $name,
                    'link' => $link
                );
            }

            $index++;
        }

        if ($this->module == 'meta' && $this->element) {
            $mdd = new Mdd();
            $module = $mdd->getModuleItem($this->element);

            $bc[] = array(
                'name' => $module['name'],
                'link' => $this->base_path.DS.$this->action.DS.'list'.DS.$this->element
            );
        }

        if (in_array('edit', $this->path)) {
            $bc[] = array(
                'name' => 'Редактирование',
                'link' => ''
            );
        }

        if (in_array('add', $this->path)) {
            $bc[] = array(
                'name' => 'Добавление',
                'link' => ''
            );
        }

        return $bc;
    }

    public function run()
    {
        $this->headers(false);
        $this->configure();

        $this->clearCache($_REQUEST);

        if ($this->user->getAdminAccess() && !isset($this->path[1]))
        {
            $page = '/dashboard';

            if (defined('SYSTEM_MAINPAGE') && is_numeric(SYSTEM_MAINPAGE))
            {
                $page = Q("SELECT `dir` FROM `#__cp_structure` WHERE `id`=?i LIMIT 1", [
                    SYSTEM_MAINPAGE
                ])->row('dir');
            }

            redirect(DS.ADMIN_DIR.$page);
        }

        $this->localization();

        $menu = $this->navigation();

        if ($this->module !== '' && !empty($this->parts[$this->module]['id'])) {
            $this->submenu = $this->navigation($this->parts[$this->module]['id']);
        }

        $site_temp = explode('.', $_SERVER['HTTP_HOST']);
        $site_name = [];
        $site_name[] = array_pop($site_temp);
        $site_name[] = array_pop($site_temp);

        $site_name = array_reverse($site_name);

        $breadcrumbs = $this->breadcrumbs();

        $this->config['redactor_list'] = [];

        if (isset($this->config['redactor'])) {
            foreach ($this->config['redactor'] as $item) {
                $rd = [];

                $rd['default']  = isset($item['default']) ? true : false;
                $rd['value']    = $item['system'];
                $rd['text']     = $item['name'];

                $this->config['redactor_list'][] = $rd;
            }
        }

        $this->viewer->assign('_path', $this->path);
        $this->viewer->assign('request_path', $this->request_path, false);
        $this->viewer->assign('base_path', $this->base_path, false);
        $this->viewer->assign('_config', $this->config);
        $this->viewer->assign('TPL_PATH', $this->tpl_path);
        $this->viewer->assign('INCLUDE_PATH', $this->include_path);
        $this->viewer->assign('PATH_HASH', @md5('|'.implode('|', $this->path).'|'));
        $this->viewer->assign('PATH_PUBLIC', DS.'apps');
        $this->viewer->assign('PATH_ROOT', PATH_ROOT);
        $this->viewer->assign('ADMIN_DIR', ADMIN_DIR);
        $this->viewer->assign('ADMIN_LOCALE', $this->locale);
        $this->viewer->assign('navigation', $menu);
        $this->viewer->assign('submenu', $this->submenu);
        $this->viewer->assign('breadcrumbs', $breadcrumbs, true);
        $this->viewer->assign('_backuri', base64_encode($_SERVER['REQUEST_URI']), true);
        $this->viewer->assign('_site_name', $site_name, false);
        $this->viewer->assign('locale', $this->localize);
        $this->viewer->assign('page_count', [5, 10, 15, 20, 25, 30, 40, 50]);

        $this->viewer->assign('_module', $this->module);
        $this->viewer->assign('_action', $this->action);
        $this->viewer->assign('_method', $this->method);

        $this->getTemplate();
        $this->loadController();

        $this->viewer->assign('content', $this->content, true);

        $this->viewer->display($this->pattern);
    }
}
