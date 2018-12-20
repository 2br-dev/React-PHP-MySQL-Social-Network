{strip}
{if $modules_list}
<form action="" method="POST">
    <input name="module_action" type="hidden" value="export">

    <table class="table">
        <col width="40">
        <col width="250">
        <col width="200">
        <col width="130">
        <col>
        <thead>
            <tr class="th">
                <th colspan="5">Список модулей</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h checkbox-col">
                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        addclass    =   "controll_single"
                        needle      =   "1"
                        name        =   "module"
                        onchange    =   "checkAll(this)"
                    }
                </td>
                <td class="h">Название модуля</td>
                <td class="h">Системное имя</td>
                <td class="h">Экспорт данных</td>
                <td class="h"></td>
            </tr>
            {foreach item=item from=$modules_list name=item}
            <tr>
            	<td class="checkbox-col">
                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        addclass    =   "controll_single"
                        ctrlid      =   "module-"|cat:$item.id
                        name        =   "module"
                        value       =   $item.id
                        onchange    =   "changeRow(this)"
                    }
                </td>
            	<td>
                    <label for="module-{$item.id}">{$item.name}</label>
                </td>
                <td>{$item.sys_name}</td>
            	<td class="va_t">
                    {include file="system/group.tpl"
                        name    = "data["|cat:$item.id|cat:"]"
                        list    = [
                            [ value => '0', text => "Нет", default => true ],
                            [ value => '1', text => "Да" ]
                        ]
                    }
                </td>
            	<td class="va_t">
            		{if $item.binds}
            			<ul>
            			{foreach from=$item.binds item=bind}
            				<li>
                                {include file="system/controll.tpl"
                                    type        =   "checkbox"
                                    addclass    =   "controll_single"
                                    ctrlid      =   "module-"|cat:$item.id
                                    name        =   "bind["|cat:$item.id|cat:"]["|cat:$v|cat:"]"
                                    value       =   $bind.id
                                    text        =   $bind.name
                                }
                            </li>
            			{/foreach}
            			</ul>
            		{/if}
        		</td>
    		</tr>
            {/foreach}
        </tbody>
    </table>

    <div class="button-container clearfix">
        <button type="submit" class="button button-purple"><i class="zmdi zmdi-plus-circle"></i>Экспортировать</button>
    </div>
</form>
{/if}
{/strip}