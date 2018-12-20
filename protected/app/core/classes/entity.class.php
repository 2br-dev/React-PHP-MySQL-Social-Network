<?php

declare(strict_types=1);

namespace Fastest\Core;

class Entity # extends \Fastest\Core\Caching
{
    use \Tools, \Singleton;

    public $cache = null;

    protected $menu = [];
    protected $sitemap = [];
    protected $sitemenu = [];
    protected $cachetree = [];
    protected $structure = [];
    protected $debugMode = false;
    protected $moduleRoot = null;
    protected $sitemenu_sample = ['id', 'pid', 'name', 'system', 'link', 'target', 'current', 'tree'];

    public function __construct()
    {
        $this->cache = Caching::getInstance();

        $this->debugMode = defined('SYSTEM_DEBUG') && SYSTEM_DEBUG;
        $this->sitemenu_sample = array_flip($this->sitemenu_sample);
    }

    protected function getSection($item = [])
    {
        if (!in_array($item['type'], ['editor', 'redactor', 'zone', 'block', 'search', 'module', 'banner'])) {
            return 'ERROR BLOCK TYPE';
        }

        $method = '_get'.ucwords($item['type']);

        if ($this->visible($item['indynamic']) && method_exists($this, $method))
        {
            $generated = $this->{$method}($item);
            return $this->_wrap($generated, $item);
        }

        return '';
    }

    private function _getModule($item = [], $hasId = false)
    {
        $method = !$item['mode'] ? 'router' : $item['mode'];

        if ($hasId) {
            $where = '`id`=?i';
            $value = $item['id'];
        } else {
            $where = '`func_name` LIKE ?s';
            $value = $item['item'];
        }

        $cache = 'app.module.item'.$value;

        if (!($module = $this->cache->getCompiled($cache))) {
            $module =
                Q('SELECT
                        `id`,
                        `func_name`,
                        `cache` '.
                    'FROM `#__mdd_binds` '.
                    'WHERE '.$where.' '.
                    'LIMIT 1',
                [$value])->row();

            $this->cache->setCache($cache, $module);
        }

        return $this->loadModule($module, $method);
    }

    private function _getZone($item = [])
    {
        $html = '';

        $zone = Q('SELECT `b`.`id`, `b`.`block_cont`, `b`.`module` FROM `#__blc_zone` as `z`
                    LEFT JOIN `#__blc_blocks` as `b` ON `b`.`pid`=`z`.`id`
                    WHERE `b`.`visible`=1 AND `z`.`visible`=1 AND `z`.`sys_name`
                    LIKE ?s
                    ORDER BY `b`.`ord` ASC', [$item['item']])->all();

        if (!empty($zone)) {
            foreach ($zone as $block) {
                $html .= $this->_getBlock($item, $block);
            }
        }

        return $html;
    }

    private function _getBlock($item = [], $block = [])
    {
        $content = '';

        if (empty($block)) {
            $block = Q('SELECT `id`, `block_cont` as `content`, `module`
                        FROM `#__blc_blocks`
                        WHERE `visible`=1 AND `id`=?i
                        LIMIT 1', [
                            $item['item'],
                        ])->row();
        }

        if (!empty($block)) {
            if ($block['module']) {
                $content = $this->_getModule(['id' => $block['module'], 'mode' => 'block'], true);
            } elseif ($block['content']) {
                $content = $this->viewer->fetch('eval:'.stripslashes($block['content']));
            }
        }

        return $content;
    }

    private function _getBanner($item = [])
    {
        return 'banner'.json_encode($item);
    }

    private function _getEditor($item = [])
    {
        return $this->_getRedactor($item);
    }

    private function visible($indynamic)
    {
        return $indynamic == 0 ||
               $indynamic == 1 && !$this->dynamic ||
               $indynamic == 2 && $this->dynamic;
    }

    private function _getRedactor($item = [])
    {
        $content = '';

        $content = Q('SELECT `content` FROM `#__str_filling` WHERE `pid`=?i AND `locale` LIKE ?s LIMIT 1', [
            $item['id'],
            $this->locale,
        ])->row('content');

        return $content;
    }

    private function _getSearch($item = [])
    {
        $error = 0;

        if (isset($_GET[$this->search_var]) && strlen($_GET[$this->search_var]) < 3) {
            $error = 1;
        } elseif (isset($_GET[$this->search_var]) && !preg_match('/^['.chr(0x7F).'-'.chr(0xff)."a-zA-Z0-9\- \s]+$/", $_GET[$this->search_var])) {
            $error = 2;
        }

        if (isset($_GET[$this->search_var])) {
            $this->viewer->assign('search_word', urldecode($_GET[$this->search_var]));
        }

        // $this->viewer->assign('_page', $this->page);
        $this->viewer->assign('_error', $error);

        if (!$error && isset($_GET[$this->search_var])) {
            $rs = new Request_search();
            $rs->search_query = urldecode($_GET[$this->search_var]);
            $rs->find();

            $this->viewer->assign('search_result', $rs->result);
            $this->viewer->assign('search_result_count', $rs->count);
            $this->viewer->assign('pager_info', $rs->pager);
        }

        // exit(__(PATH_THEMES.DS.$this->template['dir'].'core'.DS.'search'));

        return $this->viewer->fetch(PATH_THEMES.DS.$this->template['dir'].'core'.DS.'search');
    }

