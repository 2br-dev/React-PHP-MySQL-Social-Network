{strip}
{if isset($mdd_additions_list ) && !empty( $mdd_additions_list )}
<ul class="tabs clearfix">
	{foreach from=$mdd_additions_list item=mname key=mid}
		<li><a href="/{$ADMIN_DIR}/meta/{$mid}/" class="tab{if isset($module_id ) && $module_id == $mid} current{/if}">{$mname}</a></li>
	{/foreach}
</ul>
{/if}
{/strip}