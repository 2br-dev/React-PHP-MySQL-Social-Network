<?php
/**
 * Smarty plugin
 * @package Smarty
 * @subpackage plugins
 */

//{devtree from_id="6" class="service-list"}
function smarty_function_devtree($params, &$smarty)
{
    // be sure from_id parameter is present
    if (empty($params['from_id'])) {
        $smarty->trigger_error("devtree: missing from_id parameter");
        return;
    }
    $id = $params['from_id'];
    
    // be sure class parameter is present
    if (!empty($params['class'])) {
        $class = $params['class'];
    }

    if (!empty($params['current'])) {
        $current = $params['current'];
    }

    $str = "" ;
    $str .= isset($class) ? '<ul class="'.$class.'">' : '<ul>' ;
    if (isset($id) && $id != "") {
        $tree = Q("SELECT * FROM `#__str_structure` WHERE `pid`='".$id."' AND `visible`='1' ")->all();
    } else {
        $tree = Q("SELECT * FROM `#__str_structure` WHERE `pid`='1' AND `visible`='1' ")->all();
    }
    
    if (!empty($tree)) {
        $link = getLink2($id, array( "/" )) ;
        
        if (!empty($link)) {
            $tmp = [];
            foreach ($link as $k => $v) {
                if ($v != '/') {
                    $tmp[] = $v;
                }
            }
            $link = $tmp;
        }
        
        $count = count($tree) - 1;
        foreach ($tree as $k => $v) {
            $curr = $current == $v['sys_name'] ? 'class="current"' : '' ;
            $cls = ($count == $k) ? ' class="last-child"' : '';
            $str .= '<li'. $cls .'><a href="/'.implode("/", $link) . '/' . $v['sys_name'].'/" '. $curr .'>'.$v['name'] .'</a></li>' ;
        }
    }
    $str .= '</ul>' ;
    echo $str ;
}

function getLink2($id, $arr)
{
    $q = new Mysql("SELECT `pid`,`sys_name` FROM `#__str_structure` WHERE `id`='".$id."' LIMIT 1 ") ;
    if ($q->nf()) {
        $q->next_record() ;
    
        $result = array_merge($arr, array( $q->f('sys_name') )) ;
        
        if ($q->f('pid') != '0') {
            getLink2($q->f('pid'), $result) ;
        }
    }
    return $result ;
}
