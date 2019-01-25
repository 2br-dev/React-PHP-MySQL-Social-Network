<?php
/* Smarty version 3.1.32, created on 2019-01-18 18:17:07
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\view\settings\index\index.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c41edf33765b3_04406500',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '302daa32179361a3a28850c08d5e4a3b5724c4db' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\view\\settings\\index\\index.tpl',
      1 => 1511963598,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:system/group.tpl' => 3,
  ),
),false)) {
function content_5c41edf33765b3_04406500 (Smarty_Internal_Template $_smarty_tpl) {
$_smarty_tpl->_checkPlugins(array(0=>array('file'=>'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\libs\\smarty.plugins\\modifier.capi.php','function'=>'smarty_modifier_capi',),));
?><form action="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/settings" method="POST"><input type="hidden" name="action" value="save_setting"><table class="table"><col width="200"><col><thead><tr><th colspan="2"><?php echo smarty_modifier_capi($_smarty_tpl->tpl_vars['locale']->value['site_settings']);?>
</th></tr></thead><tbody><tr><td class="h hl"><?php echo smarty_modifier_capi($_smarty_tpl->tpl_vars['locale']->value['site_name']);?>
</td><td id="COMPANY_NAME"><input type="text" name="COMPANY_NAME" value="<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['settings']->value['COMPANY_NAME'], ENT_QUOTES, 'UTF-8', true);?>
"></td></tr><tr><td class="h hl"><?php echo smarty_modifier_capi($_smarty_tpl->tpl_vars['locale']->value['timezone']);?>
</td><td><div class="select-up"><?php if (!empty($_smarty_tpl->tpl_vars['timezone']->value)) {?><select name="SYSTEM_TIMEZONE"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['timezone']->value, 'zone');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['zone']->value) {
?><option value="<?php echo $_smarty_tpl->tpl_vars['zone']->value['value'];?>
"<?php if (isset($_smarty_tpl->tpl_vars['settings']->value['SYSTEM_TIMEZONE']) && $_smarty_tpl->tpl_vars['zone']->value['value'] == $_smarty_tpl->tpl_vars['settings']->value['SYSTEM_TIMEZONE']) {?> selected<?php }?>><?php echo $_smarty_tpl->tpl_vars['zone']->value['name'];?>
</option><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></select><?php }?></div></td></tr><tr><td class="h hl"><?php echo smarty_modifier_capi($_smarty_tpl->tpl_vars['locale']->value['locale']);?>
</td><td>                        <select name="SYSTEM_LOCALE"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['languages']->value, 'lang');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['lang']->value) {
?><option value="<?php echo $_smarty_tpl->tpl_vars['lang']->value['system'];?>
"<?php if (isset($_smarty_tpl->tpl_vars['settings']->value['SYSTEM_LOCALE']) && $_smarty_tpl->tpl_vars['settings']->value['SYSTEM_LOCALE'] == $_smarty_tpl->tpl_vars['lang']->value['system']) {?> selected<?php }?>><?php echo $_smarty_tpl->tpl_vars['lang']->value['name'];?>
</option><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></select><a href="<?php echo $_smarty_tpl->tpl_vars['base_path']->value;?>
/add" class="button button-green">Добавить</a>                </td></tr><tr><td class="h hl">Главная страница</td><td><select name="SYSTEM_MAINPAGE"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['pages']->value, 'page');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['page']->value) {
?><option value="<?php echo $_smarty_tpl->tpl_vars['page']->value['id'];?>
"<?php if (isset($_smarty_tpl->tpl_vars['settings']->value['SYSTEM_MAINPAGE']) && $_smarty_tpl->tpl_vars['settings']->value['SYSTEM_MAINPAGE'] == $_smarty_tpl->tpl_vars['page']->value['id']) {?> selected<?php }?>><?php echo t($_smarty_tpl->tpl_vars['page']->value['name']);?>
</option><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></select></td></tr><tr><td class="h hl"><?php echo smarty_modifier_capi($_smarty_tpl->tpl_vars['locale']->value['debug']);?>
</td><td><?php $_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>"SYSTEM_DEBUG",'check'=>$_smarty_tpl->tpl_vars['settings']->value['SYSTEM_DEBUG'],'list'=>array(array('value'=>'1','text'=>smarty_modifier_capi($_smarty_tpl->tpl_vars['locale']->value['yes'])),array('value'=>'0','text'=>smarty_modifier_capi($_smarty_tpl->tpl_vars['locale']->value['no']),'default'=>true))), 0, false);
?></td></tr><tr><td class="h hl"><?php echo smarty_modifier_capi($_smarty_tpl->tpl_vars['locale']->value['enablecache']);?>
</td><td><?php $_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>"ENABLECACHE",'check'=>$_smarty_tpl->tpl_vars['settings']->value['ENABLECACHE'],'list'=>array(array('value'=>'1','text'=>smarty_modifier_capi($_smarty_tpl->tpl_vars['locale']->value['yes'])),array('value'=>'0','text'=>smarty_modifier_capi($_smarty_tpl->tpl_vars['locale']->value['no']),'default'=>true))), 0, true);
?></td></tr><tr><td class="h hl"><?php echo mb_strtoupper($_smarty_tpl->tpl_vars['locale']->value['iis'], 'UTF-8');?>
</td><td><?php $_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>"SYSTEM_TRANSLATE",'check'=>$_smarty_tpl->tpl_vars['settings']->value['SYSTEM_TRANSLATE'],'list'=>array(array('value'=>'latin','text'=>smarty_modifier_capi($_smarty_tpl->tpl_vars['locale']->value['latin']),'hint'=>"/stati/metki/leto",'default'=>true),array('value'=>'cyrillic','text'=>smarty_modifier_capi($_smarty_tpl->tpl_vars['locale']->value['cyrillic']),'hint'=>"/статьи/метки/лето"),array('value'=>'translate','text'=>smarty_modifier_capi($_smarty_tpl->tpl_vars['locale']->value['translate']),'hint'=>"/articles/tags/summer"))), 0, true);
?></td></tr></tbody></table><div class="button-container clearfix"><button class="button" type="submit"><i class="zmdi zmdi-save"></i><?php echo smarty_modifier_capi($_smarty_tpl->tpl_vars['locale']->value['buttons.save']);?>
</button></div></form><?php }
}
