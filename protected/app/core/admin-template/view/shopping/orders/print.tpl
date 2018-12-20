{literal}
<style>
    p {
        font-size: 14px;
        margin-bottom: 15px;
    }  
</style>

<script>
    window.print();
</script>
{/literal}

<p>Дата заказа {$order.date},</p>

<p>Заказ номер <strong>{$order.number}</strong>,</p>

<p>Сумма заказа <strong>{$order.cost|to_money} руб.</strong>,</p>

{if $order.promocode}
<p>Сумма заказа {$order.promocode},</p>
{/if}

<p>Способ доставки {$order.delivery},</p>

{* <p>Способ оплаты {$order.payment},</p> *}

<p>--------------------</p>
<p><strong>Данные покупателя:</strong></p>

<p>Контактное лицо: <strong>{$order.user.name}</strong></p>
<p>Электронная почта: <strong>{$order.user.email}</strong></p>
<p>Номер телефона: <strong>{$order.user.phone}</strong></p>

{if $order.address.value}
<p>Адрес доставки: <strong>{$order.address.value}</strong></p>
{/if}

{if $order.address.city}
<p>Город доставки: <strong>{$order.address.city}</strong></p>
{/if}

{if $order.address.postal_code}
<p>Индекс: <strong>{$order.address.postal_code}</strong></p>
{/if}

{if $order.address.phone}
<p>Номер телефона указанный при выборе доставки: <strong>{$order.address.phone}</strong></p>
{/if}

{if $order.comment}
<p>Комментарий для курьера: <strong>{$order.comment}</strong></p>
{/if}

<p>--------------------</p>
<p><strong>Содержимое заказа:</strong></p>

<table style="width: 100%; border-collapse: collapse; font: 15px/15px Roboto, sans-serif;">
    <thead>
        <tr>
            <th style="padding: 10px; border: 1px solid #e2e2e2; color: #898989; text-align: left; vertical-align: middle;">Фото</th>
            <th style="padding: 10px; border: 1px solid #e2e2e2; color: #898989; text-align: left; vertical-align: middle;">Наименование</th>
            <th style="padding: 10px; border: 1px solid #e2e2e2; color: #898989; text-align: left; vertical-align: middle;">Кол-во</th>
            <th style="padding: 10px; border: 1px solid #e2e2e2; color: #898989; text-align: left; vertical-align: middle;">Стоимость</th>
            <th style="padding: 10px; border: 1px solid #e2e2e2; color: #898989; text-align: left; vertical-align: middle;">Итого</th>
        </tr>
    </thead>
    <tbody>

    {foreach $order.purchase as $product}
        <tr>
            <td style="padding: 10px; border: 1px solid #e2e2e2; color: #898989; text-align: left; vertical-align: middle;">
                <img src="{$product.item.image.file}" width="100" height="100" alt="">
            </td>
            <td style="padding: 10px; border: 1px solid #e2e2e2; color: #898989; text-align: left; vertical-align: middle;">
                {$product.item.name}<br>
                <p>Добавлен {$product.date}</p>
            </td>
            <td style="padding: 10px; border: 1px solid #e2e2e2; color: #898989; text-align: left; vertical-align: middle;">{$product.count}</td>
            <td style="padding: 10px; border: 1px solid #e2e2e2; color: #898989; text-align: left; vertical-align: middle;">
                <strong>{$product.item.price|to_money}</strong> руб.
            </td>
            <td style="padding: 10px; border: 1px solid #e2e2e2; color: #898989; text-align: left; vertical-align: middle;">
                <strong>{$product.item.total|to_money}</strong> руб.
            </td>
        </tr>
    {/foreach}

    </tbody>
    <tfoot>
        <tr>
            <th style="padding: 10px; border: 1px solid #e2e2e2; color: #898989; text-align: left; vertical-align: middle;" colspan="3">
                Общее количество: <strong>{$cart.result.count}</strong>
            </th>
            <th style="padding: 10px; border: 1px solid #e2e2e2; color: #898989; text-align: left; vertical-align: middle;" colspan="4">
                Итого, без доставки: <strong>{$cart.result.amount|to_money} руб.</strong>
            </th>
        </tr>
    </tfoot>
</table>
