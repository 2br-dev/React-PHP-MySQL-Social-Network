{strip}
<form action="" method="post">
    <input type="hidden" name="form_action" value="add">
    
    <table class="table">
        <col width="200">
        <col>
        <thead>
            <tr>
                <th colspan="2">{t('contents.title')}</th>
            </tr>
        </thead>
        <tbody>
           <tr>
                <td class="h hl">{t('unique.identificator')}:</td>
                <td>
                    <input name="key" id="dictionary-key" class="w50">
                    <a href="#" onclick="return translate_key('#dictionary-key')" class="button button-purple button-icon"><i class="zmdi zmdi-refresh"></i></a>
                </td>
            </tr>
           <tr>
                <td class="h hl">{t('translations')}:</td>
                <td>
                    {if $locale_list}
                        {foreach $locale_list as $locale}
                        <div class="locale__row">
                            <div class="locale__row__flag">
                                <i class="flag flag_{$locale.system}"></i>
                            </div>
                            <input name="val[{$locale.system}]" placeholder="{$locale.name}" class="locale__input">
                        </div>
                        {/foreach}
                    {/if}
                </td>
            </tr>
            <tr>
                <td class="h hl">{t('systematic')}:</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "system"
                        check   = $robots
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