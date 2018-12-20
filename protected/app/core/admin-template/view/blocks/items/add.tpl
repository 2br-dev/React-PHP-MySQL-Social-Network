{strip}
<form action="{$request_path}" id="form" method="post">
    <input type="hidden" name="action" value="block_add">

	<table class="table">
        <col width="200">
        <col>
        <thead>
            <tr>
                <th colspan="2">Добавление элемента</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h hl">Зона вывода <span class="ness_color">*</span></td>
                <td>
                    <select name="zone_id" class="ness">
                        <option value="">..выбрать</option>
                        {foreach item=item from=$zone_list}
                        <option value="{$item.id}">{$item.name|escape}</option>
                        {/foreach}
                    </select>
                </td>
            </tr>
            <tr>
                <td class="h hl">{t('titles.name')} <span class="ness_color">*</span></td>
                <td><input name="name" class="w50 ness"></td>
            </tr>
            <tr>
                <td class="h hl">На каких страницах отображать блок?</td>
                <td>
                    <textarea name="pages_on" cols="50" rows="5" class="mb10"></textarea>
                    <div class="apply notice mb0">
                        Перечислите системные имена страниц ( например news; company; about; ), на которых должен выводится блок, разделяя их точкой с запятой (;)<br>
                        Если оставить поле пустым, то блок будет отображаться на всех страницах!
                    </div>
                </td>
            </tr>
            <tr>
                <td class="h hl">На каких страницах не отображать блок?</td>
                <td>
                    <textarea name="pages_off" cols="50" rows="5" class="mb10"></textarea>
                    <div class="apply notice mb0">
                        Перечислите системные имена страниц ( например news; company; about; ), на которых не должен выводится блок, разделяя их точкой с запятой (;)<br>
                        Если оставить поле пустым, то блок будет отображаться на всех страницах!
                    </div>
                </td>
            </tr>
            <tr>
                <td class="h hl">Локализация</td>
                <td>
                    <div class="width-50" style="position: relative">
                        <select name="locale">
                            <option value="ru">Русский язык</option>
                            <option value="en">Английский язык</option>
                        </select>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="h hl">Модуль</td>
                <td>
                    <div class="width-50" style="position: relative">
	                    <select name="module">
                            <option value="0">..выбрать модуль</option>
                            {if isset($modules_list)}
                                {foreach item=item from=$modules_list}
                                    <option value="{$item.id}"{if $block_item.module == $item.id} selected{/if}>{$item.name}: {$item.func_name}</option>
                                {/foreach}
                            {/if}
                        </select>
	                </div>
                </td>
            </tr>
            <tr>
                <td class="h hl">Содержимое блока</td>
                <td>
                    {include file="system/editor.tpl"
                        editor_name          = "block_cont" 
                        editor_id            = "block_cont" 
                        editor_cont          = ''
                        editor_hightlight    = "php"
                        editor_save_btn      = true
                    }
                </td>
            </tr>
            <tr>
                <td class="h hl">Сортировка</td>
                <td><input name="ord" class="ord integer reducing-trigger" value="{$next_ord}"></td>
            </tr>
            <tr>	
                <td class="h hl">Активен</td>
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
        </tbody>
	</table>
    
    {include file="system/buttons.tpl"}
</form>
{/strip}