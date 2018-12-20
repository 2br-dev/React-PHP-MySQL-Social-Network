<?php

final class Structure
{
    use Tools, Singleton;

    public $table_stc    = "#__str_structure";
    public $table_cnt    = "#__str_content";
    public $table_fil    = "#__str_filling";
    public $table_tpl    = "#__str_templates";
    public $table_ogp    = "#__ogp_structure";
    public $table_ogp_types    = "#__ogp_types";

    private $f_id        = "id";
    private $f_pid        = "pid";
    private $f_sys_name = "sys_name";
    private $f_ord        = "ord";
    private $f_vis        = "visible";
    private $v_id        = 1;
    private $v_pid        = 0;
    private $mysql        = null;
    private $show_ids    = [];

    public function __construct()
    {
        $tmp = array(0, $this->v_id);

        if (!isset($_SESSION['admin_struct'])) {
            $_SESSION['admin_struct'] = $tmp;
        }

        if ($_SESSION['admin_struct'] == "") {
            $_SESSION['admin_struct'] = $tmp;
        }

        if (isset($_COOKIE['admin_struct'])) {
            $arr = unserialize($_COOKIE['admin_struct']);
            $arr = array_unique($arr);
            $_SESSION['admin_struct'] = $arr;
        } else {
            setcookie("admin_struct", serialize($_SESSION['admin_struct']));
        }

        $this->mysql = new Mysql();
    }

    public function getPageContent($pid)
    {
        $result = Q(
                "SELECT `c`.*, `f`.`id` AS `fid`, `f`.`content` FROM `".$this->table_cnt."` AS `c` " .
                "LEFT JOIN `".$this->table_fil."` AS `f` ON `f`.`pid`=`c`.`id` " .
                "WHERE `c`.`pid`=?i " .
                "ORDER BY `c`.`ord`",
            array(
                $pid
            ))->all();

        if (!empty($result)) {
            foreach ($result as $k => $v) {
                if (!in_array($v['type'], array('redactor', 'editor'))) {
                    unset($result[$k]['fid'], $result[$k]['content']);
                }
            }
        }

        return $result;
    }

    public function crawler($branch = [], $base = '/')
    {
        foreach ($branch as $item)
        {
            $url = $base;
            $system = $item['sys_name'];

            if (isset($item['pid']) && $system !== 'main')
            {
                if ($url !== '/')
                {
                    $url .= '/';
                }

                $url .=  $system;
            }

            Q("UPDATE `#__str_structure` SET `url`=?s WHERE `id`=?i LIMIT 1", [
                $url, $item['id']
            ]);

            if (!empty($item['tree']))
            {
                $this->crawler($item['tree'], $url);
            }
        }
    }

    public function setFilling($fields = array())
    {
        if (empty($fields)) {
            return false;
        }

        if (!empty($fields['content'])) {
            foreach ($fields['content'] as $id => $content) {
                Q("INSERT INTO `" . $this->table_fil . "` SET `pid`=?i, `content`=?s ON DUPLICATE KEY UPDATE `content`=?s", array(
                    $id, $content, $content
                ));
            }
        }
    }

    public function getLocaleList()
    {
        $locales = Q("SELECT `name` as `text`, `system` as `value` FROM `#__str_locale` ORDER BY `ord`")->all();

        if (isset($locales[0])) {
            $locales[0]['default'] = true;
        }

        return $locales;
    }

    public function toggleVis($id)
    {
        $item = Q("SELECT `id`, `visible` FROM `".$this->table_stc."` WHERE `id`=?i LIMIT 1", array( $id ))->row();

        if (!empty($item)) {
            $visible = ($item['visible'] == 0) ? 1 : 0;

            Q("UPDATE `".$this->table_stc."` SET `visible`=?i WHERE `id`=?i LIMIT 1", array( $visible, $id ));

            return true;
        }

        return false;
    }

