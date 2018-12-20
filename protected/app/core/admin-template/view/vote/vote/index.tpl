{strip}
<div class="button-container clearfix">
    <a href="/{$ADMIN_DIR}/vote/add_vote/" class="button button-blue"><i class="zmdi zmdi-plus-circle"></i> Добавить голосование</a>
</div>

<div class="apply notice">
    {include file="system/help.tpl" help_theme="vote_index"}
</div>

<table class="table">
	<col>
	<col width="120">
	<col width="120">
	<col width="75">
	<col width="55">
	<thead>
	    <tr>
	        <th colspan="5">Список голосований</th>
	    </tr>
	</thead>
	<tbody>
        <tr>
            <td class="h">Тема голосования</th>
            <td class="h">Порядок</th>
            <td class="h">Отображать</th>
            <td class="h">Вопросы</th>
            <td class="h"></th>
        </tr>
    {if !empty( $ListTheme )}
            {foreach name=i item=item from=$ListTheme}
            <tr>
                <td><a href="/{$ADMIN_DIR}/vote/edit_vote/{$item.theme_id}/"><i class="zmdi zmdi-link"></i> {$item.theme_title}</a></td>
                <td>{$item.theme_ord}</td>
                <td>{if $item.theme_visible == 1}Да{else}Нет{/if}</td>
                <td class="tac"><a href="/{$ADMIN_DIR}/vote/add_questions/{$item.theme_id}/" class="zmdi zmdi-list"></a></td>
                <td class="tac">
                    <a href="/{$ADMIN_DIR}/vote/edit_vote/{$item.theme_id}/" class="zmdi zmdi-edit"></a>
                    <a href="/{$ADMIN_DIR}/vote/del_vote/{$item.theme_id}/" class="zmdi zmdi-delete remove-trigger" data-no-instant></a>
                </td>
            </tr>
            {/foreach}
        {else}
        <tr>
            <td colspan="5" class="center-middle">Данные не найдены!</td>
        </tr>
    {/if}
    </tbody>
</table>
{/strip}