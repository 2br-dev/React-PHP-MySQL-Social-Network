{strip}
{if isset($pager_info ) && !empty( $pager_info )}
    {assign var=uri value=$smarty.server.REQUEST_URI}
    {if $pager_info.page_count != 1}
        
        {if !isset($pager_info.advanced ) && !empty( $pager_info.arr_pages )}
        
        <div class="pagination">
            {foreach item=item from=$pager_info.arr_pages}
                {math assign=this_page equation="(a + 1)" a = $item.point}
                <a class="{if $pager_info.curr_page == $item.point}pagination-current{else}pagination-link{/if}" href="{$item.qstring}" title="{$this_page}">{$this_page}</a>
            {/foreach}
        </div>

        {elseif !empty( $pager_info.advanced )}
        
        <div class="pagination">
            <a class="button button-prev" href="{$pager_info.first_page}">Первая</a>
            
            {foreach item=item from=$pager_info.arr_pages}
                {if is_numeric($item.point)}
                    {math assign=this_page equation="(a + 1)" a = $item.point}
                    <a class="{if $pager_info.curr_page == $item.point}pagination-current{else}pagination-link{/if}" href="{$item.qstring}" title="{$this_page}">{$this_page}</a>
                {else}
                    <span class="pagination-empty" title="{$item.point}">{$item.point}</span>
                {/if}
            {/foreach}
            
            {math assign=last_j equation="(a-1)" a=$pager_info.page_count}
            <a class="button button-next" href="{$pager_info.last_page}">Последняя</a>
        </div>

        {/if}
    {/if}
{/if}
{/strip}