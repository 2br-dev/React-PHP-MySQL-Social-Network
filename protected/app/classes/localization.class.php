<?php

class Localization
{
    protected $db_locale = '__str_locale';
    protected $db_dictionary = '__str_dictionary';

    public function getLocaleList()
    {
        return Q("SELECT * FROM `#" . $this->db_locale . "`")->all();
    }

    public function getDictionaryList($page = 0, $search = '')
    {
        $list = [];
        $pager = [];

        $pager['limit'] = 15;

        $where = '';

        if ($search)
        {
            $where = " AND (`key` LIKE '%".$search."%' OR `val` LIKE '%".$search."%')";
        }

        $pager['curr_page'] = $page;
        $pager['start_item'] = $pager['limit'] * $pager['curr_page'];
        $pager['all_items'] = Q("SELECT COUNT(`id`) AS `count` FROM `#".$this->db_dictionary."` WHERE `locale` LIKE 'ru' ".$where." LIMIT 1")->row('count');
        $pager['page_count'] = ceil($pager['all_items'] / $pager['limit']);

        $prn_limit = 12;

        if ($pager['page_count'] > 30)
        {
            if ($pager['all_items'] > $pager['limit']) {
                $pager['advanced'] = 1;
                $pager['arr_pages'] = [];

                $pager['first_page'] = '/' . ADMIN_DIR . '/locale/?page=0';
                $pager['last_page'] = '/' . ADMIN_DIR . '/locale/?page=' . ($pager['page_count'] - 1);

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
                        'qstring'   =>    '/' . ADMIN_DIR . '/locale/?page=' . $i
                   );
                }
            }
        } else {
            if ($pager['all_items'] > $pager['limit']) {
                $pager['arr_pages'] = [];

                for ($i = 0; $i < $pager['page_count']; $i++) {
                    $pager['arr_pages'][] = array(
                        'point'     =>    $i,
                        'qstring'   =>    '/' . ADMIN_DIR . '/locale/?page=' . $i
                   );
                }
            }
        }

        $temp = Q("SELECT * FROM `#" . $this->db_dictionary . "` WHERE 1 ".$where." GROUP BY `key` ORDER BY `id` DESC LIMIT ?i, ?i", [
            $pager['start_item'], $pager['limit']
        ])->all('key');

        $keys = implode(',', array_keys($temp));

        $temp = Q("SELECT * FROM `#" . $this->db_dictionary . "` WHERE FIND_IN_SET(`key`, ?s) ORDER BY `id` DESC", [
            $keys
        ])->all();

        if (!empty($temp))
        {
            foreach ($temp as $t_item) {
                if (!isset($list[$t_item['key']])) {
                    $list[$t_item['key']]['id'] = $t_item['id'];
                    $list[$t_item['key']]['system'] = $t_item['system'];
                }

                $list[$t_item['key']]['list'][$t_item['locale']] = $t_item['val'];
            }
        }

        return [
            'list'  => $list,
            'pager' => $pager
        ];
    }

    public function getDictionaryItem($key = '')
    {
        $item = [];
        $temp = Q("SELECT * FROM `#" . $this->db_dictionary . "` WHERE `key` LIKE ?s", array( $key ))->all();

        if (!empty($temp)) {
            foreach ($temp as $t_item) {
                if (!isset($item['key'])) {
                    $item['key'] = $t_item['key'];
                }

                if (!isset($item['system'])) {
                    $item['system'] = $t_item['system'];
                }

                $item[$t_item['locale']] = $t_item['val'];
            }
        }

        return $item;
    }

    public function deleteDictionaryItem($id = 0)
    {
        Q("DELETE FROM `#" . $this->db_dictionary . "` WHERE `id`=?i LIMIT 1", array( $id ));
    }

    public function insertData($data = [])
    {
        if (!empty($data)) {
            $key = '';

            if (!empty($data['key'])) {
                $key = preg_replace('/[^A-Za-z0-9]/', '.', strtolower($data['key']));
                $key = preg_replace('/\.+/', '.', $key);
                $key = rtrim($key, '.');
            }

            $system = $data['system'];

            foreach ($data['val'] as $lang => $value) {
                if ($value) {
                    $value = trim($value);

                    Q("INSERT INTO `#" . $this->db_dictionary . "` SET `key`=?s, `system`=?i, `locale`=?s, `val`=?s ON DUPLICATE KEY UPDATE `system`=?s, `val`=?s", array(
                        $key, $system, $lang, $value, $system, $value
                    ));
                }
            }

            return  $key;
        }

        return '';
    }
}
