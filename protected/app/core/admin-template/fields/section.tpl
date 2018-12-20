{strip}
{if isset($list ) && !empty( $list )}
    {foreach from=$list item=li name=section}
        <div style="{if !$smarty.foreach.section.last}margin-bottom: 10px;{/if}clear: both;" class="clearfix" id="section-{$name}-item-{$li.value}">
            <a data-no-instant onclick="return removeSection('#section-{$name}-value', event, {$li.value}, '#section-{$name}-item-{$li.value}');" title="Удалить" class="zmdi zmdi-delete remove-trigger" style="float: left" href="#"></a>
            <div style="margin-left: 20px; line-height: 18px; vertical-align: middle;">{$li.var}</div>
        </div>
    {/foreach}
{else}
    <p>Значений нет</p>
{/if}

<input type="hidden" name="{$name}" value="{$value|escape}" class="{$class_name}" tabindex="{$index}" id="section-{$name}-value">
{/strip}