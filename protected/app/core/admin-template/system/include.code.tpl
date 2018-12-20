<div id="clipsmodal" style="display: none;">
    <section>
        <ul class="redactor_clips_box">
            <li>
                <a href="#" class="redactor_clip_link">Lorem ipsum …</a>
                <div class="redactor_clip" style="display: none;">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>
            </li>
            <li>
                <a href="#" class="redactor_clip_link">Red label</a>
                <div class="redactor_clip" style="display: none;">
                    <span class="label-red">Label</span>
                </div>
            </li>
        </ul>
    </section>

    <footer>
        <a href="#" class="redactor_modal_btn redactor_btn_modal_close">Close</a>
    </footer>
</div>

<div id="alert" class="alert">
    <div id="alert-message" class="alert-message"></div> <a class="alert-close" id="alert-close"></a>
</div>

<script type="text/html" id="tpl_dropdown_menu">
    <div class="popover popover_menu" id="popover-dropdown_menu">
        <span class="popover__triangle"></span>
        <ul class="popover-menu">
            <li><a href="./?cleancache=smarty&backuri={$_backuri}">{t('template.cache')}</a></li>
            <li><a href="./?cleancache=memory&backuri={$_backuri}">{t('data.cache')}</a></li>
            <li class="divider"></li>
            <li><a href="./?cleancache=styles&backuri={$_backuri}">{t('cash.styles')}</a></li>
            <li><a href="./?cleancache=scripts&backuri={$_backuri}">{t('script.cache')}</a></li>
            <li class="divider"></li>
            <li><a href="./?cleancache=config&backuri={$_backuri}">{t('configuration.cache')}</a></li>
            <li><a href="./?cleancache=task&backuri={$_backuri}">{t('task.list')}</a></li>
        </ul>
    </div>
</script>

<script type="text/html" id="tpl_schedule">
    <div class="schedule-popup" id="schedule-popup">
        <form action="{literal}{{action}}{/literal}" method="post" enctype="multipart/form-data">
            <button class="schedule-popup__close j-schedule-popup-close" aria-label="Закрыть">
                <svg class="schedule-popup__close__ico" role="img">
                    <use xlink:href="#close"/>
                </svg>
            </button>

            <header class="schedule-popup__header">
                Добавить элемент
            </header>

            <div class="schedule-popup__body">
                {literal}
                {{#if item}}
                    <input name="item" value="{{item}}" type="hidden">
                {{/if}}

                {{#if id}}
                    <input name="id" value="{{id}}" type="hidden">
                {{/if}}

                {{#if group}}
                <input name="group" value="{{group}}" type="hidden">
                {{/if}}

                {{#if start}}
                <input name="start" value="{{start}}" type="hidden">
                {{/if}}

                {{#if end}}
                <input name="end" value="{{end}}" type="hidden">
                {{/if}}

                <div class="schedule-popup__item">
                    <input name="title" placeholder="Название"{{#if title}} value="{{title}}"{{/if}}>
                </div>

                <div class="schedule-popup__item">
                    <select name="item" placeholder="Занятие">
                        <option value="0"></option>
                        {/literal}
                        {if $meta_select}
                            {foreach $meta_select as $item}
                            <option value="{$item.id}"{literal}{{#js_if "this.item == {/literal}{$item.id}{literal}"}} selected{{/js_if}}{/literal}>{$item.name}</option>
                            {/foreach}
                        {/if}
                        {literal}
                    </select>
                </div>

                <div class="schedule-popup__item">
                    <input name="color" placeholder="Цвет" class="jscolor"{{#if color}} value="{{color}}"{{/if}}>
                </div>

                <div class="schedule-popup__item">
                    <select name="types[]" placeholder="Рекомендации" multiple>
                        <option value="men"{{#js_if "this.types && this.types.indexOf('men') >= 0"}} selected{{/js_if}}>Рекомендованно мужчинам</option>
                        <option value="teen"{{#js_if "this.types && this.types.indexOf('teen') >= 0"}} selected{{/js_if}}>Рекомендованно подросткам</option>
                        <option value="record"{{#js_if "this.types && this.types.indexOf('record') >= 0"}} selected{{/js_if}}>Предварительная запись</option>
                        <option value="popular"{{#js_if "this.types && this.types.indexOf('popular') >= 0"}} selected{{/js_if}}>Популярное занятие</option>
                    </select>
                </div>

                <div class="schedule-popup__item">
                    <input name="extra" placeholder="Помещение"{{#if extra}} value="{{extra}}"{{/if}}>
                </div>

                <div class="schedule-popup__item">
                    <div class="group">
                        <label class="group__item">
                            <input type="radio" class="group__item__rb" name="visible" value="1"{{#js_if "this.visible === '1' || this.visible !== '0'"}} checked{{/js_if}}>
                            <span class="group__item__style"></span>
                            <span class="group__item__text">Активен</span>
                        </label>

                        <label class="group__item">
                            <input type="radio" class="group__item__rb" name="visible" value="0"{{#js_if "this.visible === '0'"}} checked{{/js_if}}>
                            <span class="group__item__style"></span>
                            <span class="group__item__text">Неактивен</span>
                        </label>
                    </div>

                    {{#if id}}
                    <button type="button" data-event="{{id}}" class="schedule-popup__remove j-remove-event">Удалить</button>
                    {{/if}}
                </div>
                {/literal}
            </div>

            <footer class="schedule-popup__footer">
                <button type="submit" class="button is-save">
                    <i class="zmdi zmdi-save"></i>Сохранить и закрыть
                </button>

                <button type="reset" class="button j-schedule-popup-close">
                    Отменить
                </button>
            </footer>
        </form>
    </div>
</script>

{literal}
<script type="text/html" id="tpl_image_row">
<tr data-index="{{index}}">
    <td class="va_m"><input name="f_image_prefix[{{iteration}}][{{index}}]" class="latin ness tac" value="" maxlength="7"></td>
    <td class="va_t"><input name="f_image_width[{{iteration}}][{{index}}]" class="integer" value="0"></td>
    <td class="va_t"><input name="f_image_height[{{iteration}}][{{index}}]" class="integer" value="0"></td>
    <td class="va_t">
        <div class="option-group option-combo option-simple simple">
            <label title="Crop image"><input type="radio" name="f_image_photo_method[{{iteration}}][{{index}}]" value="crop"><span class="option"><i class="zmdi zmdi-crop-free"></i></span></label>
            <label title="Resize image"><input type="radio" name="f_image_photo_method[{{iteration}}][{{index}}]" value="resize" checked><span class="option"><i class="zmdi zmdi-photo-size-select-large"></i></span></label>
        </div>
    </td>
    <td class="va_m">
        {{#button}}
        <a href="#" class="js-size-delete"><i class="zmdi zmdi-delete"></i></a>
        {{/button}}
    </td>
</tr>
</script>
{/literal}