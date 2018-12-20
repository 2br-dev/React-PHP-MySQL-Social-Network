{strip}
<div class="{$class_name}">
    <select name="{$name}[]" multiple data-placeholder="Выбрать" tabindex="{$index}">
        <option value="0">---</option>
    {if isset($list ) && !empty( $list )}
        {foreach from=$list item=e}
        <option value="{$e.value}"{if $e.value == $value || isset($e.checked ) && $e.checked == 1} selected{/if}>{$e.var}</option>
        {/foreach}
    {/if}
    </select>
</div>
{/strip}