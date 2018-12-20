{strip}

{include file="./template.tpl"}
{include file="./statistic.tpl"}

<div class="widget-table">
    <div class="widget-table__title"><span class="icon icon-shopping-cart"></span>&nbsp;&nbsp;Заказы магазина</div>
    <div class="widget-table__count">Всего заказов: <strong>{$count}</strong> шт.</div>
</div>

<div class="managing">
    <div class="managing__start">
        <div class="managing__item">
            <a href="{$base_path}/orders/add" class="button button-green">
                <i class="icon icon-plus-square"></i>Добавить заказ
            </a>
        </div>

        {if !empty($smarty.get)}
        <div class="managing__item">
            <a href="{$base_path}/orders" class="button"><i class="icon icon-format-clear-all"></i>Сбросить фильтры</a>
        </div>
        {/if}

        <div class="managing__item catalog-disable" id="remove-button">
            <button type="button" class="button button-red" onclick="orders.deleteAll(event)">
                <i class="icon icon-delete"></i>Удалить отмеченные заказы
            </button>
        </div>
    </div>

    <div class="managing__end">
        <div class="managing__limit">
            <span class="managing__limit__label">{t('on.the.page')}:</span>

            <div class="managing__limit__select">
                <select name="limit" onchange="shopping.setLimit('orders', this)">
                    {foreach $page_count as $page}
                        <option value="{$page}"{if $page == $limit} selected{/if}>{$page}</option>
                    {/foreach}
                </select>
            </div>
        </div>
    </div>
</div>

<div class="orders">

    {*
    <p>Присвоить заказам статус:</p>
    <select name="operation" class="order-operation">
        <option value="status_id_5">Выполнен</option>
        <option value="status_id_4">Отменен</option>
        <option value="status_id_3">В доставке</option>
        <option value="status_id_2">Оплачен</option>
        <option value="status_id_1">Ожидает оплаты</option>
        <option value="status_id_0">Не подтвержден</option>
    </select>

    <button class="button">Выполнить</button>
    *}

    <table class="module-table" id="orders-table">
        <colgroup>
            <col width="30">        {* Чекбокс *}
            <col width="110">       {* Номер заказа *}
            <col width="130">       {* Дата и время добавления *}
            <col>                   {* Ф.И.О. покупателя *}
            <col width="170">       {* Номер телефона *}
            <col width="150">       {* Способ доставки *}
            <col width="150">       {* Способ оплаты *}
            <col width="110">       {* Стоимость *}
            {* <col width="120">  *}       {* Статус *}
            <col width="90">        {* Состав заказа *}
            <col width="70">        {* Действия *}
        </colgroup>

    	<thead>
    		<tr>
                <th class="module-table__header module-table__center">
                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        addclass    =   "controll_single"
                        name        =   "order"
                        onchange    =   "shopping.checkAll(this)"
                    }
                </th>
                <th class="module-table__header">Номер заказа</th>
                <th class="module-table__header">Дата добавления</th>
    			<th class="module-table__header">Ф.И.О. покупателя</th>
    			<th class="module-table__header">Номер телефона</th>
    			<th class="module-table__header">Доставка</th>
    			<th class="module-table__header">Оплата</th>
    			<th class="module-table__header">Стоимость</th>
    			{* <th class="module-table__header">Статус</th> *}
                <th class="module-table__header">Состав</th>
    			<th class="module-table__header"></th>
    		</tr>
    	</thead>

    	<tbody class="order-tbody">
    	{if isset($orders)}
    	{foreach $orders as $order}
    		<tr data-id="{$order.id}" id="catalog-row-{$order.id}" class="module-table__row product-row">
                <td class="module-table__column module-table__vhcenter">
                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        addclass    =   "controll_single"
                        ctrlclass   =   "check-all-spy"
                        name        =   "order["|cat:$order.id|cat:"]"
                        value       =   $order.id
                        onchange    =   "shopping.checkItem(this)"
                    }
                </td>

    			<td class="module-table__column">
                    <a href="/cp/shopping/orders/item/{$order.id}">{$order.number}</a>
                </td>

                <td class="module-table__column">{$order.date}</td>

    			<td class="module-table__column">{$order.user.name}</td>

    			<td class="module-table__column">
                    {if $order.user.tel && $order.user.phone}
                        <a href="tel:{$order.user.tel}" class="module-table__link"><span class="icon icon-phone"></span>&nbsp;&nbsp;{$order.user.phone}</a>
                    {/if}
                </td>

    			<td class="module-table__column">{$order.delivery}</td>

    			<td class="module-table__column">{$order.payment}</td>

    			<td class="module-table__column">{$order.cost|to_money} руб.</td>

                {*
    			<td class="module-table__column">
    				<span class="orders-status trigger-popover" data-popover="status_payment"><span class="orders-status__text">{$order.status_payment}</span> <i class="icon icon-caret-down-circle"></i></span>
    				<span class="orders-status trigger-popover" data-popover="status_delivery"><span class="orders-status__text">{$order.status_delivery}</span> <i class="icon icon-caret-down-circle"></i></span>
    			</td>
                *}

                <td class="module-table__column"><a href="/cp/shopping/orders/item/{$order.id}">Просмотр</a></td>
    
    			<td class="module-table__column module-table__vhcenter">
                    <a href="{$base_path}/orders/print/{$order.id}?backuri={$_backuri}" onclick="order.print(event, {$order.id})" class="catalog-print" title="Удалить" data-no-instant>
                        <i class="icon icon-print"></i>
                    </a>

                    <a href="{$base_path}/orders/del/{$order.id}?backuri={$_backuri}" onclick="order.delete(event, {$order.id})" class="catalog-remove" title="Удалить" data-no-instant>
                        <i class="icon icon-delete"></i>
                    </a>
    			</td>
    		</tr>
    	{/foreach}
    	{/if}
    	</tbody>
	</table>
</div>

{include file="system/pager.inc.tpl"}
{/strip}