{if !isset($redactor_type )}
    {assign var="redactor_type" value="imperavi"}
{/if}

{if $redactor_type == 'quill'}
<div id="{$redactor_id}-container" class="quill-container">{$redactor_value|stripslashes}</div>
{/if}

<textarea name="{$redactor_name}" id="{$redactor_id}" class="redactor_{$redactor_type} js-redactor" data-redactor="{$redactor_type}" style="min-height: 150px" rows="5" cols="50">{$redactor_value|stripslashes}</textarea>

{** include file="redactor/$redactor_type.tpl" redactor=$redactor_id **}