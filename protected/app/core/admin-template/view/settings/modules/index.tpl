{strip}
{if $structure}

    {foreach from=$structure.main item=stc}
    <table class="t1 table table-toggle-trigger" id="xdata-{$stc.id}">
        <colgroup>
            <col>
            <col width="200">
            <col width="80">
            <col width="35">
            <col width="60">
        </colgroup>
        <thead>
        <tr class="th">
            <th colspan="5">
                <a href="#" class="table_hdr table_d js-table-toggle" data-toggle="xdata-{$stc.id}">
                    <i class="icon"></i>
                    {if $locale[$stc.name]}
                        {$locale[$stc.name]|capi}
                    {else}
                        {$stc.name}
                    {/if}
                </a>
            </th>
        </tr>
        </thead>
        <tbody>
            <tr style="display: none;">
                <td class="h">
                    Родитель
                </td>
                <td class="h">
                    {$stc.id}
                    {$stc.groups}
                </td>
                <td class="h">
                    {$stc.ord}
                </td>
                <td class="h tac">
                    <a href="{$base_path}/modules/visible/{$stc.id}" class="zmdi zmdi-eye{if $stc.visible == 0}-off{/if} visible-link" onclick="return cp.toggleModule(this, event);" data-no-instant></a>
                </td>
                <td class="h tac">
                    <a href="{$base_path}/modules/edit/{$stc.id}" class="zmdi zmdi-edit" title="Редактировать"></a>
                    <a href="{$base_path}/modules/del/{$stc.id}" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить?')" data-no-instant></a>
                </td>
            </tr>
            {foreach from=$structure.bind[$stc.id] item=bind}
            <tr style="display: none;">
                <td>
                    {if $locale[$bind.name]}
                        {$locale[$bind.name]|capi}
                    {else}
                        {$bind.name}
                    {/if}
                </td>
                <td>
                    {$bind.pid}
                    {$bind.groups}
                </td>
                <td>
                    {$bind.ord}
                </td>
                <td class="tac">
                    <a href="{$base_path}/modules/visible/{$bind.id}" class="zmdi zmdi-eye{if $bind.visible == 0}-off{/if} visible-link" onclick="return cp.toggleModule(this, event);" data-no-instant></a>
                </td>
                <td class="tac">
                    <a href="{$base_path}/modules/edit/{$bind.id}" class="zmdi zmdi-edit" title="Редактировать"></a>
                    <a href="{$base_path}/modules/del/{$bind.id}" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить?')" data-no-instant></a>
                </td>
            </tr>
            {/foreach}
        </tbody>
    </table>
    {/foreach}

{/if}
{/strip}