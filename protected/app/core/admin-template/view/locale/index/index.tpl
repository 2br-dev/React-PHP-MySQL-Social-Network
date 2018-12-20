{strip}
<div class="managing">
    <div class="managing__start">
        <div class="managing__item">
            <form action="{$base_path}/search" class="locale-search">
                <input name="word" placeholder="{t('a.word.or.translation')}" class="locale-search__input" value="{$find_value}">
                <button type="submit" class="locale-search__button"><i class="zmdi zmdi-search"></i></button>
            </form>
        </div>

        <div class="managing__item">
            <a href="/{$ADMIN_DIR}/locale/add" class="button button-green">
                <i class="zmdi zmdi-plus-circle"></i>{t('add.something', [string => t('simple.word')])}
            </a>
        </div>

        {if !empty($smarty.get)}
        <div class="managing__item">
            <a href="{$base_path}" class="button"><i class="zmdi zmdi-format-clear-all"></i>Сбросить фильтры</a>
        </div>
        {/if}

        <div class="managing__item catalog-disable" id="remove-button">
            <button type="button" class="button button-red">{* onclick="shopping.deleteAll(event)" *}
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
                <select name="limit" onchange="shopping.setLimit('discounts', this)">
                    {foreach $page_count as $page}
                        <option value="{$page}"{if $page == $limit} selected{/if}>{$page}</option>
                    {/foreach}
                </select>
            </div>
        </div>
    </div>
</div>

<table class="table">
    <colgroup>
        <col width="250">
        <col>
        <col width="140">
        <col width="85">
        <col width="60">
    </colgroup>
    <thead>
        <tr>
            <th>Ключ</th>
            <th>{t('translations')}</th>
            <th>Примеры</th>
            <th colspan="2">Группа</th>
        </tr>
    </thead>
    <tbody>
    {if $dictionary_list}
        {foreach $dictionary_list as $key => $row}
        <tr>
            <td>
                <a href="/{$ADMIN_DIR}/locale/edit/{$key}" title="Редактировать"><span class="zmdi zmdi-edit"></span> {$key}</a>
            </td>
            <td>
                {foreach $row.list as $lang => $value}
                <span class="locale__item"><i class="flag flag_{$lang}"></i> <span class="locale__item__value">{$value}</span></span>
                {/foreach}
            </td>
            <td>
                <span class="inner-copy j-clipboard" data-clipboard="{$key}">key</span>
                <span class="inner-copy j-clipboard" data-clipboard="t('{$key}')">php</span>
                <span class="inner-copy j-clipboard" data-clipboard="{literal}{{{/literal} t('{$key}') {literal}}}{/literal}">twig</span>
                <span class="inner-copy j-clipboard" data-clipboard="{literal}{{/literal}t('{$key}'){literal}}{/literal}">smarty</span>
                <span class="inner-copy j-clipboard" data-clipboard="{literal}{{/literal}t('{$key}'){literal}}{/literal}">text</span>
            </td>
            <td>
            {if $row.system}
                <span class="label orange">{t('systematic')}</span>
            {/if}
            </td>
            <td class="tac">
                <a href="/{$ADMIN_DIR}/locale/edit/{$key}" class="zmdi zmdi-edit" title="Редактировать"></a>
                <a href="/{$ADMIN_DIR}/locale/del/{$row.id}" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить поле?')" data-no-instant></a>
            </td>
        </tr>
        {/foreach}
    {else}
        <tr>
            <td colspan="5">--</td>
        </tr>
    {/if}
    </tbody>
</table>

{include file="system/pager.tpl"}
{/strip}