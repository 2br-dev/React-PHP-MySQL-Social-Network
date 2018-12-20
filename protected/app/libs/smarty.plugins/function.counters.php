<?php

/**
 * Smarty plugin
 * @package Smarty
 * @subpackage plugins
 */

function smarty_function_counters($data = array(), &$smarty)
{
    $counters_file = PATH_RUNTIME . '/cache/counters.php';

    if (!file_exists($counters_file)) {
        $data = Q("SELECT `c`.`id`, `c`.`code`, `c`.`post_loading`, `t`.`template`
    				FROM `#__seo_counters` AS `c`
    				LEFT JOIN `#__seo_counters_type` AS `t` ON `t`.`system` LIKE `c`.`type`
    				WHERE `c`.`active`=1 ORDER BY `c`.`ord`")->all();

        foreach ($data as &$item) {
            $item['template'] = preg_replace('/<!--(.*)-->/Uis', '', $item['template']);
            $item['template'] = str_replace("'", '"', $item['template']);
            $item['template'] = str_replace('%code%', $item['code'], $item['template']);
        }

        $counters = '';
        $index = 0;

        foreach ($data as $item) {
            $index++;

            //$counters .= $item['template'] . '|' . $item['post_loading'];
            $counters .= $item['template'];

            if ($index < count($data)) {
                $counters .= "\n";
            }
        }

        file_put_contents($counters_file, $counters, LOCK_EX);
    } else {
        $counters = file_get_contents($counters_file);
    }

    if ($counters !== '') {
        echo $counters;
    }

    return;
    
    if ($counters !== '') {
        $counters = explode("\n", $counters);
        
        if (!empty($counters)) {
            $code = "";
            
            /* Pre-load */

            $pre_html = "";
            $pre_script = "";
            
            /* Post-load */

            $post_html = "";
            $post_script = [];
            
            foreach ($counters as $item) {
                $item = trim($item);

                $type = substr($item, -1);
                $html = substr($item, 0, strlen($item)-2);

                if ($type == '1') {
                    $post_html .= preg_replace("/<script.*?\/script>/s", "", $html);
                    $post_script[] = strip_tags($html, 'script');
                } else {
                    $pre_html .= preg_replace("/<script.*?\/script>/s", "", $html);
                    $pre_script .= strip_tags($html, 'script');
                }
            }

            $cid = 'cms-counters-' . md5(uniqid());
            $code .= "<div id='" . $cid . "'>";
            
            if ($post_html) {
                $code .= $post_html;
            }
            
            if (!empty($post_script)) {
                $code .= "<script async defer>";
                $code .= "setTimeout(function(){";
                $code .= "(function(d, id) {";
                
                foreach ($post_script as $i => $s) {
                    $code .= "var js" . $i . " = d.createElement('script');";
                    $code .= "js" . $i . ".defer = 'defer';";
                    $code .= "js" . $i . ".async = 'async';";
                    $code .= "js" . $i . ".innerHTML = '" . $s . "';";
                    $code .= "d.getElementById(id).appendChild(js" . $i . ");";
                }

                $code .= "}(document, '" . $cid . "'));";
                $code .= "}, 50);";
                $code .= "</script>";
            }
            
            if ($pre_html) {
                $code .= $pre_html;
            }

            if ($pre_script) {
                $code .= $pre_script;
            }

            $code .= "</div>";
        
            echo $code;
        }
    }
}
