{strip}
<form action="/{$ADMIN_DIR}/settings" method="POST">
    <input type="hidden" name="action" value="save_setting">
    <table class="table">
        <col width="200">
        <col>
        <thead>
            <tr>
                <th colspan="2">{$locale.site_settings|capi}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h hl">{$locale.site_name|capi}</td>
                <td id="COMPANY_NAME">
                    <input type="text" name="COMPANY_NAME" value="{$settings['COMPANY_NAME']|escape}">
                </td>
            </tr>
            <tr>
                <td class="h hl">{$locale.timezone|capi}</td>
                <td>
                    <div class="select-up">
                    {if !empty($timezone)}
                    <select name="SYSTEM_TIMEZONE">
                        {foreach from=$timezone item=zone}
                            <option value="{$zone.value}"{if isset($settings['SYSTEM_TIMEZONE']) && $zone.value == $settings['SYSTEM_TIMEZONE']} selected{/if}>{$zone.name}</option>
                        {/foreach}
                    </select>
                    {/if}
                    </div>
                </td>
            </tr>
            <tr>
                <td class="h hl">{$locale.locale|capi}</td>
                <td>
                    {* <div class="group"> *}
                        <select name="SYSTEM_LOCALE">
                        {foreach $languages as $lang}
                            <option value="{$lang.system}"{if isset($settings['SYSTEM_LOCALE']) && $settings['SYSTEM_LOCALE'] == $lang.system} selected{/if}>
                                {$lang.name}
                            </option>
                        {/foreach}
                        </select>

                        <a href="{$base_path}/add" class="button button-green">Добавить</a>
                    {* </div> *}
                </td>
            </tr>
            <tr>
                <td class="h hl">Главная страница</td>
                <td>
                    <select name="SYSTEM_MAINPAGE">
                    {foreach $pages as $page}
                        <option value="{$page.id}"{if isset($settings['SYSTEM_MAINPAGE']) && $settings['SYSTEM_MAINPAGE'] == $page.id} selected{/if}>
                            {t($page.name)}
                        </option>
                    {/foreach}
                    </select>
                </td>
            </tr>
            <tr>
                <td class="h hl">{$locale.debug|capi}</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "SYSTEM_DEBUG"
                        check   = $settings['SYSTEM_DEBUG']
                        list    = [
                            [ value => '1', text => $locale.yes|capi ],
                            [ value => '0', text => $locale.no|capi, default => true ]
                        ]
                    }
                </td>
            </tr>
            <tr>
                <td class="h hl">{$locale.enablecache|capi}</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "ENABLECACHE"
                        check   = $settings['ENABLECACHE']
                        list    = [
                            [ value => '1', text => $locale.yes|capi ],
                            [ value => '0', text => $locale.no|capi, default => true ]
                        ]
                    }
                </td>
            </tr>
            <tr>
                <td class="h hl">{$locale.iis|upper}</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "SYSTEM_TRANSLATE"
                        check   = $settings['SYSTEM_TRANSLATE']
                        list    = [
                            [ value => 'latin', text => $locale.latin|capi, hint => "/stati/metki/leto", default => true ],
                            [ value => 'cyrillic', text => $locale.cyrillic|capi, hint => "/статьи/метки/лето" ],
                            [ value => 'translate', text => $locale.translate|capi, hint => "/articles/tags/summer" ]
                        ]
                    }
                </td>
            </tr>
        </tbody>
    </table>

    <div class="button-container clearfix">
        <button class="button" type="submit"><i class="zmdi zmdi-save"></i>{$locale['buttons.save']|capi}</button>
    </div>
</form>
{/strip}