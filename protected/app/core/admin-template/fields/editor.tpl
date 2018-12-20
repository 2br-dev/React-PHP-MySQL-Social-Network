{if isset($settings.f_editor_mode )}
    {assign var="mode" value=$settings.f_editor_mode}
{else}
    {assign var="mode" value="php"}
{/if}

{include file="system/editor.tpl"
	editor_type       =   $settings.f_editor
	editor_id         =   $name
	editor_name       =   $name
	editor_value      =   $value
	editor_cont       =   $value
	editor_hightlight =   $mode
}