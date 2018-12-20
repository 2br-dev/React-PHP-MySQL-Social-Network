{strip}

{include file="./template.tpl"}

<form action="" method="post" enctype="multipart/form-data" name="meta_form">
    <input type="hidden" name="form_action" value="add_customers">
    
    <table class="table">
        <col width="200">
        <col>
        <thead>
            <tr>
                <th colspan="2">Добавление покупателя</th>
            </tr>
        </thead>
        <tbody>

            <tr>
                <td class="h">Фотография:</td>
                <td>
                	<input type="hidden" name="photo" value="">
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
                    <input name="name">
                </td>
            </tr>

            <tr>
                <td class="h">Электронная почта:</td>
                <td>
                    <input name="email">
                </td>
            </tr>

			<tr>
                <td class="h">Пароль:</td>
                <td>
                  	<input name="password" class="width-25">
                </td>
            </tr>

            <tr>
                <td class="h">Номер телефона:</td>
                <td>
                    <input name="phone" class="width-25 watch-phonemask">
                </td>
            </tr>

            <tr>
                <td class="h">Дата рождения:</td>
                <td>
                	<div class="calendar">
                		<input name="birthday" data-format="DD.MM.YYYY" tabindex="8">
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
                    			<td class="h" colspan="2">№ квартиры</td>
                            </tr>
                		</thead>
						<tbody>
							<tr class="variant-row-table__empty">
								<td colspan="10">
									Адреса не добавлены
								</td>
							</tr>
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
                    <input name="balance" value="0" class="width-25 integer">
                </td>
            </tr>

            <tr>
                <td class="h">Количество бонусов:</td>
                <td>
                    <input name="bonus" value="0" class="width-25 integer">
                </td>
            </tr>

            <tr>
                <td class="h">Статус:</td>
                <td>
                	{include file="system/group.tpl"
                        name    = "status"
                        list    = [
                            [ value => 1, text => "Подтвердил регистрацию" ],
                            [ value => 0, text => "Не подтвердил регистрацию", checked => true ]
                        ]
                    }
                </td>
            </tr>

            <tr>
                <td class="h">Доступ к личному кабинету:</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "active"
                        list    = [
                            [ value => 1, text => "Разрешен" ],
                            [ value => 0, text => "Заблокирован", checked => true ]
                        ]
                    }
                </td>
            </tr>

       	</tbody>
   </table>

    {include file="system/buttons.tpl"}
</form>
{/strip}