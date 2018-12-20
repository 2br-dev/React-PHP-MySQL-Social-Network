{strip}
<form action="" method="post">
	<input type="hidden" name="form_action" value="add_list">
	
	{* List *}
	<table class="table">
        <thead>
            <tr>
                <th colspan="2">Новый список</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h w50">Название списка на русском</td>
                <td class="h w50">Системное имя ( латин. символы )</td>
            </tr>
            <tr>
                <td><input name="name" placeholder="Например: Субъекты федерации"></td>
                <td><input name="list_name" placeholder="Например: regions"></td>
            </tr>
        </tbody>
	</table>

	{* Values *}
	<table class="table">
        <col>
        <col>
        <col width="120">
        <col width="120">
        <col width="55">
        <thead>
            <tr>
                <th colspan="5">Список значений</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h">{t('titles.name')}</td>
                <td class="h">Значение</td>
                <td class="h">По-умолчанию</td>
                <td class="h">Порядок</td>
                <td class="h"></td>
            </tr>
            <tr id="tr0">
                <td>
                    <input type="hidden" name="field_id[]" value="0">
                    <input name="var[]" placeholder="Например: Краснодарский край">
                </td>
                <td><input name="value[]" placeholder="Например: 23"></td>
                <td>
                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        name        =   "default[]"
                        value       =   "1"
                        checked     =   true
                    }
                </td>
                <td><input name="ord[]" value="0" class="ord integer reducing-trigger"></td>
                <td class="tac">
                    <a href="#" class="zmdi zmdi-delete" title="Удалить" onclick="del_list_fields(0);return false;"></a>
                </td>
            </tr>
            <tr id="add_btn">
                <td colspan="5">
                     <a href="#" title="Добавить" class="fr" onclick="add_list_fields_list();return false;"><span class="zmdi zmdi-plus-circle"></span> Добавить</a>
                </td>
            </tr>
        </tbody>
	</table>
    
    {include file="system/buttons.tpl"}
</form>
<script type="text/javascript">
    var field_counter = 0;
</script>
{/strip}