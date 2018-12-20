{strip}
<table class="t1 table module-table" id="mdd_fields">
    <col>
    <col width="150">
    <col width="240">
    <col width="330">
    <col width="85">
    <col width="80">
    <col width="35">
    <col width="35">
    <col width="35">
    <thead>
        <tr>
            <th colspan="9">
                Редактирование полей
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="h">Название поля</td>
            <td class="h">Системное имя</td>
            <td class="h">Тип поля</td>
            <td class="h">Дополнительно</td>
            <td class="h">Порядок</td>
            <td class="h">В списке</td>
            <td class="h"><span class="mysql-index"></span></td>
            <td class="h"><span class="mysql-unique"></span></td>
            <td class="h"></td>
        </tr>
        {assign var="zindex" value=1000}
        {foreach item=it from=$mdd_fields name=i}{$index = $smarty.foreach.i.iteration}
        {assign var="zindex" value=$zindex-1}
        <tr id="tr{$index}" valign="top"{if in_array($it.f_sys_name, array('meta_title', 'meta_keywords', 'meta_description', 'meta_robots'))} style="display: none"{/if}>
            <td class="va_t">
                <input name="f_id[{$index}]" value="{$it.id}" type="hidden">
                <input name="f_name[{$index}]" class="ness" value="{$it.f_name|htmlspecialchars}">
            </td>
            <td class="va_t"><input name="f_sys_name[{$index}]" class="ness" value="{$it.f_sys_name}"></td>
            <td class="va_t">
                <div style="z-index: {$zindex}; position: relative;">
                    <select name="f_type[{$index}]" data-placeholder="Тип поля" class="ness" id="fieldtype_{$index}" onchange="select_type(this)">
                    {foreach item=item from=$mmd_fields_type}
                        <option value="{$item.sys_name}" {if $it.f_type == $item.sys_name}selected{/if}>{$item.type}</option>
                    {/foreach}
                    </select>
                </div>
            </td>
            <td class="addition va_t">
                {if $it.f_type == 'cost' || $it.f_type == 'autocomplete' || $it.f_type == 'int' || $it.f_type == 'hidden' || $it.f_type == 'document' || $it.f_type == 'timestamp' || $it.f_type == 'email' || $it.f_type == 'list' || $it.f_type == 'select' || $it.f_type == 'treeselect' || $it.f_type == 'float' || $it.f_type == 'input' || $it.f_type == 'system' || $it.f_type == 'multiselect' || $it.f_type == 'datetime'}
                    
                    {include file="system/group.tpl"
                        name    = "f_width["|cat:$index|cat:"]"
                        check   = $it.f_width
                        list    = [
                            [ value => '25', text => "25%" ],
                            [ value => '50', text => "50%" ],
                            [ value => '75', text => "75%" ],
                            [ value => '100', text => "100%", default => true ]
                        ]
                    }

                    {if $it.f_type == 'list' || $it.f_type == 'autocomplete' || $it.f_type == 'select' || $it.f_type == 'treeselect' || $it.f_type == 'radio' || $it.f_type == 'checkbox' || $it.f_type == 'multiselect' || $it.f_type == 'system'}
                        <div class="cb mb10"></div>
                    {/if}
                {/if}
                
                {if $it.f_type == 'hidden'}
                    <input value="{if isset($it.f_settings.f_hidden_default )}{$it.f_settings.f_hidden_default}{/if}" name="f_hidden_default[{$index}]" placeholder="Значение по умолчанию">
                {/if}
                
                {if $it.f_type == 'system'}
                    <input value="{if isset($it.f_settings.f_binding )}{$it.f_settings.f_binding}{/if}" name="f_binding[{$index}]" placeholder="Например поле (title)">
                {/if}
                
                {if $it.f_type == 'date'}
                    <div class="help-cover">
                        <input name="f_date_format[{$index}]" value="{if isset($it.f_settings.f_date_format )}{$it.f_settings.f_date_format}{else}DD.MM.YYYY{/if}" placeholder="Формат даты">
                        <div class="tooltip tooltip-down">
                            D — день,<br>
                            M — месяц (без нуля впереди)<br>
                            DD, MM — день и месяц с нулём впереди для значений от 1 до 9<br>
                            YY — 2-символьное обозначение года<br>
                            YYYY — 4-символьное обозначение года (год пишется полностью)
                        </div>
                    </div>
                {/if}
                
                {if $it.f_type == 'file' || $it.f_type == 'image'}
                    {include file="system/group.tpl"
                        name    = "f_file_count["|cat:$index|cat:"]"
                        check   = $it.f_settings.f_file_count
                        list    = [
                            [ value => '0', text => "Один файл" ],
                            [ value => '1', text => "Много файлов", default => true ]
                        ]
                    }

                    {if $it.f_type == 'image'}
                        <div class="cb mb10"></div>
                    {/if}
                {/if}

                {if $it.f_type == 'image' || $it.f_type == 'gallery'}
                <div class="js-size-list">
                    <table class="table-simple">
                        <col>
                        <col>
                        <col>
                        <col width="57">
                        <col width="20">
                        <thead>
                            <tr>
                                <td class="h">Префикс</td>
                                <td class="h">Ширина</td>
                                <td class="h">Высота</td>
                                <td class="h">Метод</td>
                                <td class="h"></td>
                            </tr>
                        </thead>
                        <tbody>
                            {if isset($it.f_settings) && !empty($it.f_settings.f_image_width)}
                                {foreach from=$it.f_settings.f_image_width key=key item=image name=im}
                                <tr data-index="{$key}">
                                    <td class="va_m"><input name="f_image_prefix[{$index}][{$key}]" class="latin ness tac" value="{$it.f_settings.f_image_prefix[$key]}" maxlength="7"></td>
                                    <td class="va_t"><input name="f_image_width[{$index}][{$key}]" class="integer" value="{$it.f_settings.f_image_width[$key]}"></td>
                                    <td class="va_t"><input name="f_image_height[{$index}][{$key}]" class="integer" value="{$it.f_settings.f_image_height[$key]}"></td>
                                    <td class="va_t">
                                        <div class="option-group option-combo option-simple simple">
                                            <label title="Crop image"><input type="radio" name="f_image_photo_method[{$index}][{$key}]" value="crop"{if $it.f_settings.f_image_photo_method[$key] == 'crop'} checked{/if}><span class="option"><i class="zmdi zmdi-crop-free"></i></span></label>
                                            <label title="Resize image"><input type="radio" name="f_image_photo_method[{$index}][{$key}]" value="resize"{if !isset($it.f_settings.f_image_photo_method[$key]) || $it.f_settings.f_image_photo_method[$key] == 'resize'} checked{/if}><span class="option"><i class="zmdi zmdi-photo-size-select-large"></i></span></label>
                                        </div>
                                    </td>
                                    <td class="va_m">
                                        <a href="#" class="js-size-delete"><i class="zmdi zmdi-delete"></i></a>
                                    </td>
                                </tr>
                                {/foreach}
                            {/if}
                        </tbody>
                    </table>

                    <a href="#" class="add-size js-add-size" data-iteration="{$index}"><i class="zmdi zmdi-plus-circle"></i> Добавить размер</a>
                </div>
                {/if}
                
                {if $it.f_type == 'section' || $it.f_type == 'autocomplete' || $it.f_type == 'select' || $it.f_type == 'treeselect' || $it.f_type == 'radio' || $it.f_type == 'checkbox' || $it.f_type == 'multiselect'}
                    <div class="cb clearfix">
                        
                        {$checked = false}

                        {if isset($it.f_settings.f_use_table_list)}
                            {$checked = true}
                        {/if}

                        {include file="system/controll.tpl"
                            type        =   "checkbox"
                            name        =   "f_use_table_list["|cat:$index|cat:"]"
                            checked     =   $checked
                            value       =   "1"
                            onchange    =   "switch_types(this)"
                            text        =   "привязать к `#__mdd_lists`"
                        }

                        <div class="case case0{if isset($it.f_settings.f_use_table_list )} hidden{/if}">
                            <input name="f_table_name[{$index}]"{if isset($it.f_settings.f_use_table_list )} disabled{/if} value="{if isset($it.f_settings.f_table_name )}{$it.f_settings.f_table_name}{/if}" class="mb5" placeholder="Название таблицы (#_news)">
                            <input name="f_table_field[{$index}]"{if isset($it.f_settings.f_use_table_list )} disabled{/if} value="{if isset($it.f_settings.f_table_field )}{$it.f_settings.f_table_field}{/if}" placeholder="Поле (title)">
                        </div>
                        
                        <div class="case case1{if !isset($it.f_settings.f_use_table_list )} hidden{/if}">
                            <input name="f_table_list[{$index}]"{if !isset($it.f_settings.f_use_table_list )} disabled{/if} placeholder="BIND списка" value="{if isset($it.f_settings.f_table_list )}{$it.f_settings.f_table_list}{/if}">
                        </div>
                    </div>
                {/if}

                {if $it.f_type == 'list'}
                    <div class="cb clearfix">
                        {$checked = false}

                        {if isset($it.f_settings.f_use_table_list)}
                            {$checked = true}
                        {/if}

                        {include file="system/controll.tpl"
                            type        =   "checkbox"
                            name        =   "f_use_table_list["|cat:$index|cat:"]"
                            checked     =   $checked
                            value       =   "1"
                            onchange    =   "switch_types(this)"
                            text        =   "привязать к `#__mdd_lists`"
                        }
                        
                        <div class="case case0{if isset($it.f_settings.f_use_table_list )} hidden{/if}">
                            <input name="f_table_name[{$index}]"{if isset($it.f_settings.f_use_table_list )} disabled{/if} value="{if isset($it.f_settings.f_table_name )}{$it.f_settings.f_table_name}{/if}" class="mb5" placeholder="Название таблицы (#_news)">
                            <input name="f_table_field[{$index}]"{if isset($it.f_settings.f_use_table_list )} disabled{/if} value="{if isset($it.f_settings.f_table_field )}{foreach from=$it.f_settings.f_table_field item=ft name=ftypes}{$ft}{if !$smarty.foreach.ftypes.last};{/if}{/foreach}{/if}" placeholder="Поле (title)">
                        </div>
                        
                        <div class="case case1{if !isset($it.f_settings.f_use_table_list )} hidden{/if}">
                            <input name="f_table_list[{$index}]"{if !isset($it.f_settings.f_use_table_list )} disabled{/if} placeholder="BIND списка" value="{if isset($it.f_settings.f_table_list )}{$it.f_settings.f_table_list}{/if}">
                        </div>
                    </div>
                {/if}
                
                {if $it.f_type == 'embedded'}
                <div class="j-select-wrapper">
                    <div class="mb5">
                        <select name="f_module[{$index}]" data-placeholder="Выбрать модуль" class="j-select-choosen">
                            {foreach $modules_list as $m_item}
                            {if $m_item.id !== $module_id}
                                <option value="{$m_item.id}"{if isset($it.f_settings.f_module) && $it.f_settings.f_module == $m_item.id} selected{/if}>{$m_item.name}</option>
                            {/if}
                            {/foreach}
                        </select>
                    </div>

                    <div class="clearfix j-select-container">
                        <select name="f_fields[{$index}][]" multiple data-placeholder="Выбрать"{if !isset($it.f_settings.f_module)} disabled{/if}>
                        {if isset($it.list) && !empty($it.list)}
                            {foreach from=$it.list item=e}
                            <option value="{$e.sys_name}"{if isset($e.checked) && $e.checked == 1} selected{/if}>{$e.name}</option>
                            {/foreach}
                        {/if}
                        </select>
                    </div>
                </div>
                {/if}
                
                {if $it.f_type == 'range' || $it.f_type == 'slider'}
                    <div class="-col">
                        <div class="-left">
                            <input name="f_range[{$index}][min]" value="{if isset($it.f_settings.f_range.min )}{$it.f_settings.f_range.min}{/if}" placeholder="Min" class="integer">
                        </div>
                        <div class="-right">
                            <input name="f_range[{$index}][max]" value="{if isset($it.f_settings.f_range.max )}{$it.f_settings.f_range.max}{/if}" placeholder="Max" class="integer">        
                        </div>
                    </div>
                {/if}
                
                {if $it.f_type == 'editor' &&  isset($_config.editor )}
                    <div class="option-group option-combo">
                        {foreach from=$_config.editor item=item}
                        <label><input type="radio" name="f_editor[{$index}]" value="{$item.system}"{if ( isset($it.f_settings.f_editor ) && $it.f_settings.f_editor == $item.system ) || ( !isset($it.f_settings.f_editor ) && isset($item.default ) && $item.default == '1' )} checked{/if}><span class="option">{$item.name}</span></label>
                        {/foreach}
                    </div>
                    
                    {if isset($_config.editor_mode )}
                        <div class="cb mb10"></div>
                        
                        <div class="option-group">
                            {foreach from=$_config.editor_mode item=item}
                            <label><input type="radio" name="f_editor_mode[{$index}]" value="{$item}"{if isset($it.f_settings.f_editor_mode ) && $it.f_settings.f_editor_mode == $item} checked{/if}><span class="option">{$item}</span></label>
                            {/foreach}
                        </div>
                    {/if}
                {/if}
                
                {if $it.f_type == 'redactor' &&  isset($_config.redactor )}
                    
                    {$redactor_type = 'imperavi'}

                    {if isset($it.f_settings.f_redactor)}
                        {$redactor_type = $it.f_settings.f_redactor}
                    {/if}

                    {include file="system/group.tpl"
                        name    = "f_redactor["|cat:$index|cat:"]"
                        check   = $redactor_type
                        list    = $_config.redactor_list
                    }
                {/if}
            </td>
            <td class="va_m">
                <input name="f_ord[{$index}]" value="{$it.ord}" class="integer">
            </td>
            <td class="va_m tac">
                {$checked = false}

                {if $it.in_list nocache}
                    {$checked = true}
                {/if}

                {include file="system/controll.tpl"
                    type        =   "checkbox"
                    addclass    =   "controll_single"
                    name        =   "f_in_list["|cat:$index|cat:"]"
                    checked     =   $checked
                    value       =   "1"
                }
            </td>
            <td class="va_m tac">
                {$checked = false}

                {if $it.f_index nocache}
                    {$checked = true}
                {/if}

                {include file="system/controll.tpl"
                    type        =   "checkbox"
                    addclass    =   "controll_single"
                    name        =   "f_index["|cat:$index|cat:"]"
                    checked     =   $checked
                    value       =   "1"
                }
            </td>
            <td class="va_m tac">
                {$checked = false}

                {if $it.f_unique nocache}
                    {$checked = true}
                {/if}

                {include file="system/controll.tpl"
                    type        =   "checkbox"
                    addclass    =   "controll_single"
                    name        =   "f_unique["|cat:$index|cat:"]"
                    checked     =   $checked
                    value       =   "1"
                }
            </td>
            <td class="tac va_t"><a href="#" class="zmdi zmdi-delete" title="Удалить" onclick="del_fields({$index});return false;"></td>
        </tr>
        {/foreach}
        <tr id="add_btn">
            <td colspan="9">
                <a onclick="add_fields();return false;" class="button-link fr" title="Добавить" href="#"><span class="zmdi zmdi-plus-circle"></span> Добавить</a>
            </td>
        </tr>
    </tbody>
</table>

<script type="text/javascript">
	var field_counter = {$smarty.foreach.i.total}, arr_field_type = [];
	{foreach item=item from=$mmd_fields_type}
	    arr_field_type['{$item.sys_name}'] = '{$item.type}';
	{/foreach}
</script>
{/strip}