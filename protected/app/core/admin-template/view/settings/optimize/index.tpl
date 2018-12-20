{strip}
{if $supported}
	<div class="apply success">Поддерживается:<br>
		{foreach from=$supported item=item}
			{$item}<br>
		{/foreach}
	</div>
{else}
	<div class="apply notice">Нет библиотек для оптимизации</div>
{/if}
{/strip}