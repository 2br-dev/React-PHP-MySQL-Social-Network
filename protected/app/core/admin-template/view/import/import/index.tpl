{strip}
{if $exchange_files nocache}
<table class="table">
    <col width="200">
    <col>
    <col width="120">
    <col width="180">
    <col width="35">
    <thead>
        <tr class="th">
            <th colspan="5">Список файлов</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="h">Файл</td>
            <td class="h">Импортировать</td>
            <td class="h">Размер файла</td>
            <td class="h">Дата создания</td>
            <td class="h"></td>
        </tr>
    {foreach from=$exchange_files item=item name=exchange}
        <tr>
            <td><i class="zmdi zmdi-file"></i> {$item.file}</td>
            <td>
                <form action="/{$ADMIN_DIR}/import" method="GET">
                    <input type="hidden" name="filename" value="{$item.file}">
                    <input type="hidden" name="setimport" value="0">
                    
                    {if $profile_list}
                    <div class="width-50 fl">
                        {foreach from=$profile_list item=prof}
                        <select name="module_id">
                            <option value="{$prof.module_id}">{$prof.name}</option>
                        </select>
                        {/foreach}
                    </div>

                    <button type="submit" class="button"><i class="zmdi zmdi-upload"></i> Импортировать</button>
                    {/if}
                </form>
            </td>
            <td>{$item.size}</td>
            <td>{$item.time}</td>
            <td class="tac">
                <a href="#" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить файл?')" data-no-instant></a>
            </td>
        </tr>
    {/foreach}
    </tbody>
</table>
{else}
<div class="apply">
    Импорт данных не настроен <a href="/{$ADMIN_DIR}/import/settings">настроить</a>
</div>
{/if}


{*
<ul class="tabs clearfix">
    <li><a href="/{$ADMIN_DIR}/import/export/1c/" class="tab{if isset($type ) && $type == '1c'} current{/if}">Обмен данными с 1С</a></li>
    <li><a href="/{$ADMIN_DIR}/import/export/xls/" class="tab{if isset($type ) && $type == 'xls'} current{/if}">Импорт из *.xls</a></li>
</ul>

{if isset($type )}
<form method="post" enctype="multipart/form-data">
    {if $type == '1c'}
        <div class="apply notice">
            Последний обмен данными был выполен<br><b>12.12.2013</b> 23:48
        </div>
        
        {include file="system/controll.tpl"
            type        =   "radio"
            name        =   "source"
            checked     =   true
            value       =   "xml"
            text        =   "Загрузка XML-файлов"
        }
        
        {include file="system/controll.tpl"
            type        =   "radio"
            name        =   "source"
            value       =   "ftp"
            text        =   "Загрузка из папки"
        }
        
        <div class="mb10">
            <h3>Загрузка XML-файлов</h3>
        </div>
        
        <p>файл import.xml</p>
        <div class="upload-block clearfix">
            <input type="file" name="import" class="w50">
            <span class="file_loading"><img src="/{$ADMIN_DIR}/images/preloader-64.gif" width="32" height="32" alt="загрузка"></span>
        </div>
        
        <p>файл offers.xml</p>
        <div class="upload-block clearfix">
            <input type="file" name="offers" class="w50">
            <span class="file_loading"><img src="/{$ADMIN_DIR}/images/preloader-64.gif" width="32" height="32" alt="загрузка"></span>
        </div>
        
        <h3>Загрузка из папки FTP</h3>
        <div class="apply">
            Положите файлы в папку <b>/exchange/import/</b>
        </div>
        
        <button type="submit" class="button button-green"><i class="zmdi zmdi-file"></i> Загрузить</button>
    {elseif $type == 'xls'}
        <div class="apply notice">
            Последний обмен данными был выполен<br><b>12.12.2013</b> 23:48
        </div>

        <input type="hidden" name="action" value="update">
        
        <div class="mb10">
            <h3>Загрузка XLS-файла</h3>
        </div>

        <div class="upload-block clearfix">
            <input type="file" name="file" class="w50">
            <span class="file_loading"><img src="/{$ADMIN_DIR}/images/preloader-64.gif" width="32" height="32" alt="загрузка"></span>
        </div>
        
        {include file="system/controll.tpl"
            type        =   "radio"
            name        =   "source"
            value       =   "add"
            text        =   "Добавить к каталогу"
        }
        
        {include file="system/controll.tpl"
            type        =   "radio"
            name        =   "source"
            checked     =   true
            value       =   "update"
            text        =   "Обновить каталог"
        }
        
        <button type="submit" class="button button-green"><i class="zmdi zmdi-check-square"></i> Импортировать файл</button>
    {/if}
</form>
{/if}
*}
{/strip}