{strip}
{if isset($mdd_additions_list ) && !empty( $mdd_additions_list )}
<ul class="tabs clearfix">
	{foreach from=$mdd_additions_list item=mname key=mid}
		<li><a href="/{$ADMIN_DIR}/meta/{$mid}/" class="tab{if isset($module_id ) && $module_id == $mid} current{/if}">{$mname}</a></li>
	{/foreach}
</ul>
{/if}

<form method="post" id="form_mdd">
	<input type="hidden" name="module_action" value="edit_group">
	
	<table class="table">
		<colgroup><col width="200"><col></colgroup>
		<thead>
		<tr>
			<th colspan="2">
				Редактирование группы
			</th>
		</tr>
		</thead>
		<tbody>
			<tr>
				<td class="h">
					Наименование группы:
				</td>
				<td>
					<input name="name" value="{if isset($group_item.name )}{$group_item.name}{/if}" tabindex="1">
				</td>
			</tr>
			<tr>
				<td class="h">
					Системное имя:
				</td>
				<td>
					<input class="width-100" name="sys_name js-binding" data-binding-name="name" data-binding-element="sys_name" value="{if isset($group_item.sys_name)}{$group_item.sys_name}{/if}" tabindex="2">
				</td>
			</tr>
			<tr>
				<td class="h">
					Модули в группе:
				</td>
				<td>
					{if $modules_list}
						{foreach from=$modules_list item=item}
							{$checked = false}

	                        {if isset($group_item.modules) && in_array( $item.id, $group_item.modules )}
	                            {$checked = true}
	                        {/if}

	                        {include file="system/controll.tpl"
	                            type        =   "checkbox"
	                            name        =   "modules["|cat:$item.id|cat:"]"
	                            checked     =   $checked
	                            value       =   $item.id
	                            text        =   $item.name
	                        }
						{/foreach}
					{/if}
				</td>
			</tr>
			<tr>
                <td class="h">Сортировка:</td>
                <td>
                    <input name="ord" value="{if isset($group_item.ord )}{$group_item.ord}{/if}" class="integer ord">
                </td>
            </tr>
			<tr>
                <td class="h">Отображать:</td>
                <td>
                	{include file="system/group.tpl"
                        name    = "visible"
                        check   = $group_item.visible
                        list    = [
                            [ value => '1', text => "Да", default => true ],
                            [ value => '0', text => "Нет" ]
                        ]
                    }
                </td>
            </tr>
		</tbody>
	</table>
	
	{include file="system/buttons.tpl"}
</form>
{/strip}