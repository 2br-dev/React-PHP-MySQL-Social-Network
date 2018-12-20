{strip}
<form action="" id="form" method="post">
    <input type="hidden" name="action" value="zone_add">
		
	<table class="table">
	    <col width="200">
	    <col>
	    <thead>
            <tr>
                <th colspan="2">Добавление зоны</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h hl">{t('titles.name')} <span class="ness_color">*</span></td>
                <td><input name="name" class="ness"></td>
            </tr>
            <tr>	
                <td class="h hl">Системное имя <span class="ness_color">*</span></td>
                <td>
                    <input name="sys_name" class="ness js-binding" data-binding-name="name" data-binding-element="sys_name">
                </td>
            </tr>
            <tr>	
                <td class="h hl">Шаблон</td>
                <td>
                    <select name="template">
                        <option value="">любой шаблон</option>
                        {foreach item=item from=$tid_list key=k}
                        <option value="{$k}">{$item}</option>
                        {/foreach}
                    </select>
                </td>
            </tr>
            <tr>	
                <td class="h hl">Активна</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "visible"
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