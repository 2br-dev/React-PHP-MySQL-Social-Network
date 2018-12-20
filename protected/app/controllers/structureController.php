<?php

final class structureController extends CPLoader
{
    use Tools, Singleton;
    private $config = null;
    private $user = null;
    private $stc = null;
    private $mdd = null;

    public function __construct()
    {
        parent::__construct();

        $this->user = new Person();
        $this->stc = new Structure();
        $this->mdd = new MDD();
    }

    public function index()
    {
        if (in_array($this->method, array( 'add', 'edit' ))) {
            $info['stc_menu_list']  = lst_menu();
            $info['stc_all_tree']   = $this->stc->allTree(0, true);
            $info['usr_groups']     = $this->user->getGroups();
            $info['ogp_types']      = $this->stc->getOgpTypes();
            $info['templates_list'] = $this->stc->getTemplates();
            $info['modules_list']   = $this->mdd->getModules(0, true, false);
            //$info['breadcrumbs'] 	= $this->stc->getBC($this->element);
        }

        if ($this->method == "add") {
            $info['stc_page']['pid'] = $this->element;
            $info['stc_page']['date'] = date('d.m.Y H:i');
            $info['header_action']    = "Добавление подраздела";
            $info['stc_next_ord']    = $this->stc->getNextOrd($this->element);
        } elseif ($this->method == "edit") {
            $info['header_action']    = "Редактирование раздела";
            $info['stc_page']        = $this->stc->getPage($this->element);
            $info['cnt_page']        = $this->stc->getPageContent($this->element);

            if (isset($info['stc_page']['access']) && $info['stc_page']['access'] != "") {
                $info['stc_page']['access'] = explode(",", $info['stc_page']['access']);
            }
        } elseif ($this->method == "del") {
            if ($this->element != 1) {
                $info['stc_page'] = $this->stc->getPage($this->element);
                $trush = new Trush("Структура сайта - ".$info['stc_page']['name']);
                $this->stc->deleteStc($this->element, $trush);
            }

            redirect($this->base_path);
        } else {
            $info['tv_struct'] = $this->stc->allTree(0, true);

            // exit(__($info['tv_struct']));
        }

        if (in_array($this->method, array( 'add', 'edit' ))) {
            $info['languages'] = $this->stc->getLocaleList();

            if (!empty($_SESSION['stc_fields'])) {
                foreach ($_SESSION['stc_fields'] as $name => $value) {
                    if (strstr($name, 'stc_')) {
                        $_name = str_replace(
                                array(
                                    'menu',
                                    'in_menuname'
                                ),
                                array(
                                    'in_menu',
                                    'menuname'
                                ),
                                str_replace('stc_', '', $name)
                            );

                        if (empty($info['stc_page'][$_name])) {
                            $info['stc_page'][$_name] = $value;
                        }
                    }
                }
            }

            if (!empty($_SESSION['stc_errors'])) {
                foreach ($_SESSION['stc_errors'] as $name) {
                    if (strstr($name, 'stc_')) {
                        $_name = str_replace(
                                    array(
                                        'menu',
                                        'in_menuname'
                                    ),
                                    array(
                                        'in_menu',
                                        'menuname'
                                    ),
                                    str_replace('stc_', '', $name)
                                );

                        if (empty($info['stc_page'][$_name])) {
                            $info['stc_errors'][] = $_name;
                        }
                    }
                }
            }

            $type_list = array(
                'redactor'    => 'Визуальный редактор',
                'editor'    => 'Редактор кода',
                'module'    => 'Модуль',
                'zone'        => 'Зона',
                'block'        => 'Блок',
                'banner'    => 'Баннер',
                'search'    => 'Поиск'
            );

            $info['type_list'] = $type_list;
        }

        if (in_array($this->method, array('edit'))) {
            foreach ($info['cnt_page'] as $key => $value) {
                $info['cnt_page'][$key]['breadcrumbs'] = [];
            }

            foreach ($info['cnt_page'] as $key => $value) {
                $info['cnt_page'][$key]['item_list'] = $this->loadSettings($value['type']);
                
                if (!empty($type_list[$value['type']])) {
                    $info['cnt_page'][$key]['breadcrumbs'][] = $type_list[$value['type']];
                }
            }

            foreach ($info['cnt_page'] as $key => $value) {
                if (!empty($info['cnt_page'][$key]['item_list'][$value['item']])) {
                    $info['cnt_page'][$key]['breadcrumbs'][] = $info['cnt_page'][$key]['item_list'][$value['item']];
                }

                if (!in_array($value['type'], array('block', 'zone', 'search', 'banner', 'redactor', 'module'))) {
                    $info['cnt_page'][$key]['mode_list'] = $this->loadSettings($value['type'], $value['item']);
                    
                    if (!empty($info['cnt_page'][$key]['mode_list'][$value['mode']])) {
                        $info['cnt_page'][$key]['breadcrumbs'][] = $info['cnt_page'][$key]['mode_list'][$value['mode']];
                    }
                }
            }
        }

        $info['localize'] = Q("SELECT * FROM `db__str_locale` WHERE `visible`=1 ORDER BY `ord`")->all();

        $info['method'] = $this->method;

        return $info;
    }

