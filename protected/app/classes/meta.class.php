<?php

class Meta extends MDD
{
    use Singleton, Tools;

    public $f_pid           = '';
    public $table_main      = '';
    public $table_files     = '#__sys_files';
    public $table_fields    = '#__mdd_fields';
    public $table_lists     = '#__mdd_lists';
    public $is_recursive    = false;
    public $pager           = 10;
    public $ord             = 'id';
    public $ord_type        = 'DESC';
    public $module_info     = [];

    public $mysql           = null;
    public $mysql2          = null;

    public function __construct($module = '')
    {
        parent::__construct();

        if (!$module || !is_numeric($module)) {
            return false;
        }

        //  Get module
        $this->module_info = $this->getModules($module);

        if (empty($this->module_info)) {
            return false;
        }

        //  Define base variables
        $this->table_main    = $this->prepareTableName($this->module_info['sys_name']);

        if ($this->module_info['pager']) {
            $this->pager = $this->module_info['pager'];
        }

        if ($this->module_info['ord']) {
            $this->ord = $this->module_info['ord'];
        }

        $limit_key = 'module_limit_'.$module;

        if (isset($_COOKIE[$limit_key]) && is_numeric($_COOKIE[$limit_key])) {
            $this->pager = $_COOKIE[$limit_key];
        }

        $this->ord_type = $this->module_info['ord_type'];
        $this->mysql    = new Mysql();
        $this->mysql2   = new Mysql();
    }

    //  Load module information
    public function loadModule()
    {
        return $this->module_info;
    }

    public function filterModule($module_id = 0, $meta_module = [])
    {
        $filter = [];

        // range slider list timeline autocomplete

        foreach ($meta_module as $module) {
            if (in_array($module['f_type'], [ 'select', 'multiselect', 'treeselect', 'radio', 'checkbox' ]))
            {
                $settings = $module['f_settings'];

                if (!empty($settings)) {
                    $list = [];

                    if (isset($settings['f_use_table_list']) && isset($settings['f_table_list'])) {
                        $list = getfl($settings['f_table_list']);
                    } elseif (isset($settings['f_table_name']) && $settings['f_table_name'] !== '' && isset($settings['f_table_field']) && $settings['f_table_field'] !== '') {
                        $data = $this->getTypeLists($settings['f_table_name'], $settings['f_table_field']);
                    }

                    if (!empty($list)) {
                        if ($module['f_type'] == 'checkbox') {
                            $type = 'multiselect';
                        } else {
                            $type = 'select';
                        }

                        $filter[$module['f_sys_name']]['type'] = $type;
                        $filter[$module['f_sys_name']]['name'] = $module['f_name'];
                        $filter[$module['f_sys_name']]['list'] = $list;
                    }
                }
            }
        }

        return $filter;
    }

    public function sortModule($module_id = 0, $meta_module = [])
    {
        return [];
    }

    public function loadAdditions($module_id = 0, $meta_module)
    {
        $result = [];

        if ($module_id) {
            $additions = Q("SELECT `m2`.`name`, `m2`.`id` FROM `#__mdd_modules` as `m2` WHERE `m2`.`id` IN (SELECT `m1`.`additions` FROM `#__mdd_modules` as `m1` WHERE `m1`.`id`=?i)", array($module_id))->all();

            if (!empty($additions)) {
                $additions[] = array(
                    'id'    =>    $meta_module['id'] ,
                    'name'    =>    $meta_module['name']
               );

                foreach ($additions as $k => $v) {
                    $result[$v['id']] = $v['name'] ;
                }

                ksort($result) ;
            }
        }

        return $result;
    }

    public function prepareFieldArr($module_fields)
    {
        $arr = [];
        foreach ($module_fields as $v) {
            if ($v['in_list']) {
                $arr[] = $v['f_sys_name'];
            }
        }
        return $arr;
    }

    public function getModuleForStc()
    {
        $sql = "SELECT * FROM `".$this->table_fields."` WHERE `module_id`='".$this->module_info['id']."' ORDER BY `ord` ";

        $this->mysql->query($sql);

        $title_field = '';

        while ($this->mysql->next_record() && $title_field == '')
        {
            if ($this->mysql->f("f_sys_name") != 'id') {
                $title_field = $this->mysql->f("f_sys_name");
            }
        }

        $sql = "SELECT `id`,`visible`,`".$title_field."` as `name` FROM `".$this->table_main."` ORDER BY ".$this->ord." ".$this->ord_type;
        $this->mysql->query($sql);
        $this->mysql->preparePager($this->pager);

        $res = [];

        while ($this->mysql->next_record())
        {
            $res[] = [
                'id'        => $this->mysql->f('id'),
                'visible'   => $this->mysql->f('visible'),
                'name'      => from_base($this->mysql->f('name')),
                'mid'       => $this->module_info['id'],
            ];
        }

        if (isset($this->mysql->pager['page_count']) && $this->mysql->pager['page_count'] > 1)
        {
            $res[] = [
                'm_link'    => "/" . ADMIN_DIR . "/meta/module/" . $this->module_info['id'] . "/?page=1",
                'mid'       => $this->module_info['id'],
            ];
        }

        return $res;
    }

