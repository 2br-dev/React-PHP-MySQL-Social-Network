{strip}

{if $smarty.get.act == 'good'}
	<p class="apply success">Импорт успешно завершен! Вернуться в  <a href="{$base_path}/meta/index{$field_info.module_id}">{$field_info.module_name}</a></p>
{else}

	<p class="apply notice">Импорт файлов в модуль <a href="{$base_path}/meta/index/{$field_info.module_id}">{$field_info.module_name}</a> для поля <b>{$field_info.f_name}</b></p>

	<table class="table">
		<tr class="th">
			<th colspan="2">Список фалов для импорта</th>
		</tr>
		<tr>
			<td class="h">Файл</td>
			<td class="h" style="width:100px">Размер</td>
		</tr>
		{foreach item=item from=$rDir name=i}
		<tr>
			<td{if $smarty.foreach.i.iteration % 2 == 0} class="odd"{/if}>{$item.name}</td>
			<td{if $smarty.foreach.i.iteration % 2 == 0} class="odd"{/if}>{$item.info.0}x{$item.info.1}px</td>
		</tr>
		{foreachelse}
		<tr>
			<td class="c h100 odd" style="vertical-align:middle" colspan="2"><b>Файлы отсутствуют</b></td>
		</tr>
		{/foreach}
	</table>

	<div class="button-container">
		<a href="./?act=import&field_id={$smarty.get.field_id}&group_id={$smarty.get.group_id}" class="button button-green">Импортировать</a>
	</div>
{/if}
{/strip}