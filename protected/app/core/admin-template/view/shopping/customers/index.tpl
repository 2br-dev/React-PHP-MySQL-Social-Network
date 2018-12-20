{strip}
<div class="managing">
	<div class="managing__start">
		<div class="managing__item">
			<a href="{$base_path}/customers/add" class="button button-green">
				<i class="icon icon-plus-square"></i>Добавить покупателя
			</a>
		</div>

		{if !empty($smarty.get)}
		<div class="managing__item">
			<a href="{$base_path}/customers" class="button"><i class="icon icon-format-clear-all"></i>Сбросить фильтры</a>
		</div>
		{/if}

		<div class="managing__item catalog-disable" id="remove-button">
			<button type="button" class="button button-red">{* onclick="shopping.deleteAll(event)" *}
				<i class="icon icon-delete"></i>Удалить выбранных покупателей
			</button>
		</div>
	</div>

	<div class="managing__end">
		<div class="managing__limit">
			<span class="managing__limit__label">{t('on.the.page')}:</span>

			<div class="managing__limit__select">
				<select name="limit" onchange="shopping.setLimit('customers', this)">
					{foreach $page_count as $page}
						<option value="{$page}"{if $page == $limit} selected{/if}>{$page}</option>
					{/foreach}
				</select>
			</div>
		</div>
	</div>
</div>

<table class="table orders-table">
<colgroup>
	<col width="30">
	<col width="250">
	<col>
	<col>
	<col>
	<col>
	<col>
	<col>
	<col>
	<col width="40">
</colgroup>
<thead>
	<tr>
		<th class="checkbox-col">
			{include file="system/controll.tpl"
				type        =   "checkbox"
				addclass    =   "controll_single"
				name        =   "order"
				onchange    =   "checkAll(this)"
			}
		</th>
		<th>Имя</th>
		<th>E-mail</th>
		<th>Дата рождения</th>
		<th>Телефон</th>
		<th>Статус</th>
		<th>Доступ к <span class="is-tooltip" title="личному кабинету">ЛК</span></th>
		<th>Баланс / Бонусы</th>
		<th>Действия</th>
	</tr>
</thead>
<tbody>
{if $users}
	{foreach $users as $key => $user}
	<tr data-id="{$item.id}" class="product-row">
		<td class="checkbox-col">
		    {include file="system/controll.tpl"
		        type        =   "checkbox"
		        addclass    =   "controll_single"
		        ctrlclass   =   "check-all-spy"
		        name        =   "order["|cat:$item.id|cat:"]"
		        value       =   $item.id
		    }
		</td>

		<td><a href="{$base_path}/customers/edit/{$user.id}?backuri={$_backuri}" class="p-link1">{$user.name}</a></td>
		<td>{$user.email}</td>
		<td>{$user.birthday}</td>
		<td>{$user.phone}</td>
		<td>
			{if $user.status == 1}
			<span class="label green">Подтвердил регистрацию</span>
			{else}
			<span class="label amber">Не подтвердил регистрацию</span>
			{/if}
		</td>
		<td>
			{if $user.active == 1}
			<span class="label green">Разрешен</span>
			{else}
			<span class="label amber">Заблокирован</span>
			{/if}
		</td>
		<td>{$user.bonus} / {$user.balance}</td>

		<td class="tac">
	        <a href="{$base_path}/customers/edit/{$user.id}?backuri={$_backuri}" class="icon icon-edit" title="Редактировать"></a>
	        <a href="{$base_path}/customers/del/{$user.id}?backuri={$_backuri}" class="icon icon-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить?')" data-no-instant></a>
	    </td>
	</tr>
	{/foreach}
{else}
	<tr>
		<td colspan="9" class="empty-row">
			Зарегистрированных покупателей нет
		</td>
	</tr>
{/if}
</tbody>
</table>

{include file="system/pager.inc.tpl"}
{/strip}