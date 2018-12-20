<?php
/*
* Smarty plugin
* -------------------­--------------------­--------------------­--
* Type: modifier
* Name: count_array
* Purpose: count the number of elements in an array
* -------------------­--------------------­--------------------­--
*/
function smarty_modifier_count_array($array, $k=0, $v=0, $offset=0)
{
    if (is_array($array)) {
        if (isset($k) && isset($v)) {
            $count = 0;
            foreach ($array as $item) {
                if ($item[$k] == $v) {
                    $count++;
                }
            }
            return $count+$offset;
        }
        return count($array);
    } else {
        return 0;
    }
}
