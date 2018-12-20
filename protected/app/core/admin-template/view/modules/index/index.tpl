{strip}
<table class="table" id="meta_data">
    <col>
    <col width="270">
    <col width="160">
    <col width="140">
    <col width="120">
    <col width="80">
    <col width="60">
    <thead>
        <tr class="th">
            <th colspan="7">Список модулей</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="h">Название модуля</td>
            <td class="h">Системное имя</td>
            <td class="h">Кол-во на странице</td>
            <td class="h">Тип данных</td>
            <td class="h">Тип таблицы</td>
            <td class="h">Статус</td>
            <td class="h"></td>
        </tr>
        {foreach item=item from=$modules_list name=i}
        <tr class="row-{$item.id}">
            <td><a href="{$base_path}/index/edit/{$item.id}/" title="Редактировать" class="module-item-link"><i class="zmdi zmdi-edit"></i> {$item.name}</a></td>
            <td>{$item.sys_name}</td>
            <td>{$item.pager}</td>
            <td>{if isset($item.type) && $item.type == 2}SINGLE{else}MULTI{/if}</td>
            <td>{$item.storage}</td>
            <td class="va_m">
                <span class="label {if isset($item.active) && $item.active == 1}green{else}amber{/if}">{if isset($item.active) && $item.active == 1}Активен{else}Не активен{/if}</span>
            </td>
            <td class="va_m tac">
                <a href="{$base_path}/index/edit/{$item.id}" class="zmdi zmdi-edit" title="Редактировать"></a>
                <a href="{$base_path}/index/del/{$item.id}" rel=".row-{$item.id}" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить модуль и все что связанно с ним?');" data-no-instant></a>
            </td>
        </tr>
        {/foreach}
    </tbody>
</table>

<a href="{$base_path}/index/add" class="button button-purple"><i class="zmdi zmdi-plus-circle"></i>Добавить модуль</a>
<a href="{$base_path}/clean" class="button button-blue fr"><i class="zmdi zmdi-wrench"></i>Починить таблицы</a>
{/strip}