{if $list}
    {$children = 'tree'}
    {$value_key = 'value'}
    {$value_name = 'var'}
    {$selected = 'checked'}

    <select name="{$name}"><option value="0">---</option>
    {foreach from=$list item=tree_item}
        {$nbsp_count = 0}

        <option value="{$tree_item[$value_key]}"{if isset($tree_item[$selected]) && $tree_item[$selected]} selected{/if}>
            {section name=nbsp loop=$nbsp_count}-{/section}{$tree_item[$value_name]}
        </option>

        {if $tree_item[$children]}
                    
            {$nbsp_count = $nbsp_count + 2}

            {include file="fields/select_tree.tpl"
                tree            =   $tree_item[$children]
                children        =   $children
                value_key       =   $value_key
                value_name      =   $value_name
                selected        =   $selected
                nbsp_count      =   $nbsp_count
            }
        {/if}
    {/foreach}
    </select>
{/if}