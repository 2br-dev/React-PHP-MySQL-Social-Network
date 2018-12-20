{if isset($tree) && !empty($tree)}
{strip}
	{foreach $tree as $item}
		{if $item.sys_name == 'main'}
			{assign var=tmp value=''}
		{else}
			{assign var=tmp value=$item.sys_name}
			{assign var=tmp value="$tmp/"}
		{/if}
		<li><a href="{$link}{$tmp}">{$item.name}</a>
			{if $item.tree}
			<ul>
				{include file='../system/sitemap.tpl' tree=$item.tree link="$link$tmp"}
			</ul>
			{/if}
		</li>
	{/foreach}
{/strip}
{/if}