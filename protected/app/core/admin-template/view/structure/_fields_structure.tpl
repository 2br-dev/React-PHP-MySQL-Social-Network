{strip}

<input type="hidden" name="_backuri" value="{$_backuri}">

<table class="t1 table table-toggle-trigger" id="page_data">
    <col width="200">
    <col>
    <thead>
        <tr class="th">
            <th colspan="2">
                <a href="#" class="table_hdr table_u js-table-toggle" data-toggle="page_data"><i class="icon"></i> Настройки страницы</a>
            </th>
        </tr>
    </thead>
    <tbody>
        <tr style="display: none;">
            <td class="h hl va_m">Название в меню <span class="ness_color">*</span></td>
            <td><input name="stc_menuname" class="ness{if isset($stc_errors) && in_array('menuname', $stc_errors)} error{/if}" value="{if isset($stc_page.menuname)}{$stc_page.menuname|escape}{/if}"></td>
        </tr>

        <tr class="th">
            <td class="h hl va_m">Название страницы <span class="ness_color">*</span></td>
            <td rowspan="2">

                <div class="url">
                    <div class="url__title">
                        <input name="stc_name" class="ness{if isset($stc_errors) && in_array('name', $stc_errors)} error{/if}" value="{if isset($stc_page.name)}{$stc_page.name|escape}{/if}">
                    </div>

                    <div class="url__system">
                        {if isset($stc_page.id) && $stc_page.id == 1}
                            <input name="stc_sys_name" id="stc_sys_name" value="{if isset($stc_page.sys_name)}{$stc_page.sys_name}{/if}" disabled="disabled">
                            <input type="hidden" name="stc_sys_name" value="main">
                        {else}
                        <div class="url__lock">
                            <span class="url__lock__switch {if $method == 'edit'}off{else}on{/if} js-toggle-binding" data-element="#stc_sys_name" title="Нажмите на замок, чтобы внести / запретить изменения">
                                <span class="zmdi zmdi-lock-open is-on"></span>
                                <span class="zmdi zmdi-lock-outline is-off"></span>
                            </span>
                        </div>

                        <input name="stc_sys_name" id="stc_sys_name" class="ness{if isset($stc_errors) && in_array('sys_name', $stc_errors)} error{/if} js-binding" data-binding-name="stc_name" data-binding-element="stc_sys_name" value="{if isset($stc_page.sys_name)}{$stc_page.sys_name}{/if}"{if $method == 'edit'} readonly{/if}>
                        {/if}
                    </div>
                </div>

            </td>
        </tr>

        <tr style="display: none;">
            <td class="h hl va_m">Системное имя <span class="ness_color">*</span></td>
        </tr>

        <tr style="display: none;">
            <td class="h hl va_m">Порядок вывода</td>
            <td><input name="stc_ord" class="ord integer reducing-trigger" value="{if isset($stc_page.ord)}{$stc_page.ord}{elseif isset($stc_next_ord)}{$stc_next_ord}{/if}"></td>
        </tr>

        <tr style="display: none;">
            <td class="h hl va_m">Отображать страницу</td>
            <td>
                {include file="system/group.tpl"
                    name    = "stc_visible"
                    check   = $stc_page.visible
                    list    = [
                        [ value => 1, text => "Да", checked => true ],
                        [ value => 0, text => "Нет" ]
                    ]
                }
            </td>
        </tr>

        <tr style="display: none;">
            <td class="h hl va_m">Отображать в меню</td>
            <td>
            {if isset($stc_menu_list)}
                {foreach from=$stc_menu_list item=item}
                    {$checked = false}
                    
                    {if !empty($stc_page.in_menu)}
                        {foreach from=$stc_page.in_menu item=s}
                            {if $s == $item.id}
                                {$checked = true}
                            {/if}
                        {/foreach}
                    {/if}

                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        name        =   "stc_menu["|cat:$item.id|cat:"]"
                        checked     =   $checked
                        value       =   $item.id
                        text        =   $item.name
                    }
                {/foreach}
            {/if}
            </td>
        </tr>

        <tr style="display: none;">
            <td class="h hl va_m">Дата публикации</td>
            <td>
                {include file="fields/datetime.tpl"
                    index       =   3 
                    name        =   "stc_date"
                    value       =   $stc_page.date
                    settings    =   ["f_date_format" => "YYYY-MM-DD"]
                    class_name  =   ""
                }
            </td>
        </tr>
    </tbody>
</table>

