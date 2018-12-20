{strip}
<div class="managing">
	<div class="managing__start">
		<div class="managing__item">
			<a href="{$base_path}/manufacturer/add" class="button button-green">
				<i class="icon icon-plus-square"></i>Добавить производителя
			</a>
		</div>

		{if !empty($smarty.get)}
		<div class="managing__item">
			<a href="{$base_path}/catalog" class="button"><i class="icon icon-format-clear-all"></i>Сбросить фильтры</a>
		</div>
		{/if}

		<div class="managing__item catalog-disable" id="remove-button">
			<button type="button" class="button button-red">{* onclick="shopping.deleteAll(event)" *}
				<i class="icon icon-delete"></i>Удалить выбранных производителей
			</button>
		</div>
	</div>

	<div class="managing__end">
		<div class="managing__limit">
			<span class="managing__limit__label">{t('on.the.page')}:</span>

			<div class="managing__limit__select">
				<select name="limit" onchange="shopping.setLimit('manufacturer', this)">
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
		<col> 				{* Системное имя *}
		<col width="60"> 	{* На сайте *}
		<col width="70"> 	{* Порядок *}
		<col width="50"> 	{* Отображать *}
		<col width="30"> 	{* Действия *}
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
			<th class="module-table__header">
				<span class="module-table__sort{if $sort.name == 'system'} {$sort.by}{/if}" onclick="shopping.sort('system')">Системное имя</span>
			</th>
			<th class="module-table__header module-table__center">Ссылка</th>
			<th class="module-table__header module-table__center">Порядок</th>
			<th class="module-table__header module-table__center"><i class="catalog-eye icon icon-eye"></i></th>
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
			<td class="module-table__sub-header">
				<input name="system" class="catalog-input"{if $search.system} value="{$search.system}"{/if} placeholder="Поиск по системному имени..." onkeypress="shopping.search('system', this.value, true, event)">
			</td>
			<td class="module-table__sub-header"></td>
			<td class="module-table__sub-header"></td>
			<td class="module-table__sub-header module-table__center">
				<label class="switch">
					<input name="special" value="1" onchange="shopping.search('special', Number(this.checked))" type="checkbox"{if $search.special == 1} checked{/if}>
					<div class="slider"></div>
				</label>
			</td>
			<td class="module-table__sub-header"></td>
		</tr>
	</thead>
	<tbody>

	{if $manufacturer}
		{foreach $manufacturer as $brand}
		<tr data-id="{$brand.id}" id="brand-row-{$brand.id}" class="module-table__row">
			<td class="module-table__column module-table__vhcenter">
			    {include file="system/controll.tpl"
			        type        =   "checkbox"
			        addclass    =   "controll_single"
			        ctrlclass   =   "check-all-spy"
			        name        =   "order["|cat:$brand.id|cat:"]"
			        value       =   $brand.id
			        onchange    =   "shopping.checkItem(this)"
			    }
			</td>

			<td class="module-table__column module-table__vhcenter">{$brand.id}</td>

			<td class="module-table__column">
				<a href="{$base_path}/manufacturer/edit/{$brand.id}?backuri={$_backuri}" class="module-table__link" title="Редактировать">
					<span class="catalog-edit icon icon-edit"></span> {$brand.name}
				</a>
			</td>

			<td class="module-table__column">{$brand.system}</td>

			<td class="module-table__column module-table__vhcenter">
			{if $brand.link}
				<a href="{$brand.link}" class="catalog-view" target="_blank">
					<i class="icon icon-open-in-new"></i>
				</a>
			{else}
				<span class="catalog-view-broken">
					<i class="icon icon-open-in-new"></i>
				</span>
			{/if}
			</td>

			<td class="module-table__column module-table__vhcenter">{$brand.ord}</td>

			<td class="module-table__column module-table__vhcenter">
				<label class="switch">
					<input name="visible" onchange="shopping.update(event, 'visible', {$brand.id})" type="checkbox"{if $brand.visible == 1} checked {/if}>
					<div class="slider"></div>
				</label>
			</td>

		    <td class="module-table__column module-table__vhcenter">
				<a href="{$base_path}/manufacturer/del/{$brand.id}?backuri={$_backuri}" onclick="return shopping.deleteManufacturer(event, {$brand.id})" class="catalog-remove" title="Удалить" data-no-instant>
		    		<i class="icon icon-delete"></i>
		    	</a>
		    </td>

		</tr>
		{/foreach}
	{else}
		<tr>
			<td colspan="7" class="module-table__empty">
				Тегов нет
			</td>
		</tr>
	{/if}
	</tbody>
</table>

{include file="system/pager.inc.tpl"}
{/strip}