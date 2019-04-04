<?php
/* Smarty version 3.1.32, created on 2019-04-04 17:06:55
  from 'C:\OpenServer\domains\akvatory.local\protected\themes\base\smarty\components\scripts.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5ca60f7f058bf2_00541431',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'b6f94da42d1d4510af616e8c04958e07d712010d' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\themes\\base\\smarty\\components\\scripts.tpl',
      1 => 1554386176,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5ca60f7f058bf2_00541431 (Smarty_Internal_Template $_smarty_tpl) {
$_smarty_tpl->_checkPlugins(array(0=>array('file'=>'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\libs\\smarty.plugins\\function.compress.php','function'=>'smarty_function_compress',),));
echo smarty_function_compress(array('attr'=>'data-no-instant','mode'=>'js','source'=>array(array('file'=>'/js/vendor.min.js'),array('file'=>'/js/app.min.js'))),$_smarty_tpl);
echo '<script'; ?>
 src="/frontend/build/static/js/1.62861efe.chunk.js"><?php echo '</script'; ?>
><?php echo '<script'; ?>
 src="/frontend/build/static/js/main.ad815bec.chunk.js"><?php echo '</script'; ?>
><?php echo '<script'; ?>
 src="/frontend/build/static/js/runtime~main.229c360f.js"><?php echo '</script'; ?>
></body></html><?php }
}
