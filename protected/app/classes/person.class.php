<?php

class Person
{
    public $user = array('id' => 0, 'gid' => 0, 'login' => "guest", 'name' => "Гость", 'admin_access' => 0); //	$user - define default user
    public $table = "#__usr_users";
    public $table_ai = "#__usr_add_info";
    public $table_af = "#__usr_add_fields";
    public $table_gr = "#__usr_groups";
    public $user_fields = array('id', 'gid', 'name', 'email', 'login', 'password', 'code', 'active', 'created', 'add_info', 'last_login', 'save', 'saving', 'comid', 'apply', 'action');

    public function __construct()
    {
        $this->mysql = new Mysql;

        if (count($_POST)) {
            //	Auth
            if (isset($_POST['auth'])) {
                $this->authUser($_POST);
            }

            //	Registry
            elseif (isset($_POST['registry'])) {
                $this->registryUser(__post("gid"));
            }
            //	Repear
            elseif (isset($_POST['repear_password'])) {
                $this->repearUser();
            }
        }

        //	Logout
        if (isset($_GET['logout']) && $_GET['logout'] == 1) {
            $this->logoutUser();
        }
        //	Activation
        elseif (isset($_GET['user_activate']) && $_GET['user_activate'] != "") {
            $this->activateUser();
        }
        //	Deactivation
        elseif (isset($_GET['user_deactivate']) && $_GET['user_deactivate'] != "") {
            $this->deactivateUser();
        }

        //	Define user
        if (empty($_SESSION['userinf'])) {
            $_SESSION['userinf'] = $this->user;
        } else {
            $this->user = $_SESSION['userinf'];
        }
    }
    
    //	getUser
    public function getUser($id = 0)
    {
        $user = [];

        if ($id) {
            $user = Q("SELECT `id`, `gid`, `login`, `name`, `email` FROM `" . $this->table . "` WHERE `id`=?i LIMIT 1", array(
                intval($id)
            ))->row();
        }

        return $user;
    }
    
    public function getEmailsFromGroups($arr)
    {
        if (is_array($arr)) {
            $sql = "SELECT `email` FROM `" . $this->table . "` WHERE `gid` IN ('0'";
            foreach ($arr as $v) {
                $sql .= ",'" . $v . "'";
            }
            $sql .= ") GROUP BY `email`";
            
            $data = Q($sql)->all();
            
            $res = [];
            foreach ($data as $v) {
                $res[] = $v['email'];
            }
            
            return $res;
        }
    }
    
    //	Get admin access
    public function getAdminAccess()
    {
        if (isset($_SESSION['userinf']['admin_access']) && $_SESSION['userinf']['admin_access'] == 1) {
            return true;
        }
    
        return false;
    }
    
    //	Check admin access
    public function checkAdminAccess($gid)
    {
        if ($gid == 10) {
            return true;
        }
        
        $admin_access = Q("SELECT `admin_access` FROM `" . $this->table_gr . "` WHERE `id`=?i ", array( $gid ))->row('admin_access');
        
        if ($admin_access == 1) {
            return true;
        }
        
        return false;
    }
    
