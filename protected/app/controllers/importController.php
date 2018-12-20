<?php

final class importController extends CPLoader
{
    use Singleton;

    public function __construct()
    {
        parent::__construct();
    }

    public function profiles()
    {
        $info = [];

        switch ($this->method) {
            case 'item':

                if (!$this->element) {
                    $info['modules'] = $this->getModules();
                } else {
                    $info['profiles']   = $this->getProfiles($this->element);
                    $info['fields']     = $this->getFields($this->element);
                }

                $info['group'] = $this->element;
            break;

            case 'del':
                if ($this->element) {
                    Q("DELETE FROM `#__import__profiles` WHERE `group`=?i", [ $this->element ]);
                    redirect($this->base_path . '/profiles/');
                }

                $delete_mode = isset($path[5]) ? $path[5] : '';
                $delete_id = isset($path[6]) ? $path[6] : '';

                if ($delete_mode && $delete_id) {
                    Q("DELETE FROM `#__import__profiles` WHERE `id`=?i LIMIT 1", [ $delete_id ]);
                    redirect($this->base_path . '/profiles/edit/' . $this->element . '/');
                }
            break;

            default:
                $info['profile_list'] = $this->getProfilesList();
            break;
        }

        return $info;
    }

    public function import()
    {
        $formats = [ 'csv', 'xls', 'xlsx', 'xlsm', 'xlsb', 'xltm', 'xlam', 'xml', 'yaml' ];
        $exchange = scandir(PATH_ROOT . '/exchange/');

        $filename   = __get('filename');
        $setimport  = intval(__get('setimport'));
        $group  = __get('group');

        if ($filename && $group) {
            $settings = Q("SELECT `name`, `value` FROM `#__import__settings`")->all('name');

            if (!empty($settings)) {
                foreach ($settings as $k => $v) {
                    $settings[$k] = $v['value'];
                }
            }

            $fields = Q("SELECT `field`, `index` FROM `#__import__profiles` WHERE `group`=?i", array( $group ))->all('index');

            if (!empty($fields)) {
                foreach ($fields as $k => $v) {
                    $fields[$k] = $v['field'];
                }
            }

            if (file_exists(PATH_ROOT . '/exchange/' . $filename)) {
                importFile($filename, $fields, $group, $setimport, isset($settings['line_limit']) ? $settings['line_limit'] : 10);
            }

            redirect($info['base_path']);
        }

        foreach ($exchange as $key => $item) {
            $extention = @end(explode('.', $item));

            if (!is_file(PATH_ROOT . '/exchange/' . $item) || !in_array($extention, $formats)) {
                unset($exchange[$key]);
            } else {
                $exchange[$key] = array(
                    'file'  =>  $item,
                    'time'  =>  date("d.m.Y H:i:s.", filectime(PATH_ROOT . '/exchange/' . $item)),
                    'size'  =>  humanFileSize(filesize(PATH_ROOT . '/exchange/' . $item))
               );
            }
        }

        $info['exchange_files'] = $exchange;
        $info['profile_list'] = $this->getProfilesList();

        return $info;
    }

    public function settings()
    {
        $settings = Q("SELECT `name`, `value` FROM `#__import__settings`")->all('name');

        if (!empty($settings)) {
            foreach ($settings as $k => $v) {
                $settings[$k] = $v['value'];
            }
        }

        $info['settings'] = $settings;

        return $info;
    }

    public function getModules()
    {
        return Q("SELECT `id`, `name`, `sys_name` FROM `#__mdd_modules` WHERE `active`=1 ORDER BY `order`")->all();
    }

    public function getFields($group)
    {
        return Q("SELECT `id`, `f_name`, `f_sys_name` FROM `#__mdd_fields` WHERE `group`=?i ORDER BY `ord`", array( $group ))->all();
    }

    public function getProfilesList()
    {
        return Q("SELECT `p`.`group`, `m`.`name` FROM `#__import__profiles` AS `p` LEFT JOIN `#__mdd_modules` AS `m` ON `m`.`id`=`p`.`group` GROUP BY `p`.`group`")->all();
    }

    public function getProfiles($group)
    {
        return Q("SELECT `id`, `name`, `group`, `field`, `index` FROM `#__import__profiles` WHERE `group`=?i", array( $group ))->all();
    }

    public function post()
    {
        $action = __post("action");

        if ($action == "settings") {
            Q("TRUNCATE `#__import__settings`");

            unset($_POST['action']);

            foreach ($_POST as $k => $v) {
                Q("INSERT INTO `#__import__settings` SET `name`=?s, `value`=?i", array( $k, $v ));
            }

            redirect($this->base_path . '/settings/');
        } elseif ($action == "add_fields") {
            Q("INSERT INTO `#__import__profiles` SET `name`=?s, `group`=?i, `field`=?s, `index`=?i ON DUPLICATE KEY UPDATE `group`=?i", array( $_POST['name'], $_POST['group'], $_POST['field_name'], $_POST['index'], $_POST['group'] ));
            redirect($this->base_path . '/profiles/edit/' . $_POST['group'] . '/');
        } elseif ($action == "add_module") {
            redirect($this->base_path . '/profiles/edit/' . $_POST['group'] . '/');
        }
    }
}