    public function metaEnable($module_id = '', $item_id = 0)
    {
        $count = Q("SELECT COUNT(*) as `count` FROM `".$this->table_fields."` WHERE `f_type` LIKE 'meta' AND `module_id`=?i LIMIT 1 ", [
            $module_id
        ])->row('count');

        if ($count > 0)
        {
            if ($item_id)
            {
                $meta = Q("SELECT `meta_title`, `meta_keywords`, `meta_description`, `meta_robots` FROM `#_mdd_" . $this->module_info['sys_name'] . "` WHERE `id`=?i LIMIT 1", [
                    $item_id
                ])->row();

                $meta['meta_robots'] = preg_split('/\,+/', $meta['meta_robots'], -1, PREG_SPLIT_NO_EMPTY);

                return $meta;
            }

            return true;
        }

        return false;
    }

    public function toggleVis($id)
    {
        $temp = Q("SELECT `visible` FROM `".$this->table_main."` WHERE `id`=?i LIMIT 1", [
            $id
        ])->row('visible');

        $visible = ($temp == 0) ? 1 : 0;

        Q("UPDATE `".$this->table_main."` SET `visible`=?i WHERE `id`=?i LIMIT 1", [
            $visible, $id
        ]);

        return true;
    }

    public function getChildsForStc()
    {
        $childs = Q("SELECT `id` FROM `".$this->table_main."`")->all();

        if (count($childs))
        {
            return 1;
        }
        else
        {
            return 0;
        }
    }

