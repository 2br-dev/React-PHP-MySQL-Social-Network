<?php
/* Smarty version 3.1.32, created on 2019-02-22 09:56:30
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\view\structure\structure_tree.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c6f9d1e1f4dd5_64232868',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '48eda1c814f62e2bcfadaca0a6e4098f8f95b586' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\view\\structure\\structure_tree.tpl',
      1 => 1521468518,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5c6f9d1e1f4dd5_64232868 (Smarty_Internal_Template $_smarty_tpl) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['a_tree']->value, 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
$_smarty_tpl->_assignInScope('cookie', ('structure_collapse_').($_smarty_tpl->tpl_vars['item']->value['id']));?><li class="dd-item<?php ob_start();
echo $_smarty_tpl->tpl_vars['cookie']->value;
$_prefixVariable1 = ob_get_clean();
if (isset($_COOKIE[$_prefixVariable1])) {?> dd-collapsed<?php }?> dd-<?php if ($_smarty_tpl->tpl_vars['item']->value['visible'] == 0) {?>in-<?php }?>visible" id="node-<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
" data-id="<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
"><?php if (isset($_smarty_tpl->tpl_vars['item']->value['a_tree']) && !empty($_smarty_tpl->tpl_vars['item']->value['a_tree']) && $_smarty_tpl->tpl_vars['item']->value['sys_name'] !== 'main') {?><button data-action="collapse" type="button" class="dd-button dd-button__collapse"<?php ob_start();
echo $_smarty_tpl->tpl_vars['cookie']->value;
$_prefixVariable2 = ob_get_clean();
if (isset($_COOKIE[$_prefixVariable2])) {?> style="display: none;"<?php }?>></button><button data-action="expand" type="button" class="dd-button dd-button__expand"<?php ob_start();
echo $_smarty_tpl->tpl_vars['cookie']->value;
$_prefixVariable3 = ob_get_clean();
if (!isset($_COOKIE[$_prefixVariable3])) {?> style="display: none;"<?php }?>></button><?php }?>		<div class="dd-handle"></div><div class="dd-content"><?php if (!isset($_smarty_tpl->tpl_vars['item']->value['m_link'])) {
if ($_smarty_tpl->tpl_vars['item']->value['sys_name'] == 'main') {?><i class="zmdi zmdi-home page-icon"></i><?php } elseif (isset($_smarty_tpl->tpl_vars['item']->value['a_tree']) && !empty($_smarty_tpl->tpl_vars['item']->value['a_tree'])) {?><i class="zmdi zmdi-folder page-icon"></i><?php } elseif ($_smarty_tpl->tpl_vars['item']->value['mod_id']) {?><i class="zmdi zmdi-file page-icon"></i><?php } elseif ($_smarty_tpl->tpl_vars['item']->value['dynamic'] == 1) {?><i class="zmdi zmdi-apps page-icon"></i><?php } elseif ($_smarty_tpl->tpl_vars['item']->value['sys_name'] == 'search') {?><i class="zmdi zmdi-search page-icon"></i><?php } else { ?><i class="zmdi zmdi-file-text page-icon"></i><?php }
if ($_smarty_tpl->tpl_vars['item']->value['redirect'] || $_smarty_tpl->tpl_vars['item']->value['access'] || $_smarty_tpl->tpl_vars['item']->value['dynamic'] == 1) {?><div class="structure__flags"><?php if ($_smarty_tpl->tpl_vars['item']->value['access']) {?><span class="label label-sm bg-danger">Ограниченный доступ</span><?php }
if ($_smarty_tpl->tpl_vars['item']->value['redirect']) {?><span class="label label-sm deep-orange" title="Редирект на другую страницу">R &rarr; <?php echo $_smarty_tpl->tpl_vars['item']->value['redirect'];?>
</span><?php }
if ($_smarty_tpl->tpl_vars['item']->value['dynamic'] == 1) {?><span class="label label-sm bg-success" title="Получаем аргументы">A</span><?php }?></div><?php }?><a href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/<?php if (isset($_smarty_tpl->tpl_vars['item']->value['mid'])) {?>meta/edit/<?php echo $_smarty_tpl->tpl_vars['item']->value['mid'];?>
/<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
?backuri=/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/structure/<?php } else { ?>structure/index/edit/<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
/<?php echo $_smarty_tpl->tpl_vars['item']->value['sys_name'];?>
/<?php }?>" class="structure__link"><?php echo $_smarty_tpl->tpl_vars['item']->value['name'];?>
</a><span class="structure__plus js-structure-controll"><a href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/<?php if ($_smarty_tpl->tpl_vars['item']->value['mod_id']) {?>meta/add/<?php echo $_smarty_tpl->tpl_vars['item']->value['mod_id'];?>
?backuri=/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/structure/<?php } else { ?>structure/index/add/<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
/<?php }?>" class="structure__plus__add label bg-dark pos-rlt m-r-xs"><b class="arrow left b-dark pull-in"></b>+</a><span class="structure__control animate"><a href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/<?php if ($_smarty_tpl->tpl_vars['item']->value['mod_id']) {?>meta/add/<?php echo $_smarty_tpl->tpl_vars['item']->value['mod_id'];?>
?backuri=/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/structure/<?php } else { ?>structure/index/add/<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
/<?php }?>" class="structure__control__icon zmdi zmdi-file-plus" title="Добавить подраздел"></a><a href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/<?php if (isset($_smarty_tpl->tpl_vars['item']->value['mid'])) {?>meta/edit/<?php echo $_smarty_tpl->tpl_vars['item']->value['mid'];?>
/<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
?backuri=/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/structure/<?php } else { ?>structure/index/edit/<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
/<?php }?>" class="structure__control__icon zmdi zmdi-edit" title="Редактировать раздел"></a><a href="#" onclick="ajax_vis_toggle(this, <?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
,<?php if (isset($_smarty_tpl->tpl_vars['item']->value['mid'])) {
echo $_smarty_tpl->tpl_vars['item']->value['mid'];
} else { ?>0<?php }?>);return false;" class="structure__control__icon zmdi zmdi-eye<?php if ($_smarty_tpl->tpl_vars['item']->value['visible'] == 0) {?>-off<?php }?>" title="Отображение страницы"></a>						<a href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/<?php if (isset($_smarty_tpl->tpl_vars['item']->value['mid'])) {?>meta/del/<?php echo $_smarty_tpl->tpl_vars['item']->value['mid'];?>
/<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
?backuri=/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/structure/<?php } else { ?>structure/index/del/<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
/<?php }?>" class="structure__control__icon zmdi zmdi-delete" title="Удалить раздел" onclick="return cp.dialog('Вы действительно хотите удалить раздел?');" data-no-instant></a>					</span></span><?php }?></div><?php if (isset($_smarty_tpl->tpl_vars['item']->value['a_tree']) && !empty($_smarty_tpl->tpl_vars['item']->value['a_tree'])) {?><ol class="dd-list" id="item<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
"><?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['TPL_PATH']->value)."/structure_tree.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('a_tree'=>$_smarty_tpl->tpl_vars['item']->value['a_tree']), 0, true);
?></ol><?php }?></li><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
}
