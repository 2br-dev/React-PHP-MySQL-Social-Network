{strip}
<form action="" method="post" enctype="multipart/form-data">
    <input type="hidden" name="form_action" value="add">

    <table class="table">
        <col width="200">
        <col>
        <thead>
            <tr>
                <th colspan="2">Редактирование параметра</th>
            </tr>
        </thead>
        <tbody>

            <tr>
                <td class="h">{t('system.key')}:</td>
                <td>
                    <input name="key" value="{$item.key}">
                </td>
            </tr>

            <tr>
                <td class="h">{t('system.value')}:</td>
                <td>
                    <input name="value" value="{$item.value}">

                    {include file="system/group.tpl"
                        name    = "active"
                        check   = $item.active
                        list    = [
                            [ value => 1, text => "Активен" ],
                            [ value => 0, text => "Заблокирован" ]
                        ]
                    }
                </td>
            </tr>

        </tbody>
   </table>

    {include file="system/buttons.tpl"}
</form>
{/strip}