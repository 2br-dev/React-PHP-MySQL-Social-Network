{strip}
{assign var="weeks_name" value=[ "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс" ]}

<div class="timeline clearfix">
    <div class="timeline-header clearfix">
        {section name=timeline start=0 loop=7 step=1}
        <div class="timeline-item{if $smarty.section.timeline.index == 6} timeline-item-last{/if}">{$weeks_name[$smarty.section.timeline.index]}</div>
        {/section}
    </div>

    <div class="timeline-wrapper clearfix">
        {section name=timeline start=1 loop=8 step=1}
            <div class="timeline-item{if $smarty.section.timeline.index == 6} timeline-item-last{/if}">
                <div class="timeline-slider">
                    <div id="slider-{$smarty.section.timeline.index}"></div>

                    <div class="timeline-slider-min">
                        <input name="{$name}[min][{$smarty.section.timeline.index}]" id="slider-{$smarty.section.timeline.index}-min" value="{if isset($value[$smarty.section.timeline.index].min)}{$value[$smarty.section.timeline.index].min}{else}0{/if}" readonly>
                    </div>
                    <div class="timeline-slider-max">
                        <input name="{$name}[max][{$smarty.section.timeline.index}]" id="slider-{$smarty.section.timeline.index}-max" value="{if isset($value[$smarty.section.timeline.index].max)}{$value[$smarty.section.timeline.index].max}{else}23{/if}" readonly>
                    </div>
                </div>

                <script>
                    slider('#slider-{$smarty.section.timeline.index}', 'range', [{if isset($value[$smarty.section.timeline.index].min)}{$value[$smarty.section.timeline.index].min}{else}0{/if}, {if isset($value[$smarty.section.timeline.index].max)}{$value[$smarty.section.timeline.index].max}{else}23{/if}], 0, 23, 'vertical');
                </script>
            </div>
        {/section}
    </div>
</div>
{/strip}