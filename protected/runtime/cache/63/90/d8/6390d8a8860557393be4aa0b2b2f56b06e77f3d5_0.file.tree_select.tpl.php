<?php
/* Smarty version 3.1.32, created on 2018-12-24 10:54:46
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\view\structure\tree_select.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c2090c6695141_97005621',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '6390d8a8860557393be4aa0b2b2f56b06e77f3d5' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\view\\structure\\tree_select.tpl',
      1 => 1521233732,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5c2090c6695141_97005621 (Smarty_Internal_Template $_smarty_tpl) {
$_smarty_tpl->_checkPlugins(array(0=>array('file'=>'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\vendors\\smarty\\smarty\\libs\\plugins\\function.math.php','function'=>'smarty_function_math',),));
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['a_tree']->value, 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
?>
	<option value="<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
"<?php if ($_smarty_tpl->tpl_vars['curr_id']->value == $_smarty_tpl->tpl_vars['item']->value['id']) {?> selected="selected"<?php }?>>
		<?php
$__section_nbsp_0_loop = (is_array(@$_loop=$_smarty_tpl->tpl_vars['nbsp_count']->value) ? count($_loop) : max(0, (int) $_loop));
$__section_nbsp_0_total = $__section_nbsp_0_loop;
$_smarty_tpl->tpl_vars['__smarty_section_nbsp'] = new Smarty_Variable(array());
if ($__section_nbsp_0_total !== 0) {
for ($__section_nbsp_0_iteration = 1, $_smarty_tpl->tpl_vars['__smarty_section_nbsp']->value['index'] = 0; $__section_nbsp_0_iteration <= $__section_nbsp_0_total; $__section_nbsp_0_iteration++, $_smarty_tpl->tpl_vars['__smarty_section_nbsp']->value['index']++){
?>•<?php
}
}
?>
		<?php if ($_smarty_tpl->tpl_vars['nbsp_count']->value > 0) {?>&nbsp;<?php }?>
		<?php echo $_smarty_tpl->tpl_vars['item']->value['name'];?>

	</option>

	<?php if ($_smarty_tpl->tpl_vars['item']->value['a_tree']) {?>
		<?php echo smarty_function_math(array('equation'=>"x+y",'x'=>$_smarty_tpl->tpl_vars['nbsp_count']->value,'y'=>3,'assign'=>"nbsp_count"),$_smarty_tpl);?>


        <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['TPL_PATH']->value)."/tree_select.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('a_tree'=>$_smarty_tpl->tpl_vars['item']->value['a_tree'],'nbsp_count'=>$_smarty_tpl->tpl_vars['nbsp_count']->value,'curr_id'=>$_smarty_tpl->tpl_vars['curr_id']->value), 0, true);
?>

		<?php echo smarty_function_math(array('equation'=>"x-y",'x'=>$_smarty_tpl->tpl_vars['nbsp_count']->value,'y'=>3,'assign'=>"nbsp_count"),$_smarty_tpl);?>

	<?php }
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
}
