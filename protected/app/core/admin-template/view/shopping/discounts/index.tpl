{strip}
<div class="managing">
    <div class="managing__start">
        <div class="managing__item">
            <a href="{$base_path}/discounts/add" class="button button-green">
                <i class="icon icon-plus-square"></i>Добавить промокод
            </a>
        </div>

        {if !empty($smarty.get)}
        <div class="managing__item">
            <a href="{$base_path}/discounts" class="button"><i class="icon icon-format-clear-all"></i>Сбросить фильтры</a>
        </div>
        {/if}

        <div class="managing__item catalog-disable" id="remove-button">
            <button type="button" class="button button-red">{* onclick="shopping.deleteAll(event)" *}
                <i class="icon icon-delete"></i>Удалить выбранные промокоды
            </button>
        </div>
    </div>

    <div class="managing__end">
        <div class="managing__limit">
            <span class="managing__limit__label">{t('on.the.page')}:</span>

            <div class="managing__limit__select">
                <select name="limit" onchange="shopping.setLimit('discounts', this)">
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
        <col>               {* Наименование *}
        <col>               {* Промокод *}
        <col>               {* Количество использований *}
        <col>               {* Размер скидки *}
        <col>               {* Срок действия *}
        <col>               {* Статус *}
        <col width="40">    {* Действия *}
    </colgroup>
    <thead>
        <tr>
            <th class="module-table__header module-table__center">
                {include file="system/controll.tpl"
                    type        =   "checkbox"
                    addclass    =   "controll_single"
                    name        =   "checked"
                    onchange    =   "shopping.checkAll(this)"
                }
            </th>
            <th class="module-table__header">
                <span class="module-table__sort{if $sort.name == 'id'} {$sort.by}{/if}" onclick="shopping.sort('id')">№</span>
            </th>
            <th class="module-table__header">
                <span class="module-table__sort{if $sort.name == 'name'} {$sort.by}{/if}" onclick="shopping.sort('name')">Наименование</span>
            </th>
            <th class="module-table__header">
                <span class="module-table__sort{if $sort.name == 'name'} {$sort.by}{/if}" onclick="shopping.sort('name')">Промокод</span>
            </th>
            <th class="module-table__header">
                <span class="module-table__sort{if $sort.name == 'name'} {$sort.by}{/if}" onclick="shopping.sort('name')">Кол-во использований</span>
            </th>
            <th class="module-table__header">
                <span class="module-table__sort{if $sort.name == 'name'} {$sort.by}{/if}" onclick="shopping.sort('name')">Размер скидки</span>
            </th>
            <th class="module-table__header">
                <span class="module-table__sort{if $sort.name == 'name'} {$sort.by}{/if}" onclick="shopping.sort('name')">Срок действия</span>
            </th>
            <th class="module-table__header">
                <span class="module-table__sort{if $sort.name == 'name'} {$sort.by}{/if}" onclick="shopping.sort('name')">Статус</span>
            </th>
            <th class="module-table__header"></th>
        </tr>
        {*
        <tr>
            <td class="module-table__sub-header"></td>
            <td class="module-table__sub-header">
                <input name="id" class="catalog-input integer"{if $search.id} value="{$search.id}"{/if} placeholder="ID" onkeypress="shopping.search('id', this.value, true, event)">
            </td>
            <td class="module-table__sub-header">
                <input name="name" class="catalog-input"{if $search.name} value="{$search.name}"{/if} placeholder="Поиск по названию..." onkeypress="shopping.search('name', this.value, true, event)">
            </td>
            <td class="module-table__sub-header"></td>
        </tr>
        *}
    </thead>

    <tbody>
    {if $discounts}
        {foreach $discounts as $key => $promo}
        <tr data-id="{$promo.id}" id="catalog-row-{$promo.id}" class="module-table__row">
            <td class="module-table__column module-table__vhcenter">
                {include file="system/controll.tpl"
                    type        =   "checkbox"
                    addclass    =   "controll_single"
                    ctrlclass   =   "check-all-spy"
                    name        =   "order["|cat:$promo.id|cat:"]"
                    value       =   $promo.id
                    onchange    =   "shopping.checkItem(this)"
                }
            </td>

            <td class="module-table__column module-table__vhcenter">{$promo.id}</td>

            <td class="module-table__column">
                <a href="{$base_path}/discounts/edit/{$promo.id}?backuri={$_backuri}" class="module-table__link" title="Редактировать">
                    <span class="catalog-edit icon icon-edit"></span> {$promo.name}
                </a>
            </td>

            <td class="module-table__column">
                <span class="inner-copy j-clipboard" data-clipboard="{$promo.code}">{$promo.code}</span>
            </td>

            <td class="module-table__column">{$promo.limit}</td>

            <td class="module-table__column">{$promo.discount}{if $promo.discount_type == 1}%{else} руб.{/if}</td>

            <td class="module-table__column">{$promo.date_start} - {$promo.date_end}</td>

            <td class="module-table__column">
                {if $promo.active == 1}
                <span class="label green">Активен</span>
                {else}
                <span class="label amber">Заблокирован</span>
                {/if}
            </td>

            <td class="module-table__column module-table__vhcenter">
                <a href="{$base_path}/discounts/del/{$promo.id}?backuri={$_backuri}" onclick="return cp.dialog('Вы действительно хотите удалить?')" class="catalog-remove remove-trigger" title="Удалить" data-no-instant>
                    <i class="icon icon-delete"></i>
                </a>
            </td>
        </tr>
        {/foreach}
    {else}
        <tr>
            <td colspan="4" class="empty-row">
                Тегов нет
            </td>
        </tr>
    {/if}
    </tbody>
</table>

{include file="system/pager.inc.tpl"}
{/strip}