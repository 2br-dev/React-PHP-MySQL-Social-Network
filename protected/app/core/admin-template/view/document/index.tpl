{strip}
<div class="button-container clearfix">
    <a class="button button-blue" href="/{$ADMIN_DIR}/document/add/"><i class="zmdi zmdi-plus-circle"></i>Добавить группу</a>
</div>

<table class="table" id="meta_data">
    <col>
    <col width="200">
    <col width="70">
    <thead>
        <tr class="th">
            <th colspan="3">Документация</th>
        </tr>
    </thead>
    <tbody>
    {if !empty( $docs_list )}
        <tr>
            <td class="h">Группа</td>
            <td class="h">Ключ</td>
            <td class="h"></td>
        </tr>
        {foreach item=item from=$docs_list name=i}
        <tr>
            <td><a href="/{$ADMIN_DIR}/document/edit/{$item.id}/{if isset($back_to_page )}{$back_to_page}{/if}" title="Редактировать">{$item.title|escape}</a></td>
            <td>{$item.key|escape}</td>
            <td class="tac">
                <a href="/{$ADMIN_DIR}/document/edit/{$item.id}/{if isset($back_to_page )}{$back_to_page}{/if}" class="zmdi zmdi-edit" title="Редактировать"></a>
                <a href="/{$ADMIN_DIR}/document/del/{$item.id}/" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить?')" data-no-instant></a>
            </td>
        </tr>
        {/foreach}
    {else}
        <tr>
            <td colspan="3" class="center-middle">Данные отсутствуют</td>
        </tr>
    {/if}
    </tbody>
</table>
{include file="system/pager.tpl"}
{/strip}