{strip}
<div class="slider-conteiner">
    <div id="slider-{$name}" class="js-slider" data-type="{$type}" data-value="{if is_array( $value )}[{$value[0]}, {$value[1]}]{else}{$value}{/if}" data-min="{$settings.f_range.min}" data-max="{$settings.f_range.max}"></div>
    
    <div class="slider-values">
    {if $type == 'range'}
        <input name="{$name}[]" id="slider-{$name}-min" value="{if isset($value[0] )}{$value[0]}{else}{$settings.f_range.min}{/if}">
        <input name="{$name}[]" id="slider-{$name}-max" value="{if isset($value[0] )}{$value[1]}{else}{$settings.f_range.max}{/if}">
    {else}
        <input name="{$name}" id="slider-{$name}-value" value="{$value}">
    {/if}
    </div>
</div>
{/strip}