    //	authUser
    public function authUser($data = array())
    {
        $login    = (isset($data['login']) && $data['login'] !== '') ? $data['login'] : ((isset($_POST['login']) && $_POST['login'] !== '') ? $_POST['login'] : '');
        $password = (isset($data['password']) && $data['password'] !== '') ? $data['password'] : ((isset($_POST['password']) && $_POST['password'] !== '') ? $_POST['password'] : '');
        $save     = isset($data['save']) ? 1 : 0;
        
        if ($save == 1) {
            setcookie("savepassword", $save, time() + 3600 * 24 * 31);
        } else {
            setcookie("savepassword", "", time() - 3600);
        }
        
        if ($login !== '' && $password !== '') {
            $user = Q("SELECT * FROM `" . $this->table . "` WHERE `login` LIKE ?s AND `password` LIKE ?s AND `active`=?i LIMIT 1", array(
                to_base($login), md5($password), 1
            ))->row();
            
            if (empty($user)) {
                $log = new Log("auth", "Не удачная попытка авторизации");
            } else {
                $log = new Log("auth", "Удачная авторизация");
                
                //	Check admin access
                $gid   = $user['gid'];
                $uid   = $user['id'];
                $login = $user['login'];
                $name  = $user['name'];
                $email = $user['email'];
                
                if ($this->checkAdminAccess($gid)) {
                    $this->user['admin_access'] = 1;
                } else {
                    $this->user['admin_access'] = 0;
                }
                //
                $this->user['id']    = $uid;
                $this->user['gid']   = $gid;
                $this->user['login'] = $login;
                $this->user['name']  = $name;
                $this->user['email'] = $email;
                
                //	Clear user info
                if (isset($_SESSION['userinf'])) {
                    unset($_SESSION['userinf']);
                }
                    
                $_SESSION['userinf'] = $this->user;
            }
        }
    }
    
    //	Log out
    public function logoutUser()
    {
        $log = new Log("auth", "Был произведен выход из аккаунта");
        unset($_SESSION['userinf']);
        redirect("/");
    }
    
    //	Show list of users
    public function usersList($gid = 0, $pager = 10, $ord = "id", $ord_type = "DESC")
    {
        $groups = $this->getGroups();
        $where  = " WHERE  1 ";
        
        if ($gid) {
            $where = "WHERE `gid` <= " . $gid . "";
        }

        $data = Q("SELECT * FROM `" . $this->table . "` " . $where . " ORDER BY `" . $ord . "` " . $ord_type . "")->all();
        
        //	Paging
        if ($pager) {
            $this->mysql->preparePager($pager);
        }

        if (!empty($this->mysql->pager)) {
            printPager($this->mysql->pager);
        }
        
        $res = [];
        foreach ($data as $l => $v) {
            $gid   = $v['gid'];
            $res[] = array(
                'id' => $v['id'],
                'gid' => $gid,
                'user' => from_base($v['name']),
                'group' => isset($groups[$gid]) ? $groups[$gid]['name'] : '',
                'login' => from_base($v['login']),
                'email' => from_base($v['email']),
                'created' => $v['created'],
                'active' => $v['active']
            );
        }
        return $res;
    }
    
    //	Get user
    public function usersGet($id)
    {
        return Q("SELECT * FROM `" . $this->table . "` WHERE `id`=?i LIMIT 1", array( intval($id) ))->row();
    }
    
    public function genCode()
    {
        return substr(md5(time()), 0, 16);
    }

    //	AddUser
    public function addUser($gid, $name, $email, $login, $password, $active = 0, $add_info = "")
    {
        $last_id = Q("INSERT INTO `" . $this->table . "` SET `gid`=?i, `name`=?s, `email`=?s, `login`=?s, `password`=?s, `active`=?s, `add_info`=?s, `code`=?s, `created`=NOW()", array(
            intval($gid), to_base($name), to_base($email), to_base($login), md5($password), intval($active), to_base($add_info), $this->genCode()
        ));

        if (!empty($_POST)) {
            foreach ($_POST as $k => $value) {
                if (!in_array($k, $this->user_fields)) {
                    Q("UPDATE `" . $this->table . "` SET `" . $k . "`=?s WHERE `id`=?i LIMIT 1", array(
                        $value, $last_id
                    ));
                }
            }
        }

        return $last_id;
    }
    
