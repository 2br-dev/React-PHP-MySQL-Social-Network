{strip}
<form method="post" id="form_mdd">
	<input type="hidden" name="action" value="menu_add">
	
	<table id="meta_data" class="table">
        <colgroup>
            <col width="200">
            <col>
        </colgroup>
        <tbody>
            <tr class="th">
                <td class="h hl va_m">Наименование меню</td>
                <td>
					<input name="name" class="w50 ness">
                </td>
            </tr>
            <tr class="th">
                <td class="h hl va_m">Системное имя</td>
                <td>
					<input name="system" class="w50 ness js-binding" data-binding-name="name" data-binding-element="system">
                </td>
            </tr>
            <tr class="th">
                <td class="h hl va_m">Отображать подменю</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "tree"
                        list    = [
                            [ value => '1', text => "Да" ],
                            [ value => '0', text => "Нет", default => true ]
                        ]
                    }
                </td>
            </tr>
        </tbody>
    </table>
    
    {include file="system/buttons.tpl"}
</form>
{/strip}