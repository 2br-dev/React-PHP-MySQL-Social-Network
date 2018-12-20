{strip}
<form method="post" id="form_mdd">
	<input type="hidden" name="action" value="counters_add_type">
	
	<table id="meta_data" class="table">
        <colgroup>
            <col width="200">
            <col>
        </colgroup>
        <tbody>
            <tr class="th">
                <td class="h va_m">Наименование</td>
                <td>
                    <input name="name" class="w50 ness">
                </td>
            </tr>
            <tr class="th">
                <td class="h va_m">Системное имя</td>
                <td>
					<input name="system" class="w50 ness">
                </td>
            </tr>
            <tr class="th">
                <td class="h va_t">Шаблон</td>
                <td>
                    {include file="system/editor.tpl" 
                        editor_id           =   "template_editor"
                        editor_name         =   "template"
                        editor_cont         =   ""
                        editor_hightlight   =   'htmlmixed'
                        editor_save_btn     =   true
                    }
                </td>
            </tr>
        </tbody>
    </table>
    
    {include file="system/buttons.tpl"}
</form>
{/strip}