{strip}

<form action="" method="post" class="form">
	<table class="table module-table" id="mdd_fields">
	<colgroup><col><col width="250"><col width="300"><col width="330"><col width="85"><col width="80"><col width="35"></colgroup>
	<thead>
	<tr>
		<th colspan="7">
			Данные покупателя
		</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td class="h">
			Название поля
		</td>
		<td class="h">
			Системное имя
		</td>
		<td class="h">
			Тип поля
		</td>
		<td class="h">
			Дополнительно
		</td>
		<td class="h">
			Порядок
		</td>
		<td class="h">
			В списке
		</td>
		<td class="h">
		</td>
	</tr>

	<tr id="tr7" valign="top">
		<td class="va_t">
			<input name="f_id[7]" value="545" type="hidden"><input name="f_name[7]" class="ness" value="Категория">
		</td>
		<td class="va_t">
			<input name="f_sys_name[7]" class="ness" value="category">
		</td>
		<td class="va_t">
			<div style="z-index: 993; position: relative;">
				<select name="f_type[7]" data-placeholder="Тип поля" class="ness" id="fieldtype_7" onchange="select_type(this)" style="display: none;">
					{foreach from=$fields_type item=field}
					<option value="{$field.sys_name}">{$field.type}</option>
					{/foreach}
				</select>
			</div>
		</td>
		<td class="addition va_t">
			<div class="group">
				<label class="group__item"><input type="radio" class="group__item__rb" name="f_width[7]" value="25"><span class="group__item__style"></span><span class="group__item__text">25%</span></label><label class="group__item"><input type="radio" class="group__item__rb" name="f_width[7]" value="50"><span class="group__item__style"></span><span class="group__item__text">50%</span></label><label class="group__item"><input type="radio" class="group__item__rb" name="f_width[7]" value="75"><span class="group__item__style"></span><span class="group__item__text">75%</span></label><label class="group__item"><input type="radio" class="group__item__rb" name="f_width[7]" value="100" checked=""><span class="group__item__style"></span><span class="group__item__text">100%</span></label>
			</div>
			<div class="cb mb10">
			</div>
			<div class="cb clearfix">
				<label class="controll"><input type="checkbox" class="controll__input" value="1" onchange="switch_types(this)" name="f_use_table_list[7]"><span class="controll__visible controll__visible_checkbox"></span><span class="controll__text">привязать к `#__mdd_lists`</span></label>
				<div class="case case0">
					<input name="f_table_name[7]" value="#_mdd_category" class="mb5" placeholder="Название таблицы (#_news)"><input name="f_table_field[7]" value="name" placeholder="Поле (title)">
				</div>
				<div class="case case1 hidden">
					<input name="f_table_list[7]" disabled="" placeholder="BIND списка" value="">
				</div>
			</div>
		</td>
		<td class="va_m">
			<input name="f_ord[7]" value="20" class="integer">
		</td>
		<td class="va_m tac">
			<label class="controll controll_single"><input type="checkbox" class="controll__input" value="1" name="f_in_list[7]" checked=""><span class="controll__visible controll__visible_checkbox"></span></label>
		</td>
		<td class="tac va_t">
			<a href="#" class="icon icon-delete" title="Удалить" onclick="del_fields(7);return false;"></a>
		</td>
	</tr>

	<tr id="add_btn">
		<td colspan="7">
			<a onclick="add_fields();return false;" class="button-link fr" title="Добавить" href="#"><span class="icon icon-plus-square"></span> Добавить поле</a>
		</td>
	</tr>
	</tbody>
	</table>
	
	{include file="system/buttons.tpl"}
</form>


{*
<input type="text" name="checkout[]" placeholder="Контактное лицо">
<input type="text" name="checkout[]" placeholder="Телефон для связи">
<input type="text" name="checkout[]" placeholder="E-mail">
<input type="text" name="checkout[]" placeholder="Адрес">
<input type="text" name="checkout[]" placeholder="Примечание к заказу">

<p>Способ доставки</p>

{include file="system/group.tpl"
    name    = "delivery"
    list    = [
        [ value => '1', text => "Самовывоз", default => true ],
        [ value => '2', text => "Курьерская" ],
        [ value => '3', text => "Почта" ],
        [ value => '4', text => "Добавить новый способ" ]
    ]
}


<p>Способ оплаты</p>

{include file="system/group.tpl"
    name    = "payment"
    list    = [
        [ value => '1', text => "Квитанция банка", default => true ],
        [ value => '2', text => "Оплата с лицевого счета" ],
        [ value => '3', text => "Visa, MasterCard, WebMoney, Терминалы оплат" ],
        [ value => '4', text => "Яндекс.Деньги" ],
        [ value => '4', text => "Добавить новый способ" ]
    ]
}
*}

{/strip}