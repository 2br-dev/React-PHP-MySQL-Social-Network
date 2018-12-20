{strip}
<table class="table bg-white b-a" id="uploaded_files_list_{$name}">
     <colgroup>
        <col>
        <col width="10%">
        <col width="10%">
        <col width="10%">
    </colgroup>
    <thead>
        <tr>
            <th width="50%">Файл</th>
            <th>Размер</th>
            {*
            <th>Прогресс</th>
            <th>Статус</th>
            *}
            <th>Порядок</th>
            <th>Действия</th>
        </tr>
    </thead>
    <tbody>
    {if isset($list) && !empty($list)}
        {foreach from=$list item=e}
        <tr id="file_photo_{$e.id}">
            <td><a class="upload-gallery-edit" title="Редактировать наименование" onclick="return editTitle({$e.id}, '{$e.title|escape}')" href="#"><i class="zmdi zmdi-edit"></i></a> <a href="{$e.file}" target="_blank" id="ftitle_{$e.id}">{$e.title}</a></td>
            <td>{$e.size}</td>
            <td>
                <a style="float:left;margin: 0 5px 0 0;" title="Редактировать порядок" onclick="return editOrd({$e.id}, '{$e.ord}')" href="#"><i class="zmdi zmdi-edit"></i></a> <span id="ordfile_{$e.id}">{$e.ord}</span>
            </td>
            <td>
                <button type="button" class="btn btn-default btn-xs" onclick="return Module.ajaxFileDelete({$e.id}, 'file_photo_{$e.id}');" href="#" data-no-instant>Удалить</button>
            </td>
        </tr>
        {/foreach}
    {else}
        <tr>
            <td colspan="4" class="center-middle">
                Файл{if isset($settings.f_file_count) && $settings.f_file_count == 1}ы{/if} не загружен{if isset($settings.f_file_count) && $settings.f_file_count == 1}ы{/if}
            </td>
        </tr>
    {/if}
    </tbody>
</table>

{include file="fields/upload.tpl"
    name    =   $name
    value   =   $value
    count   =   $settings.f_file_count
}

{*
<input type="hidden" name="{$name}" value="{$value|escape}">

<label class="file--upload">
    <div class="file--upload-placehoder">Прикрепить файл{if isset($settings.f_file_count) && $settings.f_file_count == 1}ы{/if}</div>
    <div class="file--upload-button">Обзор</div>
    <input type="file" accept="*" onchange="cp.fileChange(this)" {if isset($settings.f_file_count) && $settings.f_file_count == 1}name="{$name}[]" multiple{else}name="{$name}"{/if} data-url="/{$ADMIN_DIR}/templates/js/upload/upload.php" id="fileupload_input_{$name}">
</label>
*}
{/strip}