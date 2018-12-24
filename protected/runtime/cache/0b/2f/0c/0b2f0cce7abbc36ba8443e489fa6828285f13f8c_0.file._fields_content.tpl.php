<?php
/* Smarty version 3.1.32, created on 2018-12-24 10:54:46
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\view\structure\_fields_content.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c2090c6835684_30722023',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '0b2f0cce7abbc36ba8443e489fa6828285f13f8c' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\view\\structure\\_fields_content.tpl',
      1 => 1511963600,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:system/redactor.tpl' => 1,
    'file:system/editor.tpl' => 1,
  ),
),false)) {
function content_5c2090c6835684_30722023 (Smarty_Internal_Template $_smarty_tpl) {
echo '<script'; ?>
 type="text/javascript">var modules_list = <?php echo json_encode($_smarty_tpl->tpl_vars['modules_list']->value);?>
;<?php echo '</script'; ?>
><table class="table" id="cont_data"><thead><tr class="th"><th>Содержание</th></tr></thead><tbody><?php if ($_smarty_tpl->tpl_vars['cnt_page']->value) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['cnt_page']->value, 'cnt');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['cnt']->value) {
?><tr id="settings-<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
"><td class="settings-row"><div class="settings-container clearfix"><a href="#" onclick="return cp.removeSettings(<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
, event);" class="block-settings-link block-settings-remove"><i class="zmdi zmdi-delete"></i>Удалить часть страницы</a><a href="#settings-container-toggle-<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" onclick="return cp.toggleSettings(this, event);" class="block-settings-link block-settings-title"><span class="block-settings-title-drop"><i class="zmdi zmdi-settings"></i></span><span class="block-settings-title-text">Настройки блока (<span class="settings-item"><?php if ($_smarty_tpl->tpl_vars['cnt']->value['visible'] == 1) {?><span class="color-green">Активен</span><?php } elseif ($_smarty_tpl->tpl_vars['cnt']->value['visible'] == 0) {?><span class="color-red">Не активен</span><?php }?>;</span><span class="settings-item"><?php if ($_smarty_tpl->tpl_vars['cnt']->value['indexer'] == 1) {?><span class="color-green">Используется в поиске</span><?php } elseif ($_smarty_tpl->tpl_vars['cnt']->value['indexer'] == 0) {?><span class="color-red">Не используется в поиске</span><?php } elseif ($_smarty_tpl->tpl_vars['cnt']->value['indexer'] == 2) {?><span class="color-green">Только динамические страницы</span><?php }?>;</span><span class="settings-item">Отображается <span class="color-green"><?php if ($_smarty_tpl->tpl_vars['cnt']->value['indynamic'] == 0) {?>на странице и на подстраницах<?php } elseif ($_smarty_tpl->tpl_vars['cnt']->value['indynamic'] == 1) {?>только на странице<?php } elseif ($_smarty_tpl->tpl_vars['cnt']->value['indynamic'] == 2) {?>только на подстраницах<?php }?></span>;</span>)</span></a><div class="settings-container-toggle" id="settings-container-toggle-<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
"><div class="block-settings-ln block-settings-visible clearfix"><div class="option-group option-combo option-simple"><label><input type="radio" name="SETTINGS_visible_<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" value="1"<?php if (!$_smarty_tpl->tpl_vars['cnt']->value['visible'] || $_smarty_tpl->tpl_vars['cnt']->value['visible'] == 1) {?> checked="checked"<?php }?>><span class="option">Активен</span></label><label class="disallow"><input type="radio" name="SETTINGS_visible_<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" value="0"<?php if ($_smarty_tpl->tpl_vars['cnt']->value['visible'] == 0) {?> checked="checked"<?php }?>><span class="option">Не активен</span></label></div></div><div class="block-settings-ln block-settings-caching clearfix"><div class="option-group option-combo option-simple"><label><input type="radio" name="SETTINGS_caching_<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" value="1"<?php if (!$_smarty_tpl->tpl_vars['cnt']->value['caching'] || $_smarty_tpl->tpl_vars['cnt']->value['caching'] == 1) {?> checked="checked"<?php }?>><span class="option">Кешировать</span></label><label class="disallow"><input type="radio" name="SETTINGS_caching_<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" value="0"<?php if ($_smarty_tpl->tpl_vars['cnt']->value['caching'] == 0) {?> checked="checked"<?php }?>><span class="option">Не кешировать</span></label></div></div><div class="block-settings-ln block-settings-order clearfix"><div class="block-settings-order-input"><input name="SETTINGS_ord_<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" value="<?php echo $_smarty_tpl->tpl_vars['cnt']->value['ord'];?>
" placeholder="Порядок"></div></div><div class="block-settings-ln block-settings-select clearfix" id="block-settings-select-block-<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
"><?php if ($_smarty_tpl->tpl_vars['type_list']->value) {?><div class="block-settings-select-block lvl1" id="block-lvl1-<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
"><select name="SETTINGS_type_<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" id="cnt_type-<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" onchange="cp.loadSettings(this.value, <?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
, 'type');"><?php if (!$_smarty_tpl->tpl_vars['cnt']->value['type']) {?><option value="" selected>Выбрать</option><?php }
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['type_list']->value, 'type', false, 'system');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['system']->value => $_smarty_tpl->tpl_vars['type']->value) {
?><option value="<?php echo $_smarty_tpl->tpl_vars['system']->value;?>
"<?php if ($_smarty_tpl->tpl_vars['cnt']->value['type'] == $_smarty_tpl->tpl_vars['system']->value) {?> selected<?php }?>><?php echo $_smarty_tpl->tpl_vars['type']->value;?>
</option><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></select></div><?php }
if ($_smarty_tpl->tpl_vars['cnt']->value['item_list']) {?><div class="block-settings-select-block lvl2" id="block-lvl2-<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
"><select name="SETTINGS_item_<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" id="cnt_item-<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" onchange="cp.loadSettings(this.value, <?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
, 'item');"><?php if (!$_smarty_tpl->tpl_vars['cnt']->value['item']) {?><option value="" selected>Выбрать</option><?php }
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['cnt']->value['item_list'], 'name', false, 'system');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['system']->value => $_smarty_tpl->tpl_vars['name']->value) {
?><option value="<?php echo $_smarty_tpl->tpl_vars['system']->value;?>
"<?php if ($_smarty_tpl->tpl_vars['cnt']->value['item'] == $_smarty_tpl->tpl_vars['system']->value) {?> selected<?php }?>><?php echo $_smarty_tpl->tpl_vars['name']->value;?>
</option><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></select></div><?php }
if ($_smarty_tpl->tpl_vars['cnt']->value['mode_list']) {?><div class="block-settings-select-block lvl3" id="block-lvl3-<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
"><select name="SETTINGS_mode_<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" id="cnt_mode-<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" onchange="cp.loadSettings(this.value, <?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
, 'mode');"><?php if (!$_smarty_tpl->tpl_vars['cnt']->value['mode']) {?><option value="" selected>Выбрать</option><?php }
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['cnt']->value['mode_list'], 'name', false, 'system');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['system']->value => $_smarty_tpl->tpl_vars['name']->value) {
?><option value="<?php echo $_smarty_tpl->tpl_vars['system']->value;?>
"<?php if ($_smarty_tpl->tpl_vars['cnt']->value['mode'] == $_smarty_tpl->tpl_vars['system']->value) {?> selected<?php }?>><?php echo $_smarty_tpl->tpl_vars['name']->value;?>
</option><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></select></div><?php }?></div><div class="block-settings-ln block-settings-system clearfix"><div class="block-settings-system-input"><input name="SETTINGS_system_<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" value="<?php echo $_smarty_tpl->tpl_vars['cnt']->value['system'];?>
" placeholder="Системное имя"></div></div><!--<div class="block-settings-ln block-settings-system clearfix"><div class="block-settings-system-input"><input name="SETTINGS_arguments_<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" value="<?php echo $_smarty_tpl->tpl_vars['cnt']->value['arguments'];?>
" placeholder="Получаемые аргументы: Например 1;2"></div></div>--><div class="block-settings-ln block-settings-system clearfix"><div class="option-group option-combo option-simple"><label><input type="radio" name="SETTINGS_indexer_<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" value="1"<?php if (!$_smarty_tpl->tpl_vars['cnt']->value['indexer'] || $_smarty_tpl->tpl_vars['cnt']->value['indexer'] == 1) {?> checked="checked"<?php }?>><span class="option">Использовать в поиске</span></label><label class="disallow"><input type="radio" name="SETTINGS_indexer_<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" value="0"<?php if ($_smarty_tpl->tpl_vars['cnt']->value['indexer'] == 0) {?> checked="checked"<?php }?>><span class="option">Не использовать в поиске</span></label><?php if (isset($_smarty_tpl->tpl_vars['stc_page']->value['dynamic']) && $_smarty_tpl->tpl_vars['stc_page']->value['dynamic'] == 1) {?><label class="disallow"><input type="radio" name="SETTINGS_indexer_<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" value="2"<?php if ($_smarty_tpl->tpl_vars['cnt']->value['indexer'] == 2) {?> checked="checked"<?php }?>><span class="option">Только динамические страницы</span></label><?php }?></div></div><?php if (isset($_smarty_tpl->tpl_vars['stc_page']->value['dynamic']) && $_smarty_tpl->tpl_vars['stc_page']->value['dynamic'] == 1) {?><div class="block-settings-ln clearfix"><div class="block-settings-inline"><div class="block-settings-inline-title">Где отображать:</div><div class="block-settings-inline-content"><div class="option-group option-combo option-simple"><label><input type="radio" name="SETTINGS_indynamic_<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" value="0"<?php if (!$_smarty_tpl->tpl_vars['cnt']->value['indynamic'] || $_smarty_tpl->tpl_vars['cnt']->value['indynamic'] == 0) {?> checked="checked"<?php }?>><span class="option">На странице и на подстраницах</span></label><label><input type="radio" name="SETTINGS_indynamic_<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" value="1"<?php if ($_smarty_tpl->tpl_vars['cnt']->value['indynamic'] == 1) {?> checked="checked"<?php }?>><span class="option">Только на странице</span></label><label><input type="radio" name="SETTINGS_indynamic_<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" value="2"<?php if ($_smarty_tpl->tpl_vars['cnt']->value['indynamic'] == 2) {?> checked="checked"<?php }?>><span class="option">Только на подстраницах</span></label></div></div></div></div><?php }?><div class="block-settings-buttons clearfix"><a href="#" onclick="return cp.saveSettings(<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
, event);" class="button button-purple block-settings-save"><i class="zmdi zmdi-check-square"></i>Сохранить</a></div></div></div></td></tr><?php if ($_smarty_tpl->tpl_vars['cnt']->value['type'] == 'redactor' && $_smarty_tpl->tpl_vars['cnt']->value['item']) {?><tr id="container-<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
"><td class="editor-row"><?php $_smarty_tpl->_assignInScope('redactor_id', ("redactor_content_").($_smarty_tpl->tpl_vars['cnt']->value['id']) ,true);
$_smarty_tpl->_assignInScope('redactor_name', ("cnt_content[").($_smarty_tpl->tpl_vars['cnt']->value['id']).("]") ,true);
$_smarty_tpl->_subTemplateRender('file:system/redactor.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('redactor_type'=>$_smarty_tpl->tpl_vars['cnt']->value['item'],'redactor_name'=>$_smarty_tpl->tpl_vars['redactor_name']->value,'redactor_value'=>$_smarty_tpl->tpl_vars['cnt']->value['content'],'redactor_id'=>$_smarty_tpl->tpl_vars['redactor_id']->value), 0, true);
?></td></tr><?php } elseif ($_smarty_tpl->tpl_vars['cnt']->value['type'] == 'editor' && $_smarty_tpl->tpl_vars['cnt']->value['item']) {?><tr id="container-<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
"><td class="editor-row"><?php $_smarty_tpl->_assignInScope('editor_id', ("cnt_content").($_smarty_tpl->tpl_vars['cnt']->value['id']) ,true);
$_smarty_tpl->_assignInScope('editor_name', ("cnt_content[").($_smarty_tpl->tpl_vars['cnt']->value['id']).("]") ,true);
$_smarty_tpl->_assignInScope('editor_mode', 'htmlmixed' ,true);
if ($_smarty_tpl->tpl_vars['cnt']->value['mode']) {
$_smarty_tpl->_assignInScope('editor_mode', $_smarty_tpl->tpl_vars['cnt']->value['mode'] ,true);
}
$_smarty_tpl->_subTemplateRender("file:system/editor.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('editor_id'=>$_smarty_tpl->tpl_vars['editor_id']->value,'editor_name'=>$_smarty_tpl->tpl_vars['editor_name']->value,'editor_cont'=>htmlspecialchars($_smarty_tpl->tpl_vars['cnt']->value['content'], ENT_QUOTES, 'UTF-8', true),'editor_hightlight'=>$_smarty_tpl->tpl_vars['editor_mode']->value,'editor_save_btn'=>true), 0, true);
?></td></tr><?php }?><tr id="emptysplash-<?php echo $_smarty_tpl->tpl_vars['cnt']->value['id'];?>
" class="simple-row"><td></td></tr><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}?></tbody></table><?php }
}
