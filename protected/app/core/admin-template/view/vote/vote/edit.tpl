{strip}
{literal}
<script type="text/javascript">
	function Check() {
		if ( document.getElementById( 'VoteAddForm' ).title.value == '' ) {
			alert( "Поле 'Тема голосования' должно быть заполнено!" );
			return false;
		}
		if ( document.getElementById( 'VoteAddForm' ).ord.value == '' ) {
			alert( "Поле 'Порядок' должно быть заполнено!" );
			return false;
		}
		document.getElementById( 'VoteAddForm' ).submit();
	}
</script>
{/literal}

<form method="post" id="VoteAddForm">
	<input type="hidden" name="action" value="edit_vote">
	<input type="hidden" name="id" value="{$ItemVote.id}">
	
	<table class="table">
        <col width="200">
		<col>
		<thead>
            <tr>
                <td class="h">Тема голосования:</td>
                <td><input name="title" value="{$ItemVote.title}"></td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h">Системная дата создания:</td>
                <td><input name="created" value="{$ItemVote.created}"></td>
            </tr>
            <tr>
                <td class="h">Отображать:</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "visible"
                        check   = $ItemVote.visible
                        list    = [
                            [ value => '1', text => "Да", default => true ],
                            [ value => '0', text => "Нет" ]
                        ]
                    }
                </td>
            </tr>	
            <tr>
                <td class="h">Поле для сортировки:</td>
                <td><input name="ord" value="{$ItemVote.ord}" class="ord integer reducing-trigger"></td>
            </tr>
        </tbody>
	</table>

	<div class="button-container">
		<button class="button button-blue" name="save" type="submit" onclick="Check()"><i class="zmdi zmdi-save"></i>Сохранить</button>
		<a class="button button-red" href="/{$ADMIN_DIR}/vote/"><i class="zmdi zmdi-arrow-left"></i>Отмена</a>
	</div>
</form>
{/strip}