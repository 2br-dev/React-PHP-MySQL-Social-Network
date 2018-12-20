{strip}
<div class="dd-tree">

	{$structure_item = $tv_struct}

	{if !empty($structure_item)}
	<div class="dd nestable-tree" data-path="structure" data-group="0">
		<ol class="dd-list">
			{include file="$TPL_PATH/structure_tree.tpl" a_tree=$structure_item}
		</ol>
	</div>
	{/if}

	{*
	{$structure_item = $tv_struct[0]}

	<li class="dd-root dd-{if $structure_item.visible == 0}in-{/if}visible">
        <div class="dd-homepage"><i class="zmdi zmdi-home"></i></div>

		<div class="dd-content">
            {if !isset($structure_item.m_link)}
                {if isset($structure_item.a_tree) && !empty($structure_item.a_tree)}
                    <i class="zmdi zmdi-folder page-icon"></i>
                {elseif $structure_item.mod_id}
                    <i class="zmdi zmdi-file page-icon"></i>
                {elseif $structure_item.dynamic == 1}
                    <i class="zmdi zmdi-apps page-icon"></i>
                {elseif $structure_item.sys_name == 'search'}
                    <i class="zmdi zmdi-search page-icon"></i>
                {else}
                    <i class="zmdi zmdi-file-text page-icon"></i>
                {/if}

                {if $structure_item.redirect || $structure_item.access || $structure_item.dynamic == 1}
                <div class="structure__flags">
                    {if $structure_item.access}<span class="label label-sm bg-danger">Ограниченный доступ</span>{/if}
                    {if $structure_item.redirect}<span class="label label-sm deep-orange" title="Редирект на другую страницу">R &rarr; {$structure_item.redirect}</span>{/if}
                    {if $structure_item.dynamic == 1}<span class="label label-sm bg-success" title="Получаем аргументы">A</span>{/if}
                </div>
                {/if}

                <a href="/{$ADMIN_DIR}/{if isset($structure_item.mid )}meta/edit/{$structure_item.mid}/{$structure_item.id}?backuri=/{$ADMIN_DIR}/structure/{else}structure/index/edit/{$structure_item.id}/{$structure_item.sys_name}/{/if}" class="structure__link">{$structure_item.name}</a>

                <span class="structure__plus js-structure-controll">
                    <span class="label bg-dark pos-rlt m-r-xs"><b class="arrow left b-dark pull-in"></b>+</span>
                    <span class="structure__control animate">
                        <a href="/{$ADMIN_DIR}/{if $structure_item.mod_id}meta/add/{$structure_item.mod_id}?backuri=/{$ADMIN_DIR}/structure/{else}structure/index/add/{$structure_item.id}/{/if}" class="structure__control__icon zmdi zmdi-file-plus" title="Добавить подраздел"></a>
                        <a href="/{$ADMIN_DIR}/{if isset($structure_item.mid )}meta/edit/{$structure_item.mid}/{$structure_item.id}?backuri=/{$ADMIN_DIR}/structure/{else}structure/index/edit/{$structure_item.id}/{/if}" class="structure__control__icon zmdi zmdi-edit" title="Редактировать раздел"></a>
                        <a href="#" onclick="ajax_vis_toggle(this, {$structure_item.id},{if isset($structure_item.mid )}{$structure_item.mid}{else}0{/if});return false;" class="structure__control__icon zmdi zmdi-eye{if $structure_item.visible == 0}-off{/if}" title="Отображение страницы"></a>
                        {if $structure_item.id !== '1'}
                        <a href="/{$ADMIN_DIR}/{if isset($structure_item.mid )}meta/del/{$structure_item.mid}/{$structure_item.id}?backuri=/{$ADMIN_DIR}/structure/{else}structure/index/del/{$structure_item.id}/{/if}" class="structure__control__icon zmdi zmdi-delete" title="Удалить раздел" onclick="return cp.dialog('Вы действительно хотите удалить раздел?');" data-no-instant></a>
                        {/if}
                    </span>
                </span>
            {/if}
        </div>

	    {if isset($structure_item.a_tree)}
		<div class="dd nestable-tree" data-path="structure" data-group="1">
			<ol class="dd-list">
			    {include file="$TPL_PATH/structure_tree.tpl" a_tree=$structure_item.a_tree}
			</ol>
		</div>
		{/if}
	</li>
	*}
</div>
{/strip}

{*
<menu id="nestable-menu">
    <button type="button" data-action="expand-all">Expand All</button>
    <button type="button" data-action="collapse-all">Collapse All</button>
</menu>

<div class="form__header"><strong>Локализации:</strong></div>

<div class="form__row clearfix">
	<div class="form_column">
		<select name="">
		{foreach from=$localize item=loc name=local}
			<option value="{$loc.system}">{$loc.name}{if $smarty.foreach.local.first} (Основной){/if}</option>
		{/foreach}
		</select>
	</div>

	<div class="form_column">
		<a href="#" class="button button-link"><i class="zmdi zmdi-plus-circle"></i>Добавить</a>
	</div>
</div>

<form action="" class="form">
	<div class="form__row clearfix">
		<div class="form_column">
			<input type="text" placeholder="{t('titles.name')}">
		</div>

		<div class="form_column form_column_half">
			<input type="text" placeholder="Сокращение">
		</div>

		<div class="form_column form_column_auto">
			{include file="system/controll.tpl"
	            type        =   "checkbox"
	            name        =   "default"
	            value       =   "1"
	            text        =   "Основной язык"
	        }
		</div>

		<div class="form_column">
			<button class="button button-blue"><i class="zmdi zmdi-save"></i>Сохранить</button>
		</div>
	</div>
</form>
*}