    public function updateStructure()
    {
        $oid = isset($_POST['oid']) ? intval($_POST['oid']) : '';
        $pid = isset($_POST['pid']) ? intval($_POST['pid']) : '';
        $nid = isset($_POST['nid']) ? intval($_POST['nid']) : '';

        $min = Q("SELECT MIN(`ord`) as `ord` FROM `#__str_structure` WHERE `pid`=?i LIMIT 1", array( $pid ))->row('ord');

        Q("UPDATE `#__str_structure` SET `ord`=(`ord` - ?i + 10) WHERE `pid`=?i", array( $min, $pid ));

        if ($nid == 0) {
            $ord = Q("SELECT (MAX(`ord`) + 5) as `ord` FROM `#__str_structure` WHERE `pid`=?i LIMIT 1", array( $pid ))->row('ord');
        } else {
            $ord = Q("SELECT (`ord` - 5) as `ord` FROM `#__str_structure` WHERE `id`=?i LIMIT 1", array( $nid ))->row('ord');
        }

        Q("UPDATE `#__str_structure` SET `pid`=?i, `ord`=?i WHERE `id`=?i LIMIT 1", array(
            $pid, $ord, $oid
        ));

        $structure = Q("SELECT `id`, `pid`, `locale`, `name`, `sys_name`, `url` FROM `#__str_structure` ORDER BY `pid`")->all();

        $this->stc->crawler($this->makeTree($structure, 0, 'pid', 'id', 'tree'));

        exit(
            json_encode(
                array(
                    'status' => true
                ), 64 | 256
            )
        );
    }

    public function getStructure()
    {
        $category = Q("SELECT `id`, `pid`, `locale`, `name`, `menuname`, `sys_name`, `redirect`, `access`, `dynamic`, `in_sitemap`, `in_menu`, `visible`, `ord` FROM `#__str_structure` ORDER BY `pid`, `ord`, `id`")->all();

        exit(
            json_encode(
                $category, 64 | 256
            )
        );
    }

    public function loadSettings($action = '', $mode = '')
    {
        if (__post('action')) {
            $action = __post('action');
        }

        if (__post('mode')) {
            $mode = __post('mode');
        }

        $this->configure();

        $list = [];

        switch ($action) {
            case 'redactor':

                if (!$mode) {
                    foreach ($this->config['redactor'] as $ar) {
                        $list[$ar['system']] = $ar['name'];
                    }
                }

            break;

            case 'editor':

                switch ($mode) {
                    case 'codemirror':
                        foreach ($this->config['editor_mode'] as $k => $value) {
                            $list[$value] = $value;
                        }
                    break;

                    default:
                        foreach ($this->config['editor'] as $ar) {
                            $list[$ar['system']] = $ar['name'];
                        }
                    break;
                }

            break;

            case 'module':

                if (!$mode) {
                    $binds = $this->mdd->getBinds(0);

                    foreach ($binds as $k => $v) {
                        $list[$v['func_name']] = $v['name'];
                    }
                }

            break;

            case 'zone':

                if (!$mode) {
                    $temp = Q("SELECT `name`, `sys_name` FROM `#__blc_zone` ")->all();

                    if (!empty($temp)) {
                        foreach ($temp as $key => $value) {
                            $list[$value['sys_name']] = $value['name'];
                        }
                    }
                }

            break;

            case 'block':

                if (!$mode) {
                    $temp = Q("SELECT `name`, `id` FROM `#__blc_blocks` ")->all();
                    
                    if (!empty($temp)) {
                        foreach ($temp as $key => $value) {
                            $list[$value['id']] = $value['name'];
                        }
                    }
                }

            break;
            
            case 'banner':

                if (!$mode) {
                    $temp = Q("SELECT `name`, `sys_name` FROM `#__blc_banners` ")->all();
                    
                    if (!empty($temp)) {
                        foreach ($temp as $key => $value) {
                            $list[$value['sys_name']] = $value['name'];
                        }
                    }
                }
                 
            break;

            case 'search':
            break;
        }

        return $list;
    }

    public function getNewId($parent = 0, $order = 10)
    {
        if (__post('parent')) {
            $parent = __post('parent');
        }

        if (__post('order')) {
            $order = __post('order');
        }

        return Q("INSERT INTO `" . $this->stc->table_cnt . "` SET `visible`=1, `pid`=?i, `ord`=?i", array(
            $parent, $order
        ));
    }

    public function removeSettings($id = 0)
    {
        if (__post('id')) {
            $id = __post('id');
        }

        Q("DELETE FROM `" . $this->stc->table_cnt . "` WHERE `id`=?i LIMIT 1", array(
            $id
        ));

        Q("DELETE FROM `" . $this->stc->table_fil . "` WHERE `pid`=?i LIMIT 1", array(
            $id
        ));

        return array(
            'result' => 1
        );
    }

