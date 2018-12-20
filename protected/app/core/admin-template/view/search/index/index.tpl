{strip}
<div class="apply notice">
	{include file='system/help.tpl' help_theme="search_index"}
</div>

{if $search_info.index_records}
    <div class="indexation-info">Проиндексированно <span class="badge badge-blue">{$search_info.index_records}</span> страниц сайта</div>
{/if}

<div class="content" style="margin: 0; padding: 0;">
	{*
	<div class="progress" id="indexation-progress">
		<div class="progressbar">
			<div class="bar" style="width: 0%"></div>
		</div>
	</div>
	*}
	
    <div class="indexation-search" id="requests"></div>
	
	<div id="indexation-good" class="apply" style="display:none">
		Индексация сайта завершена
	</div>
</div>

<button type="button" class="button button-blue" onclick="return cp.indexation(event);"><i class="zmdi zmdi-refresh"></i>Индексировать сайт</button>
{/strip}