{strip}
<form method="post" id="form_usr">
	<input type="hidden" name="action" value="addition_add">

	<table class="table">
		<col width="200">
		<col>
		<thead>
            <tr>
                <th colspan="2">Добавление дополнительных полей</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h">{t('titles.name')} <span class="ness_color">*</span></td>
                <td>
                    <input name="name" class="w50 ness js-binding" data-binding-name="name" data-binding-element="sys_name">
                </td>
            </tr>
            <tr>
                <td class="h">Системное имя<span class="ness_color">*</span></td>
                <td><input name="sys_name" class="w50 ness"></td>
            </tr>
            <tr>
                <td class="h">Тип поля <span class="ness_color">*</span></td>
                <td>
                    <select name="field_type" class="ness" onchange="show_tr(this)">
                        <option value="">..выбрать</option>
                        {foreach item=item from=$field_type}
                            {if $item.id == 1 or $item.id == 6 or $item.id == 10 or $item.id == 11 or $item.id == 12}
                            <option value="{$item.id}">{$item.type}</option>
                            {/if}
                        {/foreach}
                    </select>
                </td>
            </tr>
            <tr id="to_list" {if isset($userAdditions.field_type ) && $userAdditions.field_type < 10}style="display:none"{/if}>
                <td class="h"></td>
                <td>
                    <label class="checkbox-label"><input type="checkbox" onclick="switch_type_fields(this)" value="1"><span class="checkbox"></span> &mdash; привязать к `#__mdd_lists`</label>
                    
                    <div style="display: none" id="case1" class="clearfix">
                        <label class="label label-box">
                            <input name="table_list" placeholder="BIND списка" value="{if isset($userAdditions.table_list )}{$userAdditions.table_list}{/if}">
                        </label>
                    </div>

                    <div id="case2" class="clearfix">
                        <label class="label label-box">
                            <input name="remote_table" placeholder="Название таблицы (#_news)" value="{if isset($userAdditions.table_list )}{$userAdditions.remote_table}{/if}">
                        </label>
                        
                        <label class="label label-box">
                            <input name="remote_field" placeholder="Поле (title)" value="{if isset($userAdditions.table_list )}{$userAdditions.remote_field}{/if}">
                        </label>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="h">Обязательно для заполнения</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "necess"
                        list    = [
                            [ value => '1', text => "Да" ],
                            [ value => '0', text => "Нет", default => true ]
                        ]
                    }
                </td>
            </tr>
            <tr>
                <td class="h">Сортировка</td>
                <td><input name="ord" class="ord" value="0"></td>
            </tr>
        </tbody>
	</table>
	
    {include file="system/buttons.tpl"}
</form>
{/strip}