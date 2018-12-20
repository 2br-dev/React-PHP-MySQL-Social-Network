{strip}
<form method="post" id="form_usr">
	<input type="hidden" name="action" value="addition_edit">
		
	<table class="table">
		<col width="200">
		<col>
		<thead>
            <tr>
                <th colspan="2">Редактирование дополнительных полей</th>
            </tr>
		</thead>
		<tbody>
            <tr>
                <td class="h">{t('titles.name')} <span class="ness_color">*</span></td>
                <td>
                    <input name="name" class="w50 ness js-binding" data-binding-name="name" data-binding-element="sys_name" value="{$userAdditions.name}">
                </td>
            </tr>
            <tr>
                <td class="h">Системное имя<span class="ness_color">*</span></td>
                <td><input name="sys_name" class="w50 ness" value="{$userAdditions.sys_name}"></td>
            </tr>
            <tr>
                <td class="h">Тип поля <span class="ness_color">*</span></td>
                <td>
                    <select name="field_type" class="ness" onchange="show_tr(this)">
                        <option value="">..выбрать</option>
                        {foreach item=item from=$field_type}
                            {if $item.id == 1 or $item.id == 6 or $item.id == 10 or $item.id == 11 or $item.id == 12}
                            <option value="{$item.id}"{if $userAdditions.field_type == $item.id} selected="selected"{/if}>{$item.type}</option>
                            {/if}
                        {/foreach}
                    </select>
                </td>
            </tr>
            <tr id="to_list">
                <td class="h"></td>
                <td>
                    <label class="checkbox-label"><input type="checkbox" onclick="switch_type_fields(this)" value="1"{if !$userAdditions.remote_table} checked{/if}><span class="checkbox"></span> &mdash; Привязать к списку или таблице</label>
                    
                    <div{if $userAdditions.remote_table} style="display: none"{/if} id="case1" class="clearfix">
                        <label class="label label-box">
                            <input name="table_list" placeholder="BIND списка" value="{$userAdditions.table_list}">
                        </label>
                    </div>

                    <div{if !$userAdditions.remote_table} style="display: none"{/if} id="case2" class="clearfix">
                        <label class="label label-box">
                            <input name="remote_table" placeholder="Название таблицы (#_news)" value="{$userAdditions.remote_table}">
                        </label>
                        
                        <label class="label label-box">
                            <input name="remote_field" placeholder="Поле (title)" value="{$userAdditions.remote_field}">
                        </label>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="h">Обязательно для заполнения</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "necess"
                        check   = $userAdditions.necess
                        list    = [
                            [ value => '1', text => "Да" ],
                            [ value => '0', text => "Нет", default => true ]
                        ]
                    }
                </td>
            </tr>
            <tr>
                <td class="h">Сортировка</td>
                <td><input name="ord" class="ord integer reducing-trigger" value="{$userAdditions.ord}"></td>
            </tr>
        </tbody>
	</table>
	
    {include file="system/buttons.tpl"}
</form>
{/strip}