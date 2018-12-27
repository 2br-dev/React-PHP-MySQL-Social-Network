<?php
/* Smarty version 3.1.32, created on 2018-12-27 15:36:43
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\view\users\index\edit.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c24c75b235e67_90056388',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '23eb2ce35483e1e8d66067ca362a4c7b6cfc0ce0' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\view\\users\\index\\edit.tpl',
      1 => 1511963600,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:system/group.tpl' => 1,
    'file:system/buttons.tpl' => 1,
  ),
),false)) {
function content_5c24c75b235e67_90056388 (Smarty_Internal_Template $_smarty_tpl) {
?><form method="post" id="form_usr"><input type="hidden" name="action" value="user_edit"><table class="table"><col width="200"><col><thead><tr><th colspan="2">Редактирование пользователя</th></td></thead><tr><td class="h hl">Пользователь <span class="ness_color">*</span></td><td><input name="name" class="w50 ness" value="<?php echo $_smarty_tpl->tpl_vars['userinf']->value['name'];?>
"></td></tr><tr><td class="h hl">Группа <span class="ness_color">*</span></td><td><div class="width-50"><select name="gid" class="ness"><option value="0"<?php if (isset($_COOKIE['users_gid']) && $_COOKIE['users_gid'] == 0) {?> selected="selected"<?php }?>>..выбрать</option><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['usersGroups']->value, 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
?><option value="<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
"<?php if ($_smarty_tpl->tpl_vars['userinf']->value['gid'] == $_smarty_tpl->tpl_vars['item']->value['id']) {?> selected="selected"<?php }?>><?php echo $_smarty_tpl->tpl_vars['item']->value['name'];?>
</option><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></select></div></td></tr><tr><td class="h hl">Логин</td><td><input name="login" class="w50" value="<?php echo $_smarty_tpl->tpl_vars['userinf']->value['login'];?>
"></td></tr><tr><td class="h hl">E-mail <span class="ness_color">*</span></td><td><input name="email" class="w50 ness" value="<?php echo $_smarty_tpl->tpl_vars['userinf']->value['email'];?>
"></td></tr><tr><td class="h hl">Сменить пароль</td><td><input name="password" id="password" class="w25"><a href="#" onclick="return secret('#password')" class="button button-purple button-icon"><i class="zmdi zmdi-refresh"></i></a></td></tr><tr><td class="h hl">Активен</td><td><?php $_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>"active",'check'=>$_smarty_tpl->tpl_vars['userinf']->value['active'],'list'=>array(array('value'=>'1','text'=>"Да"),array('value'=>'0','text'=>"Нет",'default'=>true))), 0, false);
?></td></tr><?php if ($_smarty_tpl->tpl_vars['additions']->value) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['additions']->value, 'addition', false, NULL, 'i', array (
  'iteration' => true,
));
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['addition']->value) {
$_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration']++;
?><tr><td class="h hl"><?php echo $_smarty_tpl->tpl_vars['addition']->value['name'];?>
</td><td><?php if (isset($_smarty_tpl->tpl_vars['addition']->value['list'])) {
$_smarty_tpl->_assignInScope('list', $_smarty_tpl->tpl_vars['addition']->value['list']);
} else {
$_smarty_tpl->_assignInScope('list', '');
}
if (isset($_smarty_tpl->tpl_vars['userinf']->value[$_smarty_tpl->tpl_vars['addition']->value['sys_name']])) {
$_smarty_tpl->_assignInScope('value', $_smarty_tpl->tpl_vars['userinf']->value[$_smarty_tpl->tpl_vars['addition']->value['sys_name']]);
} else {
$_smarty_tpl->_assignInScope('value', '');
}
$_smarty_tpl->_assignInScope('field', $_smarty_tpl->tpl_vars['addition']->value['f_type']);
$_smarty_tpl->_assignInScope('class_name', "w50");
$_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['TPL_PATH']->value)."/fields/".((string)$_smarty_tpl->tpl_vars['field']->value).".tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('index'=>(isset($_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration'] : null),'fid'=>$_smarty_tpl->tpl_vars['item']->value['id'],'type'=>$_smarty_tpl->tpl_vars['addition']->value['f_type'],'name'=>$_smarty_tpl->tpl_vars['addition']->value['sys_name'],'list'=>$_smarty_tpl->tpl_vars['list']->value,'value'=>$_smarty_tpl->tpl_vars['value']->value,'class_name'=>$_smarty_tpl->tpl_vars['class_name']->value), 0, true);
?></td></tr><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}?></table><?php $_smarty_tpl->_subTemplateRender("file:system/buttons.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?></form><?php }
}
