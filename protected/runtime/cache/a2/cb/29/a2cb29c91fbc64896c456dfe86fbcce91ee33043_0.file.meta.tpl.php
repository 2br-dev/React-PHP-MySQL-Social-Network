<?php
/* Smarty version 3.1.32, created on 2018-12-24 10:54:45
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\fields\meta.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c2090c5c8b5b2_67965943',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'a2cb29c91fbc64896c456dfe86fbcce91ee33043' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\fields\\meta.tpl',
      1 => 1511965748,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:system/group.tpl' => 2,
    'file:system/controll.tpl' => 7,
  ),
),false)) {
function content_5c2090c5c8b5b2_67965943 (Smarty_Internal_Template $_smarty_tpl) {
?><table class="t1 table table-toggle-trigger" id="meta_data"><col width="200"><col><thead><tr class="th"><th colspan="2"><a href="#" class="table_hdr table_u js-table-toggle" data-toggle-init="true" data-toggle="meta_data"><i class="icon"></i> Мета данные</a></th></tr></thead><tbody><tr class="th"><td class="h hl va_m">Заголовок</td><td><div class="count-number-block clearfix"><span class="count-number-block-count<?php if (isset($_smarty_tpl->tpl_vars['title']->value) && mb_strlen($_smarty_tpl->tpl_vars['title']->value) > 65) {?> unlim<?php }?>" data-recomend="65"><?php if (isset($_smarty_tpl->tpl_vars['title']->value)) {
echo mb_strlen($_smarty_tpl->tpl_vars['title']->value);
} else { ?>0<?php }?>/65</span><input name="meta_title" placeholder="META title" value="<?php if (isset($_smarty_tpl->tpl_vars['title']->value)) {
echo htmlspecialchars($_smarty_tpl->tpl_vars['title']->value, ENT_QUOTES, 'UTF-8', true);
}?>" class="count-number"></div></td></tr><tr style="display: none;"><td class="h hl va_m">Ключевые слова</td><td><div class="count-number-block clearfix"><span class="count-number-block-count"><?php if (isset($_smarty_tpl->tpl_vars['keywords']->value)) {
echo mb_strlen($_smarty_tpl->tpl_vars['keywords']->value);
} else { ?>0<?php }?></span><textarea name="meta_keywords" placeholder="META keywords" class="count-number"><?php if (isset($_smarty_tpl->tpl_vars['keywords']->value)) {
echo htmlspecialchars($_smarty_tpl->tpl_vars['keywords']->value, ENT_QUOTES, 'UTF-8', true);
}?></textarea></div></td></tr><tr style="display: none;"><td class="h hl va_m">Описание</td><td><div class="count-number-block clearfix"><span class="count-number-block-count"><?php if (isset($_smarty_tpl->tpl_vars['description']->value)) {
echo mb_strlen($_smarty_tpl->tpl_vars['description']->value);
} else { ?>0<?php }?></span><textarea name="meta_description" placeholder="META description" class="count-number"><?php if (isset($_smarty_tpl->tpl_vars['description']->value)) {
echo htmlspecialchars($_smarty_tpl->tpl_vars['description']->value, ENT_QUOTES, 'UTF-8', true);
}?></textarea></div></td></tr><tr style="display: none;"><td class="h hl va_m">Индексация поисковиками</td><td><div class="meta-robots"><?php if (!isset($_smarty_tpl->tpl_vars['robots']->value) || empty($_smarty_tpl->tpl_vars['robots']->value)) {
$_smarty_tpl->_assignInScope('robots', array('index','follow'));
}
$_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>"meta_robots[index]",'check'=>$_smarty_tpl->tpl_vars['robots']->value,'list'=>array(array('value'=>'index','text'=>"index",'default'=>true),array('value'=>'noindex','text'=>"noindex"))), 0, false);
$_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>"meta_robots[follow]",'check'=>$_smarty_tpl->tpl_vars['robots']->value,'list'=>array(array('value'=>'follow','text'=>"follow",'default'=>true),array('value'=>'nofollow','text'=>"nofollow"))), 0, true);
$_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'name'=>"meta_robots[noarchive]",'checked'=>in_array('noarchive',$_smarty_tpl->tpl_vars['robots']->value),'value'=>"noarchive",'text'=>"noarchive",'title'=>'Не показывать ссылку на сохраненную копию на странице результатов поиска..'), 0, false);
$_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'name'=>"meta_robots[noyaca]",'checked'=>in_array('noyaca',$_smarty_tpl->tpl_vars['robots']->value),'value'=>"noyaca",'text'=>"noyaca",'title'=>'Не использовать описание из Яндекс.Каталога для сниппета в результатах поиска.'), 0, true);
$_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'name'=>"meta_robots[nosnippet]",'checked'=>in_array('nosnippet',$_smarty_tpl->tpl_vars['robots']->value),'value'=>"nosnippet",'text'=>"nosnippet",'title'=>'Не отображать расширенное описание этой веб-страницы в результатах поиска.'), 0, true);
$_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'name'=>"meta_robots[notranslate]",'checked'=>in_array('notranslate',$_smarty_tpl->tpl_vars['robots']->value),'value'=>"notranslate",'text'=>"notranslate",'title'=>'Не предлагать перевод этой страницы в результатах поиска.'), 0, true);
$_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'name'=>"meta_robots[noimageindex]",'checked'=>in_array('noimageindex',$_smarty_tpl->tpl_vars['robots']->value),'value'=>"noimageindex",'text'=>"noimageindex",'title'=>'Не индексировать изображения на этой странице.'), 0, true);
$_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'name'=>"meta_robots[noodp]",'checked'=>in_array('noodp',$_smarty_tpl->tpl_vars['robots']->value),'value'=>"noodp",'text'=>"noodp",'title'=>'Не использовать название и описание сайта из каталога DMOZ для сниппета в результатах поиска.'), 0, true);
$_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'name'=>"meta_robots[noydir]",'checked'=>in_array('noydir',$_smarty_tpl->tpl_vars['robots']->value),'value'=>"noydir",'text'=>"noydir",'title'=>'Не использовать название и описание сайта из каталога Yahoo для сниппета в результатах поиска.'), 0, true);
?>                </div></td></tr><?php if ($_smarty_tpl->tpl_vars['generate']->value) {?><tr style="display: none;"><td></td><td><button type="button" class="button button-green" onclick="return shopping.generateMeta()"><i class="zmdi zmdi-refresh"></i>Генерировать мета-теги по шаблону</button></td></tr><?php }?></tbody></table><?php }
}
