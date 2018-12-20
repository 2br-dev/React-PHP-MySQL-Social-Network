<?php

class MDD
{
    private $table_modules      = '#__mdd_modules';
    private $table_fields       = '#__mdd_fields';
    private $table_mysql_types  = '#__mdd_mysql_types';
    private $table_fields_type  = '#__mdd_fields_type';
    private $table_bind         = '#__mdd_binds';
    private $table_lists        = '#__mdd_lists';
    private $table_group        = '#__mdd_group';
    private $table_prefix       = '#_mdd_';
    private $charset            = 'utf8';

    public $rec_field           = false;
    public $is_recursive        = false;

    private $necessary_fields = [
        'id' => [
            'f_name' => 'ID',
            'f_sys_name' => 'id',
            'f_width' => 0,
            'f_type' => 'int',
            'ord' => '0',
            'in_list' => '0'
        ],
        'ord'  => [
            'f_name' => 'Сортировка',
            'f_sys_name' => 'ord',
            'f_width' => 0,
            'f_type' => 'int',
            'ord' => '1000',
            'in_list' => '1',
            'f_default' => 0
        ],
        'visible' => [
            'f_name' => 'Отображать',
            'f_sys_name' => 'visible',
            'f_width' => 0,
            'f_type' => 'tinyint',
            'ord' => '1010',
            'in_list' => '1'
        ],
        'created' => [
            'f_name' => 'Дата создания',
            'f_sys_name' => 'created',
            'f_width' => 0,
            'f_type' => 'int',
            'ord' => '1020',
            'in_list' => '0',
            'f_default' => 'NULL'
        ],
        'updated' => [
            'f_name' => 'Дата изменения',
            'f_sys_name' => 'updated',
            'f_width' => 0,
            'f_type' => 'int',
            'ord' => '1030',
            'in_list' => '0',
            'f_default' => 'NULL'
        ],
        'uid' => [
            'f_name' => 'Пользователь',
            'f_sys_name' => 'uid',
            'f_width' => 0,
            'f_type' => 'int',
            'f_settings' => [
                'f_table_name' => '#__usr_users',
                'f_table_field' => 'name'
            ],
            'ord' => '1040',
            'in_list' => '0',
            'f_default' => 'NULL'
        ],
        'gid' => [
            'f_name' => 'Группа',
            'f_sys_name' => 'gid',
            'f_width' => 0,
            'f_type' => 'int',
            'f_settings' => [
                'f_table_name' => '#__usr_groups',
                'f_table_field' => 'name'
            ],
            'ord' => '1050',
            'in_list' => '0',
            'f_default' => 'NULL'
        ],
    ];

    private $meta_fields = [
        'meta_title'        => [
            'f_name' => 'META title',
            'f_sys_name' => 'meta_title',
            'f_width' => 0,
            'f_type' => 'text',
            'ord' => 0,
            'in_list' => 0
        ],
        'meta_keywords'     => [
            'f_name' => 'META keywords',
            'f_sys_name' => 'meta_keywords',
            'f_width' => 0,
            'f_type' => 'text',
            'ord' => 0,
            'in_list' => 0
        ],
        'meta_description'  => [
            'f_name' => 'META description',
            'f_sys_name' => 'meta_description',
            'f_width' => 0,
            'f_type' => 'text',
            'ord' => 0,
            'in_list' => 0
        ],
        'meta_robots'       => [
            'f_name' => 'META robots',
            'f_sys_name' => 'meta_robots',
            'f_width' => 0,
            'f_type' => 'checkbox',
            'ord' => 0,
            'in_list' => 0
        ]
    ];

    private $index_fields = [
        'visible', 'ord', 'created', 'updated'
    ];

    public function __construct() {}

