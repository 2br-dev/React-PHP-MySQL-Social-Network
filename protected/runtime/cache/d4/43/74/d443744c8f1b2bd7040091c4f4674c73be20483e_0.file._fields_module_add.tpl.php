<?php
/* Smarty version 3.1.32, created on 2019-01-14 12:19:52
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\view\modules\_fields_module_add.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c3c54388787d9_32832472',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'd443744c8f1b2bd7040091c4f4674c73be20483e' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\view\\modules\\_fields_module_add.tpl',
      1 => 1512138868,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:system/group.tpl' => 1,
    'file:system/controll.tpl' => 3,
  ),
),false)) {
function content_5c3c54388787d9_32832472 (Smarty_Internal_Template $_smarty_tpl) {
?><table class="t1 table module-table" id="mdd_fields"><col><col width="150"><col width="240"><col width="320"><col width="85"><col width="80"><col width="35"><col width="35"><col width="35"><thead><tr><th colspan="9">Добавление полей</th></tr></thead><tbody><tr><td class="h">Название поля</td><td class="h">Системное имя</td><td class="h">Тип поля</td><td class="h">Дополнительно</td><td class="h">Порядок</td><td class="h">В списке</td><td class="h"><span class="mysql-index"></span></td><td class="h"><span class="mysql-unique"></span></td><td class="h"></td></tr><tr id="tr1"><td class="va_t"><input name="f_name[1]" class="ness"></td><td class="va_t"><input name="f_sys_name[1]" class="ness"></td><td class="va_t"><select name="f_type[1]" data-placeholder="Тип поля" class="ness" id="fieldtype_1" onchange="select_type(this)"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['mmd_fields_type']->value, 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
?><option value="<?php echo $_smarty_tpl->tpl_vars['item']->value['sys_name'];?>
"><?php echo $_smarty_tpl->tpl_vars['item']->value['type'];?>
</option><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></select></td><td class="addition va_t"><?php $_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>"f_width[1]",'list'=>array(array('value'=>'25','text'=>"25%"),array('value'=>'50','text'=>"50%"),array('value'=>'75','text'=>"75%"),array('value'=>'100','text'=>"100%",'default'=>true))), 0, false);
?></td><td class="va_m"><input name="f_ord[1]" value="0" class="integer"></td><td class="va_m tac"><?php $_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'addclass'=>"controll_single",'name'=>"f_in_list[1]"), 0, false);
?><td class="va_m tac"><?php $_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'addclass'=>"controll_single",'name'=>"f_index[1]"), 0, true);
?></td><td class="va_m tac"><?php $_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'addclass'=>"controll_single",'name'=>"f_unique[1]"), 0, true);
?></td><td class="va_t tac"></td></tr><tr id="add_btn"><td colspan="9"><a onclick="add_fields();return false;" class="button-link fr" title="Добавить" href="#"><span class="zmdi zmdi-plus-circle"></span> Добавить</a></td></tr></tbody></table><?php echo '<script'; ?>
 type="text/javascript">var field_counter = 1, arr_field_type = [];<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['mmd_fields_type']->value, 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
?>arr_field_type['<?php echo $_smarty_tpl->tpl_vars['item']->value['sys_name'];?>
'] = '<?php echo $_smarty_tpl->tpl_vars['item']->value['type'];?>
';<?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
echo '</script'; ?>
><?php }
}
