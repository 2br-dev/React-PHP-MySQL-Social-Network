{strip}
{if isset($smarty.get.msg ) && $smarty.get.msg == "apply"}
<div class="apply">Данные были успешно сохранены!</div>
{/if}

<form method="post" id="form_mdd">
	<input type="hidden" name="module_action" value="edit">
	
	{* Module description *}
	{include file="$TPL_PATH/_module.tpl"}

	{* Fields description *}
	{include file="$TPL_PATH/_fields_module_edit.tpl"}

	{include file="system/buttons.tpl"}
</form>
{/strip}