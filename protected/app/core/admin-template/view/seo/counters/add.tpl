{strip}
<form method="post" id="form_mdd">
	<input type="hidden" name="action" value="counters_add">
	
	<table id="meta_data" class="table">
        <colgroup>
            <col width="200">
            <col>
        </colgroup>
        <tbody>
            <tr class="th">
                <td class="h va_m">Наименование</td>
                <td>
					<input name="name" class="w50 ness">
                </td>
            </tr>
            <tr class="th">
                <td class="h va_m">Тип счетчика</td>
                <td>
                    {if $counter_type}
                    <select name="type">
                    {foreach from=$counter_type item=item}
                        <option value="{$item.system}">{$item.name}</option>
                    {/foreach}
                    </select>
                    {/if}
                </td>
            </tr>
            <tr class="th">
                <td class="h va_m">Идентификатор</td>
                <td>
                    <input name="code" class="w50">
                </td> 
            </tr>
            <tr class="th">
                <td class="h va_m">Пост загрузка</td>
                <td>
					<div class="option-group option-combo">
				        <label><input type="radio" name="post_loading" value="1" checked><span class="option">Да</span></label>
				        <label class="disallow"><input type="radio" name="post_loading" value="0"><span class="option">Нет</span></label>
				    </div>
                </td>
            </tr>
            <tr class="th">
                <td class="h va_m">Порядок</td>
                <td>
                	<input name="ord" value="10" class="ord integer reducing-trigger">
                </td>
            </tr>
            <tr class="th">
                <td class="h va_m">Статус</td>
                <td>
					<div class="option-group option-combo">
				        <label><input type="radio" name="active" value="1" checked><span class="option">Активен</span></label>
				        <label class="disallow"><input type="radio" name="active" value="0"><span class="option">Не активен</span></label>
				    </div>
                </td>
            </tr>
        </tbody>
    </table>
    
    {include file="system/buttons.tpl"}
</form>
{/strip}