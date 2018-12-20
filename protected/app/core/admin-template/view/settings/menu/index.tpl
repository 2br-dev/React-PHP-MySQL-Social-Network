{strip}
<table class="table">
    <col>
    <col width="160">
    <col width="160">
    <col width="65">
    <thead>
        <tr>
            <th colspan="4">Список меню</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="h">Наименование меню</td>
            <td class="h">Системное имя</td>
            <td class="h">Отображать подменю</td>
            <td class="h tac"></td>
        </tr>
        {foreach item=item from=$menu_list name=i}
        <tr>
            <td><a href="{$base_path}/menu/edit/{$item.id}" title="Редактировать" class="module-item-link"><i class="zmdi zmdi-edit"></i> {$item.name}</a></td>
            <td>{$item.system}</td>
            <td>
                {if $item.tree==1}
                    <span class="color-green">Да</span>
                {else}
                    <span class="color-red">Нет</span>
                {/if}
            </td>
            <td class="tac">
                <a href="{$base_path}/menu/edit/{$item.id}" class="zmdi zmdi-edit" title="Редактировать"></a>
                <a href="{$base_path}/menu/del/{$item.id}" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить меню?');" data-no-instant></a>
            </td>
        </tr>
        {/foreach}
    </tbody>
</table>

<div class="button-container clearfix">
    <a href="{$base_path}/menu/add" class="button"><i class="zmdi zmdi-plus-circle"></i>Добавить меню</a>    
</div>
{/strip}