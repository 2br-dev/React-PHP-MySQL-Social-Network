<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     modifier.rus_date.php
 * Type:     modifier
 * Name:     rus_date
 * Purpose:  make date in text
 * -------------------------------------------------------------
 */
function smarty_modifier_rus_date($date)
{
    return Dates($date, 'ru');
}
