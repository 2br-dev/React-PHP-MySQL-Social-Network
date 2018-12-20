{strip}
{if !isset($editor_type)}
    {assign var="editor_type" value="codemirror"}
{/if}

{if !isset($editor_hightlight)}
    {assign var="editor_hightlight" value="smarty"}
{/if}

<textarea name="{$editor_name}" id="{$editor_id}" class="CodeMirror js-editor" data-editor="{$editor_type}" data-hightlight="{$editor_hightlight}" rows="5" cols="50">{$editor_cont}</textarea>
{/strip}