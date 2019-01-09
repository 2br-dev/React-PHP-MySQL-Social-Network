<?php
/* Smarty version 3.1.32, created on 2019-01-09 13:14:17
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\fields\date.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c35c9797614d1_95448678',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '6fe27849056dd5263d20438720301d9699b09de4' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\fields\\date.tpl',
      1 => 1511963596,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5c35c9797614d1_95448678 (Smarty_Internal_Template $_smarty_tpl) {
?><div class="calendar input-group"><input name="<?php echo $_smarty_tpl->tpl_vars['name']->value;?>
" value="<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['value']->value, ENT_QUOTES, 'UTF-8', true);?>
" <?php if (isset($_smarty_tpl->tpl_vars['onchange']->value)) {?> onchange="<?php echo $_smarty_tpl->tpl_vars['onchange']->value;?>
"<?php }?> class="calendar-input<?php if (isset($_smarty_tpl->tpl_vars['class_name']->value)) {?> <?php echo $_smarty_tpl->tpl_vars['class_name']->value;
}?>" <?php if (isset($_smarty_tpl->tpl_vars['settings']->value['f_date_format'])) {?> data-format="<?php echo $_smarty_tpl->tpl_vars['settings']->value['f_date_format'];?>
"<?php }?> tabindex="<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
"><span class="zmdi zmdi-calendar selector input-group-addon"></span></div><?php }
}
