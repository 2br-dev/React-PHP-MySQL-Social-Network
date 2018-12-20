{strip}
<div class="fullcalendar-container">
    <input name="{$name}" value="{$value|escape}" type="hidden">

    {if $json}
        <script>eventsJson['{$name}'] = {$json};</script>
    {/if}

    <div class="fullcalendar" id="fullcalendar_{$name}" data-name="{$name}"></div>
</div>
{/strip}
