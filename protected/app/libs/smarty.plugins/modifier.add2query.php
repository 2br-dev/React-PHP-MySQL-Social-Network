<?php
/*
    s0lar
*/
function smarty_modifier_add2query($query, $str, $toggle=false)
{
    $arr = explode("=", $str);
    $tmp = $_GET;
    if (isset($arr[0]) && $arr[0] != "" && isset($arr[1])) {
        if ($toggle && isset($tmp[$arr[0]])) {
            unset($tmp[$arr[0]]);
        } else {
            $tmp[$arr[0]] = $arr[1];
        }
        $str = "?";
        foreach ($tmp as $k=>$v) {
            $str .= $k."=".$v."&";
        }
        $str = substr($str, 0, -1);
    }
    return $str;
}