    public function getModules($id = 0, $flag = false, $count = true)
    {
        if ($id) {
            $result = Q("SELECT * FROM `".$this->table_modules."` WHERE `id`=?i LIMIT 1", array(intval($id)))->row();
            if (!empty($result)) {
                $this->is_recursive = $this->check_recursive($result);
                return $result;
            } else {
                return false;
            }
        } else {
            $arr = [];
            $modules = Q("SELECT `id`, `name`, `sys_name`, `type`, `active`, `pager`, `storage`, `order`, `ord_type` FROM `".$this->table_modules."` ORDER BY `order` DESC")->all();

            foreach ($modules as $item) {
                if ($this->existTable('#_mdd_' . $item['sys_name'])) {
                    if (!isset($arr[$item['sys_name']])) {
                        $arr[$item['sys_name']] = array(
                            'id'            =>    $item['id'],
                            'name'            =>    $item['name'],
                            'sys_name'        =>    $item['sys_name'],
                            'type'            =>    $item['type'],
                            'pager'            =>    $item['pager'],
                            'ord_type'        =>    $item['ord_type'],
                            'active'        =>    $item['active'],
                            'order'            =>    $item['order'],
                            'storage'        =>    $item['storage']
                        );

                        if ($count) {
                            $arr[$item['sys_name']] ['count']    = Q("SELECT COUNT(*) as `count` FROM `#_mdd_" . $item['sys_name'] . "` LIMIT 1")->row('count');
                        }
                    }
                }
            }

            return $arr;
        }
    }

    public function getGroupModules($modules = [], $groups = [])
    {
        if (!empty($groups)) {
            if (!empty($modules)) {
                $temp = [];

                foreach ($modules as $k => $arr) {
                    if ($arr['active'] != 0) {
                        $temp[$arr['id']] = $arr;
                    }
                }

                $modules = $temp;
            }

            $modules_temp = $modules;

            foreach ($groups as $k => $val) {
                if (!empty($groups[$k]['modules'])) {
                    foreach ($groups[$k]['modules'] as $id => $name) {
                        if (isset($modules[$id])) {
                            $groups[$k]['modules'][$id] = $modules[$id];
                            unset($modules_temp[$id]);
                        }
                    }
                }
            }

            $modules = $modules_temp;
        }

        return array(
            'groups'    => $groups,
            'modules'    => $modules
        );
    }

    public function delGroup($id)
    {
        Q("DELETE FROM `".$this->table_group."` WHERE `id`=?i LIMIT 1", array($id));
    }

    public function getGroupItem($id)
    {
        $item = Q("SELECT `id`, `name`, `sys_name`, `modules`, `ord`, `visible` FROM `".$this->table_group."` WHERE `id`=?i LIMIT 1", array($id))->row();
        $item['modules'] = explode(',', $item['modules']);
        return $item;
    }

    public function getGroup()
    {
        $list = Q("SELECT `id`, `name`, `sys_name`, `modules`, `ord`, `visible` FROM `".$this->table_group."` ORDER BY `ord` ASC")->all();
        if (!empty($list)) {
            foreach ($list as $key => $arr) {
                $modules = [];

                $temp = explode(',', $arr['modules']);
                if (!empty($temp)) {
                    foreach ($temp as $k => $id) {
                        $modules[$id] = Q("SELECT `name` FROM `".$this->table_modules."` WHERE `id`=?i LIMIT 1", array($id))->row('name');
                    }
                }

                $list[$key]['modules'] = $modules;
            }
        }
        return $list;
    }

    public function getNextGroupOrder()
    {
        $order = Q("SELECT (MAX(`ord`)+10) AS `order` FROM `".$this->table_group."` LIMIT 1")->row('order');

        if (!$order) {
            $order = 10;
        }

        return $order;
    }

    public function addGroup($arr)
    {
        if ($arr['name'] && $arr['sys_name']) {
            return Q("INSERT INTO `".$this->table_group."` SET `name`=?s, `sys_name`=?s, `modules`=?s, `ord`=?i, `visible`=?i ", array(
                $arr['name'], $arr['sys_name'], $arr['modules'], $arr['ord'], $arr['visible']
            ));
        } else {
            return 0;
        }
    }

    public function editGroup($arr, $id)
    {
        if ($arr['name'] && $arr['sys_name']) {
            return Q("UPDATE `".$this->table_group."` SET `name`=?s, `sys_name`=?s, `modules`=?s, `ord`=?i, `visible`=?i WHERE `id`=?i LIMIT 1", array(
                $arr['name'], $arr['sys_name'], $arr['modules'], $arr['ord'], $arr['visible'], $id
            ));
        }
    }

