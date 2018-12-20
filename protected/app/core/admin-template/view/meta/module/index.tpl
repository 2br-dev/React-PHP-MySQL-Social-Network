{strip}
{if (isset($modules) && !empty($modules)) || ( isset($groups) && !empty($groups))}
    <div class="button-container clearfix">
        {if isset($groups) && !empty( $groups )}
            <div class="mb40"></div>
            
            {foreach item=item from=$groups name=item}
                <div class="fieldset{if $smarty.foreach.item.last} mb10{/if} fieldset-{cycle values='red,blue,green,purple,orange,pink' name='fieldset'} clearfix">
                    <span class="fieldset-caption">{$item.name}</span>
                    <div class="fieldset-content">
                        {if isset($item.modules ) && !empty( $item.modules )}
                            {foreach item=i from=$item.modules key=id}
                                {if is_array( $i )}
                                    <a href="{$base_path}/module/list/{$id}" class="button button-{cycle values='red,blue,green,purple,orange,pink' name='color'}"><i class="zmdi zmdi-link"></i>{$i.name} <span class="baloon">{$i.count}</span></a>
                                {/if}
                            {/foreach}
                        {/if}
                    </div>
                </div>
            {/foreach}
        {/if}
        
        {if isset($modules) && !empty($modules)}
            <div class="clearfix"></div>
            
            {foreach item=item from=$modules name=i}
                <a href="{$base_path}/module/list/{$item.id}" class="button button-{cycle values='red,blue,green,purple,orange,pink' name='color'}"><i class="zmdi zmdi-link"></i>{$item.name} <span class="baloon">{$item.count}</span></a>
            {/foreach}
        {/if}
    </div>
{else}
    
    {include file="$TPL_PATH/module/filter.tpl"}

    {if $meta_sort}

        {assign var="moduleSorter" value="module_sorted_$module_id"}

        {if $moduleSorter}
            {assign var='mSort' value=$moduleSorter|@unserialize}
        {/if}

        {assign var='module_id' value=$module_id}
        
        {foreach item=item from=$meta_sort}
        {assign var='mSysName' value=$item.sys_name}
        <div>
            "{$item.name}"<br />
            <select name="{$item.sys_name}" onchange="setModuleSort(this, '{$module_id}', '{$item.sys_name}')">
                <option value="">..выбрать</option>
                {foreach item=it from=$item.list key=k}
                <option value="{$k}"{if isset($mSort.$module_id.$mSysName ) && $mSort.$module_id.$mSysName == $k} selected="selected"{/if}>{$it} </option>
                {/foreach}
            </select>
        </div>
        {/foreach}
        <div><b>Отобрать по</b></div>
    {/if}

    {if $is_recursive}
        <p><b>Показывать:</b>
            {if isset($smarty.cookies.show_as ) && $smarty.cookies.show_as == 'table'}
                <span class="show_as_table">таблицей</span>
                <a href="{$smarty.server.QUERY_STRING|add2query:'show_as=tree'}" class="show_as_tree" onclick="setCookie('show_as','tree');redirect();return false;">деревом</a>
            {elseif isset($smarty.cookies.show_as ) && $smarty.cookies.show_as=='tree'}
                <a href="{$smarty.server.QUERY_STRING|add2query:'show_as=table'}" class="show_as_table" onclick="setCookie('show_as','table');redirect();return false;">таблицей</a>
                <span class="show_as_tree">деревом</span>			
            {else}
                <span class="show_as_table">таблицей</span>
                <a href="{$smarty.server.QUERY_STRING|add2query:'show_as=tree'}" class="show_as_tree" onclick="setCookie('show_as','tree');redirect();return false;">деревом</a>
            {/if}
        </p>
    {/if}

    {if isset($smarty.cookies.show_as ) && $smarty.cookies.show_as == "tree" && $is_recursive}
    	<table class="table" id="meta_data"><tr class="th"><th>{$meta_module.name}</th></tr></table>

        <ul class="structure">
    		{include file="$TPL_PATH/module/tree.tpl" a_tree=$meta_list_tree}
    	</ul>
    {else}
    	{include file="$TPL_PATH/module/table.tpl"}
    {/if}

    {include file="system/pager.tpl"}
{/if}
{/strip}