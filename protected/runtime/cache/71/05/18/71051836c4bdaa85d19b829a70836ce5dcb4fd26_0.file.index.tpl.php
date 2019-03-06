<?php
/* Smarty version 3.1.32, created on 2019-03-06 14:52:59
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\view\meta\module\index.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c7fb49b271e30_79899827',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '71051836c4bdaa85d19b829a70836ce5dcb4fd26' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\view\\meta\\module\\index.tpl',
      1 => 1511963598,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:system/pager.tpl' => 1,
  ),
),false)) {
function content_5c7fb49b271e30_79899827 (Smarty_Internal_Template $_smarty_tpl) {
$_smarty_tpl->_checkPlugins(array(0=>array('file'=>'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\vendors\\smarty\\smarty\\libs\\plugins\\function.cycle.php','function'=>'smarty_function_cycle',),1=>array('file'=>'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\libs\\smarty.plugins\\modifier.add2query.php','function'=>'smarty_modifier_add2query',),));
if ((isset($_smarty_tpl->tpl_vars['modules']->value) && !empty($_smarty_tpl->tpl_vars['modules']->value)) || (isset($_smarty_tpl->tpl_vars['groups']->value) && !empty($_smarty_tpl->tpl_vars['groups']->value))) {?><div class="button-container clearfix"><?php if (isset($_smarty_tpl->tpl_vars['groups']->value) && !empty($_smarty_tpl->tpl_vars['groups']->value)) {?><div class="mb40"></div><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['groups']->value, 'item', false, NULL, 'item', array (
  'last' => true,
  'iteration' => true,
  'total' => true,
));
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
$_smarty_tpl->tpl_vars['__smarty_foreach_item']->value['iteration']++;
$_smarty_tpl->tpl_vars['__smarty_foreach_item']->value['last'] = $_smarty_tpl->tpl_vars['__smarty_foreach_item']->value['iteration'] === $_smarty_tpl->tpl_vars['__smarty_foreach_item']->value['total'];
?><div class="fieldset<?php if ((isset($_smarty_tpl->tpl_vars['__smarty_foreach_item']->value['last']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_item']->value['last'] : null)) {?> mb10<?php }?> fieldset-<?php echo smarty_function_cycle(array('values'=>'red,blue,green,purple,orange,pink','name'=>'fieldset'),$_smarty_tpl);?>
 clearfix"><span class="fieldset-caption"><?php echo $_smarty_tpl->tpl_vars['item']->value['name'];?>
</span><div class="fieldset-content"><?php if (isset($_smarty_tpl->tpl_vars['item']->value['modules']) && !empty($_smarty_tpl->tpl_vars['item']->value['modules'])) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['item']->value['modules'], 'i', false, 'id');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['id']->value => $_smarty_tpl->tpl_vars['i']->value) {
if (is_array($_smarty_tpl->tpl_vars['i']->value)) {?><a href="<?php echo $_smarty_tpl->tpl_vars['base_path']->value;?>
/module/list/<?php echo $_smarty_tpl->tpl_vars['id']->value;?>
" class="button button-<?php echo smarty_function_cycle(array('values'=>'red,blue,green,purple,orange,pink','name'=>'color'),$_smarty_tpl);?>
"><i class="zmdi zmdi-link"></i><?php echo $_smarty_tpl->tpl_vars['i']->value['name'];?>
 <span class="baloon"><?php echo $_smarty_tpl->tpl_vars['i']->value['count'];?>
</span></a><?php }
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}?></div></div><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
if (isset($_smarty_tpl->tpl_vars['modules']->value) && !empty($_smarty_tpl->tpl_vars['modules']->value)) {?><div class="clearfix"></div><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['modules']->value, 'item', false, NULL, 'i', array (
));
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
?><a href="<?php echo $_smarty_tpl->tpl_vars['base_path']->value;?>
/module/list/<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
" class="button button-<?php echo smarty_function_cycle(array('values'=>'red,blue,green,purple,orange,pink','name'=>'color'),$_smarty_tpl);?>
"><i class="zmdi zmdi-link"></i><?php echo $_smarty_tpl->tpl_vars['item']->value['name'];?>
 <span class="baloon"><?php echo $_smarty_tpl->tpl_vars['item']->value['count'];?>
</span></a><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}?></div><?php } else {
$_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['TPL_PATH']->value)."/module/filter.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
if ($_smarty_tpl->tpl_vars['meta_sort']->value) {
$_smarty_tpl->_assignInScope('moduleSorter', "module_sorted_".((string)$_smarty_tpl->tpl_vars['module_id']->value));
if ($_smarty_tpl->tpl_vars['moduleSorter']->value) {
$_smarty_tpl->_assignInScope('mSort', unserialize($_smarty_tpl->tpl_vars['moduleSorter']->value));
}
$_smarty_tpl->_assignInScope('module_id', $_smarty_tpl->tpl_vars['module_id']->value);
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['meta_sort']->value, 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
$_smarty_tpl->_assignInScope('mSysName', $_smarty_tpl->tpl_vars['item']->value['sys_name']);?><div>"<?php echo $_smarty_tpl->tpl_vars['item']->value['name'];?>
"<br /><select name="<?php echo $_smarty_tpl->tpl_vars['item']->value['sys_name'];?>
" onchange="setModuleSort(this, '<?php echo $_smarty_tpl->tpl_vars['module_id']->value;?>
', '<?php echo $_smarty_tpl->tpl_vars['item']->value['sys_name'];?>
')"><option value="">..выбрать</option><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['item']->value['list'], 'it', false, 'k');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['k']->value => $_smarty_tpl->tpl_vars['it']->value) {
?><option value="<?php echo $_smarty_tpl->tpl_vars['k']->value;?>
"<?php if (isset($_smarty_tpl->tpl_vars['mSort']->value[$_smarty_tpl->tpl_vars['module_id']->value][$_smarty_tpl->tpl_vars['mSysName']->value]) && $_smarty_tpl->tpl_vars['mSort']->value[$_smarty_tpl->tpl_vars['module_id']->value][$_smarty_tpl->tpl_vars['mSysName']->value] == $_smarty_tpl->tpl_vars['k']->value) {?> selected="selected"<?php }?>><?php echo $_smarty_tpl->tpl_vars['it']->value;?>
 </option><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></select></div><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?><div><b>Отобрать по</b></div><?php }
if ($_smarty_tpl->tpl_vars['is_recursive']->value) {?><p><b>Показывать:</b><?php if (isset($_COOKIE['show_as']) && $_COOKIE['show_as'] == 'table') {?><span class="show_as_table">таблицей</span><a href="<?php echo smarty_modifier_add2query($_SERVER['QUERY_STRING'],'show_as=tree');?>
" class="show_as_tree" onclick="setCookie('show_as','tree');redirect();return false;">деревом</a><?php } elseif (isset($_COOKIE['show_as']) && $_COOKIE['show_as'] == 'tree') {?><a href="<?php echo smarty_modifier_add2query($_SERVER['QUERY_STRING'],'show_as=table');?>
" class="show_as_table" onclick="setCookie('show_as','table');redirect();return false;">таблицей</a><span class="show_as_tree">деревом</span><?php } else { ?><span class="show_as_table">таблицей</span><a href="<?php echo smarty_modifier_add2query($_SERVER['QUERY_STRING'],'show_as=tree');?>
" class="show_as_tree" onclick="setCookie('show_as','tree');redirect();return false;">деревом</a><?php }?></p><?php }
if (isset($_COOKIE['show_as']) && $_COOKIE['show_as'] == "tree" && $_smarty_tpl->tpl_vars['is_recursive']->value) {?><table class="table" id="meta_data"><tr class="th"><th><?php echo $_smarty_tpl->tpl_vars['meta_module']->value['name'];?>
</th></tr></table><ul class="structure"><?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['TPL_PATH']->value)."/module/tree.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('a_tree'=>$_smarty_tpl->tpl_vars['meta_list_tree']->value), 0, true);
?></ul><?php } else {
$_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['TPL_PATH']->value)."/module/table.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
}
$_smarty_tpl->_subTemplateRender("file:system/pager.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
}
