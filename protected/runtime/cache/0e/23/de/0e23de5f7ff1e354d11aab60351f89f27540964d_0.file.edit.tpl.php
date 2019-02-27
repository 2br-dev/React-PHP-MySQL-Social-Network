<?php
/* Smarty version 3.1.32, created on 2019-02-22 10:02:17
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\view\meta\module\edit.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c6f9e79515834_97741931',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '0e23de5f7ff1e354d11aab60351f89f27540964d' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\view\\meta\\module\\edit.tpl',
      1 => 1497752718,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:fields/meta.tpl' => 1,
    'file:system/group.tpl' => 1,
    'file:fields/".((string)$_smarty_tpl->tpl_vars[\'field\']->value).".tpl' => 1,
    'file:system/buttons.tpl' => 1,
  ),
),false)) {
function content_5c6f9e79515834_97741931 (Smarty_Internal_Template $_smarty_tpl) {
if (isset($_GET['msg']) && $_GET['msg'] == "apply") {?><div class="apply">Данные были успешно сохранены!</div><?php }?><form action="<?php echo $_smarty_tpl->tpl_vars['request_path']->value;?>
" method="post" enctype="multipart/form-data" name="meta_form" class="dropzone"><input type="hidden" name="form_action" value="edit"><input type="hidden" name="back_to_page" value="<?php if (isset($_GET['back_to_page']) && $_GET['back_to_page'] !== '') {
echo $_GET['back_to_page'];
} else { ?>0<?php }?>"><?php if (is_array($_smarty_tpl->tpl_vars['meta_enable']->value) || $_smarty_tpl->tpl_vars['meta_enable']->value === true) {
$_smarty_tpl->_subTemplateRender("file:fields/meta.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('title'=>$_smarty_tpl->tpl_vars['meta_enable']->value['meta_title'],'keywords'=>$_smarty_tpl->tpl_vars['meta_enable']->value['meta_keywords'],'description'=>$_smarty_tpl->tpl_vars['meta_enable']->value['meta_description'],'robots'=>$_smarty_tpl->tpl_vars['meta_enable']->value['meta_robots']), 0, false);
}?><table class="module"><col width="200"><col><thead><tr class="module__tr"><th class="module__th" colspan="2"><?php echo t('contents.title');?>
</th></tr></thead><tbody><?php $_smarty_tpl->_assignInScope('zindex', 1000);
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['meta_item']->value, 'item', false, NULL, 'i', array (
  'iteration' => true,
));
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
$_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration']++;
$_smarty_tpl->_assignInScope('zindex', $_smarty_tpl->tpl_vars['zindex']->value-1);
if ($_smarty_tpl->tpl_vars['item']->value['f_type'] !== 'meta' && $_smarty_tpl->tpl_vars['item']->value['f_sys_name'] !== 'meta_title' && $_smarty_tpl->tpl_vars['item']->value['f_sys_name'] !== 'meta_keywords' && $_smarty_tpl->tpl_vars['item']->value['f_sys_name'] !== 'meta_robots' && $_smarty_tpl->tpl_vars['item']->value['f_sys_name'] !== 'meta_description') {
if ($_smarty_tpl->tpl_vars['item']->value['f_sys_name'] == "visible") {?><tr class="module__tr"><td class="module__td module__td_strong"><?php echo $_smarty_tpl->tpl_vars['item']->value['f_name'];?>
:</td><td class="module__td"><?php $_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>$_smarty_tpl->tpl_vars['item']->value['f_sys_name'],'check'=>$_smarty_tpl->tpl_vars['item']->value['value'],'list'=>array(array('value'=>'1','text'=>"Да"),array('value'=>'0','text'=>"Нет",'default'=>true))), 0, true);
?></td></tr><?php } elseif ($_smarty_tpl->tpl_vars['item']->value['f_sys_name'] == "ord") {?><tr class="module__tr"><td class="module__td module__td_strong"><?php echo $_smarty_tpl->tpl_vars['item']->value['f_name'];?>
:</td><td class="module__td"><input name="<?php echo $_smarty_tpl->tpl_vars['item']->value['f_sys_name'];?>
" value="<?php echo $_smarty_tpl->tpl_vars['item']->value['value'];?>
" class="ord integer reducing-trigger"></td></tr><?php } elseif ($_smarty_tpl->tpl_vars['item']->value['f_sys_name'] != "id" && $_smarty_tpl->tpl_vars['item']->value['f_sys_name'] != "updated" && $_smarty_tpl->tpl_vars['item']->value['f_sys_name'] != "uid" && $_smarty_tpl->tpl_vars['item']->value['f_sys_name'] != "gid") {?><tr class="module__tr"><td class="module__td module__td_strong"><?php echo $_smarty_tpl->tpl_vars['item']->value['f_name'];?>
:</td><td class="module__td module__td_<?php echo $_smarty_tpl->tpl_vars['item']->value['f_type'];?>
"><div style="z-index: <?php echo $_smarty_tpl->tpl_vars['zindex']->value;?>
; position: relative;"><?php if (isset($_smarty_tpl->tpl_vars['item']->value['list'])) {
$_smarty_tpl->_assignInScope('list', $_smarty_tpl->tpl_vars['item']->value['list']);
} else {
$_smarty_tpl->_assignInScope('list', '');
}
$_smarty_tpl->_assignInScope('field', $_smarty_tpl->tpl_vars['item']->value['f_type']);
$_smarty_tpl->_assignInScope('f_width', $_smarty_tpl->tpl_vars['item']->value['f_width']);
$_smarty_tpl->_assignInScope('class_name', '');
if (isset($_smarty_tpl->tpl_vars['f_width']->value) && $_smarty_tpl->tpl_vars['f_width']->value > 0) {
$_smarty_tpl->_assignInScope('class_name', "width-".((string)$_smarty_tpl->tpl_vars['f_width']->value));
}
$_smarty_tpl->_subTemplateRender("file:fields/".((string)$_smarty_tpl->tpl_vars['field']->value).".tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('index'=>(isset($_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration'] : null),'fid'=>$_smarty_tpl->tpl_vars['item']->value['id'],'type'=>$_smarty_tpl->tpl_vars['item']->value['f_type'],'name'=>$_smarty_tpl->tpl_vars['item']->value['f_sys_name'],'value'=>$_smarty_tpl->tpl_vars['item']->value['value'],'list'=>$_smarty_tpl->tpl_vars['list']->value,'json'=>$_smarty_tpl->tpl_vars['item']->value['json'],'width'=>$_smarty_tpl->tpl_vars['item']->value['f_width'],'settings'=>$_smarty_tpl->tpl_vars['item']->value['f_settings'],'class_name'=>$_smarty_tpl->tpl_vars['class_name']->value), 0, true);
?></div></td></tr><?php }
}
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></tbody></table><?php $_smarty_tpl->_subTemplateRender("file:system/buttons.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?></form><?php }
}
