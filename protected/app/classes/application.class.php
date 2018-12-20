<?php declare(strict_types = 1);

final class Application extends CPInit
{
    use Singleton, Tools;

    protected $template_vars    = [];
    protected $search_var       = 'q';
    protected $_server          = [];
    protected $arguments        = [];
    private $pattern            = 'base';
    private $router             = [];

    public $page                = [];
    public $assets              = [];
    public $cachetree           = [];
    public $sitemap             = [];
    public $sitemenu            = [];
    public $sitemenuCache       = [];
    public $submenu             = [];
    public $dynamic_page        = false;
    public $breadcrumbsTree     = [];

    private $error = [
        'id'            => 0,
        'pid'           => 0,
        'tid'           => 0,
        'dynamic'       => 0,
        'lang'          => 'ru',
        'name'          => 'Страница не найдена',
        'title'         => 'Страница не найдена (404)',
        'robots'        => '',
        'keywords'      => '',
        'referer'       => '',
        'description'   => '',
        'content'       => '',
        'system'        => ''
    ];

    public function __construct()
    {
        $this->template_driver = TEMPLATING;
        $this->template_dir = SITE_THEME.'/#/';
        $this->template_caching = $this->enabled_caching;

        parent::__construct();
    }

    protected function recursionBCrumbs(&$tree = [], &$path = [])
    {
        $sys_name = array_shift($path);

        foreach($tree as $key => $arr)
        {
            if ($arr['sys_name'] == $sys_name)
            {
                $this->breadcrumbsTree[] = [
                    'id'        => $arr['id'],
                    'pid'       => $arr['pid'],
                    'name'      => (isset($arr['menuname']) && $arr['menuname'] !== '') ? $arr['menuname'] : $arr['name'],
                    'sys_name'  => $arr['sys_name'],
                    'link'      => $arr['link']
                ];

                if (empty($arr['tree']) || empty($path))
                {
                    unset($arr['tree']);
                    return $arr;
                }
                else
                {
                    return $this->recursionBCrumbs($arr['tree'], $path);
                }
            }
        }

        return [];
    }

    protected function breadcrumbs()
    {
        $cache = 'page.breadcrumbs.cache';

        if (!$this->cache_enable || !($this->breadcrumbsTree = $this->getCache($cache)))
        {
            $breadcrumbs = [];

            if (!empty($this->template_vars))
            {
                foreach($this->template_vars as $name => $vars)
                {
                    if (is_object($vars))
                    {
                        $vars = get_object_vars($vars);
                    }

                    if ($name === 'breadcrumbs' && !empty($vars))
                    {
                        $breadcrumbs = $vars;

                        if (!isset($breadcrumbs[0]))
                        {
                            $breadcrumbs = [ $breadcrumbs ];
                        }
                    }
                }
            }

            $tree = $this->sitemap;
            $path = $this->path;

            array_unshift($path, 'main');

            $this->recursionBCrumbs($tree, $path);

            if (!empty($breadcrumbs) && isset($breadcrumbs[0]['name']) && $breadcrumbs[0]['name'] !== '')
            {
                $this->breadcrumbsTree = array_merge($this->breadcrumbsTree, $breadcrumbs);

                $this->setCache($cache, $this->breadcrumbsTree);
            }

            unset($tree, $path, $breadcrumbs);
        }

        return $this->breadcrumbsTree;
    }

    protected function recursionPage(&$tree = [], &$path = [], $cache = [])
    {
        $sys_name = array_shift($path);

        $this->arguments = $path;

        foreach ($tree as $branch)
        {
            if ($branch['sys_name'] === $sys_name)
            {
                if (empty($path))
                {
                    unset($branch['tree']);
                    return $branch;
                }

                if (!empty($path) && $branch['dynamic'] == 1)
                {
                    $cache = $branch;
                    unset($cache['tree']);
                }

                if (!empty($branch['tree']) && !empty($path))
                {
                    return $this->recursionPage($branch['tree'], $path, $cache);
                }
            }
        }

        if (!empty($cache))
        {
            return $cache;
        }

        return [];
    }

    protected function siteStructure()
    {
        if (!$this->cache_enable || !($this->structure = $this->getCache('_structure_')))
        {
            $this->structure = Q("SELECT `id`, `pid`, `tid`, `gid`, `name`, `menuname`, `sys_name`, `title`, `keywords`, `description`, `robots`, `redirect`, `visible`, `in_menu`, `in_sitemap`, `dynamic`, `access`, '' as `link`, '' as `tree` FROM `#__str_structure` WHERE `visible`=1 AND `in_sitemap`=1 ORDER BY `ord`, `name`")->all('id');
            $this->setCache('sitemap.structure', $this->structure);
        }
    }