    public function insertStc($fields = array())
    {
        if (empty($fields)) {
            return false;
        }

        $sql = "INSERT INTO `".$this->table_stc."` SET ";

        $i = 0;
        $count = count($fields);

        foreach ($fields as $name => $value)
        {
            if (is_array($value) && !empty($value))
            {
                $value = implode(',', $value);
            }

            if ($name == 'date')
            {
                $value = $this->timestamp($value, '%d.%m.%Y %H:%i');
            }

            if (is_numeric($value))
            {
                $sql .= "`" . $name . "`=" . intval($value) . "";
            }
            else
            {
                $sql .= "`" . $name . "`='".to_base($value)."'";
            }

            if (++$i !== $count)
            {
                $sql .= ", ";
            }
        }

        $sql .= " ON DUPLICATE KEY UPDATE `updated`=".time();

        return Q($sql);
    }

    public function updateStc($fields = array(), $id = array())
    {
        if (!$id) {
            return false;
        }
        if (empty($fields)) {
            return false;
        }

        $sql = "UPDATE `" .$this->table_stc."` SET ";

        foreach ($fields as $name => $value) {
            if (is_array($value) && !empty($value)) {
                $value = implode(',', $value);
            }

            if ($name == 'date') {
                $value = $this->timestamp($value, '%d.%m.%Y %H:%i');
            }

            if (is_numeric($value)) {
                $sql .= "`" . $name . "`=" . intval($value) . ", ";
            } else {
                $sql .= "`" . $name . "`='" . to_base($value) . "', ";
            }
        }

        $sql .= "`id`=?i WHERE `id`=?i LIMIT 1";

        Q($sql, array( $id, $id ));
    }

    public function getOgpTypes()
    {
        $tree = Q("SELECT * FROM `". $this->table_ogp_types ."` ")->all();
        return $this->makeTree($tree);
    }

    public function allTree($rootID=0, $all_tree=false)
    {
        $pages = Q("SELECT `id`,`".$this->f_pid."`, `sys_name`, `name`, `visible`, `ord`, `redirect`, `dynamic`, `access`, `mod_id` FROM `".$this->table_stc."` ORDER BY `".$this->f_pid."`, `".$this->f_ord."`")->all();

        return $this->makeTree($pages, 0, 'pid', 'id', $children = 'a_tree');
    }

    //	Sync session and cookie arrays
    public function syncCookie()
    {
        $s = $_SESSION['admin_struct'];
        setcookie("admin_struct", serialize($_SESSION['admin_struct']));
    }

    //	Get page by `id`
    public function getPage($id = 0)
    {
        $result = Q("SELECT * FROM `".$this->table_stc."` WHERE `id`=?i LIMIT 1", array($id))->row();

        if (!empty($result)) {
            $result['in_menu']    = isset($result['in_menu']) ? explode(',', $result['in_menu']) : $result['in_menu'] ;
            $result['robots']    = isset($result['robots']) ? explode(',', $result['robots']) : '';
            $result['date']        = $this->dateFormat($result['date'], 'd.m.Y H:i');
            $result['url']        = $this->getUrl($result);
        }

        return $result;
    }

    //	Get templates
    public function getTemplates($id=0)
    {
        //	Show all templates
        if (!$id) {
            return Q("SELECT * FROM `".$this->table_tpl."`")->all();
        }
        //	Show template
        else {
            return from_base(Q("SELECT `name` FROM `".$this->table_tpl."` WHERE `id`=?i LIMIT 1", array($id))->row('name'));
        }
    }

    public function getUrl($page = array())
    {
        $url = '';

        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== '') {
            $url .= 'https://';
        } else {
            $url .= 'http://';
        }

        $url .= $_SERVER['HTTP_HOST'];

        $breadcrumbs = $this->getBC($page['id']);

        if (!empty($breadcrumbs)) {
            foreach ($breadcrumbs as $arr) {
                if ($arr['pid'] != 0) {
                    if ($arr['id'] == $page['id']) {
                        $url .= '/' . '<strong class="js-current-system">' . $arr['sys_name'] . '</strong>';
                    } else {
                        $url .= '/' . $arr['sys_name'];
                    }
                }
            }
        }

