<?php
/* Smarty version 3.1.32, created on 2018-12-24 16:50:27
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\view\modules\index\index.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c20e423e9b069_55198923',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '846d3da02c72de007ee27409a9a44777b3f6fd0e' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\view\\modules\\index\\index.tpl',
      1 => 1512138870,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5c20e423e9b069_55198923 (Smarty_Internal_Template $_smarty_tpl) {
?><table class="table" id="meta_data"><col><col width="270"><col width="160"><col width="140"><col width="120"><col width="80"><col width="60"><thead><tr class="th"><th colspan="7">Список модулей</th></tr></thead><tbody><tr><td class="h">Название модуля</td><td class="h">Системное имя</td><td class="h">Кол-во на странице</td><td class="h">Тип данных</td><td class="h">Тип таблицы</td><td class="h">Статус</td><td class="h"></td></tr><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['modules_list']->value, 'item', false, NULL, 'i', array (
));
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
?><tr class="row-<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
"><td><a href="<?php echo $_smarty_tpl->tpl_vars['base_path']->value;?>
/index/edit/<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
/" title="Редактировать" class="module-item-link"><i class="zmdi zmdi-edit"></i> <?php echo $_smarty_tpl->tpl_vars['item']->value['name'];?>
</a></td><td><?php echo $_smarty_tpl->tpl_vars['item']->value['sys_name'];?>
</td><td><?php echo $_smarty_tpl->tpl_vars['item']->value['pager'];?>
</td><td><?php if (isset($_smarty_tpl->tpl_vars['item']->value['type']) && $_smarty_tpl->tpl_vars['item']->value['type'] == 2) {?>SINGLE<?php } else { ?>MULTI<?php }?></td><td><?php echo $_smarty_tpl->tpl_vars['item']->value['storage'];?>
</td><td class="va_m"><span class="label <?php if (isset($_smarty_tpl->tpl_vars['item']->value['active']) && $_smarty_tpl->tpl_vars['item']->value['active'] == 1) {?>green<?php } else { ?>amber<?php }?>"><?php if (isset($_smarty_tpl->tpl_vars['item']->value['active']) && $_smarty_tpl->tpl_vars['item']->value['active'] == 1) {?>Активен<?php } else { ?>Не активен<?php }?></span></td><td class="va_m tac"><a href="<?php echo $_smarty_tpl->tpl_vars['base_path']->value;?>
/index/edit/<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
" class="zmdi zmdi-edit" title="Редактировать"></a><a href="<?php echo $_smarty_tpl->tpl_vars['base_path']->value;?>
/index/del/<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
" rel=".row-<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить модуль и все что связанно с ним?');" data-no-instant></a></td></tr><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></tbody></table><a href="<?php echo $_smarty_tpl->tpl_vars['base_path']->value;?>
/index/add" class="button button-purple"><i class="zmdi zmdi-plus-circle"></i>Добавить модуль</a><a href="<?php echo $_smarty_tpl->tpl_vars['base_path']->value;?>
/clean" class="button button-blue fr"><i class="zmdi zmdi-wrench"></i>Починить таблицы</a><?php }
}
