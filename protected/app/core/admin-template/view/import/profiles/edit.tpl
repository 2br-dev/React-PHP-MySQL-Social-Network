{strip}
{if $profiles nocache}
<div class="width-75">
	<table class="table">
	    <col>
	    <col width="240">
	    <col width="130">
	    <col width="35">
	    <thead>
	        <tr class="th">
	            <th colspan="4">Список полей</th>
	        </tr>
	    </thead>
	    <tbody>
	        <tr>
	            <td class="h">Наименование</td>
	            <td class="h">Поле</td>
	            <td class="h">Индекс в файле</td>
	            <td class="h"></td>
	        </tr>
	    {foreach from=$profiles item=item name=profiles}
	        <tr>
	            <td>{$item.name}</td>
	            <td>{$item.module_field}</td>
	            <td>{$item.col_index}</td>
	            <td class="tac">
	                <a href="./del-field/{$item.id}/" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить поле?')" data-no-instant></a>
	            </td>
	        </tr>
	    {/foreach}
	    </tbody>
	</table>
</div>
{/if}

<form method="POST">
{if !$module_id nocache}
    <input name="action" value="add_module" type="hidden">
	
	{if $modules}
	<div class="width-25">
		<div class="label">
			<div class="name">Выбрать модуль</div>
			<select name="module_id">
			{foreach from=$modules item=item}
				<option value="{$item.id}">{$item.name}</option>
			{/foreach}
			</select>
		</div>
	</div>
	{/if}

	<div class="button-container clearfix">
        <button class="button button-green" type="submit" data-no-instant><i class="zmdi zmdi-save"></i>Добавить профиль</button>
    </div>
{else nocache}
	<input name="action" value="add_fields" type="hidden">
	<input name="module_id" value="{$module_id}" type="hidden">
	
	<div class="width-25">
		<div class="label">
			<div class="name">Наименование поля</div>
			<input name="name">
		</div>
	</div>

	<div class="width-25">
		<div class="label">
			<div class="name">Индекс в файле (начинается с 0)</div>
			<input name="index" class="integer">
		</div>
	</div>

	{if $fields}
	<div class="width-25">
		<div class="label">
			<div class="name">Поле в модуле</div>
			<select name="field_name">
			{foreach from=$fields item=item}
				<option value="{$item.f_sys_name}">{$item.f_name}</option>
			{/foreach}
			</select>
		</div>
	</div>
	{/if}
	
	{include file="system/buttons.tpl"}
{/if}
</form>
{/strip}