    //	EditUser
    public function editUser($id, $gid = 0, $name = '', $email = '', $login = '', $password = '', $active = 0, $add_info = "")
    {
        Q("UPDATE `" . $this->table . "` SET `gid`=?i, `name`=?s, `email`=?s, `login`=?s, `password`=?s, `active`=?s, `add_info`=?s WHERE `id`=?i LIMIT 1", array(
            intval($gid), to_base($name), to_base($email), to_base($login), md5($password), intval($active), to_base($add_info), $id
        ));

        if (!empty($_POST)) {
            foreach ($_POST as $k => $value) {
                if (!in_array($k, $this->user_fields)) {
                    Q("UPDATE `" . $this->table . "` SET `" . $k . "`=?s WHERE `id`=?i LIMIT 1", array(
                        $value, $id
                    ));
                }
            }
        }
        
        return $id ;
    }
    
    //	Delete User
    public function delUser($id)
    {
        Q("DELETE FROM `" . $this->table . "` WHERE `id`=?i LIMIT 1", array( intval($id) ));
    }
    
    //	Groups
    public function getGroups()
    {
        return Q("SELECT `id`, `name`, `description`, `admin_access`, `confirm` FROM `" . $this->table_gr . "`")->all('id');
    }
    
    //	Add group
    public function addGroup($name, $description, $admin_access, $modules_access, $confirm)
    {
        $modules_access = '';

        if (isset($_POST['modules_access'])) {
            $modules_access            = array_keys($_POST['modules_access']);
            $modules_access            = implode(',', $modules_access);
        }
        
        //	Prepare sql-query
        return Q("INSERT INTO `" . $this->table_gr . "` SET `name`=?s, `description`=?s, `confirm`=?s, `admin_access`=?i, `modules_access`=?s", array(
            to_base($name), to_base($description), to_base($confirm), __post("admin_access"), $modules_access
        ));
    }
    
    //	Add group
    public function editGroup($id, $name, $description, $admin_access, $modules_access, $confirm)
    {
        $modules_access = '';
        if (isset($_POST['modules_access'])) {
            $modules_access = array_keys($_POST['modules_access']);
            $modules_access = implode(',', $modules_access);
        }
        
        //	Prepare sql-query
        Q("UPDATE `" . $this->table_gr . "` SET `name`=?s, `description`=?s, `confirm`=?s, `admin_access`=?i, `modules_access`=?s  WHERE `id`=?i LIMIT 1", array(
            to_base($name), to_base($description), to_base($confirm), __post("admin_access"), $modules_access, $id
        ));
    }
    
    //	Groups list
    public function getGroupsList()
    {
        $mdd     = new Mdd();
        $modules = $mdd->getModules();
        
        if (!empty($modules)) {
            $result = [];
            foreach ($modules as $module) {
                $result[$module['id']] = $module;
            }
            $modules = $result;
        }

        $data = Q("SELECT `id`, `name`, `description`, `admin_access`, `modules_access`, `confirm` FROM `" . $this->table_gr . "`")->all();
        
        foreach ($data as &$item) {
            $str = '';

            if ($item['modules_access'] !== '') {
                $modules_access = explode(',', $item['modules_access']);
            
                foreach ($modules_access as $id) {
                    if (isset($modules[ $id ]['name'])) {
                        $str .= $modules[ $id ]['name'] . ', ';
                    }
                }
                
                $str = substr($str, 0, -2);
            }

            $item['name']                    = from_base($item['name']);
            $item['description']            = from_base($item['description']);
            $item['modules_access_list']    = $str;
        }

        return $data;
    }
    
    public function delGroup($id)
    {
        Q("DELETE FROM `" . $this->table_gr . "` WHERE `id`=?i LIMIT 1", array( intval($id) ));
    }
    
    //	Groups item
    public function getGroupsItem($id)
    {
        $mdd     = new Mdd();
        $modules = $mdd->getModules();
        $data = Q("SELECT * FROM `" . $this->table_gr . "` WHERE `id`=?i LIMIT 1", array( $id ))->row();
        
        $modules_access = $data['modules_access'];
        
        if ($modules_access !== null) {
            $tmp = explode(',', $modules_access);
            $str = '';
            foreach ($tmp as $v) {
                if (isset($modules[$v]['name'])) {
                    $str .= $modules[$v]['name'] . ', ';
                }
            }
            $str = substr($str, 0, -2);
        }
        
        return array(
            "id" => $data['id'],
            "name" => from_base($data['name']),
            "description" => from_base($data['description']),
            "admin_access" => $data['admin_access'],
            "modules_access" => $str,
            "modules_access_r" => $tmp,
            "confirm" => $data['confirm']
        );
    }
    
