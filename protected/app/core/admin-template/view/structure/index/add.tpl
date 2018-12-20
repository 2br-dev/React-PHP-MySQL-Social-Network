{strip}
<form method="post" id="form_stc">
	<input type="hidden" name="action" value="add">

	{* Meta *}
	{include file="$TPL_PATH/_fields_meta.tpl"}

	{* Open Graph *}
	{include file="$TPL_PATH/_fields_og.tpl"}

	{* Structure & Content *}
	{include file="$TPL_PATH/_fields_structure.tpl"}

	{include file="system/buttons.tpl"}
</form>
{/strip}


{*

Выберите тип страницы
СтраницаОбычная страница
Home Page
Виртуальная страницаОтображение содержимого другой страницы
Страница ошибкиПользовательские страницы ошибок (например, "Страница не найдена")
Страница перенаправленияПеренаправление на другую внутреннюю страницу

*}