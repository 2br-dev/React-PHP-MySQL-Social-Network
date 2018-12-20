{strip}
{*
<ul class="thumbnails">
    <li class="span3 tile tile-treeple tile-light">
        <div class="google-logo seo-logo">
            Хосты: 100<br>
            Визиты: 100<br>
            Просмотры: 100<br><br>
            <button class="button button-blue">Посмотреть статистику</button>
        </div>
    </li>
    <li class="span3 tile tile-treeple tile-yellow">
        <div class="yandex-logo seo-logo">
            <div id="ym-uniques">
                <img src="/{$ADMIN_DIR}/images/preloader.gif" width="32" height="32" alt="">
            </div>
            <script type="text/javascript">
            {literal}
                $.get('http://bs.yandex.ru/informer/25832993/json?callback=?', function(data) {
                    $('#ym-uniques').html('');
                    
                    if (data && typeof(yandex_metrika_json_informer) !== 'undefined')
                    {
                        $('#ym-uniques').append('Дата: ' + yandex_metrika_json_informer.current_date);
                        $('#ym-uniques').append('<br>');
                        $('#ym-uniques').append('Посетителей за сегодня: ' + yandex_metrika_json_informer.uniques);
                        $('#ym-uniques').append('<br>');
                        $('#ym-uniques').append('Просмотров: ' + yandex_metrika_json_informer.pageviews);
                        $('#ym-uniques').append('<br>');
                        $('#ym-uniques').append('Визитов: ' + yandex_metrika_json_informer.visits);
                    }
                });
            {/literal}
            </script>
            <br>
            <button class="button button-green">Посмотреть статистику</button>
        </div>
    </li>
</ul>
*}
{/strip}