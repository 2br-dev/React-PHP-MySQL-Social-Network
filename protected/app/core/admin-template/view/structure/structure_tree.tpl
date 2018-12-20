{strip}
{foreach item=item from=$a_tree}
	{$cookie = 'structure_collapse_'|cat:$item.id}

	<li class="dd-item{if isset($smarty.cookies[{$cookie}])} dd-collapsed{/if} dd-{if $item.visible == 0}in-{/if}visible" id="node-{$item.id}" data-id="{$item.id}">
		{if isset($item.a_tree) && !empty($item.a_tree) && $item.sys_name !== 'main'}
			<button data-action="collapse" type="button" class="dd-button dd-button__collapse"{if isset($smarty.cookies[{$cookie}])} style="display: none;"{/if}></button>
			<button data-action="expand" type="button" class="dd-button dd-button__expand"{if !isset($smarty.cookies[{$cookie}])} style="display: none;"{/if}></button>
		{/if}

		{* {if $item.sys_name !== 'main'} *}
		<div class="dd-handle"></div>
		{* {/if} *}

		<div class="dd-content">
			{if !isset($item.m_link)}
				{if $item.sys_name == 'main'}
					<i class="zmdi zmdi-home page-icon"></i>
				{elseif isset($item.a_tree) && !empty($item.a_tree)}
					<i class="zmdi zmdi-folder page-icon"></i>
				{elseif $item.mod_id}
					<i class="zmdi zmdi-file page-icon"></i>
				{elseif $item.dynamic == 1}
					<i class="zmdi zmdi-apps page-icon"></i>
				{elseif $item.sys_name == 'search'}
					<i class="zmdi zmdi-search page-icon"></i>
				{else}
					<i class="zmdi zmdi-file-text page-icon"></i>
				{/if}

				{if $item.redirect || $item.access || $item.dynamic == 1}
				<div class="structure__flags">
					{if $item.access}<span class="label label-sm bg-danger">Ограниченный доступ</span>{/if}
					{if $item.redirect}<span class="label label-sm deep-orange" title="Редирект на другую страницу">R &rarr; {$item.redirect}</span>{/if}
					{if $item.dynamic == 1}<span class="label label-sm bg-success" title="Получаем аргументы">A</span>{/if}
				</div>
				{/if}

				<a href="/{$ADMIN_DIR}/{if isset($item.mid )}meta/edit/{$item.mid}/{$item.id}?backuri=/{$ADMIN_DIR}/structure/{else}structure/index/edit/{$item.id}/{$item.sys_name}/{/if}" class="structure__link">{$item.name}</a>

				{*
				<span class="structure__meta"><span class="label label-sm bg-primary">M</span></span>
				*}

				<span class="structure__plus js-structure-controll">
					<a href="/{$ADMIN_DIR}/{if $item.mod_id}meta/add/{$item.mod_id}?backuri=/{$ADMIN_DIR}/structure/{else}structure/index/add/{$item.id}/{/if}" class="structure__plus__add label bg-dark pos-rlt m-r-xs"><b class="arrow left b-dark pull-in"></b>+</a>
					<span class="structure__control animate">
						<a href="/{$ADMIN_DIR}/{if $item.mod_id}meta/add/{$item.mod_id}?backuri=/{$ADMIN_DIR}/structure/{else}structure/index/add/{$item.id}/{/if}" class="structure__control__icon zmdi zmdi-file-plus" title="Добавить подраздел"></a>
						<a href="/{$ADMIN_DIR}/{if isset($item.mid )}meta/edit/{$item.mid}/{$item.id}?backuri=/{$ADMIN_DIR}/structure/{else}structure/index/edit/{$item.id}/{/if}" class="structure__control__icon zmdi zmdi-edit" title="Редактировать раздел"></a>
						<a href="#" onclick="ajax_vis_toggle(this, {$item.id},{if isset($item.mid )}{$item.mid}{else}0{/if});return false;" class="structure__control__icon zmdi zmdi-eye{if $item.visible == 0}-off{/if}" title="Отображение страницы"></a>
						{* {if $item.id !== '1'} *}
						<a href="/{$ADMIN_DIR}/{if isset($item.mid )}meta/del/{$item.mid}/{$item.id}?backuri=/{$ADMIN_DIR}/structure/{else}structure/index/del/{$item.id}/{/if}" class="structure__control__icon zmdi zmdi-delete" title="Удалить раздел" onclick="return cp.dialog('Вы действительно хотите удалить раздел?');" data-no-instant></a>
						{* {/if} *}
					</span>
				</span>
			{/if}
		</div>

		{if isset($item.a_tree) && !empty($item.a_tree)}
		<ol class="dd-list" id="item{$item.id}">
			{include file="$TPL_PATH/structure_tree.tpl" a_tree=$item.a_tree}
		</ol>
		{/if}
	</li>

{/foreach}
{/strip}