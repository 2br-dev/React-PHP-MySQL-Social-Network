{strip}
<form method="post" id="form_stc">
	<input type="hidden" name="action" value="edit">

	{* Meta *}
	{include file="$TPL_PATH/_fields_meta.tpl"}

	{* Open Graph *}
	{include file="$TPL_PATH/_fields_og.tpl"}

	{* Structure & Content *}
	{include file="$TPL_PATH/_fields_structure.tpl"}

	<div class="button-container-structure">
		<a href="#" class="button button-purple button-container-structure-add" onclick="return cp.addBlock({$stc_page.id}, event);"><i class="zmdi zmdi-plus-circle"></i> Добавить часть страницы</a>
		{include file="system/buttons.tpl"}
	</div>
</form>
{/strip}