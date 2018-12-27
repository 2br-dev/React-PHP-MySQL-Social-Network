<?php
/* Smarty version 3.1.32, created on 2018-12-27 15:36:40
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\view\users\index\index.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c24c75854dcb6_63199976',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'f59385c9cd50b3ca2d2ffd4341f2086fe7a72cb7' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\view\\users\\index\\index.tpl',
      1 => 1512138870,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:system/pager.tpl' => 1,
  ),
),false)) {
function content_5c24c75854dcb6_63199976 (Smarty_Internal_Template $_smarty_tpl) {
?><table class="table"><col><col><col><col width="200"><col width="75"><col width="155"><col width="65"><thead><tr><th>Пользователь</th><th>Логин</th><th>Группа</th><th>E-mail</th><th>Активен</th><th>Дата регистрации</th><th></th></tr></thead><tbody><?php if (!empty($_smarty_tpl->tpl_vars['usersList']->value)) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['usersList']->value, 'item', false, NULL, 'i', array (
));
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
?><tr><td><a href="<?php echo $_smarty_tpl->tpl_vars['base_path']->value;?>
/index/edit/<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
/" title="Редактировать" class="module-item-link"><i class="zmdi zmdi-edit"></i> <?php echo $_smarty_tpl->tpl_vars['item']->value['user'];?>
</a></td><td><?php echo $_smarty_tpl->tpl_vars['item']->value['login'];?>
</td><td><?php echo $_smarty_tpl->tpl_vars['item']->value['group'];?>
</td><td><?php echo $_smarty_tpl->tpl_vars['item']->value['email'];?>
</td><td class="tac va_m"><?php if ($_smarty_tpl->tpl_vars['item']->value['active']) {?><span class="color-green">Да</span><?php } else { ?><span class="color-red">Нет</span><?php }?></td><td><?php echo $_smarty_tpl->tpl_vars['item']->value['created'];?>
</td><td class="tac"><a href="<?php echo $_smarty_tpl->tpl_vars['base_path']->value;?>
/index/edit/<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
/" class="zmdi zmdi-edit" title="Редактировать"></a><a href="<?php echo $_smarty_tpl->tpl_vars['base_path']->value;?>
/index/del/<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
/" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить пользователя?');" data-no-instant></a></td></tr><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
} else { ?><tr><td colspan="7" class="center-middle">Пользователей нет</td></tr><?php }?></tbody></table><a href="<?php echo $_smarty_tpl->tpl_vars['base_path']->value;?>
/index/add/" class="button"><i class="zmdi zmdi-plus-circle"></i>Добавить пользователя</a><?php $_smarty_tpl->_subTemplateRender("file:system/pager.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
