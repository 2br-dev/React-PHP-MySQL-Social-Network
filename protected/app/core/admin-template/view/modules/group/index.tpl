{strip}
<table class="table" id="meta_data">
    <col width="20%">
    <col width="15%">
    <col>
    <col width="100">
    <col width="100">
    <col width="60">
    <thead>
        <tr class="th">
            <th colspan="6">Список модулей</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="h">Название группы</td>
            <td class="h">Системное имя</td>
            <td class="h">Модули</td>
            <td class="h">Сортировка</td>
            <td class="h">Отображать</td>
            <td class="h"></td>
        </tr>
        {if $mdd_group_list}
        {foreach from=$mdd_group_list item=item}
        <tr>
            <td><a href="{$base_path}/group/edit/{$item.id}/" title="Редактировать" class="module-item-link"><i class="zmdi zmdi-edit"></i> {$item.name}</a></td>
            <td>{$item.sys_name}</td>
            <td>
            	{if isset($item.modules ) && !empty( $item.modules )}
            		{foreach from=$item.modules item=m name=modules}
            			{$m}{if !$smarty.foreach.modules.last}, {/if}
            		{/foreach}
            	{/if}
        	</td>
            <td>{$item.ord}</td>
            <td><a class="zmdi zmdi-eye{if $item.visible == 0}-off{/if}" onclick="return ajax_toggle_group(this,{$item.id});" href="#"></a></td>
            <td class="va_m tac">
                <a href="{$base_path}/group/edit/{$item.id}/" class="zmdi zmdi-edit" title="Редактировать"></a>
                <a href="{$base_path}/group/del/{$item.id}/" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить группу?');" data-no-instant></a>
            </td>
        </tr>
        {/foreach}
        {/if}
    </tbody>
</table>

<div class="button-container clearfix">
    <a href="{$base_path}/group/add/" class="button button-green"><i class="zmdi zmdi-plus-circle"></i>Добавить группу</a>
</div>
{/strip}