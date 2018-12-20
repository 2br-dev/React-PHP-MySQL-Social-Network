{strip}
{if isset($smarty.get.act ) && $smarty.get.act=="result"}
	<p>Отправлено: <span class="badge badge-green">{$smarty.get.good}</span></p>
	<p>Не отправлено: <span class="badge badge-red">{$smarty.get.error}</span></p>
{else}
	{if $list_dispatch_send}
		{foreach from=$list_dispatch_send item=i}
			<p>{$i.name}</p>
		{/foreach}
	{else}
		<p class="apply notice">Рассылка не настроена</p>
	{/if}
{/if}

<a href="{$base_path}/index/add/" class="button button-blue"><i class="zmdi zmdi-plus-circle"></i>Добавить рассылку</a></li>
{/strip}