    protected function siteMapClear()
    {
        if (!empty($this->sitemap))
        {
            $this->siteMapClearRecursion($this->sitemap);
        }
    }

    protected function siteMapClearRecursion(&$tree = [])
    {
        if (!empty($tree))
        {
            foreach($tree as $key => $item)
            {
                if (intval($item['in_sitemap']) == 0)
                {
                    unset($tree[$key]);
                }

                if (!empty($item['tree']))
                {
                    $tree[$key]['tree'] = $this->siteMapClearRecursion($item['tree']);
                }
            }
        }

        return $tree;
    }

    protected function recursionTree(&$tree = [], $link = '')
    {
        foreach ($tree as $key => &$node)
        {
            $lnk = $link . '/' . $node['sys_name'];

            if ($node['sys_name'] == 'main')
            {
                $lnk = '';
            }

            $node['link'] = ($lnk == '') ? '/' : $lnk;

            if (!empty($node['tree']))
            {
                $node['tree'] = $this->recursionTree($node['tree'], $lnk);
            }

            $this->structure[$node['id']] = $node;
        }

        return $tree;
    }

    protected function siteMap()
    {
        if (!$this->cache_enable || !($this->sitemap = $this->getCache('_sitemap_')))
        {
            $temp = [];

            $this->siteStructure();

            // $first_id = reset($this->structure)['id'];

            $temp = $this->makeTree($this->structure, 0, 'pid', 'id', 'tree');

            $this->sitemap = $this->recursionTree($temp);

            $this->setCache('site.sitemap', $this->sitemap);
        }
    }

    protected function fixMenu($tree = [])
    {
        $branch = [];

        if (!empty($tree))
        {
            foreach($tree as &$item)
            {
                $branch[$item['id']] = [
                    'id'        =>  $item['id'],
                    'pid'       =>  $item['pid'],
                    'name'      =>  $item['menuname'] != '' ? $item['menuname'] : $item['name'],
                    'sys_name'  =>  $item['sys_name'],
                    'link'      =>  $item['link'],
                    'tree'      =>  $this->fixMenu($item['tree'])
                ];
            }
        }

        return $branch;
    }

    protected function siteMenu()
    {
        if (!$this->cache_enable || !($this->sitemenu = $this->getCache('_sitemenu_')))
        {
            $menu = Q("SELECT `id`, `system`, `tree` FROM `#__str_menu` ORDER BY `name`")->all('system');

            if (!empty($menu))
            {
                $sitemap = $this->sitemap;

                foreach($menu as $key => $item)
                {
                    if (!empty($this->structure))
                    {
                        $this->sitemenu[$key] = [];

                        foreach($this->structure as $tree)
                        {
                            $in_menu = preg_split('/\,+/', $tree['in_menu'], -1, PREG_SPLIT_NO_EMPTY);

                            $branch = [
                                'id'        =>  $tree['id'],
                                'pid'       =>  $tree['pid'],
                                'name'      =>  $tree['menuname'] != '' ? $tree['menuname'] : $tree['name'],
                                'sys_name'  =>  $tree['sys_name'],
                                'link'      =>  $tree['link'],
                                'tree'      =>  $this->fixMenu($tree['tree'])
                            ];

                            if (array_key_exists($branch['sys_name'], $this->sitemenuCache))
                            {
                                $node = $this->sitemenuCache[$branch['sys_name']];

                                foreach ($node as &$child)
                                {
                                    $child['pid'] = $branch['id'];
                                    $child['tree'] = [];

                                    if ($child['sys_name'] == end($this->path))
                                    {
                                        $child['current'] = true;
                                    }
                                }

                                $branch['tree'] = array_merge($branch['tree'], $node);
                            }

                            if ($branch['pid'] == 0)
                            {
                                $branch['tree'] = [];
                            }

                            if (in_array($item['id'], $in_menu))
                            {
                                if ($item['tree'] && $tree['sys_name'] !== 'main' && isset($this->cachetree[$tree['id']]))
                                {
                                    $branch['tree'] = $this->cachetree[$tree['id']];
                                }

                                $this->sitemenu[$key][$branch['id']] = $branch;
                            }
                        }
                    }
                }
            }

            $this->setCache('_sitemenu_', $this->sitemenu);
        }
    }

