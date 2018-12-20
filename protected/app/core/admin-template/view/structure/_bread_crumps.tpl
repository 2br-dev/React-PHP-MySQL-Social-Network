{strip}
{if isset($breadcrumbs )}
    <ul class="breadcrumbs">
        <li><a href="/{$ADMIN_DIR}/structure/" class="breadcrumb">Структура сайта</a></li>
        {foreach item=item from=$breadcrumbs name=breadcrumbs}
            {if $smarty.foreach.breadcrumbs.last}
                <li><span class="breadcrumb current">{$header_action}{if isset($action ) && $action !== 'add'}: {$item.name}{/if}</span></li>
            {else}
                {if isset($item.mod_id ) && $item.mod_id !== '0'}
                    <li><a href="/{$ADMIN_DIR}/structure/module/edit/{$item.id}/?mod_id={$item.mod_id}" class="breadcrumb">{$item.name}</a></li>
                {else}
                    <li><a href="/{$ADMIN_DIR}/structure/index/edit/{$item.id}/{$item.sys_name}/" class="breadcrumb">{$item.name}</a></li>
                {/if}
            {/if}
        {/foreach}
    </ul>
{/if}
{/strip}