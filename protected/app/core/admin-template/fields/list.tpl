{strip}
{if is_array($list)}
<table>
    <col width="100">
    <col>
    <col width="100">
    <col width="100">
    <col width="100">
    <thead>
        <tr>
            <th>Фото</th>
            <th>Наименование</th>
            <th>Количество</th>
            <th>Стоимость</th>
            <th>Время заказа</th>
        </tr>
    </thead>
    <tbody>

    {assign var="cart_count" value=0}
    {assign var="cart_price" value=0}

    {foreach from=$list item=i}
        <tr valign="middle">
            <td style="vertical-align: middle;">
            {if isset($i.photo.value[0].photo_sm)}
                <img src="{$i.photo.value[0].photo_sm}" width="100" height="100" alt="">
            {/if}
            </td>
            <td style="vertical-align: middle;">{$i.name.value}</td>
            <td style="vertical-align: middle;">{$i.count.value}</td>
            <td style="vertical-align: middle;">{$i.price.value|to_money}</td>
            <td style="vertical-align: middle;">{$i.time.value}</td>
        </tr>

        {assign var="cart_count" value=$cart_count+1}
        {assign var="cart_price" value=$cart_price+$i.price.value}
    {/foreach}
    </tbody>
    <tfoot>
        <tr>
            <th colspan="2">
                Общее количество: <strong>{$cart_count}</strong>
            </th>
            <th colspan="3">
                Итого, без доставки: <strong>{$cart_price|to_money} руб.</strong>
            </th>
        </tr>
    </tfoot>
</table>
{/if}
{/strip}