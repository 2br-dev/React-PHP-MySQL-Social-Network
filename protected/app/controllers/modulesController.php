<?php

final class modulesController extends CPLoader
{
    use Singleton, Tools;

    private $mdd = null;

    public function __construct()
    {
        parent::__construct();

        $this->mdd = new MDD();
    }

    public function index()
    {
        if (in_array($this->method, [ 'add', 'edit' ])) {
            $info['storage'] = [
                'InnoDB'    =>  'InnoDB',
                'MyISAM'    =>  'MyISAM',
                'MEMORY'    =>  'MEMORY',
                'ARCHIVE'   =>  'ARCHIVE'
            ];

            // if ($_link = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_BASE))
            // {
            //     $mysql = current(explode('-', mysqli_get_server_info($_link)));

            //     if (version_compare($mysql, '6.0.0') >= 0)
            //     {
            //         $info['storage']['Maria'] = 'Maria';
            //         $info['storage']['Falcon'] = 'Falcon';
            //     }
            // }
        }

        if ($this->method == 'add') {
            $info['mmd_fields_type'] = $this->mdd->getFieldsType();
        } elseif ($this->method == 'edit') {
            $info['mdd_module'] = $this->mdd->getModules($this->element);
            $info['mdd_fields'] = $this->mdd->getFields($this->element);
            $info['mmd_fields_type'] = $this->mdd->getFieldsType();
        } elseif ($this->method == 'del') {
            $this->mdd->dropTable($this->element);
            $this->mdd->removeFields($this->element);
            $this->mdd->removeBinds($this->element);
            $this->mdd->removeModule($this->element);

            redirect($this->base_path);
        }

        if (in_array($this->method, ['add', 'list', 'edit'])) {
            $info['module_id'] = $this->element;
            $info['modules_list'] = $this->mdd->getModules(0, false, false);


            if (!empty($info['modules_list'])) {
                $modules = [];

                foreach ($info['modules_list'] as $module) {
                    $id = $module['id'];
                    unset($module['id'], $module['type'], $module['pager'], $module['ord_type'], $module['active'], $module['storage'], $module['order']);
                    $modules[$id] = $module;
                }

                $info['modules_json'] = json_encode($modules, 64 | 256);
            }
        }

        return $info;
    }

    public function binds()
    {
        if ($this->method == 'add') {
            $info['mdd_bind'] = [
                'func_code' => 'require PATH_MODULE . "/module/module.php";";',
                'template'  => '{include file="$PATH_MODULE/module/module.tpl"}'
            ];
        } elseif ($this->method == 'edit') {
            $info['mdd_bind'] = $this->mdd->getBinds($this->element);
        } elseif ($this->method == 'del') {
            if (!empty($_SESSION['userinf']['gid']) && $_SESSION['userinf']['gid'] == 10) {
                $this->mdd->delBind($this->element);
            }

            redirect($this->base_path);
        } else {
            $info['binds'] = Q("SELECT * FROM `#__mdd_binds`")->all();
        }

        return $info;
    }

    public function clean()
    {
        $modules = Q("SELECT `id` FROM `#__mdd_modules` WHERE 1 ")->all('id');

        Q("DELETE FROM `#__mdd_fields` WHERE `module_id` NOT IN(?li)", [
            array_keys($modules)
        ]);

        redirect($this->base_path);
    }

    public function import()
    {
    }

    public function export()
    {
        $info['modules_list'] = $this->mdd->getModules();
        return $info;
    }

    public function group()
    {
        if ($this->method == 'add') {
            $info['modules_list'] = $this->mdd->getModules();
            $info['mdd_next_order'] = $this->mdd->getNextGroupOrder();
        } elseif ($this->method == 'edit') {
            $info['modules_list'] = $this->mdd->getModules();
            $info['group_item'] = $this->mdd->getGroupItem($this->element);
        } elseif ($this->method == 'del') {
            $this->mdd->delGroup($this->element);
            redirect($this->base_path . '/group/');
        } else {
            $info['mdd_group_list'] = $this->mdd->getGroup();
        }

        return $info;
    }

