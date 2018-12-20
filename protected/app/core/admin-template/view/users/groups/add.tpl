{strip}
<form method="post" id="form_usr">
	<input type="hidden" name="action" value="group_add">
		
	<table class="table">
		<col width="200">
		<col>
		<thead>
            <tr>
                <th colspan="2">Добавление группы</th>
            </td>
        </thead>
        <tbody>
            <tr>
                <td class="h">{t('titles.name')} <span class="ness_color">*</span></td>
                <td><input name="name" class="w50 ness"></td>
            </tr>
            <tr>
                <td class="h">Описание</td>
                <td><textarea name="description"></textarea></td>
            </tr>
            <tr>
                <td class="h">Доступ в админ</td>
                <td>
                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        name        =   "admin_access"
                        value       =   1
                        text        =   "Да"
                    }
                </td>
            </tr>
            <tr>
                <td class="h">Доступ к модулям</td>
                <td>
                    <div class="controlls-wrapper">
                        {foreach item=item from=$modulesList}
                            {include file="system/controll.tpl"
                                type        =   "checkbox"
                                name        =   "modules_access["|cat:$item.id|cat:"]"
                                value       =   $item.id
                                text        =   $item.name
                            }
                        {/foreach}
                    </div>
                </td>
            </tr>
            <tr>
                <td class="h">Подтверждение регистрации</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "confirm"
                        list    = [
                            [ value => '0', text => "Не требуется" ],
                            [ value => '1', text => "Пользователем", default => true ],
                            [ value => '2', text => "Администратором" ]
                        ]
                    }
                </td>
            </tr>
        </tbody>
	</table>
	
    {include file="system/buttons.tpl"}
</form>
{/strip}