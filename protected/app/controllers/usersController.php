<?php

final class usersController extends CPLoader
{
    use Singleton;
    private $usr = null;
    private $log = null;
    private $mdd = null;

    public function __construct()
    {
        parent::__construct();
        
        $this->usr = new Person();
        $this->log = new Log();
        $this->mdd = new Mdd();
    }
    
    public function index()
    {
        if ($this->method !== 'del') {
            $info['additions']      = $this->usr->getUserAdditions();
            $info['usersGroups']    = $this->usr->getGroups();
        }

        if ($this->method == 'edit') {
            $info['userinf']        = $this->usr->usersGet($this->element);
        } elseif ($this->method == 'del') {
            $this->usr->delUser($this->element);
            redirect($this->base_path . '/index');
        } else {
            $gid = 0;
            
            if (!empty($_SESSION['userinf']['gid'])) {
                $gid = $_SESSION['userinf']['gid'];
            }
            
            $info['usersList']  = $this->usr->usersList($gid, 10);
        }

        return $info;
    }
    
    public function groups()
    {
        if (in_array($this->method, array( 'add', 'edit' ))) {
            $info['modulesList']    = $this->mdd->getModules();
        }

        if ($this->method == 'add') {
            $info['usersGroups']    = $this->usr->getGroups();
        } elseif ($this->method == 'edit') {
            $info['usersGroups']    = $this->usr->getGroupsItem($this->element);
        } elseif ($this->method == 'del') {
            $this->usr->delGroup($this->element);
            redirect($this->base_path . '/groups');
        } else {
            $info['usersGroups']    = $this->usr->getGroupsList();
        }
        
        return $info;
    }

    public function additions()
    {
        if ($this->method !== 'del') {
            $info['usersGroups']    = $this->usr->getGroups();
        }

        if (in_array($this->method, array( 'add', 'edit' ))) {
            $info['field_type']     = $this->mdd->getFieldsType();
        }
        
        if ($this->method == 'edit') {
            $info['userAdditions']  = $this->usr->getAdditions($this->element);
        } elseif ($this->method == 'del') {
            $this->usr->delAdditions($this->element);
            redirect($this->base_path . '/additions');
        } else {
            $info['userAdditions']  = $this->usr->getAdditions();
        }
        
        return $info;
    }

    public function logs()
    {
        if ($this->method == 'del') {
            $this->log->delLog($this->element);
            
            redirect($this->base_path . '/logs');
        } else {
            $info['log_list'] = $this->log->read();
        }
        
        return $info;
    }

    public function post()
    {
        $action = __post('action', $this->transfer);

        if ($action == 'user_add') {
            $name   = __post('name', $this->transfer);
            $gid    = __post('gid', $this->transfer);
            $login  = __post('login', $this->transfer);
            $email  = __post('email', $this->transfer);
            $pass   = __post('password', $this->transfer);
            $active = __post('active', $this->transfer);
            
            if (!$gid) {
                return false;
            }
            if (!is_email($email)) {
                return false;
            }
            if (!$login) {
                $login = $email;
            }
            if (!$pass) {
                $pass = substr(md5(time()), 0, 8);
            }

            $id = $this->usr->addUser($gid, $name, $email, $login, $pass, $active);

            if (isset($this->transfer['apply'])) {
                redirect($this->base_path . '/index/edit/' . $id);
            } else {
                redirect($this->base_path . '/index');
            }
        } elseif ($action == 'user_edit') {
            $name   = __post('name', $this->transfer);
            $gid    = __post('gid', $this->transfer);
            $login  = __post('login', $this->transfer);
            $email  = __post('email', $this->transfer);
            $pass   = __post('password', $this->transfer);
            $active = __post('active', $this->transfer);
            
            if (!$gid) {
                $user = $this->usr->getUser($this->element);
                if ($user['gid'] == 10) {
                    $gid = $user['gid'];
                }
            }

            if (!$gid) {
                return false;
            }
            if (!is_email($email)) {
                return false;
            }
            if (!$login) {
                $login = $email;
            }

            $this->usr->editUser($this->element, $gid, $name, $email, $login, $pass, $active);

            if (isset($this->transfer['apply'])) {
                redirect($this->base_path . '/index/edit/' . $this->element);
            } else {
                redirect($this->base_path . '/index');
            }
        } elseif ($action == 'addition_add') {
            $name           = __post('name', $this->transfer);
            $sys_name       = __post('sys_name', $this->transfer);
            $field_type     = __post('field_type', $this->transfer);
            $necess         = __post('necess', $this->transfer);
            $ord            = __post('ord', $this->transfer);
            $remote_table   = __post('remote_table', $this->transfer);
            $remote_field   = __post('remote_field', $this->transfer);
            $table_list     = __post('table_list', $this->transfer);
            
            $last_id = $this->usr->additionsAdd($name, $sys_name, $field_type, $necess, $ord, $remote_table, $remote_field, $table_list);

            if (isset($this->transfer['apply'])) {
                redirect($this->base_path . '/additions/edit/' . $last_id);
            } else {
                redirect($this->base_path . '/additions');
            }
        } elseif ($action == 'addition_edit') {
            $name           = __post('name', $this->transfer);
            $sys_name       = __post('sys_name', $this->transfer);
            $field_type     = __post('field_type', $this->transfer);
            $necess         = __post('necess', $this->transfer);
            $ord            = __post('ord', $this->transfer);
            $remote_table   = __post('remote_table', $this->transfer);
            $remote_field   = __post('remote_field', $this->transfer);
            $table_list     = __post('table_list', $this->transfer);
            
            $this->usr->additionsEdit($this->element, $name, $sys_name, $field_type, $necess, $ord, $remote_table, $remote_field, $table_list);
            
            if (isset($this->transfer['apply'])) {
                redirect($this->base_path . '/additions/edit/' . $this->element);
            } else {
                redirect($this->base_path . '/additions');
            }
        } elseif ($action == 'group_add') {
            $name           = __post('name', $this->transfer);
            $description    = __post('description', $this->transfer);
            $confirm        = __post('confirm', $this->transfer);
            $admin_access   = __post('admin_access', $this->transfer);
            $modules_access = __post('modules_access', $this->transfer);
      
            $last_id = $this->usr->addGroup($name, $description, $admin_access, $modules_access, $confirm);

            if (isset($this->transfer['apply'])) {
                redirect($this->base_path . '/groups/edit/' . $last_id);
            } else {
                redirect($this->base_path . '/groups');
            }
        } elseif ($action == 'group_edit') {
            $name           = __post('name', $this->transfer);
            $description    = __post('description', $this->transfer);
            $confirm        = __post('confirm', $this->transfer);
            $admin_access   = __post('admin_access', $this->transfer);
            $modules_access = __post('modules_access', $this->transfer);

            $last_id = $this->usr->editGroup($this->element, $name, $description, $admin_access, $modules_access, $confirm);
            
            if (isset($this->transfer['apply'])) {
                redirect($this->base_path . '/groups/edit/' . $this->element);
            } else {
                redirect($this->base_path . '/groups');
            }
        }
    }
}
