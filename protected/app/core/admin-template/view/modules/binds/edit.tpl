{strip}
{if isset($smarty.get.msg ) && $smarty.get.msg == "apply"}
    <div class="apply">Данные были успешно сохранены!</div>
{/if}

<form method="post" id="form_mdd">
    <input type="hidden" name="module_action" value="edit_bind">
    
    <table class="table">
        <col width="200">
        <col>
        <thead>
            <tr>
                <th colspan="2">Редактирование функции</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h">Имя бинда</td>
                <td>
                    <input name="name" value="{$mdd_bind.name}" class="ness">
                </td>
            </tr>
            <tr>
                <td class="h">Имя функции</td>
                <td>
                    <input name="func_name" value="{$mdd_bind.func_name}" class="ness">
                </td>
            </tr>
            <tr>
                <td class="h">{t('caching')}</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "cache"
                        check   = $mdd_bind.cache
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