{strip}

{include file="./template.tpl"}

<form action="" method="post" enctype="multipart/form-data" name="meta_form">
    <input type="hidden" name="form_action" value="edit_customers">
    <input type="hidden" name="id" value="{$item.id}">
    
    <table class="table">
        <col width="200">
        <col>
        <thead>
            <tr>
                <th colspan="2">Редактирование покупателя</th>
            </tr>
        </thead>
        <tbody>

            <tr>
                <td class="h">Фотография:</td>
                <td>
                	<input type="hidden" name="photo" value="{$item.photo}">
                	{*
	                    {include file="fields/image.tpl"
	                        action      =   $fields.action
	                        name        =   $fields.name
	                        list        =   $fields.list
	                        value       =   $fields.value
	                        settings    =   $fields.settings
	                    }
                    *}
                </td>
            </tr>

           	<tr>
                <td class="h">Имя:</td>
                <td>
                    <input name="name" value="{$item.name}">
                </td>
            </tr>

            <tr>
                <td class="h">Электронная почта:</td>
                <td>
                    <input name="email" value="{$item.email}">
                </td>
            </tr>

			<tr>
                <td class="h">Пароль:</td>
                <td>
                  	<input name="password" value="{$item.password}" class="width-25">
                </td>
            </tr>

            <tr>
                <td class="h">Номер телефона:</td>
                <td>
                    <input name="phone" value="{$item.phone}" class="width-25 watch-phonemask">
                </td>
            </tr>

            <tr>
                <td class="h">Дата рождения:</td>
                <td>
                	<div class="calendar">
                		<input name="birthday" value="{$item.birthday}" data-format="DD.MM.YYYY" tabindex="8">
                		<a href="#" onclick="return false" class="icon icon-calendar selector"></a>
            		</div>
                </td>
            </tr>

            <tr>
                <td class="h va_t">Адреса:</td>
                <td>
                	
                	<table class="table-full variant-row-table js-template-wrapper">
                		<colgroup>
                			<col width="100">
                			<col width="130">
                			<col width="200">
                			<col>
                			<col>
                			<col>
                			<col>
                			<col width="80">
                			<col width="100">
                			<col width="30">
                		</colgroup>
                		<thead>
	                		<tr>
	                			<td class="h">Индекс</td>
	                			<td class="h">Страна</td>
	                			<td class="h">Субъект</td>
	                			<td class="h">Район</td>
	                            <td class="h">Город</td>
	                            <td class="h">Населенный пункт</td>
	                			<td class="h">Улица</td>
	                			<td class="h">Дом</td>
	                			<td class="h">№ квартиры</td>
	                			<td class="h"></td>
                			</tr>
                		</thead>
						<tbody>
						{if $item.address}
							{foreach from=$item.address item=addr}
							<tr>
								<td><input name="address[postal_code][{$addr.id}]" value="{$addr.postal_code}" class="ness integer"></td>
								<td><input name="address[country][{$addr.id}]" value="{$addr.country}" class="ness"></td>
								<td><input name="address[region][{$addr.id}]" value="{$addr.region}" class="ness"></td>
								<td><input name="address[area][{$addr.id}]" value="{$addr.area}" class="ness"></td>
								<td><input name="address[city][{$addr.id}]" value="{$addr.city}" class="ness"></td>
								<td><input name="address[settlement][{$addr.id}]" value="{$addr.settlement}" class="ness"></td>
								<td><input name="address[street][{$addr.id}]" value="{$addr.street}" class="ness"></td>
								<td><input name="address[house][{$addr.id}]" value="{$addr.house}" class="ness integer"></td>
								<td><input name="address[flat][{$addr.id}]" value="{$addr.flat}" class="ness integer"></td>
								<td><a href="" class="icon icon-delete js-remove-item" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить адрес?')" data-no-instant></a></td>
							</tr>
							{/foreach}
						{else}
							<tr class="variant-row-table__empty">
								<td colspan="10">
									Адреса не добавлены
								</td>
							</tr>
						{/if}
						</tbody>
						<tfoot>
							<tr>
								<td colspan="10">
									<a class="button button-gray fr js-add-template" href="#" data-template="tmpl-address" data-iteration="-1"><i class="icon icon-plus-square"></i>Добавить адрес доставки</a>
								</td>
							</tr>
						</tfoot>
					</table>

                </td>
            </tr>

            <tr>
                <td class="h">Текущий баланс:</td>
                <td>
                    <input name="balance" value="{$item.balance}" class="width-25 integer">
                </td>
            </tr>

            <tr>
                <td class="h">Количество бонусов:</td>
                <td>
                    <input name="bonus" value="{$item.bonus}" class="width-25 integer">
                </td>
            </tr>

            <tr>
                <td class="h">Статус:</td>
                <td>
                	{include file="system/group.tpl"
                        name    = "status"
                        check   = $item.status
                        list    = [
                            [ value => 1, text => "Подтвердил регистрацию" ],
                            [ value => 0, text => "Не подтвердил регистрацию" ]
                        ]
                    }
                </td>
            </tr>

            <tr>
                <td class="h">Доступ к личному кабинету:</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "active"
                        check   = $item.active
                        list    = [
                            [ value => 1, text => "Разрешен" ],
                            [ value => 0, text => "Заблокирован" ]
                        ]
                    }
                </td>
            </tr>

       	</tbody>
   </table>

    {include file="system/buttons.tpl"}
</form>
{/strip}