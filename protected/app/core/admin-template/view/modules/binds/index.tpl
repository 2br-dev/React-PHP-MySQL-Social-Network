{strip}
<table class="table" id="meta_data">
    <col>
    <col>
    <col width="110">
    <col width="60">
    <thead>
        <tr class="th">
            <th colspan="4">Список функций</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="h">Название функции</td>
            <td class="h">Системное имя</td>
            <td class="h">{t('caching')}</td>
            <td class="h"></td>
        </tr>
        {foreach from=$binds item=bind}
        <tr class="row-{$bind.id}">
            <td><a href="{$base_path}/binds/edit/{$bind.id}/" title="Редактировать" class="module-item-link"><i class="zmdi zmdi-edit"></i> {$bind.name}</a></td>
            <td>{$bind.func_name}</td>
            <td class="va_m">
                <span class="label {if isset($bind.cache) && $bind.cache == 1}green{else}amber{/if}">{if isset($bind.cache ) && $bind.cache == 1}Включено{else}Выключено{/if}</span>
            </td>
            <td class="va_m tac">
                <a href="{$base_path}/binds/edit/{$bind.id}" class="zmdi zmdi-edit" title="Редактировать"></a>
                <a href="{$base_path}/binds/del/{$bind.id}" rel=".row-{$bind.id}" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить модуль и все что связанно с ним?');" data-no-instant></a>
            </td>
        </tr>
        {/foreach}
    </tbody>
</table>
<a href="{$base_path}/binds/add" class="button button-purple"><i class="zmdi zmdi-plus-circle"></i>Добавить функцию</a>
{/strip}