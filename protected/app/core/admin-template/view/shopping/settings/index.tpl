{strip}
<div class="widget-list">

	<div class="widget">
		<div class="widget__title">Характеристики</div>

		<div class="widget__button">
			<button class="button" type="button"><i class="icon icon-settings"></i>Настроить</button>
		</div>
	</div>

	<div class="widget">
		<div class="widget__title">Способы оплаты</div>

		<div class="widget__button">
			<button class="button" type="button"><i class="icon icon-settings"></i>Настроить</button>
		</div>
	</div>

	Доставки
		<div class="widget">
			<div class="widget__title">Способы доставки</div>

			<div class="widget__button">
				<button class="button" type="button"><i class="icon icon-settings"></i>Настроить</button>
			</div>
		</div>

		<div class="widget">
			<div class="widget__title">Регионы доставки</div>

			<div class="widget__button">
				<button class="button" type="button"><i class="icon icon-settings"></i>Настроить</button>
			</div>
		</div>

		<div class="widget">
			<div class="widget__title">Зоны</div>

			<div class="widget__button">
				<button class="button" type="button"><i class="icon icon-settings"></i>Настроить</button>
			</div>
		</div>

	<div class="widget">
		<div class="widget__title">Статусы заказа</div>

		<div class="widget__button">
			<button class="button" type="button"><i class="icon icon-settings"></i>Настроить</button>
		</div>
	</div>

	<div class="widget">
		<div class="widget__title">Статусы доставки</div>

		<div class="widget__button">
			<button class="button" type="button"><i class="icon icon-settings"></i>Настроить</button>
		</div>
	</div>

</div>

<table class="module-table" id="module-table">
	<colgroup>
		<col width="30"> 	{* Чекбокс *}
		<col width="50"> 	{* Номер *}
		<col> 				{* Наименование *}
		<col> 				{* Группа *}
		<col width="120"> 	{* Значение *}
		<col width="70"> 	{* Порядок *}
		<col width="50"> 	{* По умолчанию *}
		<col width="30"> 	{* Действия *}
	</colgroup>

	<thead>
		<tr>
			<th class="module-table__header module-table__center">
				{include file="system/controll.tpl"
					type        =   "checkbox"
					addclass    =   "controll_single"
					name        =   "checked"
					onchange    =   "settings.checkAll(this)"
				}
			</th>
			<th class="module-table__header">
				<span class="module-table__sort{if $sort.name == 'id'} {$sort.by}{/if}" onclick="settings.sort('id')">№</span>
			</th>
			<th class="module-table__header">
				<span class="module-table__sort{if $sort.name == 'name'} {$sort.by}{/if}" onclick="settings.sort('name')">Наименование</span>
			</th>
			<th class="module-table__header">
				<span class="module-table__sort{if $sort.name == 'system'} {$sort.by}{/if}" onclick="settings.sort('system')">Группа</span>
			</th>
			<th class="module-table__header module-table__center">Значение</th>
			<th class="module-table__header module-table__center">Порядок</th>
			<th class="module-table__header module-table__center"><i class="catalog-eye icon icon-eye"></i></th>
			<th class="module-table__header"></th>
		</tr>
		<tr>
			<td class="module-table__sub-header"></td>
			<td class="module-table__sub-header">
				<input name="id" class="catalog-input integer"{if $search.id} value="{$search.id}"{/if} placeholder="ID" onkeypress="settings.search('id', this.value, true, event)">
			</td>
			<td class="module-table__sub-header">
				<input name="name" class="catalog-input"{if $search.name} value="{$search.name}"{/if} placeholder="Поиск по названию..." onkeypress="settings.search('name', this.value, true, event)">
			</td>
			<td class="module-table__sub-header">
				<input name="system" class="catalog-input"{if $search.system} value="{$search.system}"{/if} placeholder="Поиск по системному имени..." onkeypress="settings.search('system', this.value, true, event)">
			</td>
			<td class="module-table__sub-header"></td>
			<td class="module-table__sub-header"></td>
			<td class="module-table__sub-header module-table__center">
				<label class="switch">
					<input name="special" value="1" onchange="settings.search('special', Number(this.checked))" type="checkbox"{if $search.special == 1} checked{/if}>
					<div class="slider"></div>
				</label>
			</td>
			<td class="module-table__sub-header"></td>
		</tr>
	</thead>

	<tbody>
	{if $settings}
		{foreach $settings as $item}
		<tr data-id="{$item.id}" id="settings-row-{$item.id}" class="module-table__row">
			<td class="module-table__column module-table__vhcenter">
			    {include file="system/controll.tpl"
			        type        =   "checkbox"
			        addclass    =   "controll_single"
			        ctrlclass   =   "check-all-spy"
			        name        =   "order["|cat:$item.id|cat:"]"
			        value       =   $item.id
			        onchange    =   "settings.checkItem(this)"
			    }
			</td>

			<td class="module-table__column module-table__vhcenter">{$item.id}</td>

			<td class="module-table__column">
				<a href="{$base_path}/settings/edit/{$item.id}?backuri={$_backuri}" class="module-table__link" title="Редактировать">
					<span class="catalog-edit icon icon-edit"></span> {$item.variable}
				</a>
			</td>

			<td class="module-table__column">{$item.class}</td>
			<td class="module-table__column">{$item.value}</td>

			<td class="module-table__column module-table__vhcenter">{$item.ord}</td>

			<td class="module-table__column module-table__vhcenter">
				<label class="switch">
					<input name="by_default" onchange="settings.update(event, 'by_default', {$item.id})" type="checkbox"{if $item.by_default == 1} checked {/if}>
					<div class="slider"></div>
				</label>
			</td>

		    <td class="module-table__column module-table__vhcenter">
				<a href="{$base_path}/settings/del/{$item.id}?backuri={$_backuri}" onclick="return settings.delete(event, {$item.id})" class="catalog-remove" title="Удалить" data-no-instant>
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
{/strip}