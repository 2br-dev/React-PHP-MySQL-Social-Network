<?php
/**
 * Smarty plugin
 * @package Smarty
 * @subpackage plugins
 */

// {uniqid}
function smarty_function_uniqid($params = '')
{
    return 'file_' . (!empty($params['query']) ? implode('_', $params['query']) : '') . str_replace('.', '_', uniqid()) ;
}
