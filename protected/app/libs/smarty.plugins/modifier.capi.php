<?php

/**
 * Smarty plugin
 * @package Smarty
 * @subpackage plugins
 */

if (!function_exists('mb_ucfirst') && extension_loaded('mbstring')) {
    function mb_ucfirst($str, $encoding='UTF-8')
    {
        $str = mb_ereg_replace('^[\ ]+', '', $str);
        $str = mb_strtoupper(mb_substr($str, 0, 1, $encoding), $encoding).
               mb_substr($str, 1, mb_strlen($str), $encoding);
        return $str;
    }
}

function smarty_modifier_capi($string)
{
    return mb_ucfirst($string);
}