    public function check_recursive($arr)
    {
        return false;

        $table_name = $this->prepareTableName($arr['sys_name']);

        $this->rec_field = Q("SELECT `id`, `f_sys_name`, `f_settings` FROM `".$this->table_fields."` WHERE `f_settings`!='' AND `module_id`=?i", array( $arr['id'] ))->all();

        foreach ($this->rec_field as $ar) {
            $f_settings = unserialize($ar['f_settings']);
        }

        $this->rec_field = Q("SELECT `id`,`f_sys_name` FROM `".$this->table_fields."` WHERE `f_table_dep`='".to_base($table_name)."' AND `module_id`=?i", array( $arr['id'] ))->row('f_sys_name');

        if ($this->rec_field) {
            return true;
        }

        return false;
    }

    public function getOneField($id)
    {
        return Q("SELECT * FROM `".$this->table_fields."` WHERE `id`=?i LIMIT 1", array( $id ))->row();
    }

    public function getModuleItem($id = null)
    {
        return Q("SELECT * FROM `".$this->table_modules."` WHERE `id`=?i LIMIT 1", array(intval($id)))->row();
    }

    public function getFields($module_id = null, $all_fields = false, $base = '')
    {
        $result = [];

        $fields = Q("SELECT `id`, `module_id`, `f_name`, `f_sys_name`, `f_type`, `f_width`, `f_settings`, `f_index`, `f_unique`, `f_default`, `ord`, `in_list`
                     FROM `".$this->table_fields."`
                     WHERE `module_id`=?i
                     GROUP BY `f_sys_name`
                     ORDER BY `ord`", [ $module_id ])->all();

        if (!empty($fields))
        {
            foreach ($fields as $k => $ar)
            {
                if ($all_fields || !isset($this->necessary_fields[ $ar['f_sys_name'] ]))
                {
                    if (isset($ar['f_settings']) && !empty($ar['f_settings']))
                    {
                        $f_settings = @unserialize($ar['f_settings']);

                        if ($ar['f_type'] == 'embedded' && isset($f_settings['f_module']))
                        {
                            $_f = [];
                            $_temp = $this->getFields($f_settings['f_module']);

                            if (!empty($_temp))
                            {
                                foreach ($_temp as $_field)
                                {
                                    $_checked = false;

                                    if (isset($f_settings['f_fields']) && in_array($_field['f_sys_name'], $f_settings['f_fields']))
                                    {
                                        $_checked = true;
                                    }

                                    $_f[] = [
                                        'id'        =>  $_field['id'],
                                        'name'      =>  $_field['f_name'],
                                        'sys_name'  =>  $_field['f_sys_name'],
                                        'checked'   =>  $_checked
                                    ];
                                }
                            }

                            $ar['list'] = $_f;
                        }

                        if ($ar['f_type'] == 'list')
                        {
                            if (isset($f_settings['f_table_field']) && !empty($f_settings['f_table_field']))
                            {
                                $f_settings['f_table_field'] = preg_split('/\;+/', $f_settings['f_table_field'], -1, PREG_SPLIT_NO_EMPTY);
                            }
                        }

                        if ($ar['f_type'] == 'image' && !empty($f_settings['f_image_width']))
                        {
                            $image = [];

                            foreach ($f_settings['f_image_width'] as $key => $val) {
                                $image[$key] = array(
                                    'prefix'    =>  $f_settings['f_image_prefix'][$key],
                                    'width'     =>  $f_settings['f_image_width'][$key],
                                    'height'    =>  $f_settings['f_image_height'][$key],
                                    'method'    =>  $f_settings['f_image_photo_method'][$key]
                                );
                            }

                            $f_settings['json'] = json_encode($image);
                        }

                        $ar['f_settings'] = $f_settings;
                    }

                    $result[] = $ar;
                }
            }
        }

        return $result;
    }

    public function getBinds($id = 0)
    {
        if ($id) {
            $result = Q("SELECT * FROM `".$this->table_bind."` WHERE `id`=?i LIMIT 1", array($id))->row();
        } else {
            $result = Q("SELECT * FROM `".$this->table_bind."` ORDER BY `name`")->all();
        }

        return $result;
    }

    public function getFieldsType($id=0)
    {
        $result = [];

        if ($id === "asoc") {
            $result = Q("SELECT * FROM `".$this->table_fields_type."` ORDER BY `id`")->all();

            $tmp = [];
            foreach ($result as $v) {
                $tmp[ $v['sys_name'] ] = $v['mysql_type'];
            }

            $result = $tmp ;
        } elseif ($id) {
            $result = Q("SELECT * FROM `".$this->table_fields_type."` WHERE `id`=?i LIMIT 1", array(intval($id)))->all();
        } else {
            $result = Q("SELECT * FROM `".$this->table_fields_type."` ORDER BY `id`")->all();
        }

        return $result ;
    }

    public function addModule($fields = [])
    {
        $module_id = $this->existModule($fields['sys_name']);

        if (!$module_id)
        {
            if (!empty($fields)) {
                $sql = "INSERT INTO `".$this->table_modules."` SET ";

                $i = 0;
                $length = count($fields);

                foreach ($fields as $k => $v) {
                    $i++;

                    if ($k == 'additions' && is_array($v) && !empty($v)) {
                        $sql .= "`".$k."`='".implode(',', $v)."' ";
                    } else {
                        $sql .= "`".$k."`='".to_base($v)."'";
                    }

                    if ($i < $length) {
                        $sql .= ", ";
                    }
                }

                $module_id = Q($sql);
            }
        }

        return $module_id;
    }

    public function updateModule($id = 0, $fields = [])
    {
        $sql = "UPDATE `" . $this->table_modules . "` SET ";

        $index = 0;

        foreach ($fields as $k => $v) {
            $index++;

            if ($k == 'additions' && is_array($v) && !empty($v)) {
                $sql .= "`".$k."`='".implode(',', $v)."'";
            } else {
                $sql .= "`".$k."`='".to_base($v)."'";
            }

            if ($index < count($fields)) {
                $sql .= ", ";
            }
        }

        $sql .= " WHERE `id`=?i LIMIT 1";

        return Q($sql, array( $id ));
    }

    protected function insertSystemFields($id, $fields = [])
    {
        $fields = empty($fields) ? $this->necessary_fields : $fields;

        foreach ($fields as $v) {
            $sql = "INSERT INTO `".$this->table_fields."` SET `module_id`=?i ";

            foreach ($v as $kk => $vv) {
                if (is_array($vv)) {
                    $value = serialize($vv);
                } else {
                    $value = to_base($vv) ;
                }

                $sql .= ", `" . $kk . "`='" . $value . "'";
            }

            $sql .= " ON DUPLICATE KEY UPDATE `module_id`=?i";

            Q($sql, [ $id, $id ]);
        }
    }

    public function addFields($id)
    {
        $this->insertSystemFields($id);

        $settings = array(
            'f_date_format',
            'f_redactor',
            'f_module',
            'f_fields',
            'f_editor',
            'f_editor_mode',
            'f_file_count',
            'f_image_prefix',
            'f_image_width',
            'f_image_height',
            'f_hidden_default',
            'f_image_photo_method',
            'f_range',
            'f_binding',
            'f_table_name',
            'f_table_field',
            'f_use_table_list',
            'f_table_list'
       );

        $fields = [];
        $allows = [
            'f_name',
            'f_sys_name',
            'f_type',
            'f_ord',
            'f_module',
            'f_fields',
            'f_in_list',
            'f_width',
            'f_date_format',
            'f_redactor',
            'f_editor',
            'f_editor_mode',
            'f_file_count',
            'f_image_prefix',
            'f_image_width',
            'f_image_height',
            'f_hidden_default',
            'f_image_photo_method',
            'f_range',
            'f_binding',
            'f_table_name',
            'f_table_field',
            'f_use_table_list',
            'f_table_list'
        ];

        foreach ($allows as $key) {
            if (isset($_POST[ $key ]) && !empty($_POST[ $key ])) {
                foreach ($_POST[ $key ] as $k => $v) {
                    $fields[ $k ][ $key ] = !is_array($v) ? trim($v) : $v ;
                }
            }
        }

        if (!empty($fields)) {
            foreach ($fields as $k => $arr) {
                $f_width    = isset($arr['f_width']) ? $arr['f_width'] : 0;
                $in_list    = isset($arr['f_in_list']) ? 1 : 0;
                $f_index    = isset($arr['f_index']) ? 1 : 0;
                $f_unique    = isset($arr['f_unique']) ? 1 : 0;

                $f_settings = [];

                foreach ($settings as $i) {
                    if (isset($arr[ $i ])) {
                        $f_settings[ $i ] = $arr[ $i ] ;
                    }
                }

                if (empty($f_settings)) {
                    $f_settings = '';
                } else {
                    $f_settings = serialize($f_settings);
                }

                if ($arr['f_type'] == 'meta') {
                    $this->insertSystemFields($id, $this->meta_fields);
                }

                $count = Q("SELECT COUNT(*) as `count` FROM `".$this->table_fields."` WHERE `module_id`=?i AND `f_sys_name`=?s LIMIT 1", array( $id, $arr['f_sys_name'] ))->row('count');

                if ($count == 0) {
                    Q("INSERT INTO `".$this->table_fields."` SET `module_id`=?i, `f_name`=?s, `f_sys_name`=?s, `f_type`=?s, `f_width`=?i, `ord`=?i, `f_index`=?i, `f_unique`=?i, `in_list`=?i, `f_settings`=?s", array(
                        $id, $arr['f_name'], $arr['f_sys_name'], $arr['f_type'], $f_width, $arr['f_ord'], $f_index, $f_unique, $in_list, $f_settings
                    ));
                }
            }
        }
    }

    public function updateFields($id, $fields)
    {
        $settings = array(
            'f_date_format',
            'f_redactor',
            'f_module',
            'f_fields',
            'f_editor',
            'f_editor_mode',
            'f_file_count',
            'f_image_prefix',
            'f_image_width',
            'f_image_height',
            'f_hidden_default',
            'f_image_photo_method',
            'f_range',
            'f_index',
            'f_unique',
            'f_binding',
            'f_table_name',
            'f_table_field',
            'f_use_table_list',
            'f_table_list'
        );

        $meta_data = false;

        foreach ($fields as $k => $arr) {
            $item_id = isset($arr['f_id']) ? $arr['f_id'] : 0;

            $in_list = isset($arr['f_in_list']) ? 1 : 0;
            $f_width = isset($arr['f_width']) ? $arr['f_width'] : 0;
            $f_index    = isset($arr['f_index']) ? 1 : 0;
            $f_unique    = isset($arr['f_unique']) ? 1 : 0;

            $f_settings = [];

            foreach ($settings as $i) {
                if (isset($arr[ $i ])) {
                    $f_settings[ $i ] = $arr[ $i ] ;
                }
            }

            if (empty($f_settings)) {
                $f_settings = '';
            } else {
                $f_settings = serialize($f_settings);
            }

            if ($arr['f_type'] == 'meta') {
                $meta_data = true;
            }

            if (!$item_id) {
                if ($arr['f_type'] == 'meta') {
                    $this->insertSystemFields($id, $this->meta_fields);
                }

                Q("INSERT INTO `".$this->table_fields."` SET `module_id`=?i, `f_name`=?s, `f_sys_name`=?s, `f_type`=?s, `f_width`=?i, `ord`=?i, `f_index`=?i, `f_unique`=?i, `in_list`=?i, `f_settings`=?s", array(
                    $id, $arr['f_name'], $arr['f_sys_name'], $arr['f_type'], $f_width, $arr['f_ord'], $f_index, $f_unique, $in_list, $f_settings
                ));
            } else {
                Q("UPDATE `".$this->table_fields."` SET `module_id`=?i, `f_name`=?s, `f_sys_name`=?s, `f_type`=?s, `f_width`=?i, `ord`=?i, `f_index`=?i, `f_unique`=?i, `in_list`=?i, `f_settings`=?s WHERE `id`=?i LIMIT 1", array(
                    $id, $arr['f_name'], $arr['f_sys_name'], $arr['f_type'], $f_width, $arr['f_ord'], $f_index, $f_unique, $in_list, $f_settings, $arr['f_id']
                ));
            }
        }

        if (!$meta_data) {
            Q("DELETE FROM `".$this->table_fields."` WHERE `f_sys_name` IN (?ls) AND `module_id`=?i", array( array('meta_title', 'meta_keywords', 'meta_description', 'meta_robots'), $id ));
        }
    }

    public function unnecessaryFields($id, $arr_field_id)
    {
        $list = Q("SELECT `id`,`f_sys_name` FROM `".$this->table_fields."` WHERE `module_id`=?i", array( $id ))->all();

        $arr = [];
        $drop_fields = [];

        //  remove unnecessary id's
        $sql = "DELETE FROM `".$this->table_fields."` WHERE `id` IN ('-1'";

        foreach ($list as &$item) {
            $v_id        = $item['id'];
            $v_sys_name = $item['f_sys_name'];

            if (!in_array($v_id, $arr_field_id) and !isset($this->necessary_fields[$v_sys_name])) {
                $sql .= ", '".$v_id."'";
                $drop_fields[] = $v_sys_name;
            }
        }

        $sql .= ") ";

        Q($sql);

        $this->dropFields($id, $drop_fields);
    }

    public function existModule($name)
    {
        if ($name !== '') {
            return Q("SELECT `id` FROM `".$this->table_modules."` WHERE `sys_name` LIKE ?s LIMIT 1", array($name))->row('id');
        }

        return false;
    }

    public function existTable($table = '')
    {
        $table = str_replace('#', DB_PREF, $table);

        $count = Q("SHOW TABLES LIKE ?s;", array( $table ))->row();

        if (!$count) {
            return false;
        }

        return true;
    }

    public function createTable($id = 0)
    {
        //  Get module info
        $module = $this->getModules($id);

        //  Prepare table name
        $table_name = $this->prepareTableName($module['sys_name']);

        //  Check existing table
        if ($this->existTable($table_name)) {
            return "Таблица существует";
        }

        //  Get type of fields
        $types = $this->getFieldsType("asoc");

        //  Get fields info
        $fields = $this->getFields($id, true);

        //  Prepare SQL query
        $sql = "CREATE TABLE `".$table_name."` (";
        $sql .= "`id` INT UNSIGNED NOT NULL AUTO_INCREMENT";

        //  Add fields into sql
        foreach ($fields as $v)
        {
            $type = "VARCHAR(255) COLLATE 'utf8_unicode_ci' NOT NULL";

            if (isset($types[$v['f_type']]))
            {
                $type = $types[$v['f_type']];
            }

            $c_type = trim(current(explode('(', current(explode(' ', $type)))));

            if (!in_array($c_type, [ 'geometry', 'point', 'linestring', 'polygon', 'multipoint', 'multilinestring', 'multipolygon', 'geometrycollection', 'json', 'date', 'time', 'year', 'int', 'datetime', 'tynyint', 'smallint', 'mediumint', 'bigint', 'bigint', 'bigint', 'double', 'blob', 'tinyblob', 'mediumblob', 'longblob', 'bit', 'binary', 'varbinary' ]))
            {
                $type .= " COLLATE 'utf8_unicode_ci'";
            }

            if ($v['f_sys_name'] == 'id')
            {
                continue;
            }

            $sql .= ", `".$v['f_sys_name']."` ". $type ."";
        }

        $sql .= " , PRIMARY KEY (`id`)) ENGINE=" . $module['storage'] . " DEFAULT CHARSET=".$this->charset." COLLATE 'utf8_unicode_ci';";

        Q($sql);

        $this->optimizeTable($table_name);
    }

    public function optimizeTable($table_name = '')
    {
        if ($table_name !== '' && !empty($this->index_fields)) {
            $sql = "ALTER TABLE `". $table_name ."` ";

            $index = 0;
            $count = count($this->index_fields);

            foreach ($this->index_fields as $f) {
                $index++;
                $sql .= "ADD INDEX (`". $f ."`)";

                if ($index < $count) {
                    $sql .= ", ";
                }
            }

            $sql .= ";";

            Q($sql);
        }
    }

    public function prepareTableName($name)
    {
        if (!empty($name)) {
            return $this->table_prefix . $name ;
        }
        return '';
    }

    public function updateTable($id = 0, $table_name = '')
    {
        if ($id !== 0) {
            $module = $this->getModules($id);
            $old_name = $module['sys_name'];

            if ($table_name !== $old_name) {
                $table_name = $this->prepareTableName($table_name);
                $old_name = $this->prepareTableName($old_name);

                if ($this->existTable($table_name)) {
                    return false;
                }

                Q("ALTER TABLE `?e` RENAME `?e`", array( $old_name, $table_name ));
            }
        }

        return true;
    }

    public function dropFields($module_id, $fields)
    {
        //  Get module info
        $module = $this->getModules($module_id);
        //  Get old table name
        $table_name = $module['sys_name'];
        $table_name = $this->prepareTableName($table_name);
        if (is_array($fields)) {
            foreach ($fields as $v) {
                Q("ALTER TABLE `".$table_name."` DROP `".$v."`");
            }
        } else {
            Q("ALTER TABLE `".$table_name."` DROP `".$fields."`");
        }
    }

    public function getColumns($table_name = '')
    {
        $result = [];

        if ($table_name) {
            $columns = Q("SHOW COLUMNS FROM `" . $table_name . "`")->all();

            if (!empty($columns)) {
                foreach ($columns as $v) {
                    $result[ $v['Field'] ] = $v['Type'] ;
                }
            }
        }

        return $result ;
    }

    public function alterFields($id, $ids, $sys_names, $types)
    {
        $fields = [];
        $allows = array(
            'f_id',
            'f_sys_name',
            'f_index',
            'f_unique',
            'f_type'
       );

        foreach ($allows as $key) {
            if (isset($_POST[ $key ]) && !empty($_POST[ $key ])) {
                foreach ($_POST[ $key ] as $k => $v) {
                    $fields[ $k ][ $key ] = $v ;
                }
            }
        }

        //  Get field types
        $res_types = $this->getFieldsType('asoc');

        //  Get module info
        $module = $this->getModules($id);

        //  Prepare table name
        $table_name = $this->prepareTableName($module['sys_name']);

        $table_column = $this->getColumns($table_name);

        $index_table = Q("SHOW INDEX FROM `" . $table_name . "` FROM `" . DB_BASE . "`;")->all();

        if (!empty($index_table)) {
            $arr_unique = [];
            $arr_index    = [];

            foreach ($fields as $ar) {
                if (isset($ar['f_unique'])) {
                    $arr_unique[] = $ar['f_sys_name'];
                }

                if (isset($ar['f_index'])) {
                    $arr_index[] = $ar['f_sys_name'];
                }
            }

            $index_keys = [];

            foreach ($index_table as $ind) {
                if ($ind['Key_name'] !== 'PRIMARY') {
                    $index_keys[$ind['Column_name']][] = array(
                        'Key_name'        =>    $ind['Key_name'],
                        'Non_unique'    =>    $ind['Non_unique'],
                        'Seq_in_index'    =>    $ind['Seq_in_index']
                    );
                }
            }

            foreach ($index_keys as $name => $arr) {
                if (count($arr) > 1) {
                    $number = 0;

                    foreach ($arr as $a) {
                        if ($number > 0) {
                            Q("ALTER TABLE `" . $table_name . "` DROP INDEX `" . $a['Key_name'] . "`");
                        }

                        $number++;
                    }
                }
            }

            if (!empty($arr_index)) {
                foreach ($index_keys as $name => $arr) {
                    if (!in_array($name, $arr_index)) {
                        Q("ALTER TABLE `" . $table_name . "` DROP INDEX `" . $arr[0]['Key_name'] . "`");
                    }
                }
            }
        }

        if (!empty($fields)) {
            foreach ($fields as $k => $arr) {
                if (isset($table_column[ $arr['f_sys_name'] ])) {
                    $old = $this->getOneField($arr['f_id']);

                    if ($old['f_type'] !== $arr['f_type']) {
                        Q("ALTER TABLE `" . $table_name . "` CHANGE `" . $arr['f_sys_name'] . "` `" . $arr['f_sys_name'] . "` " . $res_types[ $arr['f_type'] ]);
                    }
                } else {
                    Q("ALTER TABLE `" . $table_name . "` ADD `" . $arr['f_sys_name'] . "` ". $res_types[ $arr['f_type'] ] ." AFTER `id`");
                }

                if (!isset($index_keys[$arr['f_sys_name']])) {
                    if (isset($arr['f_index'])) {
                        Q("ALTER TABLE `" . $table_name . "` ADD INDEX(`" . $arr['f_sys_name'] . "`)");
                    }

                    if (isset($arr['f_unique'])) {
                        Q("ALTER TABLE `" . $table_name . "` ADD UNIQUE(`" . $arr['f_sys_name'] . "`)");
                    }
                }
            }
        }
    }

    public function dropTable($module_id)
    {
        $module = $this->getModules($module_id);
        $table_name = $this->prepareTableName($module['sys_name']);

        Q("DROP TABLE `".$table_name."`");
    }

    public function removeFields($module_id)
    {
        Q("DELETE FROM `".$this->table_fields."` WHERE `module_id`=?i", array( $module_id ));
    }

    public function removeBinds($module_id)
    {
        Q("DELETE FROM `".$this->table_bind."` WHERE `module_id`=?i", array( $module_id ));
    }

    public function removeModule($module_id)
    {
        Q("DELETE FROM `".$this->table_modules."` WHERE `id`=?i", array( $module_id ));
    }

    public function addBind($fields)
    {
        $sql = "INSERT INTO `".$this->table_bind."` SET ";

        foreach ($fields as $k=>$v) {
            $sql .= "`".$k."`='".to_base($v)."', ";
        }

        $sql .= "`ord`=10";

        return Q($sql);
    }

    public function editBind($id, $fields)
    {
        $sql = "UPDATE `".$this->table_bind."` SET `id`='".$id."' ";

        foreach ($fields as $k=>$v) {
            $sql .= " , `".$k."`='".to_base($v)."' ";
        }

        $sql .= " WHERE `id`=?i LIMIT 1";

        Q($sql, array( $id ));
    }

    public function delBind($id)
    {
        Q("DELETE FROM `".$this->table_bind."` WHERE `id`=?i", array($id));
    }

    public function getLists($list_name = '', $get_ids = false)
    {
        if ($get_ids && $list_name) {
            $temp = Q("SELECT `id` FROM `".$this->table_lists."` WHERE `list_name`='".to_base($list_name)."' ORDER BY `ord`")->all('id');
            return array_keys($temp);
        } elseif ($list_name) {
            return Q("SELECT * FROM `".$this->table_lists."` WHERE `list_name`='".to_base($list_name)."' ORDER BY `ord`")->all();
        } else {
            $arr = Q("SELECT * FROM `".$this->table_lists."` ORDER BY `list_name`, `ord`")->all();

            $result = [];

            foreach ($arr as $item) {
                $list_name = from_base($item['list_name']);

                if (!isset($result[$list_name])) {
                    $item['count'] = 1;
                    $result[$list_name] = $item;
                } else {
                    $result[$list_name]['count'] ++;
                }
            }

            return $result;
        }
    }

    public function addList()
    {
        $name                = __post("name");
        $list_name            = __post("list_name");
        $var                = __post("var");
        $value                = __post("value");
        $default            = __post("default");
        $ord                = __post("ord");
        $field_id            = __post("field_id");

        foreach ($field_id as $k => $v) {
            Q("INSERT INTO `".$this->table_lists."` SET `name`=?s, `list_name`=?s, `var`=?s, `value`=?s, `default`=?s, `ord`=?i", array(to_base($name), to_base($list_name), to_base($var[$k]), to_base($value[$k]), (isset($default[$k])? '1' : '0'), $ord[$k]));
        }
    }

    public function editList()
    {
        $name            = __post("name");
        $list_name        = __post("list_name");
        $var            = __post("var");
        $value            = __post("value");
        $default        = __post("default");
        $ord            = __post("ord");
        $field_id        = __post("field_id");
        $old_list_name    = __post("list_name"); //__get("list_name");

        //  Remove unnecessary items
        $curr = $this->getLists($old_list_name, true);

        if (!empty($field_id)) {
            $diff = array_diff($curr, $field_id);
        } else {
            $diff = $curr;
        }

        $sql = "DELETE FROM `".$this->table_lists."` WHERE `id` IN ('-1'";

        foreach ($diff as $v) {
            $sql .= ", '".$v."'";
        }

        $sql .= ")";
        Q($sql);

        //  Change other item and add new
        foreach ($field_id as $k=>$v) {
            //  Update
            if ($field_id[$k]) {
                $sql = "UPDATE `".$this->table_lists."` SET
                            `name`='".to_base($name)."' ,
                            `list_name`='".to_base($list_name)."',
                            `var`='".to_base($var[$k])."',
                            `value`='".to_base($value[$k])."',
                            `default`='".(isset($default[$k])?"1":"0")."',
                            `ord`='".to_base($ord[$k])."'
                        WHERE
                            `id`='".$field_id[$k]."'";
                Q($sql);
            }
            //  Insert
            else {
                $sql = "INSERT INTO `".$this->table_lists."` SET
                        `name`='".to_base($name)."',
                        `list_name`='".to_base($list_name)."',
                        `var`='".to_base($var[$k])."',
                        `value`='".to_base($value[$k])."',
                        `default`='".(isset($default[$k])?"1":"0")."',
                        `ord`='".to_base($ord[$k])."'";
                Q($sql);
            }
        }
    }

    public function delLists($bind)
    {
        Q("DELETE FROM `".$this->table_lists."` WHERE `list_name` LIKE ?s", array(to_base($bind)));
    }
}
