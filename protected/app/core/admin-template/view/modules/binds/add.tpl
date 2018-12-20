{strip}
<form method="post" id="form_mdd">
	<input type="hidden" name="module_action" value="add_bind">
	
    <table class="table">
        <col width="200">
        <col>
        <thead>
            <tr>
                <th colspan="2">Добавление функции</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h">Имя бинда</td>
                <td>
                    <input name="name" class="ness">
                </td>
            </tr>
            <tr>
                <td class="h">Имя функции</td>
                <td>
                    <input name="func_name" class="ness">
                </td>
            </tr>
            <tr>
                <td class="h">{t('caching')}</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "cache"
                        list    = [
                            [ value => '1', text => "Вкл.", default => true ],
                            [ value => '0', text => "Выкл." ]
                        ]
                    }
                </td>
            </tr>
        </tbody>
	</table>
    
    {include file="system/buttons.tpl"}
</form>
{/strip}