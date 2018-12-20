{strip}
{foreach item=item from=$a_tree}
{assign var=id value=$item.id}
<li>
	<div class="shaddow">
		{if !$item.childs}
			<div class="control dis"></div>
		{elseif $item.a_tree}
			<a href="#" class="minus" onclick="toggle_menu(this,'{$item.id}');return false;"></a>
		{else}
			<a href="#" class="plus" onclick="ajax_show_menu('{$item.id}',this,{$item.mod_id});return false;"></a>
		{/if}
		
		<div class="page default"></div>
		<a href='/{$ADMIN_DIR}/modules/edit/{$meta_module.id}/{$item.id}/' style="float:left">{$item.name}</a>
		<div class="arrow_dbl"></div>
		<ul class="flydown">
			<li><a href="/{$ADMIN_DIR}/modules/add/{$meta_module.id/{$item.id}" class="ctr_padding contr ctr_add" title="Добавить подраздел">Добавить подраздел</a></li>
			<li><a href="/{$ADMIN_DIR}/modules/edit/{$meta_module.id}/{$item.id}" class="ctr_padding contr ctr_edit" title="Редактировать раздел">Редактировать раздел</a></li>
			<li><a href="/{$ADMIN_DIR}/modules/del/{$meta_module.id}/{$item.id}" class="ctr_padding contr ctr_del" title="Удалить раздел" onclick="return cp.dialog('Вы действительно хотите удалить раздел и все подразделы?');" data-no-instant>Удалить страницу</a></li>
		</ul>
		
	</div>
	{if $item.a_tree}<ul class="stc" id="item{$item.id}">{include file="$TPL_PATH/module/tree.tpl" a_tree=$item.a_tree}</ul>{/if}
</li>
{/foreach}
{/strip}