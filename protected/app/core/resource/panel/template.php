<?php

return function($sql = 0, $log = [], $backuri = '', $page = [], $includes = 0, $memory_peak = 0, $memory_usage = 0, $time = 0) {

    $link = '/'.ADMIN_DIR;

    if (isset($page['id']) && $page['id'] !== 0) {
        $link .= '/structure/index/edit/'.$page['id'];
    }

    if (isset($page['sys_name'])) {
        $link .= '/'.$page['sys_name'];
    }

    $code = '';

    if (!empty($_SESSION['sql_log'])) {
        $logs = $_SESSION['sql_log'];

        foreach ($logs as $item) {

            if (!empty($item))
            {
                $times = array_values($item);
                $queries = array_keys($item);

                ksort($times);

                foreach ($times as $index => $query_time) {
                    $code .= '<div class="fp-debugger__query">';
                    $code .= '<div class="fp-debugger__query__time">' . $query_time . '</div>';
                    $code .= '<div class="fp-debugger__query__sql">' . $queries[$index] . '</div>';
                    $code .= '</div>';
                }
            }
        }
    }

    echo '
        <div class="fp-panel" id="fp-panel">
            <div class="fp-panel__group">
                <button type="button" class="fp-panel__btn fp-panel__btn--menu">Меню</button>

                <a href="'.$link.'" class="fp-panel__btn" target="_blank" rel="noopener noreferrer">Администрирование</a>

                <div class="fp-dropdown">
                    <button type="button" class="fp-panel__btn fp-panel__btn--dropdown j-panel-ajax-link" data-action="clearcache/all">Сбросить кеш</button>

                    <div class="fp-dropdown__hidden">
                        <ul class="fp-dropdown__list">
                            <li class="fp-dropdown__list__item"><button type="button" class="fp-dropdown__list__item__link j-panel-ajax-link" data-action="clearcache/template">Кеш шаблонов</button></li>
                            <li class="fp-dropdown__list__item"><button type="button" class="fp-dropdown__list__item__link j-panel-ajax-link" data-action="clearcache/data">Кеш данных</button></li>
                            <li class="fp-dropdown__list__item"><button type="button" class="fp-dropdown__list__item__link j-panel-ajax-link" data-action="clearcache/styles">Кеш стилей</button></li>
                            <li class="fp-dropdown__list__item"><button type="button" class="fp-dropdown__list__item__link j-panel-ajax-link" data-action="clearcache/scripts">Кеш скриптов</button></li>
                            <li class="fp-dropdown__list__item"><button type="button" class="fp-dropdown__list__item__link j-panel-ajax-link" data-action="clearcache/config">Кеш конфигурации</button></li>
                            <li class="fp-dropdown__list__item"><button type="button" class="fp-dropdown__list__item__link j-panel-ajax-link" data-action="clearcache/task">Список задач</button></li>
                            <li class="fp-dropdown__list__divider"></li>
                            <li class="fp-dropdown__list__item">
                                <button type="button" class="fp-dropdown__list__item__link j-panel-ajax-link" data-action="' . (ENABLECACHE ? 'disable' : 'enable') . '/cache">' . (ENABLECACHE ? 'Не использовать кеш' : 'Включить кеш') . '</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="fp-panel__aside">
                <label class="fp-switch">
                    <span class="fp-switch__checkbox">
                        <input type="checkbox" class="fp-switch__checkbox__input">
                        <span class="fp-switch__checkbox__background"></span>
                        <span class="fp-switch__checkbox__handle"></span>
                    </span>

                    <span class="fp-switch__label">Режим правки</span>
                </label>

                <button type="button" class="fp-panel__btn fp-panel__btn--fixed j-panel-fixed-link"></button>
            </div>
        </div>
        <div class="fp-debugger">
            <div class="fp-debugger__logger" id="fp-debugger-logger">
                <pre>' . $code . '</pre>
            </div>
            <div class="fp-debugger__group">
                <span class="fp-debugger__log" style="background: #d666af;">' . $sql . ' sql.</span>
                <span class="fp-debugger__log" style="background: #cbc457;">' . $includes . ' Inc. files</span>
                <span class="fp-debugger__log" style="background: #6379b7;">' . $memory_peak . ' Mb.</span>
                <span class="fp-debugger__log" style="background: #e5752b;">' . $memory_usage . ' Mb' . PHP_EOL . '</span>
                <span class="fp-debugger__log" style="background: #6ab755;">' . $time . ' S.</span>
            </div>

            <button type="button" class="fp-panel__btn fp-panel__btn-small" id="fp-debugger-toggle-log">LOG</button>
        </div>
    ';
};


// <a href="/bitrix/admin/user_edit.php?lang=ru&amp;ID=2" id="bx-panel-user" onmouseover="BX.hint(this)">
// <span id="bx-panel-user-icon"></span><span id="bx-panel-user-text">forma</span></a>
// <a href="/gruppovye-trenirovki/silovye-programmy/?logout=yes&amp;code=silovye-programmy" id="bx-panel-logout" onmouseover="BX.hint(this)">Выйти</a>
// <a href="/gruppovye-trenirovki/silovye-programmy/?bitrix_include_areas=Y&amp;code=silovye-programmy" id="bx-panel-toggle" class="bx-panel-toggle-off" onmouseover="BX.hint(this)">
// <span id="bx-panel-switcher-gutter-left"></span>
// <span id="bx-panel-toggle-indicator">
// <span id="bx-panel-toggle-icon"></span>
// <span id="bx-panel-toggle-icon-overlay"></span>
// </span><span class="bx-panel-break"></span>
// <span id="bx-panel-toggle-caption">Режим правки</span>
// <span class="bx-panel-break"></span>
// <span id="bx-panel-toggle-caption-mode">
// <span id="bx-panel-toggle-caption-mode-off">выключен</span>
// <span id="bx-panel-toggle-caption-mode-on">включен</span>
// </span><span id="bx-panel-switcher-gutter-right"></span>
// </a>
// <a href="" id="bx-panel-expander" onmouseover="BX.hint(this)">
//     <span id="bx-panel-expander-text">Развернуть</span>
//     <span id="bx-panel-expander-arrow"></span>
// </a>
// <a id="bx-panel-hotkeys" href="javascript:void(0)" onclick="BXHotKeys.ShowSettings();" onmouseover="BX.hint(this)"></a>
// <a href="javascript:void(0)" id="bx-panel-pin" onmouseover="BX.hint(this)" class="bx-panel-pin-fixed"></a>

// <span class="cmsDebug-wrap">
//     <span class="cmsDebug" style="background: #d666af;">' . $sql . ' sql.</span>
//     <span class="cmsDebug" style="background: #cbc457;">' . $includes . ' Inc. files</span>
//     <span class="cmsDebug" style="background: #6379b7;">' . $memory_peak . ' Mb.</span>
//     <span class="cmsDebug" style="background: #e5752b;">' . $memory_usage . ' Mb' . PHP_EOL . '</span>
//     <span class="cmsDebug" style="background: #6ab755;">' . $time . ' S.</span>
// </span>

// <div class="debugger" id="debugger">
//     <button type="button" class="debugger__button" onclick="return FP.toggle()">SQL LOG</button>
//     <pre class="debugger__code">' . print_r(!empty($log) ? $log : []) . '</pre>
// </div>