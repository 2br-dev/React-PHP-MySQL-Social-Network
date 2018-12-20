{strip}
<form class="crud-form" enctype="multipart/form-data" method="POST">
    <input name="action" value="settings" type="hidden">
    <table class="table">
        <col width="350">
        <col>
        <tbody>
            <tr>
                <td class="h">Что делать с элементами, отсутствующими в файле импорта</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "element_action"
                        check   = $settings.element_action
                        list    = [
                            [ value => '0', text => "Ничего", default => true ],
                            [ value => '1', text => "Деактивировать" ],
                            [ value => '2', text => "Удалить" ]
                        ]
                    }
                </td>
            </tr>
            <tr>
                <td class="h">Что делать с разделами, отсутствующими в файле импорта</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "section_action"
                        check   = $settings.section_action
                        list    = [
                            [ value => '0', text => "Ничего", default => true ],
                            [ value => '1', text => "Деактивировать" ],
                            [ value => '2', text => "Удалить" ]
                        ]
                    }
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
                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        needle      =   $settings.use_zip
                        name        =   "use_zip"
                        value       =   "1"
                        text        =   "Да, если доступно"
                    }
                </td>
            </tr>
        </tbody>
    </table>

    <div class="button-container clearfix">
        <button class="button button-green" type="submit"><i class="zmdi zmdi-save"></i>Сохранить настройки</button>
    </div>

</form>
{/strip}