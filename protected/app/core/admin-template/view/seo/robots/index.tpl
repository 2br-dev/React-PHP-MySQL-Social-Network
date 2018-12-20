{strip}
<form method="post">
	<div class="mb10">
		<input type="hidden" name="action" value="save_robots">
		
		{assign var="robots_content" value=""}

        {if isset($robots)}
            {assign var="robots_content" value=$robots}
        {/if}

        {include file="system/editor.tpl"
            editor_type       =   "codemirror"
            editor_id         =   "robots"
            editor_name       =   "robots"
            editor_value      =   $robots_content
            editor_cont       =   $robots_content
            editor_hightlight =   "javascript"
        }
	</div>

	<div class="button-container">
		<button type="submit" class="button button-blue"><i class="zmdi zmdi-save"></i>Сохранить изменения</button>
	</div>
</form>
{/strip}