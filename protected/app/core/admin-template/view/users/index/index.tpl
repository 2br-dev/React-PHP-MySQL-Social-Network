{strip}
<table class="table">
    <col>
    <col>
    <col>
    <col width="200">
    <col width="75">
    <col width="155">
    <col width="65">
    <thead>
        <tr>
            <th>Пользователь</th>
            <th>Логин</th>
            <th>Группа</th>
            <th>E-mail</th>
            <th>Активен</th>
            <th>Дата регистрации</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
    {if !empty( $usersList )}
        {foreach item=item from=$usersList name=i}
        <tr>
            <td><a href="{$base_path}/index/edit/{$item.id}/" title="Редактировать" class="module-item-link"><i class="zmdi zmdi-edit"></i> {$item.user}</a></td>
            <td>{$item.login}</td>
            <td>{$item.group}</td>
            <td>{$item.email}</td>
            <td class="tac va_m">
                {if $item.active}
                    <span class="color-green">Да</span>
                {else}
                    <span class="color-red">Нет</span>
                {/if}
            </td>
            <td>{$item.created}</td>
            <td class="tac">
                <a href="{$base_path}/index/edit/{$item.id}/" class="zmdi zmdi-edit" title="Редактировать"></a>
                <a href="{$base_path}/index/del/{$item.id}/" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить пользователя?');" data-no-instant></a>
            </td>
        </tr>
        {/foreach}
    {else}
        <tr>
            <td colspan="7" class="center-middle">Пользователей нет</td>
        </tr>
    {/if}
    </tbody>
</table>

<a href="{$base_path}/index/add/" class="button"><i class="zmdi zmdi-plus-circle"></i>Добавить пользователя</a>

{include file="system/pager.tpl"}
{/strip}