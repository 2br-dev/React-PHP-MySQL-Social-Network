{strip}
<script type="text/html" id="tpl_status_payment">
    <div class="popover" id="popover-status_payment">
        <span class="popover__triangle"></span>
        <ul>
        {foreach from=$settings.status_payment item=item}
            <li>
                {include file="system/controll.tpl"
                    type        =   "radio"
                    needle      =   "0"
                    addclass    =   "controll_fill"
                    name        =   "payment[]"
                    value       =   $order.value
                    text        =   $order.variable
                }
            </li>
        {/foreach}
        </ul>
    </div>
</script>

<script type="text/html" id="tpl_status_delivery">
    <div class="popover" id="popover-status_delivery">
        <span class="popover__triangle"></span>
        <ul>
        {foreach from=$settings.status_delivery item=item}
            <li>
                {include file="system/controll.tpl"
                    type        =   "radio"
                    needle      =   "0"
                    addclass    =   "controll_fill"
                    name        =   "delivery[]"
                    value       =   $order.value
                    text        =   $order.variable
                }
            </li>
        {/foreach}
        </ul>
    </div>
</script>
{/strip}

{*
<div class="widget-table-title">
    <h4 class="product-order-icon">Заказы магазина</h4>
    <p class="produc-count">Всего заказов: <strong>8</strong> шт.</p>
</div>
*}

{* 
Присвоить заказам статус:
<select name="operation" class="order-operation">
    <option value="status_id_5">Выполнен</option>
    <option value="status_id_4">Отменен</option>
    <option value="status_id_3">В доставке</option>
    <option value="status_id_2">Оплачен</option>
    <option value="status_id_1">Ожидает оплаты</option>
    <option value="status_id_0">Не подтвержден</option>
</select>

<a href="">Удалить отмеченные заказы</a>

<button class="button">Выполнить</button>
*}

{*
<table>
<tbody><tr>
<td class="module-table__column">Всего продано на сумму:</td>
<td class="module-table__column">31,015.00 p.</td>
</tr>
<tr>
<td class="module-table__column">Всего продано в этом году на сумму:</td>
<td class="module-table__column">15,005.00 p.</td>
</tr>
<tr>
<td class="module-table__column">Всего заказов:</td>
<td class="module-table__column">3</td>
</tr>
<tr>
<td class="module-table__column">Всего покупателей:</td>
<td class="module-table__column">0</td>
</tr>
<tr>
<td class="module-table__column">Покупателей, ожидающих подтверждения:</td>
<td class="module-table__column">0</td>
</tr>
<tr>
<td class="module-table__column">Отзывов, ожидающих подтверждения:</td>
<td class="module-table__column">0</td>
</tr>
<tr>
<td class="module-table__column">Количество партнёров:</td>
<td class="module-table__column">0</td>
</tr>
<tr>
<td class="module-table__column">Партнёров, ожидающих подтверждения:</td>
<td class="module-table__column">0</td>
</tr>
</tbody></table>
*}