    protected function subMenu()
    {
        $sitemenu = [];

        if (!empty($this->sitemenu))
        {
            foreach ($this->sitemenu as $node)
            {
                if (!empty($node))
                {
                    foreach ($node as $node_item)
                    {
                        $sitemenu[$node_item['id']] = $node_item;
                    }
                }
            }
        }

        if (isset($sitemenu[$this->page['id']]['tree']))
        {
            $this->submenu = $sitemenu[$this->page['id']]['tree'];
        }

        if (isset($sitemenu[$this->page['pid']]['tree']))
        {
            $this->submenu = $sitemenu[$this->page['pid']]['tree'];
        }
    }

    protected function getTemplate()
    {
        if (!$this->cache_enable || !($template = $this->getCache('_template_')))
        {
            $template = Q("SELECT `id`, `sys_name` FROM `#__str_templates`")->all('id');

            $this->setCache('_template_', $template);
        }

        if (isset($template[$this->page['tid']]['sys_name']))
        {
            $this->pattern = $template[$this->page['tid']]['sys_name'];
        }
    }

    protected function getPage(&$sitemap = [], &$path = [])
    {
        $page = '';

        if (isset($path[1]))
        {
            $page = $path[1];
        }

        $this->page = $this->recursionPage($sitemap, $path);

        if ($page)
        {
            $this->page['root'] = $page;
        }
        else {
            $this->page['root'] = $this->page['sys_name'];
        }
    }

    protected function getCanonicalPage()
    {
        $path = $this->path;

        if ($this->locale == DEFAULT_LANGUAGE)
        {
            array_unshift($path, 'en');
        }

        array_unshift($path, 'main');

        $sitemap = $this->sitemap;
        $this->treeCanonicalPage($sitemap, $path);
    }

    protected function treeCanonicalPage(&$sitemap = [], &$path = [])
    {
        $this->canonical = $this->recursionPage($sitemap, $path);
    }

    protected function pageData()
    {
        $cache = 'page.path.'.$this->cache_path;

        if (!$this->cache_enable || !($this->page = $this->getCache($cache)))
        {
            // Текущая страница
            $sitemap    = $this->sitemap;
            $path       = $this->mpath;

            array_unshift($path, 'main');

            $this->getPage($sitemap, $path);

            $page = $this->page;

            if ($this->cache_enable && !empty($this->arguments))
            {
                $this->setCache('_arguments_path_', $this->arguments);
            }

            if (!empty($page) && !empty($this->_server['HTTP_REFERER']))
            {
                $page['referer'] = $this->_server['HTTP_REFERER'];
            }

            if (!empty($page['redirect']))
            {
                if (isset($page['referer']))
                {
                    redirect($page['redirect'], $page['referer']);
                }
                else
                {
                    redirect($page['redirect']);
                }
            }

            if (empty($page))
            {
                $this->page = $this->error;
                $this->page['lang'] = $this->locale;
            }
            else
            {
                $this->page = [
                    'lang'          => $this->locale,
                    'id'            => $page['id'],
                    'pid'           => $page['pid'],
                    'tid'           => $page['tid'],
                    'name'          => $page['name'],
                    'root'          => $page['root'],
                    'system'        => $page['sys_name'],
                    'title'         => $page['title'],
                    'keywords'      => $page['keywords'],
                    'description'   => $page['description'],
                    'robots'        => $page['robots'] != '' ? $page['robots'] : 'all',
                    'dynamic'       => $page['dynamic'],
                    'referer'       => '',
                    'content'       => ''
                ];
            }

            unset($sitemap, $path, $page);

            $this->setCache($cache, $this->page);
        }

        if ($this->cache_enable)
        {
            $this->arguments = $this->getCache('_arguments_path_');
        }

        if ($this->page['dynamic'] == 1 && $this->page['system'] != end($this->path))
        {
            $this->dynamic_page = true;
        }
    }