    public function fields()
    {
        $id = __post('id');

        $fields = [];
        $result = $this->mdd->getFields($id);

        if (!empty($result)) {
            foreach ($result as $field) {
                $fields[] = [
                    'id'        =>  $field['id'],
                    'name'      =>  $field['f_name'],
                    'sys_name'  =>  $field['f_sys_name'],
                ];
            }

            unset($result);
        }

        exit(json_encode($fields, 64 | 256));
    }

    public function post()
    {
        $action = __post('module_action');

        $fields = [];
        $fields_names = [
            'f_id',
            'f_name',
            'f_sys_name',
            'f_binding',
            'f_type',
            'f_width',
            'f_ord',
            'f_in_list',
            'f_module',
            'f_fields',
            'f_index',
            'f_unique',
            'f_date_format',
            'f_hidden_default',
            'f_redactor',
            'f_editor',
            'f_editor_mode',
            'f_file_count',
            'f_image_prefix',
            'f_image_width',
            'f_image_height',
            'f_image_photo_method',
            'f_range',
            'f_use_table_list',
            'f_table_name',
            'f_table_field',
            'f_table_list'
        ];

        foreach ($fields_names as $f_name) {
            if (isset($_POST[ $f_name ]) && !empty($_POST[ $f_name ])) {
                foreach ($_POST[$f_name] as $iteration => $item) {
                    if (in_array($f_name, array('f_image_prefix', 'f_image_width', 'f_image_height', 'f_image_photo_method'))) {
                        foreach ($item as $img_type => $img_size) {
                            $fields[$iteration][$f_name][$img_type] = $img_size;
                        }
                    } else {
                        $fields[$iteration][ $f_name ] = $item;
                    }
                }
            }
        }

        if (in_array($action, ['add', 'edit']))
        {
            $arr = [
                "name"      => __post('name'),
                "sys_name"  => transliterate(__post('sys_name')),
                "type"      => __post('type'),
                "pager"     => __post('pager'),
                "ord"       => __post('ord'),
                "ord_type"  => __post('ord_type'),
                "order"     => __post('order'),
                "active"    => __post('active'),
                "storage"   => __post('storage')
            ];

            if ($action == 'edit') {
                unset($arr['storage']);
            }
        }

        if ($action == 'add')
        {
            $m_name     = __post('name');
            $m_sys_name = __post('sys_name');

            if ($m_name && $m_sys_name)
            {
                $id = $this->mdd->addModule($arr);

                $this->mdd->addFields($id);

                $this->mdd->createTable($id);

                if (isset($_POST['apply'])) {
                    redirect($this->base_path . "/index/edit/" . $id);
                } else {
                    redirect($this->base_path);
                }
            }
        } elseif ($action == 'edit') {
            if (!$this->mdd->updateTable($this->element, $arr['sys_name'])) {
                return false;
            }

            $this->mdd->updateModule($this->element, $arr);
            $this->mdd->unnecessaryFields($this->element, __post('f_id'));
            $this->mdd->alterFields($this->element, __post('f_id'), __post('f_sys_name'), __post('f_type'));
            $this->mdd->updateFields($this->element, $fields);

            if (isset($_POST['apply'])) {
                redirect($this->base_path . "/index/edit/" . $this->element);
            } else {
                redirect($this->base_path);
            }
        } elseif ($action == 'add_bind') {
            $arr = [
                'name'      => __post('name'),
                'func_name' => __post('func_name'),
                'cache'     => __post('cache'),
            ];

            $fns_code   = PATH_MODULE . '/' . $arr['func_name'] . '/' . $arr['func_name'] . 'Module.class.php';
            $template   = PATH_MODULE . '/' . $arr['func_name'] . '/' . $arr['func_name'] . '.tpl';
            $partition  = PATH_MODULE . '/' . $arr['func_name'] . '/';
            $partition_tpl  = PATH_MODULE . '/' . $arr['func_name'] . '/tpl/';

            if (!is_dir($partition)) {
                mkdir($partition);
                $this->changeAvailability($partition);
            }

            if (!is_dir($partition_tpl)) {
                mkdir($partition_tpl);
                $this->changeAvailability($partition_tpl);
            }

            if ($arr['func_name'] != '' && !file_exists($fns_code)) {
                $this->createModuleFiles($fns_code, $arr['func_name']);
            }

            $bind_id = $this->mdd->addBind($arr);

            if (isset($_POST['apply'])) {
                redirect($this->base_path . "/binds/edit/" . $bind_id . '?msg=apply');
            }

            redirect($this->base_path . "/binds");
        } elseif ($action == 'edit_bind') {
            $arr = [
                'name'      => __post('name'),
                'func_name' => __post('func_name'),
                'cache'     => __post('cache'),
            ];

            $fns_code   = PATH_MODULE . '/' . $arr['func_name'] . '/' . $arr['func_name'] . 'Module.class.php';
            $template   = PATH_MODULE . '/' . $arr['func_name'] . '/' . $arr['func_name'] . '.tpl';
            $partition  = PATH_MODULE . '/' . $arr['func_name'] . '/';
            $partition_tpl  = PATH_MODULE . '/' . $arr['func_name'] . '/tpl/';

            if (!is_dir($partition)) {
                mkdir($partition, 0755);
            }

            if (!is_dir($partition_tpl)) {
                mkdir($partition_tpl, 0755);
            }

            if ($arr['func_name'] != '' && !file_exists($fns_code)) {
                $this->createModuleFiles($fns_code, $arr['func_name']);
            }

            $this->mdd->editBind($this->element, $arr);

            if (isset($_POST['apply'])) {
                redirect($this->base_path . '/binds/edit/' . $this->element . '?msg=apply');
            }

            redirect($this->base_path . "/binds");
        } elseif ($action == 'add_group') {
            $modules = __post('modules') ? __post('modules') : [];

            $arr = [
                'name'      => __post('name'),
                'sys_name'  => __post('sys_name'),
                'modules'   => implode($modules, ','),
                'ord'       => __post('ord'),
                'visible'   => __post('visible')
            ];

            $id = $this->mdd->addGroup($arr);

            if ($id == 0) {
                unset($_POST['apply']);
            }

            if (isset($_POST['apply'])) {
                redirect($this->base_path . "/group/edit/" . $id . '?msg=apply');
            }

            redirect($this->base_path . '/group');
        } elseif ($action == 'edit_group') {
            $modules = __post('modules') ? __post('modules') : [];

            $arr = [
                'name'      => __post('name'),
                'sys_name'  => __post('sys_name'),
                'modules'   => implode($modules, ','),
                'ord'       => __post('ord'),
                'visible'   => __post('visible')
            ];

            $this->mdd->editGroup($arr, $this->element);

            if ($this->element == 0) {
                unset($_POST['apply']);
            }

            if (isset($_POST['apply'])) {
                redirect($this->base_path . "/group/edit/" . $this->element);
            }

            redirect($this->base_path . '/group');
        }
    }

    public function createModuleFiles($filename, $f_name, $content = '')
    {
        if ($content == '')
        {
            $source = PATH_RESOURCE.DS.'module'.DS.'example';

            $example = file_get_contents($source);

            $content = preg_replace('/\{name\}/', $f_name, htmlspecialchars_decode($example));
        }

        if ($f = fopen($filename, 'c+')) {
            $source = '';

            while (!feof($f)) {
                $source .= fgets($f);
            }

            file_put_contents($filename, $content);

            fclose($f);

            $this->changeAvailability($filename);
        }

        return true;
    }
}
