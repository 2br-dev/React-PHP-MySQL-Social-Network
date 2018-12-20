{strip}
{foreach item=item from=$a_tree}
    {$cookie = 'shopping_collapse_'|cat:$item.id}

	<li class="dd-item{if isset($smarty.cookies[{$cookie}])} dd-collapsed{/if} dd-{if $item.visible == 0}in-{/if}visible" id="node-{$item.id}" data-id="{$item.id}">
        {if isset($item.tree) && !empty($item.tree)}
        <button data-action="collapse" type="button" class="dd-button dd-button__collapse"{if isset($smarty.cookies[{$cookie}])} style="display: none;"{/if}></button>
        <button data-action="expand" type="button" class="dd-button dd-button__expand"{if !isset($smarty.cookies[{$cookie}])} style="display: none;"{/if}></button>
        {/if}
        
        {if $item.sys_name == 'main'}
        <div class="dd-homepage"><i class="icon icon-home"></i></div>
        {else}
        <div class="dd-handle"></div>
        {/if}

        <div class="dd-content">
            {if !isset($item.m_link)}
                {if isset($item.tree) && !empty($item.tree)}
                    <i class="icon icon-folder page-icon"></i>
                {elseif $item.mod_id}
                    <i class="icon icon-file page-icon"></i>
                {elseif $item.dynamic == 1}
                    <i class="icon icon-apps page-icon"></i>
                {elseif $item.sys_name == 'search'}
                    <i class="icon icon-search page-icon"></i>
                {else}
                    <i class="icon icon-file-text page-icon"></i>
                {/if}

                <a href="/{$ADMIN_DIR}/shopping/category/edit/{$item.id}" class="structure__link">{$item.name}</a>
                
                <span class="structure__plus js-structure-controll">
                    <span class="label bg-dark pos-rlt m-r-xs"><b class="arrow left b-dark pull-in"></b>+</span>
                    <span class="structure__control animate">
                        <a href="/{$ADMIN_DIR}/shopping/category/add/{$item.id}" class="structure__control__icon icon icon-file-plus" title="Добавить подраздел"></a>
                        <a href="/{$ADMIN_DIR}/shopping/category/edit/{$item.id}" class="structure__control__icon icon icon-edit" title="Редактировать раздел"></a>
                        {*
                        <a href="/{$ADMIN_DIR}/shopping/category/visible/{$item.id}" onclick="ajax_vis_toggle(this, {$item.id}, 0);return false;" class="structure__control__icon icon icon-eye{if $item.visible == 0}-off{/if}" title="Отображение страницы"></a>
                        *}
                        <a href="/{$ADMIN_DIR}/shopping/category/del/{$item.id}?backuri={$_backuri}" class="structure__control__icon icon icon-delete" title="Удалить раздел" onclick="return cp.dialog('Вы действительно хотите удалить раздел?');" data-no-instant></a>
                    </span>
                </span>
            {/if}
        </div>

        {if isset($item.tree) && !empty($item.tree)}
        <ol class="dd-list" id="item{$item.id}">
            {include file="$TPL_PATH/category_tree.tpl" a_tree=$item.tree}
        </ol>
        {/if}
    </li>
{/foreach}
{/strip}