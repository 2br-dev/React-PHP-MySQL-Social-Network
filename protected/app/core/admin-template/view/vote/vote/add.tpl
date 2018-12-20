{strip}
<form method="post" action="" id="VoteAddForm">
	<input type="hidden" name="action" value="add_vote">
	
	<table class="table">
		<col width="200">
		<col>
		<thead>
            <tr>
                <td class="h">Тема голосования:</td>
                <td><input name="title" value="" class="ness"></td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h">Системная дата создания:</td>
                <td><input name="created"></td>
            </tr>
            <tr>
                <td class="h">Отображать:</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "visible"
                        list    = [
                            [ value => '1', text => "Да", default => true ],
                            [ value => '0', text => "Нет" ]
                        ]
                    }
                </td>
            </tr>	
            <tr>
                <td class="h">Поле для сортировки:</td>
                <td><input name="ord" value="" class="ord integer reducing-trigger"></td>
            </tr>
        </tbody>
	</table>
	
	<div class="button-container">
		<button class="button button-blue" name="save" type="submit" onclick="Check()"><i class="zmdi zmdi-save"></i>Сохранить</button>
		<a class="button button-red" href="/{$ADMIN_DIR}/vote/"><i class="zmdi zmdi-arrow-left"></i>Отмена</a>
	</div>
</form>

{literal}
<script type="text/javascript">
	function Check()
    {
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
{/strip}