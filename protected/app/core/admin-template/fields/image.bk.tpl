{strip}
<div class="attachments js-fileupload" id="dropzone-{$name}"{if $action} data-action="/{$ADMIN_DIR}/{$action}"{/if}>
	<input type="hidden" name="{$name}" value="{$value|escape}" class="js-fileupload-group">
	<input type="hidden" name="settings[{$name}]" value="{if isset($settings.json)}{$settings.json|escape}{/if}" class="js-fileupload-settings">
	<input type="hidden" name="count[{$name}]" value="{if isset($settings.f_file_count)}{$settings.f_file_count}{/if}" class="js-fileupload-count">

	<div class="dz-message">
		<div class="attachments__error js-dropzone-error"></div>

		<span class="attachments__text">
			<i class="attachments__text__icon zmdi zmdi-attachment-alt"></i> Перетащите {if isset($settings.f_file_count) && $settings.f_file_count == 1}изображение{else}изображения{/if} сюда или <a class="attachments__text__link js-dropzone-target" id="dropzone-{$name}-target" tabindex="-1">выберите ...</a>
		</span>

		<div class="fallback">
	        <input type="file" {if isset($settings.f_file_count) && $settings.f_file_count == 1}name="files_{$name}[]" multiple{else}name="files_{$name}"{/if} class="attachments__field">
	    </div>

		<ul class="attachments__pending ui-sortable js-dropzone-preview" id="dropzone-{$name}-preview">
			{if isset($list) && !empty($list)}
				{foreach from=$list item=e}
				<li class="attachments__pending__item" id="file_photo_{$e.id}">
					<div class="attachments__file clearfix">
						<span class="attachments__file__order" id="ordfile_{$e.id}">{$e.ord}</span>

						<div class="attachments__file__control">
							<a href="" class="attachments__file__control__link" onclick="return Module.ajaxFileDelete({$e.id}, 'file_photo_{$e.id}');" title="Удалить файл" data-no-instant><i class="zmdi zmdi-delete"></i></a>
							<a href="" class="attachments__file__control__link" onclick="return editOrd({$e.id}, {$e.ord})" title="Редактировать порядок"><i class="zmdi zmdi-edit"></i></a>
							<a href="" class="attachments__file__control__link" onclick="return editVisible({$e.id}, {$e.visible})"><i class="zmdi zmdi-eye{if $e.visible == 0}-off{/if}" id="fvisible_{$e.id}"></i></a>
						</div>

						<div class="attachments__file__preview">
							<img src="{if $e.preview}{$e.file}{else}/{$ADMIN_DIR}/images/ff/{$e.extension}.svg{/if}" class="attachments__file__preview__ico" alt="">
						</div>
						
						<div class="attachments__file__content">
							<div class="attachments__file__name">
								<a class="attachments__file__name__title" title="Редактировать alt | title" onclick="return editTitle({$e.id})" id="ftitle_{$e.id}">{$e.title}</a>
							</div>

							<div class="attachments__file__date-size">
								{$e.size}
							</div>
						</div>
					</div>
				</li>
				{/foreach}
			{/if}
		</ul>
	</div>
</div>

<div class="js-dropzone-template dz-preview dz-file-preview" style="display: none;">
   	<li class="attachments__pending__item dz-details">
		<div class="attachments__file clearfix">
			<div class="attachments__progress dz-progress progress progress-xss active no-radius"><span class="dz-upload progress-bar progress-bar-success" data-dz-uploadprogress></span></div>

			<!--
			<div class="attachments__file__control">
				<a href="" class="attachments__file__control__link"><i class="zmdi zmdi-delete"></i></a>
				<a href="" class="attachments__file__control__link"><i class="zmdi zmdi-edit"></i></a>
				<a href="" class="attachments__file__control__link"><i class="zmdi zmdi-eye"></i></a>
			</div>
			-->

			<div class="attachments__file__preview">
				<img data-dz-thumbnail src="/cp/images/ff/file.svg" class="attachments__file__preview__ico" alt="">
			</div>
			
			<div class="attachments__file__content">
				<div class="attachments__file__name dz-filename">
					<span data-dz-name></span>
				</div>
				<div class="attachments__file__date-size">
					<span class="dz-size" data-dz-size></span>
				</div>
			</div>
		</div>
	</li>
	
	{*
	<div class="dz-preview dz-file-preview">
		<div class="dz-details">
			<div class="dz-filename"><span data-dz-name></span></div>
			<div class="dz-size" data-dz-size></div>
			<img data-dz-thumbnail />
		</div>
		<div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
		<div class="dz-success-mark"><span>✔</span></div>
		<div class="dz-error-mark"><span>✘</span></div>
		<div class="dz-error-message"><span data-dz-errormessage></span></div>
	</div>
	*}
</div>
{/strip}