{strip}
{if isset($pager) && !empty($pager)}
    {assign var=uri value=$smarty.server.REQUEST_URI}
    {if $pager.pageCount != 1}
        
        {if !isset($pager.advanced) && !empty($pager.arrPages )}
        
        <div class="pagination">
            {foreach item=item from=$pager.arrPages}
                {math assign=this_page equation="(a + 1)" a = $item.point}
                <a class="{if $pager.currPage == $item.point}pagination-current{else}pagination-link{/if}" href="{$item.qstring}" title="{$this_page}">
                    {$this_page}
                </a>
            {/foreach}
        </div>

        {elseif !empty( $pager.advanced )}
        
        <div class="pagination">
            <a class="button button-prev" href="{$pager.firstPage}">Первая</a>
            
            {foreach item=item from=$pager.arrPages}
                {if is_numeric($item.point)}
                    {math assign=this_page equation="(a + 1)" a = $item.point}
                    <a class="{if $pager.currPage == $item.point}pagination-current{else}pagination-link{/if}" href="{$item.qstring}" title="{$this_page}">{$this_page}</a>
                {else}
                    <span class="pagination-empty" title="{$item.point}">{$item.point}</span>
                {/if}
            {/foreach}
            
            {math assign=last_j equation="(a-1)" a=$pager.pageCount}
            <a class="button button-next" href="{$pager.lastPage}">Последняя</a>
        </div>

        {/if}
    {/if}
{/if}
{/strip}