{strip}
<div class="button-container">
    <a href="/{$ADMIN_DIR}/seo/scan"class="button button-blue" data-no-instant><i class="zmdi zmdi-ok-circle"></i>Начать сканирование</a>
</div>

<form method="post">
    <input type="hidden" value="generate" name="action">
    
    <table class="table">
        <col width="200">
        <col>
        <tbody>
            <tr>
                <td class="h">Адрес сайта</td>
                <td>
                    <input value="{if isset($settings.website)}{$settings.website|stripslashes}{/if}" size="50" name="website" class="required">
                </td>
            </tr>
            <tr>
                <td class="h">Сообшить о карте</td>
                <td>
                <div class="controlls-wrapper">
                    {if isset($ping)}
                        {foreach from=$ping item=text key=value}
                            {$checked = false}

                            {if isset($settings.ping) && in_array($value, $settings.ping)}
                                {$checked = true}
                            {/if}

                            {include file="system/controll.tpl"
                                type        =   "checkbox"
                                name        =   "ping[]"
                                checked     =   $checked
                                value       =   $value
                                text        =   $text
                            }
                        {/foreach}
                    {/if}
                </div>
                </td>
            </tr>
            <tr>
                <td class="h">Сжать файл</td>
                <td>
                    {$checked = false}

                    {if isset($settings.compress_sitemap) && $settings.compress_sitemap == '1'}
                        {$checked = true}
                    {/if}

                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        name        =   "compress_sitemap"
                        checked     =   $checked
                        value       =   1
                        text        =   "Сжимать файл"
                    }
                </td>
            </tr>
            <tr>
                <td class="h">Файл карты сайта</td>
                <td>
                    <input value="{if isset($settings.sitemap_file)}{$settings.sitemap_file|stripslashes}{/if}" size="50" class="w50" name="sitemap_file">
                </td>
            </tr>
            <tr>
                <td class="h">Сжатый файл</td>
                <td>
                    <input value="{if isset($settings.compress_file)}{$settings.compress_file|stripslashes}{/if}" size="50" class="w50" name="compress_file">
                </td>
            </tr>
            <tr>
                <td class="h">Игнорировать разделы</td>
                <td>
                    {assign var="disallow_dir" value=""}

                    {if isset($settings.disallow_dir)}
                        {assign var="disallow_dir" value=$settings.disallow_dir|stripslashes}
                    {/if}

                    {include file="system/editor.tpl"
                        editor_type       =   "codemirror"
                        editor_id         =   "disallow_dir"
                        editor_name       =   "disallow_dir"
                        editor_value      =   $disallow_dir
                        editor_cont       =   $disallow_dir
                        editor_hightlight =   "shell"
                    }
                </td>
            </tr>
            <tr>
                <td class="h">Игнорировать файлы</td>
                <td>
                    {assign var="disallow_file" value=""}

                    {if isset($settings.disallow_file)}
                        {assign var="disallow_file" value=$settings.disallow_file|stripslashes}
                    {/if}

                    {include file="system/editor.tpl"
                        editor_type       =   "codemirror"
                        editor_id         =   "disallow_file"
                        editor_name       =   "disallow_file"
                        editor_value      =   $disallow_file
                        editor_cont       =   $disallow_file
                        editor_hightlight =   "shell"
                    }
                </td>
            </tr>
            <tr>
                <td class="h">Игнорировать ключи в url</td>
                <td>
                    {assign var="disallow_key" value=""}

                    {if isset($settings.disallow_key)}
                        {assign var="disallow_key" value=$settings.disallow_key|stripslashes}
                    {/if}

                    {include file="system/editor.tpl"
                        editor_type       =   "codemirror"
                        editor_id         =   "disallow_key"
                        editor_name       =   "disallow_key"
                        editor_value      =   $disallow_key
                        editor_cont       =   $disallow_key
                        editor_hightlight =   "shell"
                    }
                </td>
            </tr>
            <tr>
                <td class="h">Последние изменения</td>
                <td>
                    {if isset($lastmod)}
                    <div class="group-label clearfix">
                        <p class="mb10">Даты последнего изменения:</p>

                        {foreach from=$lastmod item=text key=value}
                            {include file="system/controll.tpl"
                                type        =   "radio"
                                name        =   "lastmod"
                                needle      =   $settings.lastmod
                                value       =   $value
                                text        =   $text
                            }
                        {/foreach}
                    </div>
                    {/if}

                    {if isset($lastmod_format)}
                    <div class="group-label mb0 clearfix">
                        <p class="mb10">Формат времени:</p>
                        {foreach from=$lastmod_format item=text key=value}
                            {include file="system/controll.tpl"
                                type        =   "radio"
                                name        =   "lastmod_format"
                                needle      =   $settings.lastmod_format
                                value       =   $value
                                text        =   $text
                            }
                        {/foreach}
                    </div>
                    {/if}
                </td>
            </tr>
            <tr>
                <td class="h">Приоритет</td>
                <td>
                    {if isset($priority)}
                    <div class="group-label mb0 clearfix">
                        {foreach from=$priority item=text key=value}
                            {include file="system/controll.tpl"
                                type        =   "radio"
                                name        =   "priority"
                                needle      =   $settings.priority
                                value       =   $value
                                text        =   $text
                            }
                        {/foreach}
                    </div>
                    {/if}
                    
                    {if isset($priority_fixed)}
                        {include file="system/group.tpl"
                            type    = "radio"
                            check   = $settings.priority_fixed
                            name    = "priority_fixed"
                            list    = $priority_fixed
                        }
                    {/if}
                </td>
            </tr>
            <tr>
                <td class="h">Частота изменения</td>
                <td>
                    {if isset($changefreq)}
                        {foreach from=$changefreq item=text key=value}
                            {include file="system/controll.tpl"
                                type        =   "radio"
                                name        =   "changefreq"
                                needle      =   $settings.changefreq
                                value       =   $value
                                text        =   $text
                            }
                        {/foreach}
                    {/if}
                    
                    {if isset($changefreq_fixed)}
                        {include file="system/group.tpl"
                            type    = "radio"
                            check   = $settings.changefreq_fixed
                            name    = "changefreq_fixed"
                            list    = $changefreq_fixed
                        }
                    {/if}
                </td>
            </tr>
        </tbody>
    </table>

    <div class="button-container">
        <button class="button button-green" type="submit"><i class="zmdi zmdi-save"></i>Сохранить настройки</button>
        <a class="button button-red" href="/{$ADMIN_DIR}/seo/settings/"><i class="zmdi zmdi-arrow-left"></i>Отмена</a>
    </div>
</form>
{/strip}