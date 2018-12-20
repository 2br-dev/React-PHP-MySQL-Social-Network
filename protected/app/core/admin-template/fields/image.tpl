{strip}
<!-- Fine Uploader Thumbnails template w/ customization
====================================================================== -->
<script>
    initialFiles['{$value}']={if isset($json)}{$json}{else}[]{/if};
</script>

<script type="text/template" id="upload-template">

    <div class="qq-uploader-selector qq-uploader" qq-drop-area-text="Drop files here">
        <div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container">
            <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar"></div>
        </div>

        <div class="qq-upload-drop-area-selector qq-upload-drop-area" qq-hide-dropzone>
            <span class="qq-upload-drop-area-text-selector"></span>
        </div>
		
		<div class="attachments__selector">
			<i class="attachments__selector__icon zmdi zmdi-attachment-alt"></i> Перетащите {if isset($settings.f_file_count) && $settings.f_file_count == 1}изображение{else}изображения{/if} сюда или <a class="attachments__selector__link qq-upload-button-selector qq-upload-button" id="dropzone-{$name}-target" tabindex="-1">выберите ...</a>
		</div>

        <span class="qq-drop-processing-selector qq-drop-processing">
            <span class="qq-drop-processing-spinner-selector qq-drop-processing-spinner"></span>
        </span>

        <ul class="attachments-list qq-upload-list-selector qq-upload-list" aria-live="polite" aria-relevant="additions removals">
            <li class="attachments-list__item">
				<div class="attachments-file clearfix">
	                {* <button type="button" class="qq-btn qq-upload-cancel-selector qq-upload-cancel">Cancel</button> *}
	                {* <button type="button" class="qq-btn qq-upload-retry-selector qq-upload-retry">Retry</button> *}

					<div class="attachments-file__control">
						<button type="button" class="attachments-file__control__link is-delete qq-upload-delete-selector qq-upload-delete">
                            <i class="zmdi zmdi-delete" aria-label="Delete"></i>
                        </button>

						<button type="button" class="attachments-file__control__link is-edit" onclick="return editOrd({$e.id}, {$e.ord})" title="Редактировать порядок">
							<i class="zmdi zmdi-edit"></i>
						</button>

						<button type="button" class="attachments-file__control__link is-visible" onclick="return editVisible({$e.id}, {$e.visible})">
							<i class="zmdi zmdi-eye{if $e.visible == 0}-off{/if}" id="fvisible_{$e.id}"></i>
						</button>
						
					</div>

					<div class="qq-progress-bar-container-selector attachments-file__progress progress progress-xss active no-radius">
	                    <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="progress-bar progress-bar-success qq-progress-bar-selector qq-progress-bar"></div>
	                </div>

					<div class="attachments-file__preview">
						<img src="/cp/images/ff/file.svg" class="attachments-file__preview__ico qq-thumbnail-selector" qq-max-size="100" qq-server-scale alt="">
					</div>

					<div class="attachments-file__content">
						<div class="attachments-file__name">
							<i class="zmdi zmdi-edit"></i> <span class="attachments-file__name__title qq-upload-file-selector qq-upload-file" title="Редактировать alt | title"></span>
						</div>

						<div class="attachments-file__date-size qq-upload-size-selector qq-upload-size"></div>
					</div>
				</div>
			</li>
        </ul>

        <dialog class="qq-alert-dialog-selector">
            <div class="qq-dialog-message-selector"></div>
            <div class="qq-dialog-buttons">
                <button type="button" class="qq-cancel-button-selector">Close</button>
            </div>
        </dialog>

        <dialog class="qq-confirm-dialog-selector">
            <div class="qq-dialog-message-selector"></div>
            <div class="qq-dialog-buttons">
                <button type="button" class="qq-cancel-button-selector">No</button>
                <button type="button" class="qq-ok-button-selector">Yes</button>
            </div>
        </dialog>

        <dialog class="qq-prompt-dialog-selector">
            <div class="qq-dialog-message-selector"></div>
            <input type="text">
            <div class="qq-dialog-buttons">
                <button type="button" class="qq-cancel-button-selector">Cancel</button>
                <button type="button" class="qq-ok-button-selector">Ok</button>
            </div>
        </dialog>
    </div>
</script>

<!-- Fine Uploader DOM Element
====================================================================== -->
<div class="attachments js-fileupload">
	<input type="hidden" name="{$name}" value="{$value|escape}" class="js-fileupload-group">
	<input type="hidden" name="settings[{$name}]" value="{if isset($settings.json)}{$settings.json|escape}{/if}" class="js-fileupload-settings">
	<input type="hidden" name="count[{$name}]" value="{if isset($settings.f_file_count)}{$settings.f_file_count}{/if}" class="js-fileupload-count">
    <input type="file" {if isset($settings.f_file_count) && $settings.f_file_count == 1}name="files_{$name}[]" multiple{else}name="files_{$name}"{/if} class="attachments__field">

	<div class="attachments__uploader js-fileupload-control" id="uploads-{$name}"{if $action} data-action="/{$ADMIN_DIR}/{$action}"{/if}>
		<ul class="attachments-list qq-upload-list-selector qq-upload-list" aria-live="polite" aria-relevant="additions removals"></ul>
	</div>
</div>
{/strip}