<table class="t1 table table-toggle-trigger" id="addition_data">
    <colgroup>
        <col width="200">
        <col>
    </colgroup>
    <thead>
        <tr class="th">
            <th colspan="2">
                <a href="#" class="table_hdr table_u js-table-toggle" data-toggle-init="true" data-toggle="addition_data"><i class="icon"></i> Дополнительные параметры</a>
            </th>
        </tr>
    </thead>
    <tbody>
        <tr class="th">
            <td class="h hl va_m">Родительская страница</td>
            <td>
                {if $stc_page.pid == 0}
                    <input type="hidden" name="stc_pid" value="0">
                {/if}
                <div style="position: relative; z-index: 10000;">
                    <select name="stc_pid"{if $stc_page.pid == 0} disabled="disabled"{/if}>
                        {include file="$TPL_PATH/tree_select.tpl"
                            a_tree          =   $stc_all_tree 
                            nbsp_count      =   0
                            curr_id         =   $stc_page.pid
                        }
                    </select>
                </div>
            </td>
        </tr>

        <tr style="display: none;">
            <td class="h hl va_m">Локализация</td>
            <td>
                {include file="system/group.tpl"
                    name    = "stc_locale"
                    check   = $stc_page.locale
                    list    = $languages
                }
            </td>
        </tr>

        <tr style="display: none;">
            <td class="h hl va_m">Шаблон страницы</td>
            <td>
                {if isset($templates_list)}
                <div class="add-template">
                    <div class="add-template__select" id="select_field">
                        <select name="stc_tid" id="templates_list">
                        {foreach item=item from=$templates_list}
                            <option value="{$item.id}" {if isset($stc_page.tid) && $stc_page.tid == $item.id}selected="selected"{/if}>{$item.name}</option>
                        {/foreach}
                        </select>
                    </div>
                    {if isset($smarty.session.userinf.gid) && $smarty.session.userinf.gid == 10}
                    <button type="button" class="button button-icon add-template__button" onclick="cp.addTemplate(event);">
                        <span class="zmdi zmdi-plus-circle"></span>
                    </button>
                    {/if}
                </div>
                {/if}
                
                {if isset($smarty.session.userinf.gid) && $smarty.session.userinf.gid == 10}
                <div class="clearfix hidden" id="addtemplate" style="padding: 10px 0 0;">
                    <div class="width-25 fl">
                        <div style="padding: 0 1px 0 0;">
                            <input name="template_name" id="template_name" disabled placeholder="Название шаблона">
                        </div>
                    </div>
                    <div class="width-25 fl">
                        <div style="padding: 0 0 0 1px;">
                            <input name="template_file" id="template_file" disabled placeholder="Файл шаблона">
                        </div>
                    </div>
                    
                    <div class="width-25 fl">
                        <div style="padding: 0 0 0 2px;">
                            <button type="button" class="button button-green" onclick="cp.addTemplateFile({if isset($stc_page.tid)}{$stc_page.tid}{else}''{/if});">Добавить</button>
                        </div>
                    </div>
                </div>
                {/if}
            </td>
        </tr>

        <tr style="display: none;">
            <td class="h hl va_m">Доступ к странице</td>
            <td>
                {if isset($usr_groups)}
                    {$checked = false}
                    
                    {if isset($stc_page.access) && is_array($stc_page.access) && in_array(0, $stc_page.access)}
                        {$checked = true}
                    {/if}

                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        name        =   "stc_access[]"
                        checked     =   $checked
                        value       =   0
                        text        =   "Всем"
                    }

                    {foreach item=item from=$usr_groups}
                        {$checked = false}
                    
                        {if isset($stc_page.access) && is_array($stc_page.access) && in_array($item.id, $stc_page.access)}
                            {$checked = true}
                        {/if}

                        {include file="system/controll.tpl"
                            type        =   "checkbox"
                            name        =   "stc_access[]"
                            checked     =   $checked
                            value       =   $item.id
                            text        =   $item.name
                        }
                    {/foreach}
                {/if}
            </td>
        </tr>

        <tr style="display: none;">
            <td class="h hl va_m">Перенаправление</td>
            <td>
                <input name="stc_redirect" placeholder="Например: /company/news/" value="{if isset($stc_page.redirect)}{$stc_page.redirect}{/if}"><br>
            </td>
        </tr>

        <tr style="display: none;">
            <td class="h hl va_m">Отображать в карте сайта</td>
            <td>
                {include file="system/group.tpl"
                    name    = "stc_in_sitemap"
                    check   = $stc_page.in_sitemap
                    list    = [
                        [ value => 1, text => "Да", default => true ],
                        [ value => 0, text => "Нет" ]
                    ]
                }
            </td>
        </tr>
        
        {if $smarty.session.userinf.gid == 1 || $smarty.session.userinf.gid == 10}
        <tr style="display: none;">
            <td class="h hl va_m">Получаем аргументы</td>
            <td>
                {include file="system/group.tpl"
                    name    = "stc_dynamic"
                    check   = $stc_page.dynamic
                    list    = [
                        [ value => 1, text => "Да" ],
                        [ value => 0, text => "Нет", default => true ]
                    ]
                }
            </td>
        </tr>
        {/if}
    </tbody>
</table>

<input type="hidden" name="mod_id" value="0">

{include file="$TPL_PATH/_fields_content.tpl"}

{/strip}