    protected function loadModule($item = [], $method = 'router')
    {
        if (empty(array_diff_key(array_flip(['id', 'func_name', 'cache']), $item))) {
            $name = $item['func_name'];
            $class_name = PATH_MODULE.DS.$name.DS.$name.'Module.class.php';

            if (!file_exists($class_name)) {
                return $this->_broken('Error: Cannot file "'.$class_name.'"');
            }

            require_once $class_name;

            $module = sprintf('\Fastest\Core\Modules\%sModule', $name);

            if (class_exists($module))
            {
                $control = new $module();

                $this->_prepare();

                $control->setPage($this->page);
                $control->setCaching();
                $control->setModule($item);
                $control->setLocale($this->locale);

                $control->setArguments($this->arguments);
                $control->setModuleRoot($this->moduleRoot);

                $control->setCSRF($this->csrf_token, $this->csrf_param);

                if (count($_POST)) {
                    $method = 'post';
                }

                if (!in_array($method, ['router'])) {
                    $method = $method.'Method';
                }

                if (!method_exists($control, $method)) {
                    $method = 'router';
                }

                $response = call_user_func_array([$control, $method], $this->arguments);

                // Error page
                if (isset($response['page']['id']) && $response['page']['id'] == 0) {
                    return;
                }

                if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
                    return json_encode($response, 64 | 256);
                    die;
                }

                $_template = isset($response['template']) ? $response['template'] : 'index';

                $_templateFile = PATH_MODULE.DS.$name.DS.'tpl'.DS.$_template;

                if (empty(glob($_templateFile.'*'))) {
                    return $this->_broken('Error: Template file '.$_template.' "not exists"');
                }

                $response['pathname'] = $this->request;

                $response['module_root'] = $this->moduleRoot;

                $this->assignVars($response, $name);

                return $this->viewer->fetch($_templateFile);
            }
        }