    //	Additions
    public function alterField($id)
    {
        $field = Q("SELECT * FROM `" . $this->table_af . "` WHERE `id`=?i LIMIT 1", array( $id ))->row();
        
        $one_user = Q("SELECT * FROM `" . $this->table . "` LIMIT 1")->row();
        
        if (!empty($field)) {
            $mysql_type = Q("SELECT `mysql_type` FROM `#__mdd_fields_type` WHERE `id`=?i LIMIT 1", array( $field['field_type'] ))->row('mysql_type');

            if (isset($one_user[$field['sys_name']])) {
                Q("ALTER TABLE `" . $this->table . "` CHANGE `" . $field['sys_name'] . "` `" . $field['sys_name'] . "` " . $mysql_type . " AFTER `id`;");
            } else {
                Q("ALTER TABLE `" . $this->table . "` ADD `" . $field['sys_name'] . "` " . $mysql_type . " AFTER `id`;");
            }
        }
    }

    public function deleteField($id)
    {
        $field = Q("SELECT * FROM `" . $this->table_af . "` WHERE `id`=?i LIMIT 1", array( $id ))->row();
        $one_user = Q("SELECT * FROM `" . $this->table . "` LIMIT 1")->row();
        
        if (isset($one_user[$field['sys_name']])) {
            Q("ALTER TABLE `" . $this->table . "` DROP `" . $field['sys_name'] . "`");
        }
    }