    protected function getPageContent($id = 0)
    {
        $cache = $this->cache_path.'_'.$id;

        $content = $this->getCache('stc.content'.$cache);

        if (!$this->cache_enable || !($content = $this->getCache('stc.content'.$cache)))
        {
            $content = Q(   "SELECT `c`.`id`, `c`.`system`, `c`.`type`, `c`.`item`, `c`.`mode`, `c`.`indexer`, `c`.`arguments`, `c`.`indynamic`, `c`.`caching`, `c`.`system`, `f`.`content` " .
                            "FROM `#__str_content` AS `c` " .
                            "LEFT JOIN `#__str_filling` AS `f` ON `f`.`pid` = `c`.`id` " .
                            "WHERE `c`.`pid`=?i AND `c`.`visible`=1 " .
                            "ORDER BY `ord` ASC", [
                            $id
                        ])->all('id');

            $this->setCache('stc.content'.$cache, $content);
        }

        $page = [];

        if (!empty($content))
        {
            $content_list = [];

            $this->viewer->assign('_page', $this->page, true);

            foreach ($content as $id => $unit)
            {
                $cache_hash = $this->cache_path.'.content.'.$id;

                if ($unit['caching'] == 0 || !$this->cache_enable || !($content_list[$id] = $this->getCache($cache_hash)))
                {
                    $item = $this->getUnit($unit);

                    // $this->assign_vars($item['assigned']);

                    // unset($item['assigned']);

                    if (!isset($item['removed']))
                    {
                        $content_list[$id] = $item;

                        $this->setCache($cache_hash, $content_list[$id]);
                    }
                }
            }

            $page['content_list'] = $content_list;

            if (!empty($content_list))
            {
                $result = '';

                foreach($content_list as $item)
                {
                    if ($item['system'])
                    {
                        $result .= '<a name="'. $item['system'] .'"></a>';
                    }

                    if ($item['indexer'] == 1 || $item['indexer'] == 2 && $this->dynamic_page)
                    {
                        $result .= '<!-- content -->';
                    }

                    $result .= $item['content'];

                    if ($item['indexer'] == 1 || $item['indexer'] == 2 && $this->dynamic_page)
                    {
                        $result .= '<!-- /content -->';
                    }
                }

                $result = str_replace('<!-- /content --><!-- content -->', '', $result);

                $page['content'] = stripslashes($result);
            }

            $this->setCache('_path_', $page);
        }

        return $page;
    }

    protected function getContent($IS_SPA = false)
    {
        if (!empty($this->page))
        {
            if ($IS_SPA)
            {
                $spa = [];

                foreach($this->structure as $page)
                {
                    unset($page['tree']);

                    $item = $this->getPageContent($page['id']);

                    if (isset($item['content'])) {
                        $page['content'] = $item['content'];
                    }

                    $spa[] = $page;
                }

                $this->page = array_merge(
                    $this->page, [
                        'spa' => $spa
                    ]
                );
            }
            else
            {
                $content = $this->getPageContent($this->page['id']);

                if (!empty($content['content'])) {
                    unset($this->page['content']);
                }

                $this->page = array_merge(
                    $content,
                    $this->page
                );
            }
        }
    }

    protected function changeCurrent($path = [], &$menu = [])
    {
        if (empty($path))
        {
            $path[] = 'main';
        }

        foreach ($menu as &$node)
        {
            $this->setCurrent($path, $node);
        }
    }

    protected function setCurrent($path = [], &$node = [])
    {
        if (!empty($node))
        {
            $sys_name = array_shift($path);

            foreach ($node as &$child)
            {
                if (isset($child['sys_name']) && ($child['sys_name'] == $sys_name))
                {
                    $child['current'] = true;

                    if (!empty($path) && !empty($child['tree']))
                    {
                        $this->setCurrent($path, $child['tree']);
                    }
                }
            }
        }
    }

    protected function logout()
    {
        if (isset($_GET['logout']))
        {
            if (isset($_SESSION['auth_user']))
            {
                unset($_SESSION['auth_user']);
            }

            if (isset($_GET['_backuri']))
            {
                redirect(base64_decode($_GET['_backuri']));
            }
            else
            {
                redirect('/');
            }
        }
    }

    public function assign_row($vars = [], $module = '')
    {
        if (!empty($vars['assets']) && $module)
        {
            foreach ($vars['assets'] as $asset)
            {
                $this->assets[] = PATH_MODULE.DS.$module.DS.$asset;
            }
        }

        if (!empty($vars['path']))
        {
            foreach ($vars['path'] as $key => $value)
            {
                $this->path[$key]   = $value;
            }
        }

        if (!empty($vars['mpath']))
        {
            foreach ($vars['mpath'] as $key => $value)
            {
                $this->mpath[$key]   = $value;
            }
        }

        if (!empty($vars['page']))
        {
            foreach ($vars['page'] as $key => $value)
            {
                $this->page[$key]   = $value;
            }
        }

        if (!empty($vars['submenu']))
        {
            foreach ($vars['submenu'] as $key => $value)
            {
                $this->submenu[$key] = $value;
            }
        }

        if (!empty($vars['meta']))
        {
            foreach ($vars['meta'] as $key => $value)
            {
                $this->page[$key]   = $value;
            }
        }

        if (is_array($vars)) {
            foreach($vars as $key => $data)
            {
                if (!in_array($key, [ 'breadcrumbs' ]))
                {
                    if (is_object($data)) {
                        $data = get_object_vars($data);
                    }

                    $this->viewer->assign($key, $data, false);
                }
            }
        }
    }

