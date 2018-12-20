{strip}
<div class="managing">
    <div class="managing__start">
        <div class="managing__item">
            <form action="{$base_path}/search" class="locale-search">
                <input name="word" placeholder="{t('key.or.value')}" class="locale-search__input" value="{$find_value}">
                <button type="submit" class="locale-search__button"><i class="zmdi zmdi-search"></i></button>
            </form>
        </div>

        <div class="managing__item">
            <a href="/{$ADMIN_DIR}/parameters/add" class="button button-green">
                <i class="zmdi zmdi-plus-circle"></i>{t('add.something', [string => t('simple.word')])}
            </a>
        </div>

        {if !empty($smarty.get)}
        <div class="managing__item">
            <a href="{$base_path}" class="button"><i class="zmdi zmdi-format-clear-all"></i>Сбросить фильтры</a>
        </div>
        {/if}

        <div class="managing__item catalog-disable" id="remove-button">
            <button type="button" class="button button-red">{* onclick="module.deleteAll(event)" *}
                <i class="zmdi zmdi-delete"></i>Удалить выбранные переводы
            </button>
        </div>
    </div>

    <div class="managing__end">
        <div class="managing__sortable">
            <span class="managing__sortable__label">{t('label.sort')}:</span>

            <div class="managing__sortable__select">
                <select name="sort">
                    <option value="">По новизне</option>
                    <option value="">По алфавиту</option>
                    <option value="">Только системные</option>
                    <option value="">Только пользовательские</option>
                </select>
            </div>
        </div>

        <div class="managing__limit">
            <span class="managing__limit__label">{t('on.the.page')}:</span>

            <div class="managing__limit__select">
                <select name="limit" onchange="module.setLimit('discounts', this)">
                    {foreach $page_count as $page}
                        <option value="{$page}"{if $page == $limit} selected{/if}>{$page}</option>
                    {/foreach}
                </select>
            </div>
        </div>
    </div>
</div>

<table class="module-table" id="module-table">
    <colgroup>
        <col width="30">    {* Чекбокс *}
        <col width="50">    {* Номер *}
        <col width="350">   {* Ключ *}
        <col>               {* Значение *}
        <col width="40">    {* Действия *}
    </colgroup>
    <thead>
        <tr>
            <th class="module-table__header module-table__center">
                {include file="system/controll.tpl"
                    type        =   "checkbox"
                    addclass    =   "controll_single"
                    name        =   "checked"
                    onchange    =   "module.checkAll(this)"
                }
            </th>
            <th class="module-table__header">
                <span class="module-table__sort{if $sort.name == 'id'} {$sort.by}{/if}" onclick="s.sort('id')">№</span>
            </th>
            <th class="module-table__header">
                <span class="module-table__sort{if $sort.name == 'key'} {$sort.by}{/if}" onclick="s.sort('key')">{t('system.key')}</span>
            </th>
            <th class="module-table__header">
                <span class="module-table__sort{if $sort.name == 'value'} {$sort.by}{/if}" onclick="s.sort('value')">{t('system.value')}</span>
            </th>
            <th class="module-table__header"></th>
        </tr>
        <tr>
            <td class="module-table__sub-header"></td>
            <td class="module-table__sub-header">
                <input name="id" class="catalog-input integer"{if $search.id} value="{$search.id}"{/if} placeholder="ID" onkeypress="module.search('id', this.value, true, event)">
            </td>
            <td class="module-table__sub-header">
                <input name="key" class="catalog-input"{if $search.key} value="{$search.key}"{/if} placeholder="Поиск по ключу..." onkeypress="module.search('key', this.value, true, event)">
            </td>
            <td class="module-table__sub-header">
                <input name="value" class="catalog-input"{if $search.value} value="{$search.value}"{/if} placeholder="Поиск по значению..." onkeypress="module.search('value', this.value, true, event)">
            </td>
            <td class="module-table__sub-header"></td>
        </tr>
    </thead>
    <tbody>
        {foreach $list as $item}
        <tr data-id="{$item.id}" id="catalog-row-{$item.id}" class="module-table__row">
            <td class="module-table__column module-table__vhcenter">
                {include file="system/controll.tpl"
                    type        =   "checkbox"
                    addclass    =   "controll_single"
                    ctrlclass   =   "check-all-spy"
                    name        =   "order["|cat:$item.id|cat:"]"
                    value       =   $item.id
                    onchange    =   "module.checkItem(this)"
                }
            </td>

            <td class="module-table__column module-table__vhcenter">
                {$item.id}
            </td>

            <td class="module-table__column">
                <a href="{$base_path}/edit/{$item.id}?backuri={$_backuri}" class="module-table__link" title="Редактировать">
                    <span class="catalog-edit zmdi zmdi-edit"></span> {$item.key}
                </a>
            </td>

            <td class="module-table__column">{$item.value}</td>

            <td class="module-table__column module-table__vhcenter">
                <a href="{$base_path}/del/{$item.id}?backuri={$_backuri}" onclick="return cp.dialog('Вы действительно хотите удалить?')" class="catalog-remove remove-trigger" title="Удалить" data-no-instant>
                    <i class="zmdi zmdi-delete"></i>
                </a>
            </td>
        </tr>
        {/foreach}
    </tbody>
</table>

{include file="system/pager.inc.tpl"}
{/strip}
