{strip}
<form id="form" method="post">
	<input type="hidden" name="action" value="zone_edit">
	
	<table class="table">
	    <col width="200">
	    <col>
	    <thead>
            <tr>
                <th colspan="2">Редактирование зоны</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h hl">{t('titles.name')} <span class="ness_color">*</span></td>
                <td><input name="name" class="ness" value="{$zone_item.name}"></td>
            </tr>
            <tr>	
                <td class="h hl">Системное имя <span class="ness_color">*</span></td>
                <td>
                    <input name="sys_name" class="ness js-binding{if $zone_item.sys_name} js-binding-init{/if}" data-binding-name="name" data-binding-element="sys_name" value="{$zone_item.sys_name}">
                </td>
            </tr>
            <tr>	
                <td class="h hl">Шаблон</td>
                <td>
                    <select name="template">
                        <option value="">любой шаблон</option>
                        {foreach item=item from=$tid_list key=k}
                        <option value="{$k}"{if $zone_item.tid == $k} selected="selected"{/if}>{$item}</option>
                        {/foreach}
                    </select>
                </td>
            </tr>
            <tr>	
                <td class="h hl">Активна</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "visible"
                        check   = $zone_item.visible
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