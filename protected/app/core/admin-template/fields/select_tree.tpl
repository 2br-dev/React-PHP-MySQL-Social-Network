{if $tree}
    {foreach from=$tree item=tree_item}
        {if isset($tree_item[$value_key]) && isset($tree_item[$value_name])}

            {if !$ignore || ($ignore && $tree_item[$value_key] !== $ignore)}

    			{if !isset($nbsp_count)}
    				{$nbsp_count = 0}
    			{/if}

            	<option value="{$tree_item[$value_key]}"{if isset($selected) && ($selected == $tree_item[$value_key])} selected{/if}>
            		{section name=nbsp loop=$nbsp_count}-{/section}
    				{if $nbsp_count > 0}&nbsp;{/if}
            		{$tree_item[$value_name]}
        		</option>

            	{if $tree_item[$children]}
            		
            		{$nbsp_count = $nbsp_count + 2}

            		{include file="fields/select_tree.tpl"
                        tree            =   $tree_item[$children]
                        children        =   $children
                        value_key       =   $value_key
                        value_name      =   $value_name
                        selected        =   $selected
                        nbsp_count		=   $nbsp_count
                    }
            	{/if}
            
            {/if}

        {/if}
    {/foreach}
{/if}