{strip}
<table class="table">
    <col width="35">
    <col>
    <col width="200">
    <col width="170">
    <col width="260">
    <thead>
        <tr>
            <th colspan="5">{t('titles.name')}</th>
        </tr>
    </thead>
    <tbody>
    {if !empty( $list )}
        <tr>
            <td class="h tac">
                {include file="system/controll.tpl"
                    type        =   "checkbox"
                    addclass    =   "controll_single"
                    name        =   "stc_menu[3]"
                    value       =   3
                }
            </td>
            <td class="h">Описание</td>
            <td class="h">Пользователь</td>
            <td class="h">Дата</td>
            <td class="h"></td>
        </tr>
        {foreach from=$list item=item}
        <tr>
            <td class="va_m tac">
                {include file="system/controll.tpl"
                    type        =   "checkbox"
                    addclass    =   "controll_single"
                    name        =   "stc_menu[3]"
                    value       =   3
                }
            </td>
            <td class="va_m">
                <a class="unactive">Re: {$item.desc}</a>
            </td>
            <td class="va_m">
                {$item.user}
            </td>
            <td class="va_m">
                {$item.date}
            </td>
            <td class="va_m">
                <a href="./?act=recovery&id={$item.id}{if isset($back_to_page )}&back_to_page={$back_to_page}{/if}" class="button button-green fl"><i class="zmdi zmdi-repeat"></i>Восстановить</a>
                <a href="./?act=remove&id={$item.id}{if isset($back_to_page )}&back_to_page={$back_to_page}{/if}" class="button button-red fr"><i class="zmdi zmdi-delete"></i>Удалить</a>
            </td>
        </tr>
        {/foreach}
    {else}
        <tr>
            <td colspan="5">
                Данные отсутствуют
            </td>
        </tr>
    {/if}
    </tbody>
</table>

{include "system/pager.tpl"}
{/strip}