{strip}
{if !$type}
	{$type = 'radio'}
{/if}
<div class="group">
{foreach from=$list item=controll}
	<label class="group__item"><input type="{$type}" class="group__item__rb" name="{$name}" value="{$controll.value}" {if (isset($check) && ($check == $controll.value) || (is_array($check) && in_array($controll.value, $check))) || (!isset($check) && ($controll.default == true || $controll.default == 1)) || ($controll.checked == true)} checked{/if}><span class="group__item__style"></span><span class="group__item__text">{$controll.text}</span></label>
{/foreach}
</div>
{/strip}