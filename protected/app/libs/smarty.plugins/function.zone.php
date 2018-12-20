<?php

/**
 * Smarty plugin
 * @package Smarty
 * @subpackage plugins
 */

//{zone item="journal" id=1}
function smarty_function_zone($params, &$smarty)
{
    if (empty($params['item'])) {
        return;
    }
    
    $locale = Tools::getLocale($_SERVER['REQUEST_URI']);
    
    $block = Q("SELECT `b`.`id`, `b`.`pages_on`, `b`.`pages_off`, `b`.`block_cont`, `b`.`module` FROM `#__blc_zone` as `z` LEFT JOIN `#__blc_blocks` as `b` ON `b`.`pid`=`z`.`id` WHERE `b`.`visible`=1 AND `z`.`visible`=1 AND `z`.`sys_name` LIKE ?s AND `b`.`locale` LIKE ?s ORDER BY `b`.`ord` ASC", array( $params['item'], $locale ))->all();
    
    $page = current(explode('?', $_SERVER['REQUEST_URI']));
    $path = preg_split('/\/+/', $page, -1, PREG_SPLIT_NO_EMPTY);

    $result = '';

    foreach ($block as $b_item) {
        if (($b_item['pages_on'] == '' || $b_item['pages_on'] !== '' && checkUrlLink($path, $b_item['pages_on']) === true) &&
            ($b_item['pages_off'] == '' || $b_item['pages_off'] !== '' && checkUrlLink($path, $b_item['pages_off']) === false)) {
            if ($b_item['module'] == '' || $b_item['module'] == '0' || $b_item['module'] == 0) {
                $result .= $smarty->fetch('eval:'.stripslashes($b_item['block_cont']));
            } else {
                $method = 'blockMethod';

                $module =
                    Q("SELECT
							`id`,
							`func_name`,
							`cache` " .
                        "FROM `#__mdd_binds` " .
                        "WHERE `id` = ?i " .
                        "LIMIT 1",
                    array($b_item['module']))->row();

                if (!empty($module) && !function_exists($module['func_name'])) {
                    $class = PATH_MODULE . '/' . $module['func_name'] . '/' . $module['func_name'] . 'Module.class.php';

                    if (file_exists($class)) {
                        require_once $class;
                    }

                    $controller = $module['func_name'] . 'Module';

                    if (class_exists($controller)) {
                        $controller = new $controller;
                        $controller->module = $module;

                        if (method_exists($controller, $method)) {
                            $data = $controller->{$method}();

                            if (!empty($data)) {
                                foreach ($data as $key => $val) {
                                    $smarty->assign($key, $val, true);
                                }
                            }

                            $template = isset($data['template']) ? $data['template'] : 'list';


                            if (file_exists(PATH_MODULE . '/' . $module['func_name'] . '/tpl/' . $template . '.tpl')) {
                                $result .= $smarty->fetch(PATH_MODULE . '/' . $module['func_name'] . '/tpl/' . $template . '.tpl');
                            }
                        }
                    }
                }
            }
        }
    }

    echo $result;
}