        return $url;
    }

    public function getBC($id = 0, $puth = array())
    {
        $page = Q("SELECT `id`, `pid`, `sys_name`, `name`, `mod_id`, `in_menu` FROM `".$this->table_stc."` WHERE `id`=?i LIMIT 1", array( $id ))->row();

        if (!empty($page)) {
            $page['in_menu'] = explode(',', $page['in_menu']);

            $puth[] = $page;

            if ($page['pid'] == 0) {
                return array_reverse($puth);
            } else {
                return $this->getBC($page['pid'], $puth);
            }
        }
    }

    public function getBC1($id = 0)
    {
        $res = [];
        $_temp = Q("SELECT `id`, `pid`, `sys_name`, `name`, `mod_id`, `in_menu` FROM `".$this->table_stc."` WHERE `id`=?i LIMIT 1", array( $id ))->row();

        if (!empty($_temp)) {
            $pid = $res['pid'];

            $res[] = array(
                "id"        => $_temp['id'],
                "pid"        => $pid,
                "name"        => $_temp['name'],
                "sys_name"    => $_temp['sys_name'],
                "mod_id"    => $_temp['mod_id'],
                "in_menu"    => preg_split('/\,+/', $_temp['in_menu'], -1, PREG_SPLIT_NO_EMPTY)
            );

            Q("SELECT `id`,`pid`,`sys_name`,`name`,`mod_id`,`in_menu` FROM `".$this->table_stc."` WHERE `id`=?i", array( $pid ));
        }

        return array_reverse($res);
    }
    
    // public function getBC122($id = 0)
    // {
    // 	$res = [];
    // 	$sql = "SELECT `id`, `pid`, `sys_name`, `name`, `mod_id`, `in_menu` FROM `".$this->table_stc."` WHERE `id`='".$id."' LIMIT 1";

    // 	$this->mysql->query($sql);

    // 	while($this->mysql->nf())
    // 	{
    // 		$this->mysql->next_record();
    // 		$pid = $this->mysql->f("pid");
    // 		$res[] = array(
    // 			"id" 		=> $this->mysql->f("id"),
    // 			"pid" 		=> $pid,
    // 			"name"	 	=> from_base($this->mysql->f("name")),
    // 			"sys_name" 	=> from_base($this->mysql->f("sys_name")),
    // 			"mod_id"	=> $this->mysql->f("mod_id"),
    // 			"in_menu"	=> explode(',', $this->mysql->f("in_menu")),
    // 		);
            
    // 		$sql = "SELECT `id`,`pid`,`sys_name`,`name`,`mod_id`,`in_menu` FROM `".$this->table_stc."` WHERE `id`='".$pid."'";
    // 		$this->mysql->query($sql);
    // 	}

    // 	return array_reverse($res);
    // }
    
    //	Get childs
    public function getChilds($pid)
    {
        $arr = Q("SELECT `id`,`".$this->f_pid."`,`sys_name`,`name`,`visible`,`ord`,`mod_id` 
				  FROM `".$this->table_stc."` 
				  WHERE `".$this->f_pid."`=?i ORDER BY `".$this->f_ord."`", array( $pid ))->all();

        $res = [];

        $sql = "SELECT `id`,`".$this->f_pid."` FROM `".$this->table_stc."` WHERE `".$this->f_pid."` IN ('-1'";
        
        foreach ($arr as $v) {
            $res[$v['id']] = $v;
            //	If child is not module items
            if (!$v['mod_id']) {
                $sql .= ", '".$v['id']."'";
            } else {
                $module = new Meta($v['mod_id']);
                if (!isset($module->module_info['id'])) {
                    $this->unlinkModule($v['id']);
                } else {
                    $res[$v['id']]['childs'] = intval($module->getChildsForStc());
                }
            }
        }
        $sql .= ") ";
        
        $arr = Q($sql)->all();
        
        foreach ($arr as $v) {
            $res[$v['pid']]['childs'] = 1;
        }

        return $res;
    }
    
    public function unlinkModule($id)
    {
        Q("UPDATE `".$this->table_stc."` SET `mod_id`='0' WHERE `id`='?i LIMIT 1", array( $id ));
    }
    
    public function getNextOrd($pid, $step=10)
    {
        $max_ord = Q("SELECT MAX(`ord`) as `max_ord` FROM `".$this->table_stc."` WHERE `".$this->f_pid."`=?i AND `sys_name` != 'search' LIMIT 1", array($pid))->row('max_ord');
        return $max_ord + $step;
    }
    
    public function tree_list_sitemap(&$a_list, $id=0, $all_tree)
    {
        if (empty($a_list[$id])) {
            return [];
        }
        $a_tree=[];
        
        $count_for = count($a_list[$id]);
        for ($i=0; $i < $count_for;$i++) {
            $f=$a_list[$id][$i];
            //
            $f['childs'] = isset($a_list[$f['id']])?1:0;
            $f['a_tree'] = $this->tree_list_sitemap($a_list, $a_list[$id][$i]['id'], $all_tree);
            $a_tree[]=$f;
        }

        unset($count_for);

        return $a_tree;
    }

    public function sitemapTree($rootID=0, $all_tree=false)
    {
        $sql = "SELECT `id`,`".$this->f_pid."`,`sys_name`,`name`,`visible`,`ord`,`mod_id`,`in_menu` FROM `".$this->table_stc."`
				WHERE `visible`='1' AND `in_sitemap`='1' ORDER BY `".$this->f_pid."`,`".$this->f_ord."`";

        $this->mysql->query($sql);

        $r = $this->mysql->Query_ID;
        if (!$this->mysql->nf()) {
            return false;
        }

        $a_list=[];
        //	Ключ массива - идентификатор родительского элемента
        //	значение - список дочерних элементов
        $count_for = mysql_num_rows($r);
        for ($i=0; $i < $count_for; $i++) {
            $f=mysql_fetch_assoc($r);
            $f['in_menu'] = (isset($f['in_menu']) && $f['in_menu'] != '') ? explode(',', $f['in_menu']) : $f['in_menu'] ;
            if (empty($a_list[$f[$this->f_pid]])) {
                $a_list[$f[$this->f_pid]]=[];
            }
            $a_list[$f[$this->f_pid]][]=$f;
        }

        unset($count_for);

        return $this->tree_list_sitemap($a_list, $rootID, $all_tree);
    }

    //	Recursive delete structure
    public function deleteStc($id, &$trush)
    {
        if ($id == 1) {
            return;
        }

        // Очищение всех потомков
        $childs = Q("SELECT `id` FROM `".$this->table_stc."` WHERE `pid`='".$id."' ")->all();

        if (!empty($childs)) {
            foreach ($childs as $v) {
                $this->deleteStc($v['id'], $trush);
            }
        }

        //	Add to trush structure `#__str_structure`
        // $trush->toTrush($this->table_stc, $id);

        //	Add to trush content `#__str_content`
        // $trush->toTrush($this->table_cnt,$id,"pid");

        Q("DELETE FROM `".$this->table_stc."` WHERE `id`=?i LIMIT 1", array($id));

        $this->deleteCnt($id);
    }

    //	Delete content page
    public function deleteCnt($pid)
    {
        // Очищаем наполнение

        $conts = Q("SELECT `id` FROM `".$this->table_cnt."` WHERE `pid`='". $pid ."' ")->all();

        if (!empty($conts)) {
            foreach ($conts as $item) {
                Q("DELETE FROM `".$this->table_fil."` WHERE `pid`=?i", array($item['id']));

                Q("DELETE FROM `".$this->table_cnt."` WHERE `id`=?i", array($item['id']));
            }
        }
    }
    
    public function checkContent($pid)
    {
        $count = Q("SELECT `id` FROM `".$this->table_cnt."` WHERE `pid`=?i", array( $pid ))->row();
        
        if (!empty($count)) {
            return true;
        }
        
        return false;
    }
}
