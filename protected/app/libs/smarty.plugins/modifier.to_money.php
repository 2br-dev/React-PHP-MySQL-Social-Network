<?php
/**
 * Smarty plugin
 * @package Smarty
 * @subpackage plugins
 */

function smarty_modifier_to_money($string)
{
    if ($string != '') {
        return number_format($string, 0, ' ', ' ');
    } else {
        return '0';
    }
}
