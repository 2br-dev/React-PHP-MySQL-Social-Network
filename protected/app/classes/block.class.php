<?php

class Block
{
    protected $table_z      = '#__blc_zone';        //Таблица с зонами вывода блоков
    protected $table_b      = '#__blc_blocks';      //Таблица с блоками, зависит от "зон" #__blc_zone
    protected $table_ban    = '#__blc_banners';     //Таблица с блоками, зависит от "зон" #__blc_zone

    public function addZone($name, $sys_name, $tid, $vis)
    {
        return Q("INSERT INTO `".$this->table_z."` SET `name`='".to_base($name)."', `sys_name`='".to_base($sys_name)."', `tid`='".intval($tid)."', `visible`='".intval($vis)."' ");
    }

    public function editZone($id, $name, $sys_name, $tid, $vis)
    {
        Q("UPDATE `".$this->table_z."` SET `name`='".to_base($name)."', `sys_name`='".to_base($sys_name)."', `tid`='".intval($tid)."', `visible`='".intval($vis)."' WHERE `id`=?i LIMIT 1", array( $id ));
        return 1;
    }

    public function delZone($id)
    {
        Q("DELETE FROM `".$this->table_z."` WHERE `id`=?i LIMIT 1", array( $id ));
    }

    public function itemZone($id)
    {
        return Q("SELECT * FROM `".$this->table_z."` WHERE `id`=?i LIMIT 1", array( $id ))->row();
    }

    public function listZones()
    {
        $tid_list = $this->getTid();

        $arr = Q("SELECT * FROM `".$this->table_z."`")->all();

        foreach ($arr as $key => $item) {
            $arr[$key] = [
                "id"        => $item['id'],
                "tid"       => isset($tid_list[$item['tid']]) ? $tid_list[$item['tid']] : '',
                "name"      => from_base($item['name']),
                "sys_name"  => from_base($item['sys_name']),
                "visible"   => $item['visible']
            ];
        }

        return $arr;
    }

    public function listZonesShort()
    {
        $list = Q("SELECT * FROM `".$this->table_z."`")->all('id');
        return $list;
    }

    public function listBlocks($pid=0)
    {
        if ($pid) {
            $arr = Q("SELECT * FROM `".$this->table_b."` WHERE `pid`=?i ORDER BY `ord`", array( $pid ))->all();
        } else {
            $arr = Q("SELECT * FROM `".$this->table_b."` ORDER BY `pid`, `ord`")->all();
        }

        foreach ($arr as $key => $item) {
            $module = $item['module'];

            if ($module !== 0 && $module !== '0' && $module !== '') {
                $module = Q("SELECT `name` FROM `#__mdd_binds` WHERE `id`=?i LIMIT 1", [ $module ])->row('name');
            } else {
                $module = 'N/A';
            }

            $locale = '';
            $locals = getfl('locale');

            if (isset($locals[$item['locale']])) {
                $locale = $locals[$item['locale']];
            }

            $arr[$key] = [
                'id'        => $item['id'],
                'pid'       => $item['pid'],
                'name'      => $item['name'],
                'module'    => $module,
                'locale'    => $locale,
                'pages_on'  => $item['pages_on'],
                'pages_off' => $item['pages_off'],
                'rotation'  => $item['rotation'],
                'ord'       => $item['ord'],
                'visible'   => $item['visible']
            ];
        }

        return $arr;
    }

    public function itemBlock($id)
    {
        return Q("SELECT * FROM `".$this->table_b."` WHERE `id`=?i LIMIT 1", array( $id))->row();
    }

    public function addBlock($data = [])
    {
        if (!empty($data)) {
            $_query = '';
            $_value = [];

            foreach ($data as $key => $value) {
                $_t = explode(':', $key);
                $_f = $_t[0];
                $_n = $_t[1];

                if ($_query !== '') {
                    $_query .= ', ';
                }

                if (in_array($_f, ['ls', 'li'])) {
                    $_f = 's';
                    $value = implode(',', $value);
                }

                $_query .= '`'.$_n.'`=?'.$_f;

                $_value[] = $value;
            }

            $id = Q("INSERT INTO `" . $this->table_b . "` SET " . $_query, $_value);

            return $id;
        }
    }

    public function editBlock($data = [], $id = 0)
    {
        if (!empty($data)) {
            $_query = '';
            $_value = [];

            foreach ($data as $key => $value) {
                $_t = explode(':', $key);
                $_f = $_t[0];
                $_n = $_t[1];

                if ($_query !== '') {
                    $_query .= ', ';
                }

                if (in_array($_f, ['ls', 'li'])) {
                    $_f = 's';
                    $value = implode(',', $value);
                }

                $_query .= '`'.$_n.'`=?'.$_f;

                $_value[] = $value;
            }

            Q("UPDATE `" . $this->table_b . "` SET " . $_query . " WHERE `id`=".$id." LIMIT 1", $_value);
        }

        return $id;
    }

    public function delBlock($id)
    {
        Q("DELETE FROM `".$this->table_b."` WHERE `id`=?i LIMIT 1", array( $id));
        return 1;
    }

    public function getTid()
    {
        $tid = Q("SELECT `id`, `name` FROM `#__str_templates`")->all('id');

        foreach ($tid as &$item) {
            $item = $item['name'];
        }

        return $tid;
    }

    public function addBanner($post = [])
    {
        $name           = __post('name', $post);
        $sys_name       = __post('sys_name', $post);
        $link           = __post('link', $post);
        $banner         = __post('file', $post);
        $visible        = __post('visible', $post);

        $sql = "INSERT INTO `".$this->table_ban."` SET 
			`name`		='".to_base($name)."', 
			`sys_name`	='".to_base($sys_name)."', 
			`link`		='".to_base($link)."', 
			`file`		='".to_base($banner)."', 
			`visible`	='".intval($visible)."'";

        return Q($sql);
    }

    public function editBanner($id = 0, $post = [])
    {
        $name           = __post('name', $post);
        $sys_name       = __post('sys_name', $post);
        $link           = __post('link', $post);
        $banner         = __post('file', $post);
        $visible        = __post('visible', $post);

        $sql = "UPDATE `".$this->table_ban."` SET 
				`name`		='".to_base($name)."', 
				`sys_name`	='".to_base($sys_name)."', 
				`link`		='".to_base($link)."', 
				`file`		='".to_base($banner)."', 
				`visible`	='".intval($visible)."' WHERE `id`=?i LIMIT 1";

        Q($sql, array( $id));

        return $id;
    }

    public function delBanner($id)
    {
        $arr = Q("SELECT * FROM `".$this->table_ban."` WHERE `id`=?i LIMIT 1", array( $id))->row();

        $f = new Files();
        $f->deleteGroupFiles($arr['file']);

        //	Delete item record
        Q("DELETE FROM `".$this->table_ban."` WHERE `id`=?i LIMIT 1", array( $id));
    }

    public function itemBanner($id)
    {
        $result = Q("SELECT * FROM `".$this->table_ban."` WHERE `id`=?i LIMIT 1", array( $id))->all();

        $banner = array(
            'id'        => $result['id'],
            'name'        => from_base($result['name']),
            'sys_name'    => from_base($result['sys_name']),
            'file'        => $result['file'],
            'link'        => $result['link'],
            'visible'    => $result['visible']
        );

        $f = new Files();
        $f->getFilesByGroup($banner['file']);

        $banner['files_list'] = json_encode($f->getFilesByGroup($banner['file']));

        return $banner;
    }

    public function listBanners()
    {
        return Q("SELECT * FROM `".$this->table_ban."` ORDER BY `id` DESC")->all();
    }
}
