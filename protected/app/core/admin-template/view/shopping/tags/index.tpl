{strip}
<div class="managing">
	<div class="managing__start">
		<div class="managing__item">
			<a href="{$base_path}/tags/add" class="button button-green">
				<i class="icon icon-plus-square"></i>Добавить тег
			</a>
		</div>

		{if !empty($smarty.get)}
		<div class="managing__item">
			<a href="{$base_path}/tags" class="button"><i class="icon icon-format-clear-all"></i>Сбросить фильтры</a>
		</div>
		{/if}

		<div class="managing__item catalog-disable" id="remove-button">
			<button type="button" class="button button-red">{* onclick="shopping.deleteAll(event)" *}
				<i class="icon icon-delete"></i>Удалить выбранные теги
			</button>
		</div>
	</div>

	<div class="managing__end">
		<div class="managing__limit">
			<span class="managing__limit__label">{t('on.the.page')}:</span>

			<div class="managing__limit__select">
				<select name="limit" onchange="shopping.setLimit('tags', this)">
					{foreach $page_count as $page}
						<option value="{$page}"{if $page == $limit} selected{/if}>{$page}</option>
					{/foreach}
				</select>
			</div>
		</div>
	</div>
</div>

<table class="module-table" id="module-table">
	<colgroup>
		<col width="30"> 	{* Чекбокс *}
		<col width="50"> 	{* Номер *}
		<col> 				{* Наименование *}
		<col width="40"> 	{* Действия *}
	</colgroup>
	<thead>
		<tr>
			<th class="module-table__header module-table__center">
				{include file="system/controll.tpl"
					type        =   "checkbox"
					addclass    =   "controll_single"
					name        =   "checked"
					onchange    =   "shopping.checkAll(this)"
				}
			</th>
			<th class="module-table__header">
				<span class="module-table__sort{if $sort.name == 'id'} {$sort.by}{/if}" onclick="shopping.sort('id')">№</span>
			</th>
			<th class="module-table__header">
				<span class="module-table__sort{if $sort.name == 'name'} {$sort.by}{/if}" onclick="shopping.sort('name')">Наименование</span>
			</th>
			<th class="module-table__header"></th>
		</tr>
		<tr>
			<td class="module-table__sub-header"></td>
			<td class="module-table__sub-header">
				<input name="id" class="catalog-input integer"{if $search.id} value="{$search.id}"{/if} placeholder="ID" onkeypress="shopping.search('id', this.value, true, event)">
			</td>
			<td class="module-table__sub-header">
				<input name="name" class="catalog-input"{if $search.name} value="{$search.name}"{/if} placeholder="Поиск по названию..." onkeypress="shopping.search('name', this.value, true, event)">
			</td>
			<td class="module-table__sub-header"></td>
		</tr>
	</thead>

	<tbody>
	{if $tags}
		{foreach $tags as $key => $tag}
		<tr data-id="{$tag.id}" id="catalog-row-{$tag.id}" class="module-table__row product-row{if $marked == $tag.id} module-table__row--marked{/if}">
			<td class="module-table__column module-table__vhcenter">
			    {include file="system/controll.tpl"
			        type        =   "checkbox"
			        addclass    =   "controll_single"
			        ctrlclass   =   "check-all-spy"
			        name        =   "order["|cat:$tag.id|cat:"]"
			        value       =   $tag.id
			        onchange    =   "shopping.checkItem(this)"
			    }
			</td>

			<td class="module-table__column module-table__vhcenter">{$tag.id}</td>

			<td class="module-table__column">
				<a href="{$base_path}/tags/edit/{$tag.id}?backuri={$_backuri}" class="module-table__link" title="Редактировать">
					<span class="catalog-edit icon icon-edit"></span> {$tag.name}
				</a>
			</td>

		    <td class="module-table__column module-table__vhcenter">
				<a href="{$base_path}/tags/del/{$tag.id}?backuri={$_backuri}" onclick="return cp.dialog('Вы действительно хотите удалить?')" class="catalog-remove remove-trigger" title="Удалить" data-no-instant>
		    		<i class="icon icon-delete"></i>
		    	</a>
		    </td>
		</tr>
		{/foreach}
	{else}
		<tr>
			<td colspan="4" class="empty-row">
				Тегов нет
			</td>
		</tr>
	{/if}
	</tbody>
</table>

{include file="system/pager.inc.tpl"}
{/strip}