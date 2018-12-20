{strip}
<div class="calendar input-group">
    <input name="{$name}" value="{$value|escape}" {if isset($onchange)} onchange="{$onchange}"{/if} class="calendar-input{if isset($class_name)} {$class_name}{/if}" {if isset($settings.f_date_format)} data-format="{$settings.f_date_format}"{/if} tabindex="{$index}">
    <span class="zmdi zmdi-calendar selector input-group-addon"></span>
</div>
{/strip}