{strip}
<form method="post" action="">
	<input type="hidden" name="action" value="del_vote" />
	<input type="hidden" name="id" value="{$DelVote.id}" />
    
    <div class="apply notice">
        <p class="mb10"><b>Тема голосования:</b> {$DelVote.title|escape}</p>
        <p class="mb10"><b>Системная дата создания:</b> {$DelVote.created}</p>
        <p class="mb10"><b>Отображать:</b> {$DelVote.visible}</p>
        <p><b>Поле для сортировки:</b> {$DelVote.ord}</p>
    </div>
	
	<div class="button-container">
		<a href="/{$ADMIN_DIR}/vote/" class="button button-blue"><i class="zmdi zmdi-arrow-left"></i>Нет</a>
		<button class="button button-red" type="button" onclick="return cp.dialog( 'Требуется подтверждение удаления!' );"><i class="zmdi zmdi-delete"></i>Подтверждаю удаление</button>
	</div>
</form>
{/strip}