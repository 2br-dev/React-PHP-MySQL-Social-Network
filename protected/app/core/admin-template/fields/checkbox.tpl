{strip}
{if isset($list) && !empty($list)}
	{foreach from=$list item=e}
		{assign var="checked" value="false"}

		{if (is_array($value) && $e.value|in_array:$value) || (isset($e.checked) && $e.checked == 1) || (!$value && $e.default == 1)}
			{assign var="checked" value=true}
		{/if}

		{include file="system/controll.tpl"
			type        =   "checkbox"
			name        =   $name|cat:"["|cat:$e.value|cat:"]"
			value       =   $e.value
			text        =   $e.var
		}
	{/foreach}
{/if}
{/strip}