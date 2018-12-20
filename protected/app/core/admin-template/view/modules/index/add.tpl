{strip}
<form method="post" id="form_mdd">
	<input type="hidden" name="module_action" value="add">
	
	{* Module description *}
	{include file="$TPL_PATH/_module.tpl"}

	{* Fields description *}
	{include file="$TPL_PATH/_fields_module_add.tpl"}
	
	{include file="system/buttons.tpl"}
</form>
{/strip}