{strip}
<table class="table">
    <col>
    <col>
    <col width="70">
    <thead>
        <tr>
            <th colspan="3">Рассылки</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="h">Название рассылки</td>
            <td class="h">Модуль</td>
            <td class="h"></td>
        </tr>
    {if isset($list_dispatch ) && !empty( $list_dispatch )}
        {foreach item=item from=$list_dispatch name=i}
        <tr>
            <td><a href="/{$ADMIN_DIR}/dispatch/edit/{$item.id}/" title="Редактировать">{$item.name}</a></td>
            <td>{$item.module_name}</td>
            <td class="tac">
                <a href="/{$ADMIN_DIR}/dispatch/edit/{$item.id}/" class="zmdi zmdi-edit" title="Редактировать"></a>
                <a href="/{$ADMIN_DIR}/dispatch/del/{$item.id}/" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить форму?');" data-no-instant></a>
            </td>
        </tr>
        {/foreach}
    {else}
        <tr>
            <td colspan="3" class="center-middle">Рассылок нет</td>
        </tr>
    {/if}
    </tbody>
</table>
{/strip}