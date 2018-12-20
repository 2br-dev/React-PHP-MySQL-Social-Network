{strip}
<form method="post" id="VoteAddQuestions">
    <input type="hidden" name="id" id="id" value="{$vote_id}">
    <input type="hidden" name="action" id="action" value="add_questions">
    
	<table class="table" id="ext_table">
		<col>
		<col width="120">
		<col width="120">
		<col width="135">
		<thead>
            <tr>
                <th class="h">Вопрос</th>
                <th class="h">Порядок</th>
                <th class="h">Отображать</th>
                <th class="h"></th>
            </tr>
        </thead>
        <tbody>
            {foreach item=item from=$ListQuestions}
            <tr id="tr_{$item.id}">
                <td>
                    <input type="hidden" name="parent_id_{$item.id}" id="parent_id_{$item.id}" value="{$item.parent_id}">
                    <input type="hidden" name="id_{$item.id}" id="id_{$item.id}" value="{$item.id}">
                    <div id="title_{$item.id}">{$item.title}</div>
                    <div id="title_i_{$item.id}" style="display:none">
                        <input name="title_{$item.id}" value="{$item.title}" id="title_input_{$item.id}">
                        
                        <div class="button-container mb0 clearfix">
                            <a href="#" class="button button-green" onclick="saveExtendet('{$item.id}')">Сохранить</a>
                            <a href="#" class="button button-red fr" onClick="cancelExtendet('{$item.id}')">Отмена</a>
                        </div>
                    </div>
                </td>
                <td>
                    <div id="ord_{$item.id}">{$item.ord}</div>
                    <div id="ord_i_{$item.id}" style="display: none">
                        <input name="ord_{$item.id}" value="{$item.ord}" id="ord_input_{$item.id}">					
                    </div>
                </td>
                <td align="center">
                    <div id="visible_{$item.id}">{if $item.visible == "1"}Да{else}Нет{/if}</div>
                    <div id="visible_i_{$item.id}" style="display: none">
                        <input name="vis_{$item.id}" type="hidden" id="vis_{$item.id}">

                        {include file="system/controll.tpl"
                            type        =   "radio"
                            id          =   "visible_input_"|cat:$item.id|cat:"_1"
                            name        =   "visible_"|cat:$item.id
                            needle      =   $item.visible
                            value       =   "1"
                            onchange    =   "$('#vis_"|cat:$item.id|cat:"').val('1');"
                            text        =   "Да"
                        }
                        
                        {include file="system/controll.tpl"
                            type        =   "radio"
                            id          =   "visible_input_"|cat:$item.id|cat:"_0"
                            name        =   "visible_"|cat:$item.id
                            needle      =   $item.visible
                            value       =   "0"
                            onchange    =   "$('#vis_"|cat:$item.id|cat:"').val('0');"
                            text        =   "Нет"
                        }
                    </div>
                </td>
                <td>
                    <a href="#" class="zmdi zmdi-edit" onclick="editExtendet('{$item.id}')">.</a>
                    <a href="#" class="zmdi zmdi-delete" onClick="delExtendet('{$item.id}')"></a>
                </td>		
            </tr>			
            {/foreach}
            <tr id="ajax_add_form">
                <td><input name="title" id="title"></td>
                <td><input name="ord" id="ord" class="ord integer reducing-trigger"></td>
                <td class="va_m">
                    {include file="system/group.tpl"
                        name    = "visible"
                        list    = [
                            [ value => '1', text => "Да" ],
                            [ value => '0', text => "Нет", default => true ]
                        ]
                    }
                </td>
                <td class="va_t">
                    <a href="#" class="button button-green" onclick="addExtendet();"><i class="zmdi zmdi-save"></i>Сохранить</a>
                </td>
            </tr>
        </tbody>
    </table>

    <div class="button-container clearfix">
        <a href="#" class="button button-green" onclick="$('#ajax_add_form').show()"><i class="zmdi zmdi-plus-circle"></i> Добавить</a>
    </div>
</form>

{if $result_vote_arr}
<p>Результаты голосования</p>
{assign var=summ value=0}
<table class="table" id="ext_table">
    <col>
    <col width="150">
    <thead>
        <tr>
            <th class="h">Вопрос:</th>
            <th class="h">Количество голосов</th>
        </tr>
    </thead>
    <tbody>
    {foreach item=i from=$result_vote_arr name=ii}
        <tr>
            <td>{$i.vote_question_title}</td>
            <td>{$i.vote_question_count}</td>
        </tr>
        {math equation="x+y" x=$summ y=$i.vote_question_count assign=summ}
    {/foreach}
    </tbody>
    <tfoot>
        <tr>
            <td>Всего голосов</td>
            <td>{$summ}</td>
        </tr>
    </tfoot>
</table>
{/if}
{/strip}