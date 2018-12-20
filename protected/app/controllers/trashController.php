<?php

final class trashController extends CPLoader
{
    use Singleton;
    
    public function __construct()
    {
        parent::__construct();
    }
    
    public function index()
    {
        $back_to_page   = __get('back_to_page');
        $page = isset($_GET['page']) ? intval($_GET['page']) : 0 ;
        $limit = 10;

        if ($this->method == 'recovery' && $id) {
            if ($back_to_page) {
                redirect("./?page=" . $back_to_page);
            }
            
            exit(" recovery " . $id);
        } elseif ($this->method == 'remove' && $id) {
            Q("DELETE FROM `#__str_trush` WHERE `id`=?i LIMIT 1", array( $id ));
            
            if ($back_to_page) {
                $count = Q("SELECT COUNT(*) as `count` FROM `#__str_trush` LIMIT 1")->row('count');
                $pages = ceil($count / $limit);
                
                if ($pages == $back_to_page && $back_to_page > 0) {
                    $back_to_page--;
                }
                
                redirect("./?page=" . $back_to_page);
            }
        } else {
            $start = $page * $limit;

            $list = Q("SELECT `id`, `desc`, `sql`, `date`, `uid` FROM `#__str_trush` LIMIT ?i, ?i", array( $start, $limit ))->all();
            
            if (!empty($list)) {
                $users = Q("SELECT `id`, `name` FROM `#__usr_users`")->all('id');
                
                foreach ($list as $k => $v) {
                    $list[ $k ]['user'] = isset($users[ $v['id'] ]['name']) ? $users[ $v['id'] ]['name'] : $v['uid'] ;
                }
            }
            
            $count = Q("SELECT COUNT(*) as `count` FROM `#__str_trush` LIMIT 1")->row('count');
            
            if ($count > $limit) {
                $pager = [];
                
                $pager['page_count'] = ceil($count / $limit);
                $pager['curr_page'] = $page;
                $pager['arr_pages'] = [];
                
                for ($i = 0; $i < $pager['page_count']; $i++) {
                    $pager['arr_pages'][] = array(
                        'point'     =>    $i,
                        'qstring'   =>    '?page=' . $i
                   );
                }
                
                $info['pager_info'] = $pager ;
            }
            
            $info['list'] = $list ;
            $info['back_to_page'] = $page;
        }

        return $info;
    }
}
