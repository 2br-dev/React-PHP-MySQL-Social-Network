{strip}
<div class="widget-table">
    <div class="widget-table__title"><span class="icon icon-shopping-cart"></span>&nbsp;&nbsp;Просмотр заказа № {$order.number} от {$order.date}</div>
</div>

<div class="order-item">
    <div class="order-item__row">
        <div class="order-item__column order-item__column--name">
            Данные покупателя:
        </div>

        <div class="order-item__column">
            <p>Контактное лицо: <strong>{$order.user.name} {$order.user.surname}</strong></p>
            <p>Электронный адрес: <strong>{$order.user.email}</strong></p>
            <p>Телефон: <strong>{$order.user.phone}</strong></p>
        </div>
    </div>

    {if !empty($order.address)}
    <div class="order-item__row">
        <div class="order-item__column order-item__column--name">
            Адрес доставки:
        </div>

        <div class="order-item__column">
            {if $order.address.value}
            <p>{if $order.address.postal_code}{$order.address.postal_code}, {/if}{$order.address.value}</p>
            {/if}

            {if $order.address.city}
            <p>{$order.address.city}</p>
            {/if}

            {if $order.address.phone}
            <p>Номер телефона указанный при выборе доставки: <strong>{$order.address.phone}</strong></p>
            {/if}
        </div>
    </div>
    {/if}

    <div class="order-item__row">
        <div class="order-item__column order-item__column--name">
            Сумма заказа:
        </div>

        <div class="order-item__column">
            {$order.cost|to_money} руб.
        </div>
    </div>

    {if $order.promocode}
    <div class="order-item__row">
        <div class="order-item__column order-item__column--name">
            Промокод:
        </div>

        <div class="order-item__column">
            {$order.promocode}
        </div>
    </div>
    {/if}

    <div class="order-item__row">
        <div class="order-item__column order-item__column--name">
            Способ доставки:
        </div>

        <div class="order-item__column">
            {$order.delivery}
        </div>
    </div>

    <div class="order-item__row">
        <div class="order-item__column order-item__column--name">
            Способ оплаты:
        </div>

        <div class="order-item__column">
            {$order.payment}
        </div>
    </div>

    {if $order.comment}
    <div class="order-item__row">
        <div class="order-item__column order-item__column--name">
            Комментарий пользователя:
        </div>

        <div class="order-item__column">
            {$order.comment}
        </div>
    </div>
    {/if}
</div>

<table class="module-table" id="orders-table">
    <colgroup>
        <col width="150">       {* Фото *}
        <col>                   {* Наименование *}
        <col width="150">       {* Кол-во *}
        <col width="150">       {* Стоимость *}
        <col width="150">       {* Итого *}
    </colgroup>

    <thead>
        <tr>
            <th class="module-table__header" colspan="5"><strong>Содержимое заказа</strong></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="module-table__sub-header" colspan="2">Товар</td>
            <td class="module-table__sub-header">Кол-во</td>
            <td class="module-table__sub-header">Стоимость</td>
            <td class="module-table__sub-header">Итого</td>
        </tr>
    {foreach $order.purchase as $product}
        <tr>
            <td class="module-table__column module-table__image">
                {if $product.item.image.file}
                    <img src="{$product.item.image.file}" height="100" alt="">
                {/if}
            </td>
            <td class="module-table__column">
                <div class="order-item__product">{$product.item.name}</div>
                <div class="order-item__add-date">Добавлен {$product.date}</div>
            </td>
            <td class="module-table__column">{$product.count}</td>
            <td class="module-table__column">
                <strong>{$product.item.price|to_money}</strong> руб.
            </td>
            <td class="module-table__column">
                <strong>{$product.item.total|to_money}</strong> руб.
            </td>
        </tr>
    {/foreach}
    </tbody>
    <tfoot>
        <tr>
            <th class="module-table__header" colspan="3"></th>
            <th class="module-table__header module-table__right">
                Итого, без доставки:
            </th>
            <th class="module-table__header">
                <strong>{$order.cost|to_money} руб.</strong>
            </th>
        </tr>
    </tfoot>
</table>
{/strip}