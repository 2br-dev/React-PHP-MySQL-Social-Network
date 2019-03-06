<?php
/* Smarty version 3.1.32, created on 2019-03-06 14:52:52
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\view\modules\_module.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c7fb4947be062_55144683',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '0ca0090295b041bc251de27e341e24d29573bf7a' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\view\\modules\\_module.tpl',
      1 => 1469786304,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:system/group.tpl' => 3,
  ),
),false)) {
function content_5c7fb4947be062_55144683 (Smarty_Internal_Template $_smarty_tpl) {
?><table class="table" id="meta_data"><col><col><col width="150"><col width="100"><col width="148"><col width="190"><col width="125"><col width="195"><thead><tr><th colspan="8">Добавление модуля</th></tr></thead><tbody><tr><td class="h"><?php echo t('titles.name');?>
 <span class="ness_color">*</span></td><td class="h">Системное имя  <span class="ness_color">*</span></td><td class="h">Тип таблицы</td><td class="h">Pager</td><td class="h">Тип</td><td class="h">Поле сортировки</td><td class="h">Порядок</td><td class="h">Статус</td></tr><tr><td class="va_t"><input name="name" value="<?php if (isset($_smarty_tpl->tpl_vars['mdd_module']->value['name'])) {
echo $_smarty_tpl->tpl_vars['mdd_module']->value['name'];
}?>" class="ness"></td><td class="va_t"><input name="sys_name" value="<?php if (isset($_smarty_tpl->tpl_vars['mdd_module']->value['sys_name'])) {
echo $_smarty_tpl->tpl_vars['mdd_module']->value['sys_name'];
}?>" class="ness"></td><td class="va_t"><?php if ($_smarty_tpl->tpl_vars['storage']->value) {?><select name="storage"<?php if (isset($_smarty_tpl->tpl_vars['mdd_module']->value['storage'])) {?> disabled<?php }?>><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['storage']->value, 'item', false, 'key', 'engine', array (
  'first' => true,
  'index' => true,
));
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['key']->value => $_smarty_tpl->tpl_vars['item']->value) {
$_smarty_tpl->tpl_vars['__smarty_foreach_engine']->value['index']++;
$_smarty_tpl->tpl_vars['__smarty_foreach_engine']->value['first'] = !$_smarty_tpl->tpl_vars['__smarty_foreach_engine']->value['index'];
?><option value="<?php echo $_smarty_tpl->tpl_vars['key']->value;?>
"<?php if ((isset($_smarty_tpl->tpl_vars['mdd_module']->value['storage']) && $_smarty_tpl->tpl_vars['mdd_module']->value['storage'] == $_smarty_tpl->tpl_vars['key']->value) || (isset($_smarty_tpl->tpl_vars['__smarty_foreach_engine']->value['first']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_engine']->value['first'] : null)) {?> selected="selected"<?php }?>><?php echo $_smarty_tpl->tpl_vars['item']->value;?>
</option><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></select><?php }?></td><td class="va_t"><input name="pager" value="<?php if (isset($_smarty_tpl->tpl_vars['mdd_module']->value['pager'])) {
echo $_smarty_tpl->tpl_vars['mdd_module']->value['pager'];
} else { ?>10<?php }?>" data-reducing="1" class="integer reducing-trigger"></td><td class="va_t"><?php $_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>"type",'check'=>$_smarty_tpl->tpl_vars['mdd_module']->value['type'],'list'=>array(array('value'=>'1','text'=>"MULTI",'default'=>true),array('value'=>'2','text'=>"SINGLE"))), 0, false);
?></td><td class="va_t"><input name="ord" value="<?php if (isset($_smarty_tpl->tpl_vars['mdd_module']->value['ord'])) {
echo $_smarty_tpl->tpl_vars['mdd_module']->value['ord'];
} else { ?>created<?php }?>" class="x-ord fl"><?php $_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>"ord_type",'check'=>$_smarty_tpl->tpl_vars['mdd_module']->value['ord_type'],'list'=>array(array('value'=>'ASC','text'=>"ASC",'default'=>true),array('value'=>'DESC','text'=>"DESC"))), 0, true);
?></td><td class="va_t"><input name="order" value="<?php if (isset($_smarty_tpl->tpl_vars['mdd_module']->value['order'])) {
echo $_smarty_tpl->tpl_vars['mdd_module']->value['order'];
} else { ?>10<?php }?>" class="integer reducing-trigger"></td><td class="va_t"><?php $_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>"active",'check'=>$_smarty_tpl->tpl_vars['mdd_module']->value['active'],'list'=>array(array('value'=>'1','text'=>"Активен",'default'=>true),array('value'=>'0','text'=>"Не активен"))), 0, true);
?></td></tr></tbody></table><?php }
}
