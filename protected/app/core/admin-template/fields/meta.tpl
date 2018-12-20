{strip}
<table class="t1 table table-toggle-trigger" id="meta_data">
    <col width="200">
    <col>
    <thead>
        <tr class="th">
            <th colspan="2">
                <a href="#" class="table_hdr table_u js-table-toggle" data-toggle-init="true" data-toggle="meta_data">
                    <i class="icon"></i> Мета данные
                </a>
            </th>
        </tr>
    </thead>
    <tbody>
        <tr class="th">
            <td class="h hl va_m">Заголовок</td>
            <td>
                <div class="count-number-block clearfix">
                    <span class="count-number-block-count{if isset($title) && $title|mb_strlen > 65} unlim{/if}" data-recomend="65">{if isset($title)}{$title|mb_strlen}{else}0{/if}/65</span>
                    <input name="meta_title" placeholder="META title" value="{if isset($title)}{$title|escape}{/if}" class="count-number">
                </div>
            </td>
        </tr>
        <tr style="display: none;">
            <td class="h hl va_m">Ключевые слова</td>
            <td>
                <div class="count-number-block clearfix">
                    <span class="count-number-block-count">{if isset($keywords)}{$keywords|mb_strlen}{else}0{/if}</span>
                    <textarea name="meta_keywords" placeholder="META keywords" class="count-number">{if isset($keywords)}{$keywords|escape}{/if}</textarea>
                </div>
            </td>
        </tr>
        <tr style="display: none;">
            <td class="h hl va_m">Описание</td>
            <td>
                <div class="count-number-block clearfix">
                    <span class="count-number-block-count">{if isset($description)}{$description|mb_strlen}{else}0{/if}</span>
                    <textarea name="meta_description" placeholder="META description" class="count-number">{if isset($description)}{$description|escape}{/if}</textarea>
                </div>
            </td>
        </tr>
        <tr style="display: none;">
            <td class="h hl va_m">Индексация поисковиками</td>
            <td>
                <div class="meta-robots">

                    {if !isset($robots) || empty($robots)}
                        {$robots = ['index', 'follow']}
                    {/if}

                    {include file="system/group.tpl"
                        name    = "meta_robots[index]"
                        check   = $robots
                        list    = [
                            [ value => 'index', text => "index", default => true ],
                            [ value => 'noindex', text => "noindex" ]
                        ]
                    }

                    {include file="system/group.tpl"
                        name    = "meta_robots[follow]"
                        check   = $robots
                        list    = [
                            [ value => 'follow', text => "follow", default => true ],
                            [ value => 'nofollow', text => "nofollow" ]
                        ]
                    }

                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        name        =   "meta_robots[noarchive]"
                        checked     =   in_array('noarchive', $robots)
                        value       =   "noarchive"
                        text        =   "noarchive"
                        title       =   'Не показывать ссылку на сохраненную копию на странице результатов поиска..'
                    }

                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        name        =   "meta_robots[noyaca]"
                        checked     =   in_array('noyaca', $robots)
                        value       =   "noyaca"
                        text        =   "noyaca"
                        title       =   'Не использовать описание из Яндекс.Каталога для сниппета в результатах поиска.'
                    }

                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        name        =   "meta_robots[nosnippet]"
                        checked     =   in_array('nosnippet', $robots)
                        value       =   "nosnippet"
                        text        =   "nosnippet"
                        title       =   'Не отображать расширенное описание этой веб-страницы в результатах поиска.'
                    }

                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        name        =   "meta_robots[notranslate]"
                        checked     =   in_array('notranslate', $robots)
                        value       =   "notranslate"
                        text        =   "notranslate"
                        title       =   'Не предлагать перевод этой страницы в результатах поиска.'
                    }

                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        name        =   "meta_robots[noimageindex]"
                        checked     =   in_array('noimageindex', $robots)
                        value       =   "noimageindex"
                        text        =   "noimageindex"
                        title       =   'Не индексировать изображения на этой странице.'
                    }

                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        name        =   "meta_robots[noodp]"
                        checked     =   in_array('noodp', $robots)
                        value       =   "noodp"
                        text        =   "noodp"
                        title       =   'Не использовать название и описание сайта из каталога DMOZ для сниппета в результатах поиска.'
                    }

                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        name        =   "meta_robots[noydir]"
                        checked     =   in_array('noydir', $robots)
                        value       =   "noydir"
                        text        =   "noydir"
                        title       =   'Не использовать название и описание сайта из каталога Yahoo для сниппета в результатах поиска.'
                    }

                    {*
                    <div class="calendar-wrapper clearfix">
                        {include file="system/controll.tpl"
                            type        =   "checkbox"
                            onchange    =   "$('#calendar-wrapper-date').toggle()"
                            name        =   "meta_robots[unavailable_after]"
                            checked     =   in_array('unavailable_after', $robots)
                            value       =   "unavailable_after"
                            text        =   "unavailable_after"
                            title       =   'Не отображать эту страницу в результатах поиска после указанного времени/даты.'
                        }

                        <div class="calendar-wrapper-date" id="calendar-wrapper-date">
                            {include file="fields/date.tpl"
                                index       =   1
                                name        =   "meta_robots[date_rfc]"
                                value       =   "09.06.2015 12:01"
                                settings    =   ["f_date_format" => "DD.MM.YYYY H:i:s"]
                                class_name  =   ""
                            }
                        </div>
                    </div>

                    RFC 850 (пример: Monday, 15-Aug-05 15:52:01 UTC)
                    date('DATE_RFC850');
                    *}
                </div>
            </td>
        </tr>
        {if $generate}
        <tr style="display: none;">
            <td></td>
            <td>
                <button type="button" class="button button-green" onclick="return shopping.generateMeta()">
                    <i class="zmdi zmdi-refresh"></i>Генерировать мета-теги по шаблону
                </button>
            </td>
        </tr>
        {/if}
    </tbody>
</table>
{/strip}