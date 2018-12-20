{strip}
<script type="text/javascript">
    var modules_list = {$modules_list|json_encode};
</script>

<table class="table" id="cont_data">
    <thead>
        <tr class="th">
            <th>Содержание</th>
        </tr>
    </thead>
    <tbody>
        {if $cnt_page nocache}
            {foreach from=$cnt_page item=cnt}

                <tr id="settings-{$cnt.id}">
                    <td class="settings-row">
                        <div class="settings-container clearfix">
                            
                            <a href="#" onclick="return cp.removeSettings({$cnt.id}, event);" class="block-settings-link block-settings-remove"><i class="zmdi zmdi-delete"></i>Удалить часть страницы</a>

                            <a href="#settings-container-toggle-{$cnt.id}" onclick="return cp.toggleSettings(this, event);" class="block-settings-link block-settings-title">
                                <span class="block-settings-title-drop">
                                    <i class="zmdi zmdi-settings"></i>
                                </span>
                                <span class="block-settings-title-text">
                                    Настройки блока ({nocache}
                                    <span class="settings-item">{if $cnt.visible == 1}<span class="color-green">Активен</span>{elseif $cnt.visible == 0}<span class="color-red">Не активен</span>{/if};</span>
                                    <span class="settings-item">{if $cnt.indexer == 1}<span class="color-green">Используется в поиске</span>{elseif $cnt.indexer == 0}<span class="color-red">Не используется в поиске</span>{elseif $cnt.indexer == 2}<span class="color-green">Только динамические страницы</span>{/if};</span>
                                    <span class="settings-item">Отображается <span class="color-green">{if $cnt.indynamic == 0}на странице и на подстраницах{elseif $cnt.indynamic == 1}только на странице{elseif $cnt.indynamic == 2}только на подстраницах{/if}</span>;</span>
                                    {/nocache})
                                </span>
                            </a>

                            <div class="settings-container-toggle" id="settings-container-toggle-{$cnt.id}">
                                <div class="block-settings-ln block-settings-visible clearfix">
                                    <div class="option-group option-combo option-simple">
                                        <label><input type="radio" name="SETTINGS_visible_{$cnt.id}" value="1"{if !$cnt.visible || $cnt.visible == 1} checked="checked"{/if}><span class="option">Активен</span></label>
                                        <label class="disallow"><input type="radio" name="SETTINGS_visible_{$cnt.id}" value="0"{if $cnt.visible == 0} checked="checked"{/if}><span class="option">Не активен</span></label>
                                    </div>
                                </div>
                                
                                <div class="block-settings-ln block-settings-caching clearfix">
                                    <div class="option-group option-combo option-simple">
                                        <label><input type="radio" name="SETTINGS_caching_{$cnt.id}" value="1"{if !$cnt.caching || $cnt.caching == 1} checked="checked"{/if}><span class="option">Кешировать</span></label>
                                        <label class="disallow"><input type="radio" name="SETTINGS_caching_{$cnt.id}" value="0"{if $cnt.caching == 0} checked="checked"{/if}><span class="option">Не кешировать</span></label>
                                    </div>
                                </div>
                                
                                <div class="block-settings-ln block-settings-order clearfix">
                                    <div class="block-settings-order-input">
                                        <input name="SETTINGS_ord_{$cnt.id}" value="{$cnt.ord}" placeholder="Порядок">
                                    </div>
                                </div>

                                <div class="block-settings-ln block-settings-select clearfix" id="block-settings-select-block-{$cnt.id}">
                                    {if $type_list nocache}
                                    <div class="block-settings-select-block lvl1" id="block-lvl1-{$cnt.id}">
                                        <select name="SETTINGS_type_{$cnt.id}" id="cnt_type-{$cnt.id}" onchange="cp.loadSettings(this.value, {$cnt.id}, 'type');">
                                            {if !$cnt.type}
                                                <option value="" selected>Выбрать</option>
                                            {/if}
                                            {foreach from=$type_list item=type key=system}
                                            <option value="{$system}"{if $cnt.type == $system} selected{/if}>{$type}</option>
                                        {/foreach}
                                        </select>
                                    </div>
                                    {/if}
                                    
                                    {if $cnt.item_list nocache}
                                    <div class="block-settings-select-block lvl2" id="block-lvl2-{$cnt.id}">
                                        <select name="SETTINGS_item_{$cnt.id}" id="cnt_item-{$cnt.id}" onchange="cp.loadSettings(this.value, {$cnt.id}, 'item');">
                                            {if !$cnt.item}
                                                <option value="" selected>Выбрать</option>
                                            {/if}
                                            {foreach from=$cnt.item_list item=name key=system}
                                            <option value="{$system}"{if $cnt.item == $system} selected{/if}>{$name}</option>
                                            {/foreach}
                                        </select>
                                    </div>
                                    {/if}
                                    
                                    {if $cnt.mode_list nocache}
                                    <div class="block-settings-select-block lvl3" id="block-lvl3-{$cnt.id}">
                                        <select name="SETTINGS_mode_{$cnt.id}" id="cnt_mode-{$cnt.id}" onchange="cp.loadSettings(this.value, {$cnt.id}, 'mode');">
                                            {if !$cnt.mode}
                                                <option value="" selected>Выбрать</option>
                                            {/if}
                                            {foreach from=$cnt.mode_list item=name key=system}
                                            <option value="{$system}"{if $cnt.mode == $system} selected{/if}>{$name}</option>
                                            {/foreach}
                                        </select>
                                    </div>
                                    {/if}
                                </div>

                                <div class="block-settings-ln block-settings-system clearfix">
                                    <div class="block-settings-system-input">
                                        <input name="SETTINGS_system_{$cnt.id}" value="{$cnt.system}" placeholder="Системное имя">
                                    </div>
                                </div>
                                
                                <!--
                                <div class="block-settings-ln block-settings-system clearfix">
                                    <div class="block-settings-system-input">
                                        <input name="SETTINGS_arguments_{$cnt.id}" value="{$cnt.arguments}" placeholder="Получаемые аргументы: Например 1;2">
                                    </div>
                                </div>
                                -->
                                
                                <div class="block-settings-ln block-settings-system clearfix">
                                     <div class="option-group option-combo option-simple">
                                        <label><input type="radio" name="SETTINGS_indexer_{$cnt.id}" value="1"{if !$cnt.indexer || $cnt.indexer == 1} checked="checked"{/if}><span class="option">Использовать в поиске</span></label>
                                        <label class="disallow"><input type="radio" name="SETTINGS_indexer_{$cnt.id}" value="0"{if $cnt.indexer == 0} checked="checked"{/if}><span class="option">Не использовать в поиске</span></label>
                                        {if isset($stc_page.dynamic ) && $stc_page.dynamic == 1}
                                        <label class="disallow"><input type="radio" name="SETTINGS_indexer_{$cnt.id}" value="2"{if $cnt.indexer == 2} checked="checked"{/if}><span class="option">Только динамические страницы</span></label>
                                        {/if}
                                    </div>
                                </div>
                                
                                {if isset($stc_page.dynamic ) && $stc_page.dynamic == 1}
                                
                                <div class="block-settings-ln clearfix">
                                    <div class="block-settings-inline">
                                        <div class="block-settings-inline-title">Где отображать:</div>
                                        <div class="block-settings-inline-content">
                                            <div class="option-group option-combo option-simple">
                                                <label><input type="radio" name="SETTINGS_indynamic_{$cnt.id}" value="0"{if !$cnt.indynamic || $cnt.indynamic == 0} checked="checked"{/if}><span class="option">На странице и на подстраницах</span></label>
                                                <label><input type="radio" name="SETTINGS_indynamic_{$cnt.id}" value="1"{if $cnt.indynamic == 1} checked="checked"{/if}><span class="option">Только на странице</span></label>
                                                <label><input type="radio" name="SETTINGS_indynamic_{$cnt.id}" value="2"{if $cnt.indynamic == 2} checked="checked"{/if}><span class="option">Только на подстраницах</span></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/if}
 
                                <div class="block-settings-buttons clearfix">
                                    <a href="#" onclick="return cp.saveSettings({$cnt.id}, event);" class="button button-purple block-settings-save"><i class="zmdi zmdi-check-square"></i>Сохранить</a>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                
                {*
                {if $cnt.breadcrumbs nocache}
                <tr id="breadcrumbs-{$cnt.id}">
                    <td class="editor-row">
                        <ul class="breadcrumbs mb0">
                        {foreach from=$cnt.breadcrumbs item=bread}
                            <li><span class="breadcrumb nohover">{$bread}</span></li>
                        {/foreach}
                        </ul>
                    </td>
                </tr>
                {/if}
                *}

                {if $cnt.type == 'redactor' && $cnt.item}
                <tr id="container-{$cnt.id}">
                    <td class="editor-row">
                        {assign var="redactor_id" value="redactor_content_"|cat:$cnt.id}
                        {assign var="redactor_name" value="cnt_content["|cat:$cnt.id:"]"}
                        
                        {include file='system/redactor.tpl'
                            redactor_type   =   $cnt.item
                            redactor_name   =   $redactor_name
                            redactor_value  =   $cnt.content 
                            redactor_id     =   $redactor_id
                        }
                    </td>
                </tr>
                {elseif $cnt.type == 'editor' && $cnt.item}
                <tr id="container-{$cnt.id}">
                    <td class="editor-row">
                        {assign var="editor_id" value="cnt_content"|cat:$cnt.id}
                        {assign var="editor_name" value="cnt_content["|cat:$cnt.id:"]"}
                        
                        {$editor_mode = 'htmlmixed'}
                        
                        {if $cnt.mode}
                            {$editor_mode = $cnt.mode}
                        {/if}

                        {include file="system/editor.tpl" 
                            editor_id           =   $editor_id    
                            editor_name         =   $editor_name
                            editor_cont         =   $cnt.content|escape
                            editor_hightlight   =   $editor_mode
                            editor_save_btn     =   true
                        }
                    </td>
                </tr>
                {/if}

                <tr id="emptysplash-{$cnt.id}" class="simple-row">
                    <td></td>
                </tr>
            {/foreach}
        {/if}
    
    </tbody>
</table>
{/strip}