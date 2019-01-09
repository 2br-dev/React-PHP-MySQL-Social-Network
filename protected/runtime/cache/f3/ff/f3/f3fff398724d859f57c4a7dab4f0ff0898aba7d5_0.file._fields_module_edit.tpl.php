<?php
/* Smarty version 3.1.32, created on 2019-01-09 17:14:22
  from 'C:\OpenServer\domains\akvatory.local\protected\app\core\admin-template\view\modules\_fields_module_edit.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5c3601be8b45c0_65852461',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'f3fff398724d859f57c4a7dab4f0ff0898aba7d5' => 
    array (
      0 => 'C:\\OpenServer\\domains\\akvatory.local\\protected\\app\\core\\admin-template\\view\\modules\\_fields_module_edit.tpl',
      1 => 1518192858,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:system/group.tpl' => 3,
    'file:system/controll.tpl' => 5,
  ),
),false)) {
function content_5c3601be8b45c0_65852461 (Smarty_Internal_Template $_smarty_tpl) {
?><table class="t1 table module-table" id="mdd_fields"><col><col width="150"><col width="240"><col width="330"><col width="85"><col width="80"><col width="35"><col width="35"><col width="35"><thead><tr><th colspan="9">Редактирование полей</th></tr></thead><tbody><tr><td class="h">Название поля</td><td class="h">Системное имя</td><td class="h">Тип поля</td><td class="h">Дополнительно</td><td class="h">Порядок</td><td class="h">В списке</td><td class="h"><span class="mysql-index"></span></td><td class="h"><span class="mysql-unique"></span></td><td class="h"></td></tr><?php $_smarty_tpl->_assignInScope('zindex', 1000);
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['mdd_fields']->value, 'it', false, NULL, 'i', array (
  'iteration' => true,
  'total' => true,
));
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['it']->value) {
$_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration']++;
$_smarty_tpl->_assignInScope('index', (isset($_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['iteration'] : null));
$_smarty_tpl->_assignInScope('zindex', $_smarty_tpl->tpl_vars['zindex']->value-1);?><tr id="tr<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
" valign="top"<?php if (in_array($_smarty_tpl->tpl_vars['it']->value['f_sys_name'],array('meta_title','meta_keywords','meta_description','meta_robots'))) {?> style="display: none"<?php }?>><td class="va_t"><input name="f_id[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]" value="<?php echo $_smarty_tpl->tpl_vars['it']->value['id'];?>
" type="hidden"><input name="f_name[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]" class="ness" value="<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['it']->value['f_name']);?>
"></td><td class="va_t"><input name="f_sys_name[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]" class="ness" value="<?php echo $_smarty_tpl->tpl_vars['it']->value['f_sys_name'];?>
"></td><td class="va_t"><div style="z-index: <?php echo $_smarty_tpl->tpl_vars['zindex']->value;?>
; position: relative;"><select name="f_type[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]" data-placeholder="Тип поля" class="ness" id="fieldtype_<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
" onchange="select_type(this)"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['mmd_fields_type']->value, 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
?><option value="<?php echo $_smarty_tpl->tpl_vars['item']->value['sys_name'];?>
" <?php if ($_smarty_tpl->tpl_vars['it']->value['f_type'] == $_smarty_tpl->tpl_vars['item']->value['sys_name']) {?>selected<?php }?>><?php echo $_smarty_tpl->tpl_vars['item']->value['type'];?>
</option><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></select></div></td><td class="addition va_t"><?php if ($_smarty_tpl->tpl_vars['it']->value['f_type'] == 'cost' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'autocomplete' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'int' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'hidden' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'document' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'timestamp' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'email' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'list' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'select' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'treeselect' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'float' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'input' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'system' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'multiselect' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'datetime') {
$_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>(("f_width[").($_smarty_tpl->tpl_vars['index']->value)).("]"),'check'=>$_smarty_tpl->tpl_vars['it']->value['f_width'],'list'=>array(array('value'=>'25','text'=>"25%"),array('value'=>'50','text'=>"50%"),array('value'=>'75','text'=>"75%"),array('value'=>'100','text'=>"100%",'default'=>true))), 0, true);
if ($_smarty_tpl->tpl_vars['it']->value['f_type'] == 'list' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'autocomplete' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'select' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'treeselect' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'radio' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'checkbox' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'multiselect' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'system') {?><div class="cb mb10"></div><?php }
}
if ($_smarty_tpl->tpl_vars['it']->value['f_type'] == 'hidden') {?><input value="<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_hidden_default'])) {
echo $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_hidden_default'];
}?>" name="f_hidden_default[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]" placeholder="Значение по умолчанию"><?php }
if ($_smarty_tpl->tpl_vars['it']->value['f_type'] == 'system') {?><input value="<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_binding'])) {
echo $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_binding'];
}?>" name="f_binding[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]" placeholder="Например поле (title)"><?php }
if ($_smarty_tpl->tpl_vars['it']->value['f_type'] == 'date') {?><div class="help-cover"><input name="f_date_format[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]" value="<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_date_format'])) {
echo $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_date_format'];
} else { ?>DD.MM.YYYY<?php }?>" placeholder="Формат даты"><div class="tooltip tooltip-down">D — день,<br>M — месяц (без нуля впереди)<br>DD, MM — день и месяц с нулём впереди для значений от 1 до 9<br>YY — 2-символьное обозначение года<br>YYYY — 4-символьное обозначение года (год пишется полностью)</div></div><?php }
if ($_smarty_tpl->tpl_vars['it']->value['f_type'] == 'file' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'image') {
$_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>(("f_file_count[").($_smarty_tpl->tpl_vars['index']->value)).("]"),'check'=>$_smarty_tpl->tpl_vars['it']->value['f_settings']['f_file_count'],'list'=>array(array('value'=>'0','text'=>"Один файл"),array('value'=>'1','text'=>"Много файлов",'default'=>true))), 0, true);
if ($_smarty_tpl->tpl_vars['it']->value['f_type'] == 'image') {?><div class="cb mb10"></div><?php }
}
if ($_smarty_tpl->tpl_vars['it']->value['f_type'] == 'image' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'gallery') {?><div class="js-size-list"><table class="table-simple"><col><col><col><col width="57"><col width="20"><thead><tr><td class="h">Префикс</td><td class="h">Ширина</td><td class="h">Высота</td><td class="h">Метод</td><td class="h"></td></tr></thead><tbody><?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']) && !empty($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_image_width'])) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_image_width'], 'image', false, 'key', 'im', array (
));
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['key']->value => $_smarty_tpl->tpl_vars['image']->value) {
?><tr data-index="<?php echo $_smarty_tpl->tpl_vars['key']->value;?>
"><td class="va_m"><input name="f_image_prefix[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
][<?php echo $_smarty_tpl->tpl_vars['key']->value;?>
]" class="latin ness tac" value="<?php echo $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_image_prefix'][$_smarty_tpl->tpl_vars['key']->value];?>
" maxlength="7"></td><td class="va_t"><input name="f_image_width[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
][<?php echo $_smarty_tpl->tpl_vars['key']->value;?>
]" class="integer" value="<?php echo $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_image_width'][$_smarty_tpl->tpl_vars['key']->value];?>
"></td><td class="va_t"><input name="f_image_height[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
][<?php echo $_smarty_tpl->tpl_vars['key']->value;?>
]" class="integer" value="<?php echo $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_image_height'][$_smarty_tpl->tpl_vars['key']->value];?>
"></td><td class="va_t"><div class="option-group option-combo option-simple simple"><label title="Crop image"><input type="radio" name="f_image_photo_method[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
][<?php echo $_smarty_tpl->tpl_vars['key']->value;?>
]" value="crop"<?php if ($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_image_photo_method'][$_smarty_tpl->tpl_vars['key']->value] == 'crop') {?> checked<?php }?>><span class="option"><i class="zmdi zmdi-crop-free"></i></span></label><label title="Resize image"><input type="radio" name="f_image_photo_method[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
][<?php echo $_smarty_tpl->tpl_vars['key']->value;?>
]" value="resize"<?php if (!isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_image_photo_method'][$_smarty_tpl->tpl_vars['key']->value]) || $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_image_photo_method'][$_smarty_tpl->tpl_vars['key']->value] == 'resize') {?> checked<?php }?>><span class="option"><i class="zmdi zmdi-photo-size-select-large"></i></span></label></div></td><td class="va_m"><a href="#" class="js-size-delete"><i class="zmdi zmdi-delete"></i></a></td></tr><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}?></tbody></table><a href="#" class="add-size js-add-size" data-iteration="<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
"><i class="zmdi zmdi-plus-circle"></i> Добавить размер</a></div><?php }
if ($_smarty_tpl->tpl_vars['it']->value['f_type'] == 'section' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'autocomplete' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'select' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'treeselect' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'radio' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'checkbox' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'multiselect') {?><div class="cb clearfix"><?php $_smarty_tpl->_assignInScope('checked', false);
if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_use_table_list'])) {
$_smarty_tpl->_assignInScope('checked', true);
}
$_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'name'=>(("f_use_table_list[").($_smarty_tpl->tpl_vars['index']->value)).("]"),'checked'=>$_smarty_tpl->tpl_vars['checked']->value,'value'=>"1",'onchange'=>"switch_types(this)",'text'=>"привязать к `#__mdd_lists`"), 0, true);
?><div class="case case0<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_use_table_list'])) {?> hidden<?php }?>"><input name="f_table_name[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]"<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_use_table_list'])) {?> disabled<?php }?> value="<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_table_name'])) {
echo $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_table_name'];
}?>" class="mb5" placeholder="Название таблицы (#_news)"><input name="f_table_field[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]"<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_use_table_list'])) {?> disabled<?php }?> value="<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_table_field'])) {
echo $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_table_field'];
}?>" placeholder="Поле (title)"></div><div class="case case1<?php if (!isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_use_table_list'])) {?> hidden<?php }?>"><input name="f_table_list[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]"<?php if (!isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_use_table_list'])) {?> disabled<?php }?> placeholder="BIND списка" value="<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_table_list'])) {
echo $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_table_list'];
}?>"></div></div><?php }
if ($_smarty_tpl->tpl_vars['it']->value['f_type'] == 'list') {?><div class="cb clearfix"><?php $_smarty_tpl->_assignInScope('checked', false);
if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_use_table_list'])) {
$_smarty_tpl->_assignInScope('checked', true);
}
$_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'name'=>(("f_use_table_list[").($_smarty_tpl->tpl_vars['index']->value)).("]"),'checked'=>$_smarty_tpl->tpl_vars['checked']->value,'value'=>"1",'onchange'=>"switch_types(this)",'text'=>"привязать к `#__mdd_lists`"), 0, true);
?><div class="case case0<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_use_table_list'])) {?> hidden<?php }?>"><input name="f_table_name[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]"<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_use_table_list'])) {?> disabled<?php }?> value="<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_table_name'])) {
echo $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_table_name'];
}?>" class="mb5" placeholder="Название таблицы (#_news)"><input name="f_table_field[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]"<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_use_table_list'])) {?> disabled<?php }?> value="<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_table_field'])) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_table_field'], 'ft', false, NULL, 'ftypes', array (
  'last' => true,
  'iteration' => true,
  'total' => true,
));
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['ft']->value) {
$_smarty_tpl->tpl_vars['__smarty_foreach_ftypes']->value['iteration']++;
$_smarty_tpl->tpl_vars['__smarty_foreach_ftypes']->value['last'] = $_smarty_tpl->tpl_vars['__smarty_foreach_ftypes']->value['iteration'] === $_smarty_tpl->tpl_vars['__smarty_foreach_ftypes']->value['total'];
echo $_smarty_tpl->tpl_vars['ft']->value;
if (!(isset($_smarty_tpl->tpl_vars['__smarty_foreach_ftypes']->value['last']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_ftypes']->value['last'] : null)) {?>;<?php }
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}?>" placeholder="Поле (title)"></div><div class="case case1<?php if (!isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_use_table_list'])) {?> hidden<?php }?>"><input name="f_table_list[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]"<?php if (!isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_use_table_list'])) {?> disabled<?php }?> placeholder="BIND списка" value="<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_table_list'])) {
echo $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_table_list'];
}?>"></div></div><?php }
if ($_smarty_tpl->tpl_vars['it']->value['f_type'] == 'embedded') {?><div class="j-select-wrapper"><div class="mb5"><select name="f_module[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]" data-placeholder="Выбрать модуль" class="j-select-choosen"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['modules_list']->value, 'm_item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['m_item']->value) {
if ($_smarty_tpl->tpl_vars['m_item']->value['id'] !== $_smarty_tpl->tpl_vars['module_id']->value) {?><option value="<?php echo $_smarty_tpl->tpl_vars['m_item']->value['id'];?>
"<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_module']) && $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_module'] == $_smarty_tpl->tpl_vars['m_item']->value['id']) {?> selected<?php }?>><?php echo $_smarty_tpl->tpl_vars['m_item']->value['name'];?>
</option><?php }
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></select></div><div class="clearfix j-select-container"><select name="f_fields[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
][]" multiple data-placeholder="Выбрать"<?php if (!isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_module'])) {?> disabled<?php }?>><?php if (isset($_smarty_tpl->tpl_vars['it']->value['list']) && !empty($_smarty_tpl->tpl_vars['it']->value['list'])) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['it']->value['list'], 'e');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['e']->value) {
?><option value="<?php echo $_smarty_tpl->tpl_vars['e']->value['sys_name'];?>
"<?php if (isset($_smarty_tpl->tpl_vars['e']->value['checked']) && $_smarty_tpl->tpl_vars['e']->value['checked'] == 1) {?> selected<?php }?>><?php echo $_smarty_tpl->tpl_vars['e']->value['name'];?>
</option><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}?></select></div></div><?php }
if ($_smarty_tpl->tpl_vars['it']->value['f_type'] == 'range' || $_smarty_tpl->tpl_vars['it']->value['f_type'] == 'slider') {?><div class="-col"><div class="-left"><input name="f_range[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
][min]" value="<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_range']['min'])) {
echo $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_range']['min'];
}?>" placeholder="Min" class="integer"></div><div class="-right"><input name="f_range[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
][max]" value="<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_range']['max'])) {
echo $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_range']['max'];
}?>" placeholder="Max" class="integer"></div></div><?php }
if ($_smarty_tpl->tpl_vars['it']->value['f_type'] == 'editor' && isset($_smarty_tpl->tpl_vars['_config']->value['editor'])) {?><div class="option-group option-combo"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['_config']->value['editor'], 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
?><label><input type="radio" name="f_editor[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]" value="<?php echo $_smarty_tpl->tpl_vars['item']->value['system'];?>
"<?php if ((isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_editor']) && $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_editor'] == $_smarty_tpl->tpl_vars['item']->value['system']) || (!isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_editor']) && isset($_smarty_tpl->tpl_vars['item']->value['default']) && $_smarty_tpl->tpl_vars['item']->value['default'] == '1')) {?> checked<?php }?>><span class="option"><?php echo $_smarty_tpl->tpl_vars['item']->value['name'];?>
</span></label><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></div><?php if (isset($_smarty_tpl->tpl_vars['_config']->value['editor_mode'])) {?><div class="cb mb10"></div><div class="option-group"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['_config']->value['editor_mode'], 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
?><label><input type="radio" name="f_editor_mode[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]" value="<?php echo $_smarty_tpl->tpl_vars['item']->value;?>
"<?php if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_editor_mode']) && $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_editor_mode'] == $_smarty_tpl->tpl_vars['item']->value) {?> checked<?php }?>><span class="option"><?php echo $_smarty_tpl->tpl_vars['item']->value;?>
</span></label><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></div><?php }
}
if ($_smarty_tpl->tpl_vars['it']->value['f_type'] == 'redactor' && isset($_smarty_tpl->tpl_vars['_config']->value['redactor'])) {
$_smarty_tpl->_assignInScope('redactor_type', 'imperavi');
if (isset($_smarty_tpl->tpl_vars['it']->value['f_settings']['f_redactor'])) {
$_smarty_tpl->_assignInScope('redactor_type', $_smarty_tpl->tpl_vars['it']->value['f_settings']['f_redactor']);
}
$_smarty_tpl->_subTemplateRender("file:system/group.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('name'=>(("f_redactor[").($_smarty_tpl->tpl_vars['index']->value)).("]"),'check'=>$_smarty_tpl->tpl_vars['redactor_type']->value,'list'=>$_smarty_tpl->tpl_vars['_config']->value['redactor_list']), 0, true);
}?></td><td class="va_m"><input name="f_ord[<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
]" value="<?php echo $_smarty_tpl->tpl_vars['it']->value['ord'];?>
" class="integer"></td><td class="va_m tac"><?php $_smarty_tpl->_assignInScope('checked', false);
if ($_smarty_tpl->tpl_vars['it']->value['in_list']) {
$_smarty_tpl->_assignInScope('checked', true ,true);
}
$_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'addclass'=>"controll_single",'name'=>(("f_in_list[").($_smarty_tpl->tpl_vars['index']->value)).("]"),'checked'=>$_smarty_tpl->tpl_vars['checked']->value,'value'=>"1"), 0, true);
?></td><td class="va_m tac"><?php $_smarty_tpl->_assignInScope('checked', false);
if ($_smarty_tpl->tpl_vars['it']->value['f_index']) {
$_smarty_tpl->_assignInScope('checked', true ,true);
}
$_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'addclass'=>"controll_single",'name'=>(("f_index[").($_smarty_tpl->tpl_vars['index']->value)).("]"),'checked'=>$_smarty_tpl->tpl_vars['checked']->value,'value'=>"1"), 0, true);
?></td><td class="va_m tac"><?php $_smarty_tpl->_assignInScope('checked', false);
if ($_smarty_tpl->tpl_vars['it']->value['f_unique']) {
$_smarty_tpl->_assignInScope('checked', true ,true);
}
$_smarty_tpl->_subTemplateRender("file:system/controll.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"checkbox",'addclass'=>"controll_single",'name'=>(("f_unique[").($_smarty_tpl->tpl_vars['index']->value)).("]"),'checked'=>$_smarty_tpl->tpl_vars['checked']->value,'value'=>"1"), 0, true);
?></td><td class="tac va_t"><a href="#" class="zmdi zmdi-delete" title="Удалить" onclick="del_fields(<?php echo $_smarty_tpl->tpl_vars['index']->value;?>
);return false;"></td></tr><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?><tr id="add_btn"><td colspan="9"><a onclick="add_fields();return false;" class="button-link fr" title="Добавить" href="#"><span class="zmdi zmdi-plus-circle"></span> Добавить</a></td></tr></tbody></table><?php echo '<script'; ?>
 type="text/javascript">var field_counter = <?php echo (isset($_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['total']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_i']->value['total'] : null);?>
, arr_field_type = [];<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['mmd_fields_type']->value, 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
?>arr_field_type['<?php echo $_smarty_tpl->tpl_vars['item']->value['sys_name'];?>
'] = '<?php echo $_smarty_tpl->tpl_vars['item']->value['type'];?>
';<?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
echo '</script'; ?>
><?php }
}
