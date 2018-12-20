{strip}

{if $profile_list}
<div class="width-25">
	<table class="table">
	    <col>
	    <col width="35">
	    <thead>
	        <tr class="th">
	            <th colspan="2">Список профилей</th>
	        </tr>
	    </thead>
	    <tbody>
	        <tr>
	            <td class="h">Модуль</td>
	            <td class="h"></td>
	        </tr>
			{foreach from=$profile_list item=item}
			<tr>
	            <td><a href="{$base_path}/profiles/edit/{$item.module_id}">{$item.name}</a></td>
	            <td class="tac">
	                <a href="{$base_path}/profiles/del/{$item.module_id}" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить профиль?')" data-no-instant></a>
	            </td>
	        </tr>
			{/foreach}
	    </tbody>
	</table>
</div>
{/if}

<a href="{$base_path}/profiles/add" class="button">
	<i class="zmdi zmdi-plus-circle"></i>Добавить профиль
</a>
{/strip}