    public function getUserAdditions()
    {
        $additions = Q("SELECT `f`.`name`, `f`.`sys_name`, `t`.`sys_name` AS `f_type`, `f`.`remote_table`, `f`.`remote_field`, `f`.`table_list`, `f`.`necess`, `f`.`ord` 
						FROM `" . $this->table_af . "` AS `f`
						LEFT JOIN `#__mdd_fields_type` AS `t` ON `t`.`id`=`f`.`field_type`
						ORDER BY `f`.`ord`")->all();
        
        if (!empty($additions)) {
            foreach ($additions as $k => $v) {
                if ($v['remote_table'] && $v['remote_field']) {
                    $additions[$k]['list'] = Q("SELECT `" . $v['remote_field'] . "` as `var`, `id` AS `value` FROM `" . $v['remote_table'] . "` WHERE `visible`=1 ORDER BY `ord`")->all();
                } elseif ($v['table_list']) {
                    $additions[$k]['list'] = Q("SELECT `var`, `value`, `default` FROM `#__mdd_lists` WHERE `list_name` LIKE ?s ORDER BY `ord`", array( $v['table_list'] ))->all();
                }
            }
        }

        return $additions;
    }

    public function getAdditions($id = 0)
    {
        if ($id) {
            return Q("SELECT * FROM `" . $this->table_af . "` WHERE `id`=?i LIMIT 1", array( intval($id) ))->row();
        } else {
            return Q("SELECT * FROM `" . $this->table_af . "` ORDER BY `ord`")->all();
        }
    }
    
    public function additionsAdd($name, $sys_name, $field_type, $necess, $ord, $remote_table, $remote_field, $table_list)
    {
        $sys_name = str_replace(array(' ', '-'), '_', $sys_name);

        if (!in_array($sys_name, $this->user_fields)) {
            $last_id = Q("INSERT INTO `" . $this->table_af . "` SET `name`=?s, `sys_name`=?s, `field_type`=?i, `necess`=?i, `remote_table`=?s, `remote_field`=?s, `table_list`=?s, `ord`=?i ON DUPLICATE KEY UPDATE `ord`=?i", array(
                $name, $sys_name, $field_type, $necess, $remote_table, $remote_field, $table_list, $ord, $ord
            ));
            
            $this->alterField($last_id);

            return $last_id;
        }
    }
    
    public function additionsEdit($id, $name, $sys_name, $field_type, $necess, $ord, $remote_table, $remote_field, $table_list)
    {
        $sys_name = str_replace(array(' ', '-'), '_', $sys_name);
        
        if (!in_array($sys_name, $this->user_fields)) {
            Q("UPDATE `" . $this->table_af . "` SET `name`=?s, `sys_name`=?s, `field_type`=?i, `necess`=?i, `remote_table`=?s, `remote_field`=?s, `table_list`=?s, `ord`=?i WHERE `id`=?i LIMIT 1", array(
                $name, $sys_name, $field_type, $necess, $remote_table, $remote_field, $table_list, $ord, $id
            ));

            $this->alterField($id);
        }
    }
    
    public function delAdditions($id)
    {
        $this->deleteField($id);

        Q("DELETE FROM `" . $this->table_af . "` WHERE `id`=?i LIMIT 1", array( intval($id) ));
    }
    
    //	Registry new user
    public function registryUser($gid)
    {
        $fields                      = $this->getAdditionFields($gid);
        $login                       = __post("login");
        $email                       = __post("email");
        $password1                   = __post("password");
        $password2                   = __post("password_again");
        $name                        = __post("name");
        $_SESSION['registry_errors'] = [];
        
        //	Check vars
        if (!($password1 && ($password1 == $password2))) {
            return false;
        }
        
        foreach ($fields as $v) {
            if (!($v['necess'] && $v['in_form'])) {
                if (__post($v['sys_name']) === false) {
                    exit("1");
                }
            }
        }
        if (!$login) {
            $login = $email;
        }
        if (!$name) {
            $name = $login;
        }

        //	Prepare to adding new user
        $code = $this->genCode();
        
        //	Prepare sql query
        $uid = Q("INSERT INTO `" . $this->table . "` SET 
			`gid` = ?i,
			`name` = ?s,
			`login` = ?s,
			`email` = ?s,
			`password` = ?s,
			`code` = ?s,
			`active` = ?i,
			`created` = NOW()", array(
            intval($gid), to_base($name), to_base($login), to_base($email), md5($password1), $code, ($this->getActivite($gid) ? 0 : 1)
        ));
        
        //	Adding additions fields
        foreach ($fields as $v) {
            Q("INSERT INTO `" . $this->table_ai . "` SET `fid`=?i, `uid`=?i, `value`=?s", array(
                $v['id'], $uid, to_base(__post($v['sys_name']))
            ));
        }
        
        return array(
            "login" => $login,
            "code" => $code,
            "password" => $password1,
            "date" => date("d-m-Y H:i:s")
        );
    }
    
    public function confirm($code)
    {
        if (Q("UPDATE `" . $this->table . "` SET `active`='1' WHERE `id` = (SELECT `id` FROM `" . $this->table . "` WHERE `code` LIKE ?s LIMIT 1) LIMIT 1", array( to_base($code) ))) {
            return true;
        }
        
        return false;
    }
    
    public function delete($code)
    {
        if (Q("DELETE FROM `" . $this->table . "` WHERE `id` = (SELECT `id` FROM `" . $this->table . "` WHERE `code` LIKE ?s LIMIT 1) LIMIT 1", array( to_base($code) ))) {
            return true;
        }
        
        return false;
    }
    
    //	Check activity method
    public function getActivite($gid)
    {
        return Q("SELECT `confirm` FROM `" . $this->table_gr . "` WHERE `id`=?i LIMIT 1", array(
            $gid
        ))->row('confirm');
    }
    
    //	Get addion fields
    public function getAdditionFields()
    {
        return Q("SELECT * FROM `" . $this->table_af . "` ORDER BY `ord`")->all();
    }
}
