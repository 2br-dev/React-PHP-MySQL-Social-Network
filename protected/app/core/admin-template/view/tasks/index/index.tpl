{strip}
{if $tasks_list}
	{foreach from=$tasks_list item=item}
		<div class="apply notice" data-item="{$item.id}">
			{$item.operation} <a href="{$base_path}/{$item.module}/{$item.action}/{$item.element}/">Выполнить</a>
		</div>
	{/foreach}
{else}
	<div class="apply">Задач нет</div>
{/if}
{/strip}