    public function inAsocArray($needle = [], $haystack = [])
    {
        if (is_array($haystack) && is_array($needle) && !empty($needle) && !empty($haystack)) {
            foreach ($haystack as $item) {
                if (is_array($item) && !empty($item)) {
                    $diff = array_diff_assoc($item, $needle);

                    if (count($diff) < count($item)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public function listModule($fields = [])
    {
        $arr = [];
        $res = [];

        $sql = "SELECT `id`";

        foreach ($fields as $item) {
            if (isset($item['in_list']) && $item['in_list'] == 1 && $item['f_type'] !== 'meta') {
                $sql .= ", `" . to_base($item['f_sys_name']) . "`";

                if (in_array($item['f_type'], array('select', 'radio', 'checkbox', 'multiselect', 'treeselect'))) {
                    if (isset($item['f_settings']['f_table_name']) && $item['f_settings']['f_table_name'] !== '' && isset($item['f_settings']['f_table_field']) && $item['f_settings']['f_table_field'] !== '') {
                        $arr[$item['f_sys_name']] = $this->getTypeLists($item['f_settings']['f_table_name'], $item['f_settings']['f_table_field']);
                    } elseif (isset($item['f_settings']['f_table_list']) && $item['f_settings']['f_table_list'] !== '') {
                        $arr[$item['f_sys_name']] = $this->getTypeLists($item['f_settings']['f_table_list']);
                    }
                }
            }
        }

        $where = '';

        $mod_id = $this->module_info['id'];

        if (!empty($_COOKIE['module_sorted_'.$mod_id])) {
            $cookie_sort = unserialize(from_base($_COOKIE['module_sorted_'.$mod_id])) ;

            if (isset($cookie_sort[$this->module_info['id']])) {
                $temp = [];
                $sort = $cookie_sort[$this->module_info['id']];

                foreach ($fields as &$field) {
                    array_push($temp, $field['f_sys_name']);
                }

                foreach ($sort as $key => $v) {
                    if (!in_array($key, $temp)) {
                        unset($sort[$key]);
                    }
                }

                unset($temp);

                if (!empty($sort)) {
                    foreach ($sort as $k => $v) {
                        if ($v !== '') {
                            if ($where !== '') {
                                $where .= " AND";
                            }

                            if (is_array($v)) {
                                $where .= " FIND_IN_SET(`".$k."`, '".implode(',', $v)."')";
                            } else {
                                $where .= " `".$k."`='".$v."'";
                            }
                        }
                    }
                }
            }
        }

        if ($where) {
            $where = "WHERE " . $where;
        }

        $sql .= " FROM `".$this->table_main."` " . $where ;

        if ($this->ord !== 'id' && $this->inAsocArray(array('f_sys_name' => $this->ord), $fields) === true) {
            if ($this->ord == 'date') {
                $sql .= " ORDER BY STR_TO_DATE(" . $this->ord . ", '%d.%m.%Y') " . $this->ord_type . " ";
            } else {
                $sql .= " ORDER BY " . $this->ord . " " . $this->ord_type . " ";
            }
        }

        $pager = [];

        $pager['limit'] = $this->pager;

        $pager['curr_page'] = isset($_GET['page']) ? intval($_GET['page']) : 0;
        $pager['all_items']    = Q("SELECT COUNT(`id`) AS `count` FROM `".$this->table_main."` ".$where." LIMIT 1")->row('count');
        $pager['start_item'] = $pager['limit'] * $pager['curr_page'];
        $pager['page_count'] = ceil($pager['all_items'] / $pager['limit']);

        $prn_limit = 12;

        if ($pager['page_count'] > 30) {
            if ($pager['all_items'] > $pager['limit']) {
                $pager['advanced'] = 1;
                $pager['arr_pages'] = [];

                $pager['first_page'] = '/' . ADMIN_DIR . '/meta/module/list/' . $this->module_info['id'] .'/?page=0';
                $pager['last_page'] = '/' . ADMIN_DIR . '/meta/module/list/' . $this->module_info['id'] .'/?page=' . ($pager['page_count'] - 1);

                $first_pager = $pager['curr_page'] - $prn_limit;
                $last_pager = $first_pager + $prn_limit * 2;

                if ($first_pager <= 0) {
                    $first_pager = 0;
                    $last_pager = $first_pager + $prn_limit + ($prn_limit / 2);
                }

                if ($last_pager >= $pager['page_count']) {
                    $last_pager = $pager['page_count'] - 1;
                    $first_pager = $last_pager - $prn_limit - ($prn_limit / 2);
                }

                for ($i = $first_pager; $i <= $last_pager; $i++) {
                    $pager['arr_pages'][] = array(
                        'point'     =>    $i,
                        'qstring'   =>    '/' . ADMIN_DIR . '/meta/module/list/' . $this->module_info['id'] .'/?page=' . $i
                   );
                }
            }
        } else {
            if ($pager['all_items'] > $pager['limit']) {
                $pager['arr_pages'] = [];

                for ($i = 0; $i < $pager['page_count']; $i++) {
                    $pager['arr_pages'][] = array(
                        'point'     =>    $i,
                        'qstring'   =>    '/' . ADMIN_DIR . '/meta/module/list/' . $this->module_info['id'] .'/?page=' . $i
                   );
                }
            }
        }

        $result = Q($sql . " LIMIT ?i, ?i", array($pager['start_item'], $pager['limit']))->all();

        $i = 0;

        $fields_temp = [];

        foreach ($fields as $item) {
            if ($item['in_list'] or $item['f_sys_name'] == 'id') {
                $fields_temp[$item['f_sys_name']] = $item;
            }
        }

        $fields = $fields_temp;

        foreach ($result as $key => $item) {
            foreach ($item as $name => $value) {
                $field = $fields[$name];

                if ($field['f_sys_name'] !== '') {
                    if (in_array($field['f_type'], array('select', 'treeselect', 'radio'))) {
                        if (isset($arr[$field['f_sys_name']][$value])) {
                            $value = $arr[$field['f_sys_name']][$value] ;
                        }

                        $result[$key][$field['f_sys_name']] = $value ;
                    } elseif (in_array($field['f_type'], array('checkbox', 'multiselect', 'range'))) {
                        $result[$key][$field['f_sys_name']] = $value;
                    } else {
                        $result[$key][$field['f_sys_name']] = from_base($value);
                    }
                }
            }
        }

        return array(
            'result'    =>    $result,
            'pager'        =>    $pager
        );
    }

    public function itemModule($item_id = 0, $fields, $base = '')
    {
        if ($item_id !== 0) {
            $sql = "SELECT ";

            if (empty($fields)) {
                $sql .= " `id` ";
            }

            foreach ($fields as $v) {
                $sql .=  "`" . $v['f_sys_name'] . "`";

                if ($v !== end($fields)) {
                    $sql .= ", ";
                }
            }

            $base = $base == '' ? $this->table_main : $base;

            $sql .= " FROM `". $base ."` WHERE `id`=?i LIMIT 1";

            $row = Q($sql, array($item_id))->row();

            foreach ($fields as $k => $item) {
                if (in_array($item['f_type'], array('checkbox', 'multiselect', 'range'))) {
                    $a = $row[$item['f_sys_name']];

                    if ($item['f_type'] == 'range') {
                        $arr = preg_split('/\,+/', $a, -1, PREG_SPLIT_NO_EMPTY);

                        if (!is_array($arr) || count($arr) < 2) {
                            $arr = array($item['f_settings']['f_range']['min'], $item['f_settings']['f_range']['max']);
                        }

                        $fields[$k]['value'] = $arr;
                    } else {
                        if ($a !== null && $a !== '') {
                            $fields[$k]['value'] = explode(",", $a);
                        } else {
                            $fields[$k]['value'] = $a;
                        }
                    }
                } elseif (in_array($item['f_type'], array('file', 'image')) && $row[$item['f_sys_name']] == '') {
                    $fields[$k]['value'] = 'file_' . $item['module_id'] . '_' . $item['id'] . '_' . str_replace('.', '_', uniqid());
                } elseif (in_array($item['f_type'], array('editor', 'redactor'))) {
                    $fields[$k]['value'] = $row[$item['f_sys_name']];
                } elseif ($item['f_type'] == 'list') {
                    $fields[$k]['value'] = $row[$item['f_sys_name']];
                } elseif ($item['f_type'] == 'timeline') {
                    $fields[$k]['value'] = '';
                    if ($row[$item['f_sys_name']] !== '') {
                        $fields[$k]['value'] = json_decode($row[$item['f_sys_name']], true);
                    }
                } else {
                    $fields[$k]['value'] = from_base($row[$item['f_sys_name']]);
                }
            }
        }

        return $this->getListInfo($fields);
    }

    public function itemExtend($meta_item = [])
    {
        foreach ($meta_item as &$item) {
            if ($item['f_type'] == 'list') {
                $json = json_decode($item['value'], true);

                if (!empty($json)) {
                    $f_settings = $item['f_settings'];

                    if (!empty($f_settings) && $f_settings['f_table_name'] !== '' && !empty($f_settings['f_table_field'])) {
                        $tmp0 = explode('_', $f_settings['f_table_name']);
                        $tmp1 = end($tmp0);

                        $this->element = Q("SELECT `id` FROM `#__mdd_modules` WHERE `sys_name` LIKE ?s LIMIT 1", array($tmp1))->row('id');
                        $fields = $this->getFields($this->element, true);

                        $result = [];

                        foreach ($json as $id => $a) {
                            $temp = $this->itemModule($id, $fields, '#_mdd_catalog');

                            foreach ($temp as $k => $v) {
                                if (!in_array($v['f_sys_name'], $f_settings['f_table_field'])) {
                                    unset($temp[$k]);
                                }
                            }

                            $catalog_item = array(
                                'time'  =>  array(
                                    'name'  =>  'Время заказа',
                                    'value' =>  date('Y-m-d H:i:s', $a['time'])
                               ),
                                'size_val'  =>  array(
                                    'name'  =>  'Размер',
                                    'value' =>  $a['size']
                               ),
                                'count'  =>  array(
                                    'name'  =>  'Кол-во',
                                    'value' =>  $a['count']
                               ),
                                'price'  =>  array(
                                    'name'  =>  'Стоимость',
                                    'value' =>  $a['price']
                               )
                            );

                            if (!empty($temp)) {
                                foreach ($temp as $n => $v) {
                                    if (isset($v['list']) && !empty($v['list'])) {
                                        $value = $v['list'];
                                    } else {
                                        $value = $v['value'];
                                    }

                                    $catalog_item[$v['f_sys_name']] = array(
                                        'name'  => $v['f_name'],
                                        'value' => $value
                                  );
                                }
                            }

                            $result[$id] = $catalog_item;
                        }

                        $item['list'] = $result;
                    }
                }
            }
        }

        return $meta_item;
    }

    public function getListInfo($arr = [])
    {
        foreach ($arr as $k => $item)
        {
            if (isset($item['f_type']))
            {
                if (isset($item['f_settings']['f_table_list']) && $item['f_settings']['f_table_list'] !== '')
                {
                    $list = Q("SELECT `var`, `value`, `default`
                                FROM `".$this->table_lists."`
                                WHERE `list_name` LIKE '" . $item['f_settings']['f_table_list'] . "'
                                ORDER BY `ord`")->all();

                    foreach ($list as $i => $v)
                    {
                        if (isset($item['value']))
                        {
                            $list[$i]['checked'] = is_array($v['value']) ? (in_array($v['value'], $item['value']) ? 1 : 0) : ($v['value'] == $item['value'] ? 1 : 0);
                        }
                        else
                        {
                            $list[$i]['checked'] = 0;
                        }
                    }

                    $arr[$k]['list'] = $list;
                }

                if (isset($item['f_settings']['f_hidden_default']) && $item['f_settings']['f_hidden_default'] !== '')
                {
                    $arr[$k]['value'] = $item['f_settings']['f_hidden_default'] ;
                }

                if (isset($item['f_settings']['f_hidden_default']) && $item['f_settings']['f_hidden_default'] !== '')
                {
                    $arr[$k]['value'] = $item['f_settings']['f_hidden_default'] ;
                }

                if (isset($item['f_settings']['f_table_name']) && $item['f_settings']['f_table_name'] !== '' && isset($item['f_settings']['f_table_field']) && $item['f_settings']['f_table_field'] !== '')
                {
                    if ($item['f_type'] == 'autocomplete')
                    {
                        if ($this->existTable($item['f_settings']['f_table_name']))
                        {
                            $arr[$k]['value'] = Q("SELECT `id` as `value`, `" . $item['f_settings']['f_table_field'] . "` as `var` FROM `" . $item['f_settings']['f_table_name'] . "` WHERE `id`=?i LIMIT 1", array($item['value']))->row();
                        }
                    }
                    else
                    {
                        $list = [];

                        if ($this->existTable($item['f_settings']['f_table_name']))
                        {
                            if (!is_array($item['f_settings']['f_table_field']))
                            {
                                $add_fields = '';

                                if ($item['f_type'] == 'treeselect')
                                {
                                    $add_fields = '`id`, `parent` as `pid`, ';
                                }

                                $list = Q("SELECT `id` as `value`, ". $add_fields ." `" . $item['f_settings']['f_table_field'] . "` as `var` FROM `" . $item['f_settings']['f_table_name'] . "` ")->all();

                                foreach ($list as $i => $v) {
                                    $list[$i]['checked'] = is_array($v['value']) ? (isset($item['value']) && in_array($v['value'], $item['value']) ? 1 : 0) : (isset($item['value']) && $v['value'] == $item['value'] ? 1 : 0) ;
                                }
                            }
                        }

                        $arr[$k]['list'] = $list;
                    }
                }

                if (in_array($item['f_type'], array('file', 'image'))) {
                    $f = new Files();

                    if (!isset($arr[$k]['value']) || $arr[$k]['value'] == '') {
                        $arr[$k]['value'] = 'file_' . $item['module_id'] . '_' . $item['id'] . '_' . str_replace('.', '_', uniqid());
                    }

                    $_list = $f->getFilesByGroup($arr[$k]['value'], 'original');

                    foreach ($_list as &$_li) {
                        $_li['uuid'] = $_li['id'];
                        $_li['name'] = $_li['title'];
                        $_li['size'] = $_li['bsize'];
                        $_li['thumbnailUrl'] = $_li['file'];
                    }

                    $arr[$k]['list'] = $_list;
                    $arr[$k]['json'] = json_encode($arr[$k]['list'], 64 | 256);
                }

                if ($item['f_type'] == 'section' && isset($item['f_settings']['f_table_name']) && $item['f_settings']['f_table_name'] !== '' && isset($item['f_settings']['f_table_field']) && $item['f_settings']['f_table_field'] !== '') {
                    $item['value'] = preg_split('/\,+/', $item['value'], -1, PREG_SPLIT_NO_EMPTY);

                    if (!empty($item['value'])) {
                        $arr[$k]['list'] = Q("SELECT `id` AS `value`, `" . $item['f_settings']['f_table_field'] . "` AS `var` FROM `". $item['f_settings']['f_table_name'] ."` WHERE `id` IN(?li) ORDER BY `ord`", array($item['value']))->all();
                    }
                }

                if ($item['f_type'] == 'section' && isset($item['f_settings']['f_use_table_list']) && $item['f_settings']['f_use_table_list'] == 1 && isset($item['f_settings']['f_table_list']) && $item['f_settings']['f_table_list'] !== '') {
                    $item['value'] = preg_split('/\,+/', $item['value'], -1, PREG_SPLIT_NO_EMPTY);

                    $list = [];

                    if (!empty($item['value'])) {
                        $list = Q("SELECT `var`, `value`, `default` FROM `".$this->table_lists."` WHERE `list_name` LIKE '" . $item['f_settings']['f_table_list'] . "' AND `value` IN (?li) ORDER BY `ord`", array($item['value']))->all();

                        foreach ($list as $i => $v) {
                            $list[$i]['checked'] = is_array($v['value']) ? (in_array($v['value'], $item['value']) ? 1 : 0) : ($v['value'] == $item['value'] ? 1 : 0) ;
                        }
                    }

                    $arr[$k]['list'] = $list;
                }

                if ($item['f_type'] == 'fullcalendar')
                {
                    if (!isset($item['value']) || $item['value'] == '')
                    {
                        $value = 'group_' . $item['module_id'] . '_' . $item['id'] . '_' . str_replace('.', '_', uniqid());
                        $arr[$k]['value'] = $value;
                    }
                    else
                    {
                        $value = $item['value'];
                    }

                    $list = Q("SELECT `id`, `title`, `item`, `start`, `end`, `color`, `extra`, `types`, `visible` FROM `#__sys_shedule` WHERE `group` LIKE ?s ORDER BY `start`", [
                        $value
                    ])->all();

                    foreach ($list as &$list_item)
                    {
                        $list_item['color'] = sprintf('#%s', $list_item['color']);
                        $list_item['start'] = date('Y-m-d\TH:i:s', $list_item['start']);
                        $list_item['end'] = date('Y-m-d\TH:i:s', $list_item['end']);
                    }

                    $arr[$k]['list'] = $list;

                    $arr[$k]['json'] = json_encode($list, 64 | 256);
                }

                if ($item['f_type'] == 'document') {
                    $arr[$k]['list'] = Q("SELECT `group_name` as `value`, `title` as `var` FROM `#__docs_group`")->all();
                }

                if ($item['f_type'] == 'timestamp') {
                    $arr[$k]['value'] = time();
                }

                if ($item['f_type'] == 'treeselect')
                {
                    $list = $arr[$k]['list'];
                    $arr[$k]['list'] = $this->makeTree($list, 0, 'pid', 'id', 'tree');
                }

                if ($item['f_type'] == 'multiselect')
                {
                    if (!empty($arr[$k]['value']) && !empty($arr[$k]['list'])) {
                        foreach ($arr[$k]['list'] as &$li) {
                            if (in_array($li['value'], $arr[$k]['value'])) {
                                $li['checked'] = 1;
                            }
                        }
                    }
                }
            }
        }

        return $arr;
    }

    public function getTypeLists()
    {
        $numargs = func_num_args();
        $arr = [];

        if ($numargs == 2) {
            $table = func_get_arg(0);    // first arg is table name
            $field = func_get_arg(1);    // second arg is field name
            $temp = Q("SELECT `id` as `value`, `".$field."` as `var` FROM `".$table."` ")->all('value');

            if (!empty($temp)) {
                foreach ($temp as $key => $val) {
                    $arr[$key] = $val['var'];
                }
            }
        } elseif ($numargs == 1) {
            $bind = func_get_arg(0);
            $temp = Q("SELECT `var`, `value` FROM `".$this->table_lists."` WHERE `list_name`='".$bind."' ")->all('value');

            if (!empty($temp)) {
                foreach ($temp as $key => $val) {
                    $arr[$key] = $val['var'];
                }
            }
        }

        return $arr;
    }

    public function is_req_table($table, $field)
    {
        $table = str_replace("#_mdd_", "", $table);
        $sql = "SELECT * FROM `#__mdd_modules` WHERE `sys_name`='".$table."'";
        $this->mysql->query($sql);
        if ($this->mysql->nf()) {
            $this->mysql->next_record();
            $mid = $this->mysql->f('id');
            //
            $sql = "SELECT * FROM `#__mdd_fields` WHERE `module_id`='".$mid."' AND `f_table_dep`='#_mdd_".$table."' AND `f_table_field`='".$field."'";
            $this->mysql->query($sql);
            if ($this->mysql->nf()) {
                return true;
            }
        }
        return false;
    }

    //  get files
    public function getFiles($gid)
    {
        $sql = "SELECT * FROM `".$this->table_files."` WHERE `gid`='".to_base($gid)."' ORDER BY `ord`";
        $this->mysql->query($sql);
        return $this->mysql->getAll();
    }

    public function addFiles($data, $group, $sys_name)
    {
        if (!empty($_FILES[$sys_name])) {
            F($_FILES[$sys_name])->upload($group, $data['f_settings']);
        }
    }

    public function updateData($module_id = 0, $item_id = 0)
    {
        if (!$module_id || isset($this->module_info['id']))
        {
            $module_id = $this->module_info['id'];
        }

        if (!$module_id)
        {
            return;
        }

        $fields = $this->getFields($module_id, true);

        foreach ($fields as $key => $fi)
        {
            if ($fi['f_type'] == 'meta')
            {
                unset($fields[$key]);
            }
        }

        $sql = "UPDATE `".$this->table_main."` SET `id`='" . $item_id ."' ";

        foreach ($fields as $k => $item)
        {
            if (in_array($item['f_sys_name'], [ 'id', 'gid', 'created', 'updated', 'module_id' ]))
            {
                continue;
            }
            elseif ($item['f_sys_name'] == 'updated')
            {
                $sql .= ", `" . $item['f_sys_name'] . "` = " . time();
                continue;
            }
            elseif ($item['f_sys_name'] == 'uid')
            {
                $sql .= ", `" . $item['f_sys_name'] . "`='" . $_SESSION['userinf']['id'] . "' ";
                continue;
            }
            elseif (in_array($item['f_type'], [ 'file' ]))
            {
                $sql .= ", `" . $item['f_sys_name'] . "`='" . to_base(__post($item['f_sys_name'])) . "' ";
                $this->addFiles($item, to_base(__post($item['f_sys_name'])), $item['f_sys_name']);
            }
            elseif (in_array($item['f_type'], [ 'checkbox', 'multiselect', 'range' ]))
            {
                $check_value = (isset($_POST[$item['f_sys_name']]) && is_array($_POST[$item['f_sys_name']])) ? implode(",", $_POST[$item['f_sys_name']]) : '';

                $sql .= ", `" . $item['f_sys_name'] . "`='" . $check_value . "' ";
            }
            elseif (in_array($item['f_type'], [ 'timeline' ]))
            {
                $time = [];

                if (isset($_POST[$item['f_sys_name']]) && is_array($_POST[$item['f_sys_name']])) {
                    if (isset($_POST[$item['f_sys_name']]['min'])) {
                        foreach ($_POST[$item['f_sys_name']]['min'] as $day => $tmv) {
                            $time[$day]['min'] = $tmv;
                        }
                    }

                    if (isset($_POST[$item['f_sys_name']]['max'])) {
                        foreach ($_POST[$item['f_sys_name']]['max'] as $day => $tmv) {
                            $time[$day]['max'] = $tmv;
                        }
                    }
                }

                $check_value = json_encode($time);

                $sql .= ", `" . $item['f_sys_name'] . "`='" . $check_value . "' ";
            }
            else
            {
                $sql .= ", `" . $item['f_sys_name'] . "`='" . to_base(__post($item['f_sys_name'])) . "' ";
            }
        }

        $sql .= " WHERE `id`= '" . $item_id . "' LIMIT 1";

        Q($sql);
    }

    public function insertData($module_id = 0)
    {
        if (!$module_id || isset($this->module_info['id'])) {
            $module_id = $this->module_info['id'];
        }

        if (!$module_id) {
            return;
        }

        $fields = $this->getFields($module_id, true);

        foreach ($fields as $key => $fi) {
            if ($fi['f_type'] == 'meta') {
                unset($fields[$key]);
            }
        }

        $sql = "INSERT INTO `".$this->table_main."` SET `updated`=".time();

        foreach ($fields as $k => $item) {
            if (in_array($item['f_sys_name'], array('id', 'gid', 'module_id', 'updated'))) {
                continue;
            } elseif ($item['f_sys_name'] == 'created') {
                $sql .= ", `" . $item['f_sys_name'] . "` = " . time();
                continue;
            } elseif ($item['f_sys_name'] == 'uid') {
                $sql .= ", `" . $item['f_sys_name'] . "`='" . $_SESSION['userinf']['id'] . "' ";
                continue;
            } elseif (in_array($item['f_type'], array('file'))) {
                // elseif (in_array($item['f_type'], array('file', 'image')))
                $sql .= ", `" . $item['f_sys_name'] . "`='" . to_base(__post($item['f_sys_name'])) . "' ";
                $this->addFiles($item, to_base(__post($item['f_sys_name'])), $item['f_sys_name']);
            } elseif (in_array($item['f_type'], array('checkbox', 'multiselect', 'range'))) {
                $check_value = (isset($_POST[$item['f_sys_name']]) && is_array($_POST[$item['f_sys_name']])) ? implode(",", $_POST[$item['f_sys_name']]) : '';

                $sql .= ", `" . $item['f_sys_name'] . "`='" . $check_value . "' ";
            } elseif (in_array($item['f_type'], array('timeline'))) {
                $time = [];

                if (isset($_POST[$item['f_sys_name']]) && is_array($_POST[$item['f_sys_name']])) {
                    if (isset($_POST[$item['f_sys_name']]['min'])) {
                        foreach ($_POST[$item['f_sys_name']]['min'] as $day => $tmv) {
                            $time[$day]['min'] = $tmv;
                        }
                    }

                    if (isset($_POST[$item['f_sys_name']]['max'])) {
                        foreach ($_POST[$item['f_sys_name']]['max'] as $day => $tmv) {
                            $time[$day]['max'] = $tmv;
                        }
                    }
                }

                $check_value = json_encode($time);

                $sql .= ", `" . $item['f_sys_name'] . "`='" . $check_value . "' ";
            } else {
                $sql .= ", `" . $item['f_sys_name'] . "`='" . to_base(__post($item['f_sys_name'])) . "' ";
            }
        }

        return Q($sql);
    }

    //  Delete data
    public function deleteData($item_id)
    {
        Q("DELETE FROM `" . $this->table_main . "` WHERE `id`=?i LIMIT 1", array(intval($item_id)));
    }

    //  Get next order
    public function getNextOrd($table_sys_name, $is_recursive=false)
    {
        if ($is_recursive) {
            $order = Q("SELECT MAX(`ord`) as `ord` FROM `".$this->table_main."` WHERE `".$this->f_pid."`=?i", array(intval(__get('pid'))))->row('ord');
        } else {
            $order = Q("SELECT MAX(`ord`) as`ord` FROM `".$this->table_main."`")->row('ord');
        }

        $order = $order * 1;

        if (!is_int($order)) {
            $order = 10;
        }

        return 10 + $order;
    }

    //
    public function tree_list_tree($a_list = [], $id=0, $all_tree)
    {
        if (!isset($a_list[$id]) || empty($a_list[$id])) {
            return [];
        }

        $a_tree=[];

        $cf = count($a_list[$id]);

        for ($i=0;$i<$cf;$i++) {
            $f=$a_list[$id][$i];
            //
            if (!$all_tree) {
                if (in_array($f[$this->f_pid], $_SESSION['admin_struct'])) {
                    //  Check modules
                    if ($f['mod_id'] && in_array($f['id'], $_SESSION['admin_struct'])) {
                        $module = new Meta($f['mod_id']);
                        if (!isset($module->module_info['id'])) {
                            $this->unlinkModule($f['id']);
                        } else {
                            $f['a_tree'] = $module->getModuleForStc();
                            if (isset($f['a_tree'][0])) {
                                $f['childs'] = 1;
                            } else {
                                $f['childs'] = 0;
                            }
                        }
                    } elseif ($f['mod_id']) {
                        $module = new Meta($f['mod_id']);
                        if (!isset($module->module_info['id'])) {
                            $this->unlinkModule($f['id']);
                        } else {
                            $f['childs'] = $module->getChildsForStc();
                        }
                    } else {
                        $f['childs'] = isset($a_list[$f['id']])?1:0;
                        $f['a_tree'] = $this->tree_list_tree($a_list, $a_list[$id][$i]['id'], $all_tree);
                    }

                    $a_tree[]=$f;
                }
            } else {
                $f['childs'] = isset($a_list[$f['id']])?1:0;
                $f['a_tree'] = $this->tree_list_tree($a_list, $a_list[$id][$i]['id'], $all_tree);
                $a_tree[]=$f;
            }
        }
        unset($cf);

        return $a_tree;
    }

    //  Get
    public function allTree($rootID=0, $all_tree=false)
    {
    }

    public function treeModule_2($table, $field)
    {
        $this->f_pid = $field;
        //
        $sql = "SELECT * FROM `".$table."` ORDER BY `".$this->f_pid."`,`ord`";
        $this->mysql->query($sql);
        $r = $this->mysql->Query_ID;
        if (!$this->mysql->nf()) {
            return false;
        }

        $a_list=[];
        $cf = mysql_num_rows($r);
        for ($i=0;$i<$cf;$i++) {
            $f=mysql_fetch_assoc($r);
            if (empty($a_list[$f[$this->f_pid]])) {
                $a_list[$f[$this->f_pid]]=[];
            }
            $a_list[$f[$this->f_pid]][]=$f;
        }
        unset($cf);
        return $this->tree_list_tree($a_list, $rootID=0, true);
    }

    public function treeModule($fields)
    {
        $table = $this->prepareTableName($this->module_info['sys_name']);
        foreach ($fields as $k=>$v) {
            if ($table == $v['f_table_dep']) {
                $this->f_pid = $v['f_sys_name'];
            }
        }
        //
        $sql = "SELECT * FROM `".$table."` ORDER BY `".$this->f_pid."`,`ord`";
        $this->mysql->query($sql);
        $r = $this->mysql->Query_ID;
        if (!$this->mysql->nf()) {
            return false;
        }

        $a_list=[];
        $cf = mysql_num_rows($r);
        for ($i=0;$i< $cf;$i++) {
            $f=mysql_fetch_assoc($r);
            if (empty($a_list[$f[$this->f_pid]])) {
                $a_list[$f[$this->f_pid]]=[];
            }
            $a_list[$f[$this->f_pid]][]=$f;
        }
        unset($cf);
        return $this->tree_list_tree($a_list, $rootID=0, true);
    }
}
