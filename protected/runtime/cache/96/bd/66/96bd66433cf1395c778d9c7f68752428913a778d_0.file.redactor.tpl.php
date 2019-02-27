<?php
/* Smarty version 3.1.32, created on 2019-02-22 10:02:17
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\system\redactor.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c6f9e795b3312_10112807',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '96bd66433cf1395c778d9c7f68752428913a778d' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\system\\redactor.tpl',
      1 => 1515768446,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5c6f9e795b3312_10112807 (Smarty_Internal_Template $_smarty_tpl) {
if (!isset($_smarty_tpl->tpl_vars['redactor_type']->value)) {?>
    <?php $_smarty_tpl->_assignInScope('redactor_type', "imperavi");
}?>

<?php if ($_smarty_tpl->tpl_vars['redactor_type']->value == 'quill') {?>
<div id="<?php echo $_smarty_tpl->tpl_vars['redactor_id']->value;?>
-container" class="quill-container"><?php echo stripslashes($_smarty_tpl->tpl_vars['redactor_value']->value);?>
</div>
<?php }?>

<textarea name="<?php echo $_smarty_tpl->tpl_vars['redactor_name']->value;?>
" id="<?php echo $_smarty_tpl->tpl_vars['redactor_id']->value;?>
" class="redactor_<?php echo $_smarty_tpl->tpl_vars['redactor_type']->value;?>
 js-redactor" data-redactor="<?php echo $_smarty_tpl->tpl_vars['redactor_type']->value;?>
" style="min-height: 150px" rows="5" cols="50"><?php echo stripslashes($_smarty_tpl->tpl_vars['redactor_value']->value);?>
</textarea>

<?php }
}
