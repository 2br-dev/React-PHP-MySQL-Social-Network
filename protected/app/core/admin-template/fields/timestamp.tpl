{strip}
<div class="calendar">
    <input name="{$name}" value="{$value|escape}" class="{$class_name}" data-timestamp="true" {if isset($settings.f_date_format )} data-format="{$settings.f_date_format}"{/if} tabindex="{$index}">
    <a href="" class="zmdi zmdi-calendar selector"></a>
</div>
{/strip}