<?php

/**
 * Smarty plugin
 * @package Smarty
 * @subpackage plugins
 */

function smarty_modifier_highlight($string)
{
    $highlight = '';

    if (isset($_GET['highlight'])) {
        $highlight = strip_tags(trim($_GET['highlight']));
    }

    if ($highlight) {
        echo preg_replace('/' . $highlight .'/i', '<span class="highlight">' . $highlight . '</span>', $string);
    } else {
        echo $string;
    }
}
