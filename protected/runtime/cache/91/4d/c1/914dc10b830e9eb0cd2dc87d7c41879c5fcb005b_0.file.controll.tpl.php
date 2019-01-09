<?php
/* Smarty version 3.1.32, created on 2019-01-09 17:54:18
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\system\controll.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c360b1aa01b90_68178876',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '914dc10b830e9eb0cd2dc87d7c41879c5fcb005b' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\system\\controll.tpl',
      1 => 1522934086,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5c360b1aa01b90_68178876 (Smarty_Internal_Template $_smarty_tpl) {
?><label class="controll<?php if ($_smarty_tpl->tpl_vars['addclass']->value) {?> <?php echo $_smarty_tpl->tpl_vars['addclass']->value;
}?>"<?php if ($_smarty_tpl->tpl_vars['id']->value) {?> id="<?php echo $_smarty_tpl->tpl_vars['id']->value;?>
"<?php }
if ($_smarty_tpl->tpl_vars['title']->value) {?> title="<?php echo $_smarty_tpl->tpl_vars['title']->value;?>
"<?php }?>><input type="<?php echo $_smarty_tpl->tpl_vars['type']->value;?>
" class="controll__input<?php if ($_smarty_tpl->tpl_vars['ctrlclass']->value) {?> <?php echo $_smarty_tpl->tpl_vars['ctrlclass']->value;
}?>"<?php if (isset($_smarty_tpl->tpl_vars['value']->value)) {?> value="<?php echo $_smarty_tpl->tpl_vars['value']->value;?>
"<?php }
if ($_smarty_tpl->tpl_vars['onchange']->value) {?> onchange="<?php echo $_smarty_tpl->tpl_vars['onchange']->value;?>
"<?php }
if ($_smarty_tpl->tpl_vars['ctrlid']->value) {?> id="<?php echo $_smarty_tpl->tpl_vars['ctrlid']->value;?>
"<?php }
if ($_smarty_tpl->tpl_vars['name']->value) {?> name="<?php echo $_smarty_tpl->tpl_vars['name']->value;?>
"<?php }
if ((isset($_smarty_tpl->tpl_vars['needle']->value) && $_smarty_tpl->tpl_vars['needle']->value == $_smarty_tpl->tpl_vars['value']->value) || (isset($_smarty_tpl->tpl_vars['checked']->value) && $_smarty_tpl->tpl_vars['checked']->value === true)) {?> checked<?php }?>><span class="controll__visible controll__visible_<?php echo $_smarty_tpl->tpl_vars['type']->value;
if ($_smarty_tpl->tpl_vars['content']->value) {?> controll__visible--contented<?php }?>"><?php if ($_smarty_tpl->tpl_vars['content']->value) {
echo $_smarty_tpl->tpl_vars['content']->value;
}?></span><?php if ($_smarty_tpl->tpl_vars['text']->value) {?><span class="controll__text"><?php echo $_smarty_tpl->tpl_vars['text']->value;?>
</span><?php }?></label><?php if ($_smarty_tpl->tpl_vars['hint']->value) {?><span class="controll__hint"><?php echo $_smarty_tpl->tpl_vars['hint']->value;?>
</span><?php }
}
}