        return $this->_broken('Error: Cannot find module "'. $item['func_name'] .'"');
    }

    protected function getStructure()
    {
        $cache_structure = 'app.structure';
        $cache_cachetree = 'app.cachetree';

        if (!($this->structure = $this->cache->getCompiled($cache_structure))) {
            $this->structure = Q('
                SELECT `id`, `pid`, `tid`, `url` as `link`, `name`, `menuname`, `sys_name` as `system`, `redirect`, `visible`, `in_menu`, `in_sitemap`, `dynamic`
                FROM `#__str_structure`
                WHERE `visible`=1 AND `in_sitemap`=1
                ORDER BY `ord`, `name`'
            )->all('id');

            $this->cache->setCache($cache_structure, $this->structure);
        }

        if (!($this->cachetree = $this->cache->getCompiled($cache_cachetree))) {
            foreach ($this->structure as $id => $page) {
                if ($page['menuname']) {
                    $page['name'] = $page['menuname'];
                }

                if ($page['redirect']) {
                    $page['link'] = $page['redirect'];

                    if (is_url($page['redirect'])) {
                        $page['target'] = '_blank';
                    }
                }

                $in_menu = array_flip(preg_split('/\,+/', $page['in_menu'], -1, PREG_SPLIT_NO_EMPTY));

                $page = array_intersect_key($page, $this->sitemenu_sample);

                $page['in_menu'] = $in_menu;

                $this->cachetree[$id] = $page;
            }

            $this->cache->setCache($cache_cachetree, $this->cachetree);
        }
    }

    protected function getSitemap()
    {
        $this->sitemap = $this->makeTree($this->structure, 0, 'pid', 'id', 'tree');
    }

    protected function sitemenuPage($page = [], $tree = false)
    {
        if (!empty($page)) {
            $id = $page['id'];

            if ($tree) {
                $node = $this->makePidTree($this->cachetree, $id, 'pid', 'id', 'tree');

                if (!empty($node)) {
                    $page['tree'] = $node;
                }
            }
        }

        return $page;
    }

    protected function setCurrent($path = [], &$menu = [])
    {
        if (empty($path)) {
            $path[] = 'main';
        }

        foreach ($menu as &$node) {
            $this->changeCurrent($path, $node);
        }
    }

    protected function changeCurrent($path = [], &$node = [])
    {
        if (!empty($node)) {
            $system = array_shift($path);

            foreach ($node as &$child) {
                if (isset($child['system']) && ($child['system'] == $system)) {
                    $child['current'] = true;

                    if (!empty($path) && !empty($child['tree'])) {
                        $this->changeCurrent($path, $child['tree']);
                    }
                }
            }
        }
    }

    protected function getSitemenu()
    {
        $cache = 'app.sitemenu';

        $this->_menu();

        if (!($this->sitemenu = $this->cache->getCompiled($cache)) || !(!empty($this->menu) && !empty($this->cachetree))) {
            $ids = [];

            foreach ($this->menu as $system => $map) {
                $ids[$map['id']] = $system;
                $this->sitemenu[$system] = [];
            }

            foreach ($this->cachetree as $id => $page) {
                if (!empty($page['in_menu'])) {
                    $intersect = array_intersect_key($ids, $page['in_menu']);

                    if (!empty($intersect)) {
                        foreach ($intersect as $system) {
                            $this->sitemenu[$system][$id] = $this->sitemenuPage($page, $this->menu[$system]['tree']);
                        }
                    }
                }
            }

            $this->cache->setCache($cache, $this->sitemenu);
        }
    }

    private function _prepare()
    {
        $pathname = preg_split('/\/+/', $this->request, -1, PREG_SPLIT_NO_EMPTY);

        $root = array_flip(
            array_intersect_key(
                array_flip(
                    array_values($this->root)
                ),
                array_flip(
                    array_values($pathname))
                )
        );

        $this->moduleRoot = '/'.implode('/', $root);

        $this->arguments = array_values(
            array_diff(
                $this->path,
                $root
            )
        );
    }

    private function _broken($message = '', $params = [])
    {
        if ($this->debugMode) {
            $message = str_replace(substr(PATH_SYSTEM, 1), '...', $message);

            return '<p style="color: red">'.$message.'</p>';
        }

        return '';
    }

    private function _wrap($html = '', $item = '')
    {
        if ($this->debugMode) {
            $title = ucwords($item['type']).' {'.$item['id'].'}';
            $result = '';

            $result .= '<fieldset style="margin-bottom:15px;border:1px solid #333;padding:12px;">';
            $result .= '<legend style="color:#000;padding:0 5px;font-size:16px;">'.$title.'</legend>';

            if (in_array($item['type'], ['redactor', 'editor'])) {
                $result .= '<img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQwMi44MDggNDAyLjgwOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDAyLjgwOCA0MDIuODA4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPHBhdGggc3R5bGU9ImZpbGw6IzNBMkM1MTsiIGQ9Ik0zODIuOTU1LDQwMi44MDhIMTYuMTk2Yy04Ljg4MiwwLTE1LjY3My02Ljc5Mi0xNS42NzMtMTUuNjczVjIwLjM3NSAgYzAtOC44ODIsNi43OTItMTUuNjczLDE1LjY3My0xNS42NzNoMTM2Ljg4MmM4Ljg4MiwwLDE1LjY3Myw2Ljc5MiwxNS42NzMsMTUuNjczcy02Ljc5MiwxNS42NzMtMTUuNjczLDE1LjY3M0gzMS44Njl2MzM1LjQxMiAgaDMzNS40MTJWMjUwLjI1M2MwLTguODgyLDYuNzkyLTE1LjY3MywxNS42NzMtMTUuNjczYzguODgyLDAsMTUuNjczLDYuNzkyLDE1LjY3MywxNS42NzN2MTM2Ljg4MiAgQzM5OC42MjksMzk2LjAxNiwzOTEuODM3LDQwMi44MDgsMzgyLjk1NSw0MDIuODA4eiIvPgo8cG9seWdvbiBzdHlsZT0iZmlsbDojMDBCQkQzOyIgcG9pbnRzPSIyMDYuMzY3LDI1OC4wOSAyMDUuODQ1LDI1OC42MTIgMTIwLjY4NiwyODIuNjQ1IDE0NC43MTgsMTk3LjQ4NiAxNDUuMjQxLDE5Ni45NjMgIi8+CjxwYXRoIHN0eWxlPSJmaWxsOiM0RENGRTA7IiBkPSJNMTQ0LjcxOCwxOTYuOTYzTDMzOC41NDcsMy4xMzVjNC4xOC00LjE4LDEwLjQ0OS00LjE4LDE0LjYyOSwwbDQ1Ljk3Niw0NS45NzYgIGM0LjE4LDQuMTgsNC4xOCwxMC40NDksMCwxNC42MjlMMjA1Ljg0NSwyNTguMDlMMTQ0LjcxOCwxOTYuOTYzeiIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" style="width: 16px; height: 16px" />';
            }

            $result .= $html;
            $result .= '</fieldset>';

            return $result;
        }

        return $html;
    }

    private function _menu()
    {
        if (!($this->menu = $this->cache->getCompiled('app.menu'))) {
            $this->menu = Q('SELECT `id`, `system`, `tree` FROM `#__str_menu`')->all('system');
            $this->cache->setCache('app.menu', $this->menu);
        }
    }
}