    public function saveSettings($arr = array())
    {
        if (isset($_POST['arr'])) {
            $arr = $_POST['arr'];
        }

        if (!empty($arr)) {
            $tmp = [];

            foreach ($arr as $name => $value) {
                $temp = explode('_', $name);
                $id   = end($temp);
                
                array_pop($temp);
                $name = implode('_', $temp);

                if (in_array($name, array( 'system', 'type', 'item', 'mode', 'visible', 'caching', 'ord', 'indexer', 'arguments', 'indynamic'))) {
                    $xtype = '?s';

                    if (is_numeric($value)) {
                        $xtype = '?i';
                    }

                    Q("UPDATE `" . $this->stc->table_cnt . "` SET `?e`=". $xtype ." WHERE `id`=?i LIMIT 1", array(
                        $name, $value, $id
                    ));
                }

                $tmp[$id][$name] = $value;
            }

            $arr = $tmp;
        }

        return array(
            'result' => 1
        );
    }

    public function configure()
    {
        if (!isset($_SESSION['configuration']) || empty($_SESSION['configuration'])) {
            $_SESSION['configuration'] = json_decode(file_get_contents(PATH_ADMIN . '/json/config.json'), true);
        }

        $this->config = $_SESSION['configuration'];
    }

    private function makeUrl($id = 0)
    {
        // $pid = Q("SELECT `pid` FROM `#__str_structure` WHERE `id`=(SELECT `pid` FROM `#__str_structure` WHERE `id`=?i LIMIT 1) LIMIT 1", array( $id ))->row('pid');
        $structure = Q("SELECT `id`, `pid`, `locale`, `name`, `sys_name`, `url` FROM `#__str_structure` ORDER BY `pid`", [ $id ])->all();
        // $structure = $this->makeTree($structure, $pid);
        $structure = $this->makeTree($structure, 0, 'pid', 'id', 'tree');

        $this->stc->crawler($structure);
    }

    public function post()
    {
        unset($_SESSION['stc_fields'], $_SESSION['stc_errors']);

        $required = array(
            'stc_name', 'stc_sys_name'
        );

        $errors = [];

        foreach ($_POST as $k => $v) {
            if (in_array($k, $required) && empty($v)) {
                $errors[] = $k;
            }
        }

        if (!empty($errors)) {
            $_SESSION['stc_fields'] = $_POST;
            $_SESSION['stc_errors'] = $errors;

            if (isset($_POST['_backuri'])) {
                redirect(base64_decode($_POST['_backuri']));
            } else {
                redirect($this->base_path);
            }
        }

        $settings = [];

        foreach ($_POST as $name => $value) {
            $xname = strtolower($name);

            if (strstr($xname, 'settings_')) {
                $xname = str_replace('settings_', '', $xname);
                $settings[$xname] = $value;
                unset($_POST[$name]);
            }
        }

        $this->saveSettings($settings);

        $action = __post("action");
        $access = "";

        if (isset($_POST['stc_access']) && is_array($_POST['stc_access'])) {
            $access = implode(",", $_POST['stc_access']);
        }

        $stc_arr = [
            #
            'title'         => __post("meta_title"),
            'keywords'      => __post("meta_keywords"),
            'description'    => __post("meta_description"),
            'robots'        => __post("meta_robots"),

            #
            'pid'            => __post("stc_pid"),
            'tid'            => __post("stc_tid"),
            'name'        => __post("stc_name"),
            'locale'        => __post("stc_locale"),
            'sys_name'        => __post("stc_sys_name"),
            'menuname'    => __post("stc_menuname"),
            'redirect'        => __post("stc_redirect"),
            'dynamic'        => __post("stc_dynamic"),
            'ord'            => __post("stc_ord"),
            
            'access'        => $access,

            'mod_id'        => __post("mod_id"),
            'visible'        => __post("stc_visible"),
            'date'            => __post("stc_date"),
            'in_sitemap'    => __post("stc_in_sitemap"),
            'in_menu'        => __post("stc_menu")
        ];

        $cnt_arr = array(
            'content' => __post('cnt_content')
        );

        if ($action == "add") {
            if (!$stc_arr['name']) {
                return false;
            }
            if (!$stc_arr['sys_name']) {
                return false;
            }
            
            $str_id = $this->stc->insertStc($stc_arr);

            $this->stc->setFilling($cnt_arr);

            setcookie(
                $str_id . '_toogle_' . md5(str_replace('/', '|', $this->base_path . '|index|edit|' . $str_id . '|' . $stc_arr['sys_name'] . '|')),
                'show',
                time() + 3600*24*7
            );

            $this->makeUrl($str_id);

            if (isset($_POST['apply'])) {
                redirect($this->base_path . '/index/edit/' . $str_id . '/' . $stc_arr['sys_name'] . '/');
            } else {
                redirect($this->base_path);
            }
        } elseif ($action == "edit") {
            if ($stc_arr['pid'] == $this->element) {
                $stc_arr['pid'] = 1;
            }
    
            $this->stc->updateStc($stc_arr, $this->element);
            $this->stc->setFilling($cnt_arr);

            $this->makeUrl($this->element);

            if (isset($_POST['apply'])) {
                redirect($this->base_path . '/index/edit/' . $this->element . '/' . $stc_arr['sys_name'] . '/');
            } else {
                redirect($this->base_path);
            }
        }
    }
}
