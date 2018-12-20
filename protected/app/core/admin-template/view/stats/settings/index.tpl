{strip}
<form class="crud-form" enctype="multipart/form-data" method="POST">
    <input name="action" value="settings" type="hidden">
    <table class="table">
        <col width="350">
        <col>
        <tbody>
        {*
            <tr>
                <td class="h">Что делать с элементами, отсутствующими в файле импорта</td>
                <td>
                    <div class="option-group">

                        <label><input type="radio" name="element_action" value="0"{if !isset($settings.element_action) || $settings.element_action == 0} checked{/if}><span class="option">Ничего</span></label>
                        <label><input type="radio" name="element_action" value="1"{if isset($settings.element_action) && $settings.element_action == 1} checked{/if}><span class="option">Деактивировать</span></label>
                        <label><input type="radio" name="element_action" value="2"{if isset($settings.element_action) && $settings.element_action == 2} checked{/if}><span class="option">Удалить</span></label>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="h">Что делать с разделами, отсутствующими в файле импорта</td>
                <td>
                    <div class="option-group">
                        <label><input type="radio" name="section_action" value="0"{if !isset($settings.section_action) || $settings.section_action == 0} checked{/if}><span class="option">Ничего</span></label>
                        <label><input type="radio" name="section_action" value="1"{if isset($settings.section_action) && $settings.section_action == 1} checked{/if}><span class="option">Деактивировать</span></label>
                        <label><input type="radio" name="section_action" value="2"{if isset($settings.section_action) && $settings.section_action == 2} checked{/if}><span class="option">Удалить</span></label>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="h">Интервал одного шага в секундах (0 - выполнять загрузку за один шаг):</td>
                <td>
                    <input maxlength="10" value="{if isset($settings.import_interval)}{$settings.import_interval}{/if}" name="import_interval" class="ord integer reducing-trigger">
                 </td>
            </tr>
            <tr>
                <td class="h">Размер единовременно загружаемой части файла (в байтах)</td>
                <td><input maxlength="11" value="{if isset($settings.file_limit)}{$settings.file_limit}{/if}" name="file_limit" class="ord integer reducing-trigger"></td>
            </tr>
            <tr>
                <td class="h">Количество единовременно загружаемых строк (для csv, xls)</td>
                <td><input maxlength="11" value="{if isset($settings.line_limit)}{$settings.line_limit}{/if}" name="line_limit" class="ord integer reducing-trigger"></td>
            </tr>
            <tr>
                <td class="h">Использовать сжатие zip</td>
                <td>
                    {$checked = false}

                    {if isset($settings.use_zip) && $settings.use_zip == 1}
                        {$checked = true}
                    {/if}

                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        name        =   "use_zip"
                        checked     =   $checked
                        value       =   1
                        text        =   "Да, если доступно"
                    }
                </td>
            </tr>
        *}
        </tbody>
    </table>    

    <div class="button-container clearfix">
        <button class="button button-blue" type="submit"><i class="zmdi zmdi-save"></i>Сохранить настройки</button>
    </div>

</form>
{/strip}