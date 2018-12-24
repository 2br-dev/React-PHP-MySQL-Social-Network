<?php
/* Smarty version 3.1.32, created on 2018-12-24 10:54:46
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\view\structure\_fields_structure.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c2090c6347449_08593899',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '10b6b69986bc727731b1d507be7b46a63a161ff6' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\view\\structure\\_fields_structure.tpl',
      1 => 1512138870,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:system/group.tpl' => 4,
    'file:system/controll.tpl' => 3,
    'file:fields/datetime.tpl' => 1,
  ),
),false)) {
function content_5c2090c6347449_08593899 (Smarty_Internal_Template $_smarty_tpl) {
?><input type="hidden" name="_backuri" value="<?php echo $_smarty_tpl->tpl_vars['_backuri']->value;?>
"><table class="t1 table table-toggle-trigger" id="page_data"><col width="200"><col><thead><tr class="th"><th colspan="2"><a href="#" class="table_hdr table_u js-table-toggle" data-toggle="page_data"><i class="icon"></i> Настройки страницы</a></th></tr></thead><tbody><tr style="display: none;"><td class="h hl va_m">Название в меню <span class="ness_color">*</span></td><td><input name="stc_menuname" class="ness<?php if (isset($_smarty_tpl->tpl_vars['stc_errors']->value) && in_array('menuname',$_smarty_tpl->tpl_vars['stc_errors']->value)) {?> error<?php }?>" value="<?php if (isset($_smarty_tpl->tpl_vars['stc_page']->value['menuname'])) {
echo htmlspecialchars($_smarty_tpl->tpl_vars['stc_page']->value['menuname'], ENT_QUOTES, 'UTF-8', true);
}?>"></td></tr><tr class="th"><td class="h hl va_m">Название страницы <span class="ness_color">*</span></td><td rowspan="2"><div class="url"><div class="url__title"><input name="stc_name" class="ness<?php if (isset($_smarty_tpl->tpl_vars['stc_errors']->value) && in_array('name',$_smarty_tpl->tpl_vars['stc_errors']->value)) {?> error<?php }?>" value="<?php if (isset($_smarty_tpl->tpl_vars['stc_page']->value['name'])) {
echo htmlspecialchars($_smarty_tpl->tpl_vars['stc_page']->value['name'], ENT_QUOTES, 'UTF-8', true);
}?>"></div><div class="url__system"><?php if (isset($_smarty_tpl->tpl_vars['stc_page']->value['id']) && $_smarty_tpl->tpl_vars['stc_page']->value['id'] == 1) {?><input name="stc_sys_name" id="stc_sys_name" value="<?php if (isset($_smarty_tpl->tpl_vars['stc_page']->value['sys_name'])) {
echo $_smarty_tpl->tpl_vars['stc_page']->value['sys_name'];
}?>" disabled="disabled"><input type="hidden" name="stc_sys_name" value="main"><?php } else { ?><div class="url__lock"><span class="url__lock__switch <?php if ($_smarty_tpl->tpl_vars['method']->value == 'edit') {?>off<?php } else { ?>on<?php }?> js-toggle-binding" data-element="#stc_sys_name" title="Нажмите на замок, чтобы внести / запретить изменения"><span class="zmdi zmdi-lock-open is-on"></span><span class="zmdi zmdi-lock-outline is-off"></span></span></div><input name="stc_sys_name" id="stc_sys_name" class="ness<?php if (isset($_smarty_tpl->tpl_vars['stc_errors']->value) && in_array('sys_name',$_smarty_tpl->tpl_vars['stc_errors']->value)) {?> error<?php }?> js-binding" data-binding-name="stc_name" data-binding-element="stc_sys_name" value="<?php if (isset($_smarty_tpl->tpl_vars['stc_page']->value['sys_name'])) {
echo $_smarty_tpl->tpl_vars['stc_page']->value['sys_name'];
}?>"<?php if ($_smarty_tpl->tpl_vars['method']->value == 'edit') {?> readonly<?php }?>><?php }?></div></div></td></tr><tr style="display: none;"><td class="h hl va_m">Системное имя <span class="ness_color">*</span></td></tr><tr style="display: none;"><td class="h hl va_m">Порядок вывода</td><td><input name="stc_ord" class="ord integer reducing-trigger" value="<?php if (isset($_smarty_tpl->tpl_vars['stc_page']->value['ord'])) {
echo $_smarty_tpl->tpl_vars['stc_page']->value['ord'];
} elseif (isset($_smarty_tpl->tpl_vars['stc_next_ord']->value)) {
echo $_smarty_tpl->tpl_vars['stc_next_ord']->value;
}?>"></td></tr><tr style="display: none;"><td class="h hl va_m">Отображать страницу</td><td><?php $_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>"stc_visible",'check'=>$_smarty_tpl->tpl_vars['stc_page']->value['visible'],'list'=>array(array('value'=>1,'text'=>"Да",'checked'=>true),array('value'=>0,'text'=>"Нет"))), 0, false);
?></td></tr><tr style="display: none;"><td class="h hl va_m">Отображать в меню</td><td><?php if (isset($_smarty_tpl->tpl_vars['stc_menu_list']->value)) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['stc_menu_list']->value, 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
$_smarty_tpl->_assignInScope('checked', false);
if (!empty($_smarty_tpl->tpl_vars['stc_page']->value['in_menu'])) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['stc_page']->value['in_menu'], 's');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['s']->value) {
if ($_smarty_tpl->tpl_vars['s']->value == $_smarty_tpl->tpl_vars['item']->value['id']) {
$_smarty_tpl->_assignInScope('checked', true);
}
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
$_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'name'=>(("stc_menu[").($_smarty_tpl->tpl_vars['item']->value['id'])).("]"),'checked'=>$_smarty_tpl->tpl_vars['checked']->value,'value'=>$_smarty_tpl->tpl_vars['item']->value['id'],'text'=>$_smarty_tpl->tpl_vars['item']->value['name']), 0, true);
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}?></td></tr><tr style="display: none;"><td class="h hl va_m">Дата публикации</td><td><?php $_smarty_tpl->_subTemplateRender("file:fields/datetime.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('index'=>3,'name'=>"stc_date",'value'=>$_smarty_tpl->tpl_vars['stc_page']->value['date'],'settings'=>array("f_date_format"=>"YYYY-MM-DD"),'class_name'=>''), 0, false);
?></td></tr></tbody></table><table class="t1 table table-toggle-trigger" id="addition_data"><colgroup><col width="200"><col></colgroup><thead><tr class="th"><th colspan="2"><a href="#" class="table_hdr table_u js-table-toggle" data-toggle-init="true" data-toggle="addition_data"><i class="icon"></i> Дополнительные параметры</a></th></tr></thead><tbody><tr class="th"><td class="h hl va_m">Родительская страница</td><td><?php if ($_smarty_tpl->tpl_vars['stc_page']->value['pid'] == 0) {?><input type="hidden" name="stc_pid" value="0"><?php }?><div style="position: relative; z-index: 10000;"><select name="stc_pid"<?php if ($_smarty_tpl->tpl_vars['stc_page']->value['pid'] == 0) {?> disabled="disabled"<?php }?>><?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['TPL_PATH']->value)."/tree_select.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('a_tree'=>$_smarty_tpl->tpl_vars['stc_all_tree']->value,'nbsp_count'=>0,'curr_id'=>$_smarty_tpl->tpl_vars['stc_page']->value['pid']), 0, true);
?></select></div></td></tr><tr style="display: none;"><td class="h hl va_m">Локализация</td><td><?php $_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>"stc_locale",'check'=>$_smarty_tpl->tpl_vars['stc_page']->value['locale'],'list'=>$_smarty_tpl->tpl_vars['languages']->value), 0, true);
?></td></tr><tr style="display: none;"><td class="h hl va_m">Шаблон страницы</td><td><?php if (isset($_smarty_tpl->tpl_vars['templates_list']->value)) {?><div class="add-template"><div class="add-template__select" id="select_field"><select name="stc_tid" id="templates_list"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['templates_list']->value, 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
?><option value="<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
" <?php if (isset($_smarty_tpl->tpl_vars['stc_page']->value['tid']) && $_smarty_tpl->tpl_vars['stc_page']->value['tid'] == $_smarty_tpl->tpl_vars['item']->value['id']) {?>selected="selected"<?php }?>><?php echo $_smarty_tpl->tpl_vars['item']->value['name'];?>
</option><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></select></div><?php if (isset($_SESSION['userinf']['gid']) && $_SESSION['userinf']['gid'] == 10) {?><button type="button" class="button button-icon add-template__button" onclick="cp.addTemplate(event);"><span class="zmdi zmdi-plus-circle"></span></button><?php }?></div><?php }
if (isset($_SESSION['userinf']['gid']) && $_SESSION['userinf']['gid'] == 10) {?><div class="clearfix hidden" id="addtemplate" style="padding: 10px 0 0;"><div class="width-25 fl"><div style="padding: 0 1px 0 0;"><input name="template_name" id="template_name" disabled placeholder="Название шаблона"></div></div><div class="width-25 fl"><div style="padding: 0 0 0 1px;"><input name="template_file" id="template_file" disabled placeholder="Файл шаблона"></div></div><div class="width-25 fl"><div style="padding: 0 0 0 2px;"><button type="button" class="button button-green" onclick="cp.addTemplateFile(<?php if (isset($_smarty_tpl->tpl_vars['stc_page']->value['tid'])) {
echo $_smarty_tpl->tpl_vars['stc_page']->value['tid'];
} else { ?>''<?php }?>);">Добавить</button></div></div></div><?php }?></td></tr><tr style="display: none;"><td class="h hl va_m">Доступ к странице</td><td><?php if (isset($_smarty_tpl->tpl_vars['usr_groups']->value)) {
$_smarty_tpl->_assignInScope('checked', false);
if (isset($_smarty_tpl->tpl_vars['stc_page']->value['access']) && is_array($_smarty_tpl->tpl_vars['stc_page']->value['access']) && in_array(0,$_smarty_tpl->tpl_vars['stc_page']->value['access'])) {
$_smarty_tpl->_assignInScope('checked', true);
}
$_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'name'=>"stc_access[]",'checked'=>$_smarty_tpl->tpl_vars['checked']->value,'value'=>0,'text'=>"Всем"), 0, true);
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['usr_groups']->value, 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
$_smarty_tpl->_assignInScope('checked', false);
if (isset($_smarty_tpl->tpl_vars['stc_page']->value['access']) && is_array($_smarty_tpl->tpl_vars['stc_page']->value['access']) && in_array($_smarty_tpl->tpl_vars['item']->value['id'],$_smarty_tpl->tpl_vars['stc_page']->value['access'])) {
$_smarty_tpl->_assignInScope('checked', true);
}
$_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'name'=>"stc_access[]",'checked'=>$_smarty_tpl->tpl_vars['checked']->value,'value'=>$_smarty_tpl->tpl_vars['item']->value['id'],'text'=>$_smarty_tpl->tpl_vars['item']->value['name']), 0, true);
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}?></td></tr><tr style="display: none;"><td class="h hl va_m">Перенаправление</td><td><input name="stc_redirect" placeholder="Например: /company/news/" value="<?php if (isset($_smarty_tpl->tpl_vars['stc_page']->value['redirect'])) {
echo $_smarty_tpl->tpl_vars['stc_page']->value['redirect'];
}?>"><br></td></tr><tr style="display: none;"><td class="h hl va_m">Отображать в карте сайта</td><td><?php $_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>"stc_in_sitemap",'check'=>$_smarty_tpl->tpl_vars['stc_page']->value['in_sitemap'],'list'=>array(array('value'=>1,'text'=>"Да",'default'=>true),array('value'=>0,'text'=>"Нет"))), 0, true);
?></td></tr><?php if ($_SESSION['userinf']['gid'] == 1 || $_SESSION['userinf']['gid'] == 10) {?><tr style="display: none;"><td class="h hl va_m">Получаем аргументы</td><td><?php $_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>"stc_dynamic",'check'=>$_smarty_tpl->tpl_vars['stc_page']->value['dynamic'],'list'=>array(array('value'=>1,'text'=>"Да"),array('value'=>0,'text'=>"Нет",'default'=>true))), 0, true);
?></td></tr><?php }?></tbody></table><input type="hidden" name="mod_id" value="0"><?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['TPL_PATH']->value)."/_fields_content.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
}
}
