{strip}
<table class="t1 table module-table" id="mdd_fields">
    <col>
    <col width="150">
    <col width="240">
    <col width="320">
    <col width="85">
    <col width="80">
    <col width="35">
    <col width="35">
    <col width="35">
    <thead>
        <tr>
            <th colspan="9">
                Добавление полей
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
        <tr id="tr1">
            <td class="va_t"><input name="f_name[1]" class="ness"></td>
            <td class="va_t"><input name="f_sys_name[1]" class="ness"></td>
            <td class="va_t">
                <select name="f_type[1]" data-placeholder="Тип поля" class="ness" id="fieldtype_1" onchange="select_type(this)">
                {foreach item=item from=$mmd_fields_type}
                    <option value="{$item.sys_name}">{$item.type}</option>
                {/foreach}
                </select>
            </td>
            <td class="addition va_t">
                {include file="system/group.tpl"
                    name    = "f_width[1]"
                    list    = [
                        [ value => '25', text => "25%" ],
                        [ value => '50', text => "50%" ],
                        [ value => '75', text => "75%" ],
                        [ value => '100', text => "100%", default => true ]
                    ]
                }
            </td>
            <td class="va_m"><input name="f_ord[1]" value="0" class="integer"></td>
            <td class="va_m tac">
                {include file="system/controll.tpl"
                    type        =   "checkbox"
                    addclass    =   "controll_single"
                    name        =   "f_in_list[1]"
                }
            <td class="va_m tac">
                {include file="system/controll.tpl"
                    type        =   "checkbox"
                    addclass    =   "controll_single"
                    name        =   "f_index[1]"
                }
            </td>
            <td class="va_m tac">
                {include file="system/controll.tpl"
                    type        =   "checkbox"
                    addclass    =   "controll_single"
                    name        =   "f_unique[1]"
                }
            </td>
            <td class="va_t tac"></td>
        </tr>
        <tr id="add_btn">
            <td colspan="9">
                <a onclick="add_fields();return false;" class="button-link fr" title="Добавить" href="#"><span class="zmdi zmdi-plus-circle"></span> Добавить</a>
            </td>
        </tr>
    </tbody>
</table>

<script type="text/javascript">
	var field_counter = 1, arr_field_type = [];
	{foreach item=item from=$mmd_fields_type}
	    arr_field_type['{$item.sys_name}'] = '{$item.type}';
	{/foreach}
</script>
{/strip}