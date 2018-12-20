{strip}
<table class="table">
    <col width="300">
    <col>
    <col width="130">
    <col width="200">
    <col width="135">
    <col width="65">
    <thead>
        <tr>
            <th>Название группы</th>
            <th>Описание</th>
            <th>Доступ в админ.</th>
            <th>Доступ к модулям</th>
            <th>Активация</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
    {if !empty( $usersGroups )}
        {foreach item=item from=$usersGroups name=i}
        <tr>
            <td class="va_m"><a href="{$base_path}/groups/edit/{$item.id}/" title="Редактировать" class="module-item-link"><i class="zmdi zmdi-edit"></i> {$item.name}</a></td>
            <td>{$item.description}</td>
            <td class="tac va_m">
                {if $item.admin_access}
                    <span class="color-green">Да</span>
                {else}
                    <span class="color-red">Нет</span>
                {/if}
            </td>
            <td>{$item.modules_access_list}</td>
            <td class="va_m">
                {if $item.confirm == 0}
                    Не требуется
                {elseif $item.confirm == 1}
                    Пользователем
                {elseif $item.confirm == 2}
                    Администратором
                {/if}
            </td>
            <td class="tac">
                <a href="{$base_path}/groups/edit/{$item.id}/" class="zmdi zmdi-edit" title="Редактировать"></a>
                <a href="{$base_path}/groups/del/{$item.id}/" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить группу?');" data-no-instant></a>
            </td>
        </tr>
        {/foreach}
    {else}
        <tr>
            <td colspan="6" class="center-middle">Пользователей нет</td>
        </tr>
    {/if}
    </tbody>
</table>

<a href="{$base_path}/groups/add/{$item.id}/" class="button"><i class="zmdi zmdi-plus-circle"></i>Добавить группу</a>
{/strip}