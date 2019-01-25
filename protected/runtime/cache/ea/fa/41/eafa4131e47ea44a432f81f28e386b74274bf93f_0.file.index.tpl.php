<?php
/* Smarty version 3.1.32, created on 2019-01-18 18:17:12
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\view\lists\edit\index.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c41edf8cea157_01342132',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'eafa4131e47ea44a432f81f28e386b74274bf93f' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\view\\lists\\edit\\index.tpl',
      1 => 1512138868,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:system/controll.tpl' => 1,
    'file:system/buttons.tpl' => 1,
  ),
),false)) {
function content_5c41edf8cea157_01342132 (Smarty_Internal_Template $_smarty_tpl) {
if (isset($_GET['msg']) && $_GET['msg'] == "apply") {?><div class="apply">Данные были успешно сохранены!</div><?php }?><form action="" method="post"><input type="hidden" name="form_action" value="edit_list">	<table class="table"><thead><tr><th colspan="2">Редактировать список</th></tr></thead><tbody><tr><td class="h w50">Название списка на русском</td><td class="h w50">Системное имя ( латин. символы )</td></tr><tr><td><input name="name" value="<?php echo $_smarty_tpl->tpl_vars['mdd_list']->value[0]['name'];?>
" placeholder="Например: Субъекты федерации"></td><td><input name="list_name" value="<?php echo $_smarty_tpl->tpl_vars['mdd_list']->value[0]['list_name'];?>
" placeholder="Например: regions"></td></tr></tbody></table>	<table class="table"><col><col><col width="120"><col width="120"><col width="55"><thead><tr><th colspan="5">Список значений</th></tr></thead><tbody><tr><td class="h"><?php echo t('titles.name');?>
</td><td class="h">Значение<br><span style="font-weight:normal;color:#777"></span></td><td class="h">По-умолчанию</td><td class="h">Порядок</td><td class="h"></td></tr><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['mdd_list']->value, 'item', false, NULL, 'i', array (
  'iteration' => true,
  'total' => true,
));
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
$_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration']++;
?><tr id="tr<?php echo (isset($_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration'] : null);?>
"><td><input type="hidden" name="field_id[<?php echo (isset($_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration'] : null);?>
]" value="<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
"><input name="var[<?php echo (isset($_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration'] : null);?>
]" placeholder="Например: Краснодарский край" value="<?php echo $_smarty_tpl->tpl_vars['item']->value['var'];?>
"></td><td><input name="value[<?php echo (isset($_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration'] : null);?>
]" placeholder="Например: 23" value="<?php echo $_smarty_tpl->tpl_vars['item']->value['value'];?>
"></td><td><?php $_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'needle'=>$_smarty_tpl->tpl_vars['item']->value['default'],'value'=>"1",'name'=>(("default[").((isset($_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration'] : null))).("]")), 0, true);
?></td><td><input name="ord[<?php echo (isset($_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration'] : null);?>
]" value="<?php echo $_smarty_tpl->tpl_vars['item']->value['ord'];?>
" class="ord integer reducing-trigger"></td><td class="tac"><a href="#" class="zmdi zmdi-delete" title="Удалить" onclick="del_list_fields(<?php echo (isset($_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration'] : null);?>
);return false;"></a></td></tr><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?><tr id="add_btn"><td colspan="5"><a href="#" title="Добавить" class="fr" onclick="add_list_fields_list();return false;"><span class="zmdi zmdi-plus-circle"></span> Добавить</a></td></tr></tbody></table><?php $_smarty_tpl->_subTemplateRender("file:system/buttons.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?></form><?php echo '<script'; ?>
 type="text/javascript">var field_counter = <?php echo (isset($_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['total']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['total'] : null);?>
;<?php echo '</script'; ?>
>
<?php }
}
