{strip}
<form method="post" id="form_usr">
	<input type="hidden" name="action" value="group_edit">
		
	<table class="table">
		<col width="200">
		<col>
		<thead>
            <tr>
                <th colspan="2">Редактирование группы</th>
            </td>
		</thead>
		<tbody>
            <tr>
                <td class="h">{t('titles.name')} <span class="ness_color">*</span></td>
                <td><input name="name" class="ness w50" value="{$usersGroups.name}"></td>
            </tr>
            <tr>
                <td class="h">Описание</td>
                <td><textarea name="description">{$usersGroups.description}</textarea></td>
            </tr>
            <tr>
                <td class="h">Доступ в админ</td>
                <td>
                    {$checked = false}

                    {if $usersGroups.admin_access}
                        {$checked = true}
                    {/if}
                    
                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        name        =   "admin_access"
                        value       =   1
                        checked     =   $checked
                        text        =   "Да"
                    }
                </td>
            </tr>
            <tr>
                <td class="h">Доступ к модулям</td>
                <td>
                    <div class="controlls-wrapper">
                        {foreach item=item from=$modulesList}
                            {$checked = false}

                            {if in_array($item.id, $usersGroups.modules_access_r)}
                                {$checked = true}
                            {/if}

                            {include file="system/controll.tpl"
                                type        =   "checkbox"
                                name        =   "modules_access["|cat:$item.id|cat:"]"
                                value       =   $item.id
                                checked     =   $checked
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
                        check   = $usersGroups.confirm
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