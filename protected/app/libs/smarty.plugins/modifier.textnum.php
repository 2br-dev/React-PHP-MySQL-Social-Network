<?php
/**
 * Smarty plugin
 * @package Smarty
 * @subpackage plugins
 */


/**
 * Smarty regex_replace modifier plugin
 *
 * Type:     modifier<br>
 * Name:     regex_replace<br>
 * Purpose:  regular epxression search/replace
 * @link http://smarty.php.net/manual/en/language.modifier.regex.replace.php
 *          regex_replace (Smarty online manual)
 * @param string
 * @param string|array
 * @param string|array
 * @return string
 */
function smarty_modifier_textnum($string, $first, $second, $third)
{
    if (@preg_match("/[1]+$/", $string) && $string != "11") {
        $string = $string."&nbsp;".$first;
    } elseif (@preg_match("/[234]+$/", $string) && $string != "12" && $string != "13" && $string != "14") {
        $string = $string."&nbsp;".$second;
    } elseif (@preg_match("/[1234567890]+$/", $string)) {
        $string = $string."&nbsp;".$third;
    }
    return $string;
}

/* vim: set expandtab: */
