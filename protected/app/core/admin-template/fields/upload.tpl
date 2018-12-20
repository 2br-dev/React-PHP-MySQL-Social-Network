{strip}
<input type="hidden" name="{$name}" value="{$value|escape}">

<label class="file--upload">
    <div class="file--upload-placehoder">Прикрепить файл{if $count == 1}ы{/if}</div>
    <div class="file--upload-button">Обзор</div>
    <input type="file" accept="*" onchange="cp.fileChange(this)" {if $count == 1}name="{$name}[]" multiple{else}name="{$name}"{/if} data-url="/{$ADMIN_DIR}/templates/js/upload/upload.php" id="fileupload_input_{$name}">
</label>
{/strip}