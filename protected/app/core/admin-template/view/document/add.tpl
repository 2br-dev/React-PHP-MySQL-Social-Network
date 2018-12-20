{strip}
<form method="post" enctype="multipart/form-data">
    <input type="hidden" name="action" value="add">
    
    <table class="table">
        <col width="200">
        <col>
        <thead>
            <tr>
                <th colspan="2">Добавление группы документа</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h">Название группы:</td>
                <td>
                    <input name="name">
                </td>
            </tr>
            <tr>
                <td class="h">Ключ:</td>
                <td>
                    <input name="key">
                </td>
            </tr>
            <tr>
                <td class="h">Документы:</td>
                <td>
                    <div id="file_docs" class="clearfix">
                        <input type="hidden" name="docs" value="docs_{$time}">
                        
                        <div class="upload-block clearfix">
                            <input type="file" name="fileToUpload" class="w50" id="docs">
                            <span class="file_loading"><img src="/{$ADMIN_DIR}/images/preloader-64.gif" width="32" height="32" alt="загрузка"></span>
                        </div>
                        
                        <button class="button button-green" onclick="return ajaxFileDocsUpload('docs_{$time}')"><i class="zmdi zmdi-save"></i> Закачать</button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    
    {include file="system/buttons.tpl"}
</form>
{/strip}