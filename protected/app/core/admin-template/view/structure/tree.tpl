{strip}
{foreach item=item from=$a_tree}
	<li class="clearfix">
		{if !isset($item.m_link)}

			{if isset($item.a_tree) && !empty($item.a_tree)}
                <i class="zmdi zmdi-folder page-icon"></i>
            {elseif $item.mod_id}
                <i class="zmdi zmdi-file page-icon"></i>
            {elseif $item.dynamic == 1}
                <i class="zmdi zmdi-file page-icon"></i>
            {elseif $item.sys_name == 'search'}
                <i class="zmdi zmdi-search page-icon"></i>
            {else}
                <i class="zmdi zmdi-file-text page-icon"></i>
            {/if}

            <a href="/{$ADMIN_DIR}/{if isset($item.mid )}meta/edit/{$item.mid}/{$item.id}?backuri=/{$ADMIN_DIR}/structure/{else}structure/index/edit/{$item.id}/{$item.sys_name}/{/if}" class="link">{$item.name}</a>

            {if $item.redirect || $item.access || $item.dynamic == 1}
            <div class="flags">
                {if $item.access}<span class="badge badge-fill badge-blue">Ограниченный доступ</span>{/if}
                {if $item.redirect}<span class="badge badge-fill badge-red">Редирект: {$item.redirect}</span>{/if}
                {if $item.dynamic == 1}<span class="badge badge-fill badge-gray">Dynamic</span>{/if}
            </div>
            {/if}

            <div class="icons">
                {* add *}
                <a href="/{$ADMIN_DIR}/{if $item.mod_id}meta/add/{$item.mod_id}?backuri=/{$ADMIN_DIR}/structure/{else}structure/index/add/{$item.id}/{/if}" class="zmdi zmdi-file-plus" title="Добавить подраздел"></a>

                {* edit *}
                <a href="/{$ADMIN_DIR}/{if isset($item.mid )}meta/edit/{$item.mid}/{$item.id}?backuri=/{$ADMIN_DIR}/structure/{else}structure/index/edit/{$item.id}/{/if}" class="zmdi zmdi-edit" title="Редактировать раздел"></a>

                {* visible *}
                <a href="#" onclick="ajax_vis_toggle(this, {$item.id},{if isset($item.mid )}{$item.mid}{else}0{/if});return false;" class="zmdi zmdi-eye{if $item.visible == 0}-off{/if}" title="Отображение страницы"></a>

                {* del *}
                {if $item.id !== '1'}
                    <a href="/{$ADMIN_DIR}/{if isset($item.mid )}meta/del/{$item.mid}/{$item.id}?backuri=/{$ADMIN_DIR}/structure/{else}structure/index/del/{$item.id}/{/if}" class="zmdi zmdi-delete" title="Удалить раздел" onclick="return cp.dialog('Вы действительно хотите удалить раздел?');" data-no-instant></a>
                {/if}
            </div>
		{/if}

		{if isset($item.a_tree ) && !empty( $item.a_tree )}
		<ul id="item{$item.id}">
		    {include file="$TPL_PATH/tree.tpl" a_tree=$item.a_tree}
		</ul>
		{/if}
	</li>
{/foreach}
{/strip}