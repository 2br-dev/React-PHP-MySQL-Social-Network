{strip}
{foreach item=item from=$a_tree}
	<option value="{$item.id}"{if $curr_id == $item.id} selected="selected"{/if}>
		{section name=nbsp loop=$nbsp_count}•{/section}
		{if $nbsp_count > 0}&nbsp;{/if}
		{$item.name}
	</option>
	{if $item.a_tree}
		{math equation="x+y" x=$nbsp_count y=3 assign="nbsp_count"}
	
		{include file="$TPL_PATH/tree_select.tpl" 
			a_tree=$item.a_tree 
			nbsp_count=$nbsp_count 
			curr_id = $curr_id
		}
		
		{math equation="x-y" x=$nbsp_count y=3 assign="nbsp_count"}
	{/if}
{/foreach}
{/strip}