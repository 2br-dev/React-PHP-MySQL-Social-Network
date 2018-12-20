<?php

final class metaController extends CPLoader
{
    use Singleton;

    private $user   = null;
    private $meta   = null;
    private $mdd    = null;
    private $person = [];

    public function __construct()
    {
        parent::__construct();

        $this->user = new Person();
        $this->person = $this->user->user;

        if (is_numeric($this->element)) {
            $this->meta = new Meta($this->element);
        }

        $this->mdd = new Mdd();
    }

    public function index()
    {
        if ($this->user->getAdminAccess() && !isset($this->path[2])) {
            redirect($this->base_path . '/module');
        }
    }

    public function module()
    {
        $_backuri = '';

        if (isset($_GET['backuri'])) {
            $_backuri = base64_decode($_GET['backuri']);
        }

        $filter = false;

        if (isset($_COOKIE['module_sorted_'.$this->element])) {
            $filter = true;
        }

        if (isset($_COOKIE['module_limit_'.$this->element]) && $_COOKIE['module_limit_'.$this->element] != 10) {
            $filter = true;
        }

        if ($this->method !== 'del' && $this->element) {
            $info['module_id']      = $this->element;
            $info['types']          = getfl('type');
            $info['is_recursive']   = $this->mdd->is_recursive;
            $info['meta_enable']    = $this->meta->metaEnable($this->element, $this->argument);
            $info['meta_module']    = $this->meta->loadModule();

            $info['time']           = md5(uniqid() . rand(1110, 10000));
            $info['meta_fields']    = $this->meta->getFields($this->element, true);

            if ($this->mdd->is_recursive) {
                $info['meta_list_tree'] = $this->meta->treeModule($info['meta_fields']);
            }
        }

        if ($this->method == 'add') {
            $info['rec_field']          = $this->mdd->rec_field;
            $info['meta_item']          = $this->meta->itemModule($this->argument, $info['meta_fields']);
            $info['meta_next_ord']      = $this->meta->getNextOrd($info['meta_module']['name'], $this->meta->is_recursive);
        } elseif ($this->method == 'clearfilter') {

            if (isset($_COOKIE['module_sorted_'.$this->element])) {
                setcookie('module_sorted_'.$this->element, null, -1, '/');
            }

            if (isset($_COOKIE['module_limit_'.$this->element])) {
                setcookie('module_limit_'.$this->element, 10, time() + 60 * 60 * 24 * 30, '/');
            }

            if ($_backuri) {
                redirect($_backuri);
            }
        } elseif ($this->method == 'edit') {
            $info['meta_item'] = $this->meta->itemExtend($this->meta->itemModule($this->argument, $info['meta_fields']));

            $result = [];
            $needle = ['treeselect', 'fullcalendar'];

            foreach ($info['meta_item'] as $item)
            {
                if (in_array($item['f_type'], $needle))
                {
                    $result[$item['f_type']] = $item['value'];
                }
            }

            if (count($result) == 2)
            {
                $current = $result['treeselect'];

                $parents = Q("SELECT `id`, `name`, `parent`, `system` FROM `#_mdd_shedulecategory` WHERE `visible`=1 AND `parent`=?i ORDER BY `ord`", [
                    $current
                ])->all('id');

                $info['meta_select'] = Q("SELECT `id`, `name`, `parent`, `system` FROM `#_mdd_shedulecategory` WHERE `visible`=1 AND `parent` IN (?li) ORDER BY `ord`", [
                    array_keys($parents)
                ])->all('id');
            }

            $info['meta_recomend'] = Q("SELECT `var`, `value` FROM `#__mdd_lists` WHERE `list_name` LIKE ?s ", [
                'recomend'
            ])->all();

        } elseif ($this->method == 'del') {
            $this->meta->deleteData($this->argument);

            if ($_backuri) {
                redirect($_backuri);
            } else {
                redirect($this->base_path . '/module/list/' . $this->element);
            }
        }
        elseif ($this->method == "visible")
        {
            if ($this->element && $this->argument)
            {
                $sys_name = Q("SELECT `sys_name` FROM `#__mdd_modules` WHERE `id`=?i LIMIT 1", [ $this->element ])->row('sys_name');

                Q("UPDATE `#_mdd_".$sys_name."` SET `visible`=IF(`visible`!=1, 1, 0) WHERE `id`=?i LIMIT 1", [ $this->argument ]);

                return [
                    'status' => true
                ];
            }
        } elseif ($this->element) {
            // $info['check_dispatch'] = $this->dispatch->checkModule($this->element);
            $module_list            = $this->meta->listModule($info['meta_fields']);

            $info['meta_list']      = $module_list['result'];
            $info['pager_info']     = $module_list['pager'];
            $info['meta_sort']      = $this->meta->sortModule($this->element, $info['meta_fields']);
            $info['meta_filter']    = $this->meta->filterModule($this->element, $info['meta_fields']);
            $info['meta_cookie']    = [];
            $info['filter'] = $filter;

            if (!isset($_COOKIE['module_limit_'.$this->element])) {
                setcookie('module_limit_'.$this->element, 10, time() + 60 * 60 * 24 * 30, '/');
            }

            if (!empty($_COOKIE['module_sorted_'.$this->element])) {
                $meta_cookie = unserialize(from_base($_COOKIE['module_sorted_'.$this->element]));

                if (isset($meta_cookie[$this->element])) {
                    $info['meta_cookie'] = $meta_cookie[$this->element];
                }
            }
        } else {
            $result = $this->mdd->getGroupModules($this->mdd->getModules(0, true), $this->mdd->getGroup());

            $info['groups']  = $result['groups'];
            $info['modules'] = $result['modules'];
        }

        return $info;
    }