    public function assign_vars($vars = [], $module = '')
    {
        $this->viewer->assign('PATH_ROOT',      PATH_ROOT, false);
        $this->viewer->assign('PATH_THEMES',    PATH_THEMES, false);
        $this->viewer->assign('uri',            $this->path, true);
        $this->viewer->assign('_backuri',       $this->backuri, true);

        if (!is_null($this->csrf_token))
        {
            $this->viewer->assign('_csrf_token',    $this->csrf_token, true);
            $this->viewer->assign('_csrf_param',    $this->csrf_param, true);
        }

        if (!empty($vars))
        {
            $this->assign_row($vars, $module);
        }
        elseif (!empty($this->template_vars))
        {
            foreach ($this->template_vars as $key => $arr)
            {
                if (!empty($arr))
                {
                    if (is_object($arr))
                    {
                        $arr = get_object_vars($arr);
                    }

                    $this->assign_row($arr, $module);
                }

            }
        }
    }

    public function setMetaUrl()
    {
        if ($this->page['id'] !== 0) {
            $base_url = $_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'];
            $request_uri = $_SERVER['REQUEST_URI'];

            $this->page['url'] = $base_url.$request_uri;
            $this->page['pathname'] = $base_url;
            $this->page['canonical'] = $base_url.$request_uri;
        }
    }

    public function setUri()
    {
        foreach ($this->path as $k => $v)
        {
            $this->viewer->assign('uri'.$k, $v, true);
        }

        $this->viewer->assign('uri', $this->path, true);
    }

    public function assignHelpers()
    {
        if (!empty($this->sitemenu))
        {
            foreach ($this->sitemenu['main'] as &$node)
            {
                if ($node['sys_name'] == 'fotootchet')
                {
                    $node['tree'] = [];
                }
            }
        }
    }

    public function helpers()
    {
        $hooks = new hooksHelper();
        $response = $hooks->init();

        if (!empty($response))
        {
            if (!empty($response['sitemenu']))
            {
                $this->sitemenuCache = $response['sitemenu'];
            }

            $this->assign_vars($response);
        }
    }

    final public function run($server = [])
    {
        $this->_server = $server;

        $this->headers();
        $this->logout();

        $this->helpers();

        // Структура сайта
        $this->siteMap();

        // Информация о странице
        $this->pageData();

        // Меню сайта
        $this->siteMenu();

        // Подменю страницы
        $this->subMenu();

        // Содержимое страницы
        $this->getContent($this->isSPA);

        // Хлебные крошки
        $this->breadcrumbs();

        // Очищаем карту сайта
        $this->siteMapClear();

        // $this->getCanonicalPage();

        $this->assignHelpers();

        $this->changeCurrent($this->path, $this->sitemenu);

        $this->setUri();

        $this->setMetaUrl();

        // $this->importAssets();

        $this->viewer->assign('PATH_ROOT',          PATH_ROOT, false);
        $this->viewer->assign('PATH_MODULE',        PATH_MODULE, false);
        $this->viewer->assign('PATH_THEMES',        PATH_THEMES, false);

        $this->viewer->assign('_page',              $this->page, true);
        $this->viewer->assign('_locale',            $this->locale, true);
        $this->viewer->assign('_sitemap',           $this->sitemap, false);
        $this->viewer->assign('_sitemenu',          $this->sitemenu, true);
        $this->viewer->assign('_submenu',           $this->submenu, true);
        $this->viewer->assign('_backuri',           $this->backuri, true);
        $this->viewer->assign('_breadcrumbs',       $this->breadcrumbsTree, true);

        if (!is_null($this->csrf_token)) {
            $this->viewer->assign('_csrf_token',    $this->csrf_token, true);
            $this->viewer->assign('_csrf_param',    $this->csrf_param, true);
        }

        if ($this->page['id'] == 0) {
            header('HTTP/1.1 404 Not Found');

            $this->viewer->assign('_page', $this->error, true);
            $this->viewer->display('core/404');
        }
        else {
            $this->getTemplate();
            $this->viewer->display($this->pattern);
        }

        unset($this->template_vars, $this->sitemap, $this->sitemenu, $this->structure);
    }
}
