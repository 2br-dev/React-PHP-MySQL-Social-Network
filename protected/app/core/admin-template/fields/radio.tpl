{strip}
{if isset($list) && !empty($list)}
    {foreach from=$list item=e}
        {$checked = false}

        {if ($e.value == $value) || !$value && $e.default == 1}
            {$checked = true}
        {/if}
        
        {include file="system/controll.tpl"
            type        =   "radio"
            name        =   $name
            needle      =   $docs_item.visible
            checked     =   $checked
            value       =   $e.value
            text        =   $e.var
        }
    {/foreach}
{/if}
{/strip}