    public function getInitialFiles()
    {
        $initialFiles = [];

        for ($i = 0; $i < 5000; $i++)
        {
            array_push(
                $initialFiles,
                [
                    "name" => "name" + $i,
                    "uuid" => "uuid" + $i,
                    "thumbnailUrl" => "/test/dev/handlers/vendor/fineuploader/php-traditional-server/fu.png"
                ]
            );
        }
        return $initialFiles;
    }

    public function sheduler()
    {
        $responce = [];
        $data = $_POST;

        unset($data['action']);

        if (in_array($this->method, ['add', 'edit']))
        {
            $data['uid'] = $this->person['id'];
            $data['gid'] = $this->person['gid'];

            if (isset($data['start']))
            {
                if (is_numeric($data['start']))
                {
                    $data['start'] = $data['start'] / 1000;
                }
                else
                {
                    $data['start'] = strtotime($data['start']);
                }
            }

            if (isset($data['end']))
            {
                if (is_numeric($data['end']))
                {
                    $data['end'] = $data['end'] / 1000;
                }
                else
                {
                    $data['end'] = strtotime($data['end']);
                }
            }
        }

        switch ($this->method)
        {
            case 'add':

                $data['created'] = time();

                if (isset($data['types']))
                {
                    $data['types'] = implode(',', array_values($data['types']));
                }
                else
                {
                    $data['types'] = '';
                }

                $id = Q("INSERT INTO `#__sys_shedule` SET `group`=?s, `start`=?i, `end`=?i, `title`=?s, `item`=?i, `color`=?s, `types`=?s, `extra`=?s, `visible`=?i, `uid`=?i, `gid`=?i, `created`=?i", [
                    $data['group'],
                    $data['start'],
                    $data['end'],
                    $data['title'],
                    $data['item'],
                    $data['color'],
                    $data['types'],
                    $data['extra'],
                    $data['visible'],
                    $data['uid'],
                    $data['gid'],
                    $data['created']
                ]);

                $responce = array_merge($data, [ 'id' => $id]);

            break;

            case 'edit':

                $data['updated'] = time();

                $id = $data['id'];

                unset($data['id']);

                if (isset($data['types']))
                {
                    $data['types'] = implode(',', array_values($data['types']));
                }

                $keys = '';

                $formats = [
                    'item'      => '?i',
                    'title'     => '?s',
                    'color'     => '?s',
                    'extra'     => '?s',
                    'visible'   => '?i',
                    'uid'       => '?i',
                    'gid'       => '?i',
                    'updated'   => '?i'
                ];

                foreach ($data as $key => $value)
                {
                    $f = '?s';

                    if (isset($formats[$key]))
                    {
                        $f = $formats[$key];
                    }
                    
                    if ($keys)
                    {
                        $keys .= ', ';
                    }

                    $keys .= '`'.$key.'`=' . $f;
                }

                $values = array_values($data);
                $values[] = $id;

                Q("UPDATE `#__sys_shedule` SET ".$keys." WHERE id=?i LIMIT 1", $values);

                exit(__(
                    $data,
                    $values,
                    date('H:i:s', $data['start']),
                    date('H:i:s', $data['end']),
                    Qb("UPDATE `#__sys_shedule` SET ".$keys." WHERE id=?i LIMIT 1", $values)
                ));

                $responce = array_merge($data, [ 'id' => $id]);

            break;

            case 'delete':

                if (isset($data['id']))
                {
                    O('__sys_shedule:id', $data['id'])->delete();
                }

            break;
        }

        if (isset($responce['start']))
        {
            $responce['start'] = date('Y-m-d\TH:i:sP', $responce['start']);
        }

        if (isset($responce['end']))
        {
            $responce['end'] = date('Y-m-d\TH:i:sP', $responce['end']);
        }

        $responce = array_intersect_key($responce, array_flip([
            'id',
            'item',
            'types',
            'extra',
            'color',
            'group',
            'title',
            'start',
            'visible',
            'end'
        ]));

        exit(json_encode($responce, 64 | 256));
    }

