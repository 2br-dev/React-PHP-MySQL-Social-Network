{strip}
{if isset($smarty.get.msg ) && $smarty.get.msg == "apply"}
<div class="apply">Данные были успешно сохранены!</div>
{/if}

<form method="post" enctype="multipart/form-data">
    <input type="hidden" name="action" value="edit" />
    <input type="hidden" name="back_to_page" value="{if isset($smarty.get.back_to_page)}{$smarty.get.back_to_page}{else}0{/if}" />

    <table class="table">
        <col width="200">
        <col>
        <thead>
            <tr>
                <th colspan="2">Редактирование группы документа</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h">Название группы:</td>
                <td>
                    <input name="name" value="{$docs_item.title}">
                </td>
            </tr>
            <tr>
                <td class="h">Ключ:</td>
                <td>
                    <input name="key" value="{$docs_item.key}">
                </td>
            </tr>
            <tr>
                <td class="h">Показать группу:</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "visible"
                        check   = $docs_item.visible
                        list    = [
                            [ value => '1', text => "Да", default => true ],
                            [ value => '0', text => "Нет" ]
                        ]
                    }
                </td>
            </tr>

            {if isset($docs_item.docs ) && !empty( $docs_item.docs )}
            <tr>
                <td colspan="2" class="editor-row">
                    <table class="table" id="meta_data">
                        <thead>
                            <tr>
                                <th colspan="3">Документы в группе</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="h">Документ</td>
                                <td class="h">Порядок</td>
                                <td class="h"></td>
                            </tr>
                            {foreach item=docs from=$docs_item.docs name=i}
                            <tr id="docs_{$docs.id}">
                                <td class="title_f">{$docs.title}</td>
                                <td class="ord_f">{$docs.ord}</td>
                                <td class="tacs">
                                    <a href="#" class="zmdi zmdi-save" title="Записать" onclick="return SaveDocs({$docs.id})"></a>
                                    <a href="#" class="zmdi zmdi-edit" title="Редактировать" onclick="return EditDocs({$docs.id})"></a>
                                    <a href="#" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return DelDocs({$docs.id})"></a>
                                </td>
                            </tr>
                            {/foreach}
                        </tbody>
                    </table>
                </td>
            </tr>
            {/if}
            <tr>
                <td class="h r nowrap">Добавить документы:</td>
                <td>
                    <div id="file_docs" class="file-list clearfix">
                        <input type="hidden" name="docs" value="{$docs_item.group_name}">
                        <div class="upload-block clearfix">
                            <input type="file" name="fileToUpload" class="w50" id="docs">
                            <span class="file_loading"><img src="/{$ADMIN_DIR}/images/preloader-64.gif" width="32" height="32" alt="загрузка"></span>
                        </div>
                        <button class="button button-green" onclick="return ajaxFileDocsUpload('{$docs_item.group_name}')"><i class="zmdi zmdi-save"></i> Закачать</button>
                    </div>
                    
                    <a href="/{$ADMIN_DIR}/image_import/?act=read{if isset($docs_item.id )}&field_id={$docs_item.id}{/if}&group_id={$docs_item.group_name}"><i class="zmdi zmdi-paperclip"></i> Пакетный импорт файлов</a>
                </td>
            </tr>
            <tr>
                <td class="h">Группа создана:</td>
                <td>{$docs_item.created}</td>
            </tr>
        </tbody>
    </table>
    
    {include file="system/buttons.tpl"}
</form>
{/strip}