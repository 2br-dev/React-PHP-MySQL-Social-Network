<?php
/**
 * Smarty plugin
 * @package Smarty
 * @subpackage plugins
 */

function smarty_modifier_site($string)
{
    return 'http://www.'.str_replace(['http://', 'www.'], '', $string);
}
