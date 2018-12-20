{strip}
<table class="table">
    <col width="">
    <col width="200">
    <col width="180">
    <col width="160">
    <col width="100">
    <col width="100">
    <col width="65">
    <thead>
        <tr class="th">
            <th colspan="7">Список счетчиков</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="h">Наименование</td>
            <td class="h">Тип счетчика</td>
            <td class="h">Идентификатор</td>
            <td class="h">Пост загрузка</td>
            <td class="h">Порядок</td>
            <td class="h">Статус</td>
            <td class="h" colspan=""></td>
        </tr>
        {foreach item=item from=$counters name=i}
        <tr>
            <td><a href="{$base_path}/counters/edit/{$item.id}" title="Редактировать" class="module-item-link"><i class="zmdi zmdi-edit"></i> {$item.name}</a></td>
            <td>{$item.type}</td>
            <td>{$item.code}</td>
            <td><span class="badge badge-block{if isset($item.post_loading ) && $item.post_loading == 1} badge-green{/if}">{if isset($item.post_loading ) && $item.post_loading == 1}Включена{else}Выключена{/if}</span></td>
            <td>{$item.ord}</td>
            <td><span class="color-{if isset($item.active ) && $item.active == 0}red">Не активен{else}green">Активен{/if}</span></td>
            <td class="va_m tac">
                <a href="{$base_path}/counters/edit/{$item.id}" class="zmdi zmdi-edit" title="Редактировать"></a>
                <a href="{$base_path}/counters/del/{$item.id}" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить счетчик?');" data-no-instant></a>
            </td>
        </tr>
        {/foreach}
    </tbody>
</table>

<div class="button-container button-container-push clearfix">
    <a href="{$base_path}/counters/add" class="button button-blue"><i class="zmdi zmdi-plus-circle"></i>Добавить счетчик</a>
</div>

<table class="table">
    <col>
    <col>
    <col width="65">
    <thead>
        <tr class="th">
            <th colspan="3">Шаблоны и типы счетчиков</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="h">Наименование</td>
            <td class="h">Системное имя</td>
            <td class="h"></td>
        </tr>
        {foreach item=item from=$counter_type name=i}
        <tr>
            <td><a href="{$base_path}/counters/edit_type/{$item.id}" title="Редактировать" class="module-item-link"><i class="zmdi zmdi-edit"></i> {$item.name}</a></td>
            <td>{$item.system}</td>
            <td class="va_m tac">
                <a href="{$base_path}/counters/edit_type/{$item.id}" class="zmdi zmdi-edit" title="Редактировать"></a>
                <a href="{$base_path}/counters/del_type/{$item.id}" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить счетчик?');" data-no-instant></a>
            </td>
        </tr>
        {/foreach}
    </tbody>
</table>

<div class="button-container clearfix">
    <a href="{$base_path}/counters/add_type" class="button button-blue"><i class="zmdi zmdi-plus-circle"></i>Добавить шаблон</a>
</div>
{/strip}