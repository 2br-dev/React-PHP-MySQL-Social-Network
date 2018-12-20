{strip}
<div class="apply notice">
    {include file="system/help.tpl" help_theme="usr_logs"}
</div>

<table class="table">
    <col width="200">
    <col width="100">
    <col>
    <col width="160">
    <col width="35">
    <thead>
        <tr>
            <th>Событие</th>
            <th>Тип</th>
            <th>Информация о посетителе</th>
            <th>Дата</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
    {if isset($log_list ) && !empty( $log_list ) nocache}
        {foreach item=item from=$log_list name=i}
        <tr>
            <td>{$item.msg}</td>
            <td>{$item.type}</td>
            <td>{foreach item=it from=$item.desc|@unserialize key=k}<b>{$k}:</b> {$it}<br />{/foreach}</td>
            <td>{$item.date}</td>
            <td class="tac">
                <a href="{$base_path}/logs/del/{$item.id}/{if $back_to_page}?page={$back_to_page}{/if}" class="zmdi zmdi-delete" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить запись?');" data-no-instant></a>
            </td>
        </tr>
        {/foreach}
    {else}
        <tr>
            <td colspan="5" class="center-middle"><b>Пользователей нет</b></td>
        </tr>
    {/if}
    </tbody>
</table>

{include file="system/pager.tpl"}
{/strip}