    public function fileUpload()
    {
        $group_id = $_POST['groupid'];
        $settings = [];

        if (isset($_POST['settings'])) {
            $settings = json_decode($_POST['settings'], true);
        }

        if (!empty($_FILES['file'])) {
            $file = F($_FILES['file'])
                ->upload($group_id)
                ->resize($settings)
                ->getFileId();

            exit(json_encode([
                'id' => $file,
                'uuid' => $_POST['qquuid'],
                'success' => true
            ], 64 | 256));
        }
    }

    public function filedelete()
    {
        $status = false;

        $url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $tokens = explode('/', $url);
        $uuid = $tokens[sizeof($tokens)-1];

        if (isset($_POST['id'])) {
            $uuid = intval($_POST['id']);
        }

        if (is_numeric($uuid))
        {
            $f = new Files;
            $status = $f->deleteFile($uuid, true);
        }

        return [
            'status' => $status
        ];
    }

    public function filename()
    {
        $id     = __post('id');
        $name   = __post('name');

        $status = false;

        if ($id && $name) {
            Q("UPDATE `#__sys_files` SET `alt`=?s, `title`=?s WHERE `id`=?i OR `fid`=?i", [ $name, $name, $id, $id ]);

            $status = true;
        }

        return [
            'status' => $status
        ];
    }

    public function filevisible()
    {
        $id         = __post('id');
        $visible    = __post('visible');

        $status = false;

        if ($id) {
            Q("UPDATE `#__sys_files` SET `visible`=?i WHERE `id`=?i OR `fid`=?i", [ $visible, $id, $id ]);

            $status = true;
        }

        return [
            'status' => $status
        ];
    }

    public function post()
    {
        $action = __post('form_action');
        $addurl  = isset($_GET['backuri']) ? '&backuri=' . $_GET['backuri'] : '';
        $backuri = isset($_GET['backuri']) ? base64_decode($_GET['backuri']) : '';

        $redirect_url = '?'.substr($addurl, 1);

        if ($action == "add") {
            $last_id = $this->meta->insertData($this->element);

            if (isset($_POST['apply'])) {
                redirect($this->base_path . '/module/edit/' . $this->element . '/' . $last_id . '/?msg=apply' . $addurl);
            } elseif ($backuri) {
                redirect($backuri);
            } else {
                redirect($this->base_path . '/module/list/' . $this->element . $redirect_url);
            }
        } elseif ($action == "edit") {
            $this->meta->updateData($this->element, $this->argument);

            if (isset($_POST['apply'])) {
                redirect($this->base_path . '/module/edit/' . $this->element . '/' . $this->argument . '/?msg=apply' . $addurl);
            } elseif ($backuri) {
                redirect($backuri);
            } else {
                redirect($this->base_path . '/module/list/' . $this->element . $redirect_url);
            }
        }
    }
}
