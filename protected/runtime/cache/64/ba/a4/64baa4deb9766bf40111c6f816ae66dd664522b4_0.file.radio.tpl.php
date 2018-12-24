<?php
/* Smarty version 3.1.32, created on 2018-12-24 17:02:40
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\fields\radio.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c20e7000b4d64_67837324',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '64baa4deb9766bf40111c6f816ae66dd664522b4' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\fields\\radio.tpl',
      1 => 1469786304,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:system/controll.tpl' => 1,
  ),
),false)) {
function content_5c20e7000b4d64_67837324 (Smarty_Internal_Template $_smarty_tpl) {
if (isset($_smarty_tpl->tpl_vars['list']->value) && !empty($_smarty_tpl->tpl_vars['list']->value)) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['list']->value, 'e');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['e']->value) {
$_smarty_tpl->_assignInScope('checked', false);
if (($_smarty_tpl->tpl_vars['e']->value['value'] == $_smarty_tpl->tpl_vars['value']->value) || !$_smarty_tpl->tpl_vars['value']->value && $_smarty_tpl->tpl_vars['e']->value['default'] == 1) {
$_smarty_tpl->_assignInScope('checked', true);
}
$_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"radio",'name'=>$_smarty_tpl->tpl_vars['name']->value,'needle'=>$_smarty_tpl->tpl_vars['docs_item']->value['visible'],'checked'=>$_smarty_tpl->tpl_vars['checked']->value,'value'=>$_smarty_tpl->tpl_vars['e']->value['value'],'text'=>$_smarty_tpl->tpl_vars['e']->value['var']), 0, true);
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
}
}
