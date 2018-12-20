{strip}
<label class="controll{if $addclass} {$addclass}{/if}"{if $id} id="{$id}"{/if}{if $title} title="{$title}"{/if}>
	<input type="{$type}" class="controll__input{if $ctrlclass} {$ctrlclass}{/if}"
	{if isset($value)} value="{$value}"{/if}
	{if $onchange} onchange="{$onchange}"{/if}
	{if $ctrlid} id="{$ctrlid}"{/if}
	{if $name} name="{$name}"{/if}
	{if (isset($needle) && $needle == $value) || (isset($checked) && $checked === true)} checked{/if}>
	<span class="controll__visible controll__visible_{$type}{if $content} controll__visible--contented{/if}">{if $content}{$content}{/if}</span>
	{if $text}
	<span class="controll__text">{$text}</span>
	{/if}
</label>
{if $hint}
<span class="controll__hint">{$hint}</span>
{/if}
{/strip}