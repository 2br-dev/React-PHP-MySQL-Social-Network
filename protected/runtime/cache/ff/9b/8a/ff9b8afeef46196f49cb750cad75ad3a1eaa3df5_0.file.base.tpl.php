<?php
/* Smarty version 3.1.32, created on 2018-12-20 17:04:43
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\base.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c1ba17b6c7b19_62432501',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'ff9b8afeef46196f49cb750cad75ad3a1eaa3df5' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\base.tpl',
      1 => 1518184606,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:system/include.code.tpl' => 1,
  ),
),false)) {
function content_5c1ba17b6c7b19_62432501 (Smarty_Internal_Template $_smarty_tpl) {
$_smarty_tpl->_checkPlugins(array(0=>array('file'=>'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\libs\\smarty.plugins\\modifier.capi.php','function'=>'smarty_modifier_capi',),));
?><!DOCTYPE html>
<!-- (c) lnk. celebro | celebro.ru -->
<html lang="ru" class="no-js"><head><link rel="stylesheet" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/css/vendors.min.css"><link rel="stylesheet" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/css/main.min.css"><meta charset="UTF-8"><meta content="IE=Edge,chrome=1" http-equiv="X-UA-Compatible"><meta content="width=device-width, initial-scale=1, minimum-scale=1, user-scalable=no" name="viewport"><meta content="no-cache" http-equiv="cache-control"><meta content="no-cache" http-equiv="pragma"><meta content="320" name="MobileOptimized"><meta content="true" name="HandheldFriendly"><meta content="notranslate" name="google"><meta content="CELEBRO.CMS" name="CMS"><meta content="http://cms.celebro.ru/" name="author"><meta content="celebro.ru" name="copyright"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css"><!-- Favicon --><link rel="apple-touch-icon" sizes="57x57" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/apple-touch-icon-57x57.png"><link rel="apple-touch-icon" sizes="60x60" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/apple-touch-icon-60x60.png"><link rel="apple-touch-icon" sizes="72x72" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/apple-touch-icon-72x72.png"><link rel="apple-touch-icon" sizes="76x76" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/apple-touch-icon-76x76.png"><link rel="apple-touch-icon" sizes="114x114" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/apple-touch-icon-114x114.png"><link rel="apple-touch-icon" sizes="120x120" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/apple-touch-icon-120x120.png"><link rel="apple-touch-icon" sizes="144x144" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/apple-touch-icon-144x144.png"><link rel="apple-touch-icon" sizes="152x152" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/apple-touch-icon-152x152.png"><link rel="apple-touch-icon" sizes="180x180" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/apple-touch-icon-180x180.png"><link rel="icon" type="image/png" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/favicon-32x32.png" sizes="32x32"><link rel="icon" type="image/png" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/favicon-96x96.png" sizes="96x96"><link rel="icon" type="image/png" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/favicon-194x194.png" sizes="194x194"><link rel="icon" type="image/png" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/android-chrome-192x192.png" sizes="192x192"><link rel="manifest" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/manifest.json"><link rel="mask-icon" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/safari-pinned-tab.svg" color="#4169e1"><link rel="shortcut icon" href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/favicon.ico"><meta name="msapplication-TileColor" content="#da532c"><meta name="msapplication-TileImage" content="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/mstile-144x144.png"><meta name="msapplication-config" content="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/favicon/browserconfig.xml"><meta name="theme-color" content="#4169e1"><?php if (isset($_smarty_tpl->tpl_vars['_config']->value['redactor'])) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['_config']->value['redactor'], 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
if (isset($_smarty_tpl->tpl_vars['item']->value['path'])) {
if (isset($_smarty_tpl->tpl_vars['item']->value['lib']['style']) && !empty($_smarty_tpl->tpl_vars['item']->value['lib']['style'])) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['item']->value['lib']['style'], 'style');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['style']->value) {
?><link rel="stylesheet" href="<?php echo $_smarty_tpl->tpl_vars['PATH_PUBLIC']->value;
echo $_smarty_tpl->tpl_vars['item']->value['path'];
echo $_smarty_tpl->tpl_vars['style']->value;?>
"><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
}
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
if (isset($_smarty_tpl->tpl_vars['_config']->value['editor'])) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['_config']->value['editor'], 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
if (isset($_smarty_tpl->tpl_vars['item']->value['path'])) {
if (isset($_smarty_tpl->tpl_vars['item']->value['lib']['style']) && !empty($_smarty_tpl->tpl_vars['item']->value['lib']['style'])) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['item']->value['lib']['style'], 'style');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['style']->value) {
?><link rel="stylesheet" href="<?php echo $_smarty_tpl->tpl_vars['PATH_PUBLIC']->value;
echo $_smarty_tpl->tpl_vars['item']->value['path'];
echo $_smarty_tpl->tpl_vars['style']->value;?>
"><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
}
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
echo '<script'; ?>
>var eventsJson = {};var initialFiles = {};var ADMIN_DIR = '<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
',PATH_HASH = '<?php echo $_smarty_tpl->tpl_vars['PATH_HASH']->value;?>
',ADMIN_LOCALE = '<?php echo $_smarty_tpl->tpl_vars['ADMIN_LOCALE']->value;?>
',CONFIGURE = <?php echo json_encode($_smarty_tpl->tpl_vars['_config']->value);?>
,URL_TRANSLATE = "<?php if (@constant('SYSTEM_TRANSLATE')) {
echo @constant('SYSTEM_TRANSLATE');
} else { ?>latin<?php }?>",TRANSLATE_API = "<?php if (@constant('TRANSLATE_API')) {
echo @constant('TRANSLATE_API');
}?>";<?php if (isset($_smarty_tpl->tpl_vars['modules_json']->value)) {?>var MODULE_LIST = <?php echo $_smarty_tpl->tpl_vars['modules_json']->value;?>
;<?php }
echo '</script'; ?>
><title><?php echo @constant('COMPANY_NAME');?>
</title></head><body><svg version="1.1" xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden;"><defs><!-- inject:svg --><symbol id="close" viewBox="0 0 39 39"><path d="M22.582 19.812l15.09-15.09a2.4 2.4 0 0 0 0-3.394 2.395 2.395 0 0 0-3.391 0l-15.093 15.09-15.09-15.09A2.4 2.4 0 1 0 .703 4.722l15.094 15.09L.703 34.902a2.402 2.402 0 0 0 3.395 3.395l15.09-15.09 15.093 15.09a2.394 2.394 0 0 0 3.391 0 2.402 2.402 0 0 0 0-3.395l-15.09-15.09z"/></symbol><!-- endinject --></defs></svg><noscript><div class="js_disabled">В вашем браузере отключена поддержка JavaScript! Для нормальной работоспособности сайта необходимо разрешить использование JavaScript.</div></noscript><div class="loader" id="loader"><img src="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/images/preloader.gif" width="32" height="32" alt="Идет загрузка"> <span>Подождите...</span></div><?php $_smarty_tpl->_subTemplateRender("file:system/include.code.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?><div class="page" id="page"><aside class="sidebar"><div class="sidebar__logo"><a href="#" class="sandwich menu-trigger"><span class="sandwich__layer">Menu</span></a><div class="sidebar__logo__celebro-cms secondary-items">CELEBRO<span>.CMS</span></div></div><div class="sidebar__inner"><?php if (isset($_smarty_tpl->tpl_vars['navigation']->value)) {?><ul class="navigation"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['navigation']->value, 'item', false, NULL, 'nav', array (
  'iteration' => true,
));
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
$_smarty_tpl->tpl_vars['__smarty_foreach_nav']->value['iteration']++;
?><li class="navigation__item"><a href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;
echo $_smarty_tpl->tpl_vars['item']->value['dir'];?>
" rel="<?php echo $_smarty_tpl->tpl_vars['item']->value['name'];?>
" class="navigation__link<?php if (isset($_smarty_tpl->tpl_vars['_path']->value[1]) && $_smarty_tpl->tpl_vars['_path']->value[1] == $_smarty_tpl->tpl_vars['item']->value['root']) {?> navigation__link_current<?php }?> trigger-navigation" id="navi-<?php echo (isset($_smarty_tpl->tpl_vars['__smarty_foreach_nav']->value['iteration']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_nav']->value['iteration'] : null);?>
" data-instant><span class="navigation__link__middle"><span class="navigation__link__icon">								<i class="navigation__link__icon__item zmdi zmdi-<?php echo $_smarty_tpl->tpl_vars['item']->value['icon'];?>
"></i></span><span class="navigation__link__text secondary-items"><?php echo $_smarty_tpl->tpl_vars['item']->value['name'];?>
</span><?php if (isset($_smarty_tpl->tpl_vars['item']->value['count'])) {?><span class="navigation__link__badge badge bg-<?php if ($_smarty_tpl->tpl_vars['item']->value['count'] > 0) {?>danger<?php } else { ?>success<?php }?>"><?php echo $_smarty_tpl->tpl_vars['item']->value['count'];?>
</span><?php }?></span></a></li><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></ul><?php }?></div></aside><section class="wrapper clearfix" id="page-wrapper"><div class="overlay" id="overlay"></div><header class="header"><div class="header__right-side"><div class="header__recycle"><a href="./?cleancache=all&backuri=<?php echo $_smarty_tpl->tpl_vars['_backuri']->value;?>
" class="header__recycle__button trigger-tooltip trigger-cache" title="Очистить кеш"></a><span class="header__recycle__dropdown trigger-popover" data-popover="dropdown_menu"><span class="zmdi zmdi-chevron-down"></span></span></div><a href="/" target="_blank" class="header__site-link"><i class="zmdi zmdi-link"></i><?php echo smarty_modifier_capi($_smarty_tpl->tpl_vars['locale']->value['view_website']);?>
</a><a href="./?logout=1" class="header__logout" title="<?php echo smarty_modifier_capi($_smarty_tpl->tpl_vars['locale']->value['logout']);?>
" title="Выйти">Выйти</a></div><div class="header__title"><?php echo $_smarty_tpl->tpl_vars['header']->value;?>
</div></header><?php if ($_smarty_tpl->tpl_vars['breadcrumbs']->value) {?><ul class="bread-crumbs"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['breadcrumbs']->value, 'bc', false, NULL, 'bc', array (
  'last' => true,
  'iteration' => true,
  'total' => true,
));
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['bc']->value) {
$_smarty_tpl->tpl_vars['__smarty_foreach_bc']->value['iteration']++;
$_smarty_tpl->tpl_vars['__smarty_foreach_bc']->value['last'] = $_smarty_tpl->tpl_vars['__smarty_foreach_bc']->value['iteration'] === $_smarty_tpl->tpl_vars['__smarty_foreach_bc']->value['total'];
?><li class="bread-crumbs__item"><?php if (!(isset($_smarty_tpl->tpl_vars['__smarty_foreach_bc']->value['last']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_bc']->value['last'] : null)) {?><a href="<?php echo $_smarty_tpl->tpl_vars['bc']->value['link'];?>
" class="bread-crumbs__item__link" data-instant><?php }
echo $_smarty_tpl->tpl_vars['bc']->value['name'];
if (!(isset($_smarty_tpl->tpl_vars['__smarty_foreach_bc']->value['last']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_bc']->value['last'] : null)) {?></a><?php }?></li><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></ul><?php }
if ($_smarty_tpl->tpl_vars['submenu']->value) {?><nav class="tabs"><ul class="tabs__list"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['submenu']->value, 'sub', false, NULL, 'sub', array (
  'first' => true,
  'index' => true,
));
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['sub']->value) {
$_smarty_tpl->tpl_vars['__smarty_foreach_sub']->value['index']++;
$_smarty_tpl->tpl_vars['__smarty_foreach_sub']->value['first'] = !$_smarty_tpl->tpl_vars['__smarty_foreach_sub']->value['index'];
?><li class="tabs__list__item"><a href="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;
echo $_smarty_tpl->tpl_vars['sub']->value['dir'];?>
" class="tabs__list__link<?php if (isset($_smarty_tpl->tpl_vars['_path']->value[2]) && $_smarty_tpl->tpl_vars['_path']->value[2] == $_smarty_tpl->tpl_vars['sub']->value['root'] || isset($_smarty_tpl->tpl_vars['_path']->value[2]) && $_smarty_tpl->tpl_vars['_path']->value[2] == 'index' && $_smarty_tpl->tpl_vars['sub']->value['root'] == 'list' || !isset($_smarty_tpl->tpl_vars['_path']->value[2]) && (isset($_smarty_tpl->tpl_vars['__smarty_foreach_sub']->value['first']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_sub']->value['first'] : null)) {?> tabs__list__link_current<?php }?>" data-instant><?php echo $_smarty_tpl->tpl_vars['sub']->value['name'];?>
</a></li><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></ul></nav><?php }?><article class="content clearfix"><?php echo $_smarty_tpl->tpl_vars['content']->value;?>
</article></section></div><?php echo '<script'; ?>
 src="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/js/vendors.min.js"><?php echo '</script'; ?>
><?php echo '<script'; ?>
 src="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/js/libs.min.js"><?php echo '</script'; ?>
><?php if (isset($_smarty_tpl->tpl_vars['_config']->value['scripts'])) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['_config']->value['scripts'], 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
if (isset($_smarty_tpl->tpl_vars['item']->value['path'])) {
if (isset($_smarty_tpl->tpl_vars['item']->value['lib']['script']) && !empty($_smarty_tpl->tpl_vars['item']->value['lib']['script'])) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['item']->value['lib']['script'], 'script');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['script']->value) {
echo '<script'; ?>
 src="<?php echo $_smarty_tpl->tpl_vars['PATH_PUBLIC']->value;
echo $_smarty_tpl->tpl_vars['item']->value['path'];
echo $_smarty_tpl->tpl_vars['script']->value;?>
" async><?php echo '</script'; ?>
><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
}
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
if (isset($_smarty_tpl->tpl_vars['_config']->value['redactor'])) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['_config']->value['redactor'], 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
if (isset($_smarty_tpl->tpl_vars['item']->value['path'])) {
if (isset($_smarty_tpl->tpl_vars['item']->value['lib']['script']) && !empty($_smarty_tpl->tpl_vars['item']->value['lib']['script'])) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['item']->value['lib']['script'], 'script');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['script']->value) {
echo '<script'; ?>
 src="<?php echo $_smarty_tpl->tpl_vars['PATH_PUBLIC']->value;
echo $_smarty_tpl->tpl_vars['item']->value['path'];
echo $_smarty_tpl->tpl_vars['script']->value;?>
"><?php echo '</script'; ?>
><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
}
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
if (isset($_smarty_tpl->tpl_vars['_config']->value['editor'])) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['_config']->value['editor'], 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
if (isset($_smarty_tpl->tpl_vars['item']->value['path'])) {
if (isset($_smarty_tpl->tpl_vars['item']->value['lib']['script']) && !empty($_smarty_tpl->tpl_vars['item']->value['lib']['script'])) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['item']->value['lib']['script'], 'script');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['script']->value) {
echo '<script'; ?>
 src="<?php echo $_smarty_tpl->tpl_vars['PATH_PUBLIC']->value;
echo $_smarty_tpl->tpl_vars['item']->value['path'];
echo $_smarty_tpl->tpl_vars['script']->value;?>
" async><?php echo '</script'; ?>
><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
}
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
echo '<script'; ?>
 src="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/js/scripts.min.js" async><?php echo '</script'; ?>
><?php echo '<script'; ?>
 src="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/js/shopping.min.js" async><?php echo '</script'; ?>
><?php echo '<script'; ?>
 src="/<?php echo $_smarty_tpl->tpl_vars['ADMIN_DIR']->value;?>
/js/module.min.js" async><?php echo '</script'; ?>
></body></html><?php }
}
