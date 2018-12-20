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
                    <input name="key" id="dictionary-key" class="w50"{if isset($dictionary_item.key)} value="{$dictionary_item.key}"{/if}>
                    {* <a href="#" onclick="return translate_key('#dictionary-key')" class="button button-purple button-icon"><i class="zmdi zmdi-refresh"></i></a> *}
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
                            <input name="val[{$locale.system}]" placeholder="{$locale.name}"{if isset($dictionary_item[$locale.system])} value="{$dictionary_item[$locale.system]}"{/if} class="locale__input">
                        </div>
                        {/foreach}
                    {/if}
                </td>
            </tr>
            <tr>
                <td class="h hl">{t('systematic')}:</td>
                <td>
                    {if isset($dictionary_item.system) && $dictionary_item.system == 1}
                        {$default1 = true}
                    {else}
                        {$default1 = false}
                    {/if}

                    {if !isset($dictionary_item.system) || $dictionary_item.system == 0}
                        {$default0 = true}
                    {else}
                        {$default0 = false}
                    {/if}

                    {include file="system/group.tpl"
                        name    = "system"
                        check   = $robots
                        list    = [
                            [ value => '1', text => "Да", default => $default1 ],
                            [ value => '0', text => "Нет", default => $default0 ]
                        ]
                    }
                </td>
            </tr>
        </tbody>
    </table>
    
    {include file="system/buttons.tpl"}
</form>
{/strip}