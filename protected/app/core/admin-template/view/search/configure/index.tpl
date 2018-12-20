{strip}
<form action="" method="post">
	<input type="hidden" name="action" value="save_conf">

	<table class="table" id="search">
		<col width="350">
		<col>
		<tbody>
            <tr>
                <td class="h">{$locale.domen|capi}</th>
                <td><input name="new_site" value="{$search_site}" disabled="disabled"></td>
            <tr>
            <tr>
                <td class="h">{$locale.ignore_links_containing|capi}</th>
                <td><input name="new_rules" value="{foreach item=item from=$search_rules}{$item} {/foreach}"></td>
            <tr>
            <tr>
                <td class="h">{$locale.not_take_links_pages_containing|capi}:<br>({$locale.take_only_content})</th>
                <td><input name="new_cat_rules" value="{foreach item=item from=$search_cat_rules}{$item} {/foreach}"></td>
            <tr>
            <tr>
                <td class="h">{$locale.ignore_references_complete_coincidence|capi}</th>
                <td><input name="new_templates" value="{foreach item=item from=$search_templates}{$item} {/foreach}"></td>
            <tr>
        </tbody>
	</table>

    {include file="system/buttons.tpl"}
</form>
{/strip}