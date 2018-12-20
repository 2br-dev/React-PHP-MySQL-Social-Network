{literal}
<style>
	.cpanel {
		width: 100%;
		z-index: 10000;
		background-color: #383a3e;
	    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
		position: relative;
		padding: 10px 90px;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		font-size: 0;
		margin-bottom: 5px;
	    
	    /*
	    position: fixed;
		top: 0;
		left: 0;
		right: 0;
		*/
	}
	
	.cpanel__menu {
		width: 80px;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		background-color: #557de2;
	}

	.cpanel__button {
		float: left;
	}

	.cpanel__clearfix {
		clear: both;
	}

	.btn,
	.btn:hover {
	    display: inline-block;
	    padding: 6px 12px;
	    font-size: 14px;
	    line-height: 1.42857143;
	    text-align: center;
	    white-space: nowrap;
	    vertical-align: middle;
	    cursor: pointer;
	    background-image: none;
	    border: 1px solid transparent;
	    font-weight: 500;
	    border-radius: 3px;
	    outline: 0!important;
	    box-shadow: 0 1px 1px rgba(90,90,90,0.1);
	    color: #fff!important;
	    background-color: #3f51b5;
	    border-color: #3f51b5;

	    -webkit-user-select: none;
	    -moz-user-select: none;
	    -ms-user-select: none;
	    user-select: none;
    	-webkit-appearance: button;
	    -ms-touch-action: manipulation;
	    touch-action: manipulation;
	}
</style>
{/literal}

<div class="cpanel">
	<div class="cpanel__menu"></div>

	<div class="cpanel__button">
		<button class="btn">Очистить кеш</button>
	</div>

	<div class="cpanel__clearfix"></div>
</div>

{*

http://take.ms/hYPQs

<div id="bx-panel" class="bx-unselectable bx-panel-folded" unselectable="on">
	<div id="bx-panel-top">
		<div id="bx-panel-top-gutter">
		</div>
		<div id="bx-panel-tabs">
			<a id="bx-panel-menu" href="" onmouseover="BX.hint(this, 'Меню', 'Быстрый переход на любую страницу Административной части.')"><span id="bx-panel-menu-icon"></span><span id="bx-panel-menu-text">Меню</span></a><a id="bx-panel-view-tab"><span>Сайт</span></a><a id="bx-panel-admin-tab" href="/bitrix/admin/index.php?lang=ru&amp;back_url_pub=%2F%3Ffinish%3D"><span>Администрирование</span></a>
			<script type="text/javascript">BX.message({MENU_ENABLE_TOOLTIP: true}); new BX.COpener({'DIV':'bx-panel-menu','ACTIVE_CLASS':'bx-pressed','MENU_URL':'/bitrix/admin/get_start_menu.php?lang=ru&back_url_pub=%2F%3Ffinish%3D&sessid=0cea7ebf6179b76856b53a98ff4aaf0f','MENU_PRELOAD':false});</script>
			<script type="text/javascript"> BXHotKeys.Add("", "var d=BX(\"bx-panel-menu\"); if (d) d.click();", 91, 'Меню', 0); </script>
			<script type="text/javascript"> BXHotKeys.Add("", "var d=BX(\'bx-panel-admin-tab\'); if (d) location.href = d.href;", 92, 'Администрирование', 0); </script>
			<a class="adm-header-notif-block" id="adm-header-notif-block" onclick="return BX.adminInformer.Toggle(this);" href="" title="Просмотр уведомлений"><span class="adm-header-notif-icon"></span><span id="adm-header-notif-counter" class="adm-header-notif-counter">2</span></a><a id="bx-panel-clear-cache" href="" onclick="BX.clearCache(); return false;"><span id="bx-panel-clear-cache-icon"></span><span id="bx-panel-clear-cache-text">Сбросить кеш</span></a>
		</div>
		<div id="bx-panel-userinfo">
			<a href="/bitrix/admin/user_edit.php?lang=ru&amp;ID=1" id="bx-panel-user" onmouseover="BX.hint(this, 'Быстрый переход на страницу редактирования параметров пользователя.')"><span id="bx-panel-user-icon"></span><span id="bx-panel-user-text">admin</span></a><a href="/?logout=yes&amp;finish=" id="bx-panel-logout" onmouseover="BX.hint(this, 'Выход пользователя из системы. (&amp;nbsp;Ctrl+Alt+O&amp;nbsp;) ')">Выйти</a><a href="/?bitrix_include_areas=Y&amp;finish=" id="bx-panel-toggle" class="bx-panel-toggle-off" onmouseover="BX.hint(this, 'Режим правки', 'Включение режима контекстного редактирования сайта. При включенном режиме наведите курсор на выбранный блок информации и используйте всплывающие панели инструментов. (&amp;nbsp;Ctrl+Alt+D&amp;nbsp;) ')"><span id="bx-panel-switcher-gutter-left"></span><span id="bx-panel-toggle-indicator"><span id="bx-panel-toggle-icon"></span><span id="bx-panel-toggle-icon-overlay"></span></span><span class="bx-panel-break"></span><span id="bx-panel-toggle-caption">Режим правки</span><span class="bx-panel-break"></span><span id="bx-panel-toggle-caption-mode"><span id="bx-panel-toggle-caption-mode-off">выключен</span><span id="bx-panel-toggle-caption-mode-on">включен</span></span><span id="bx-panel-switcher-gutter-right"></span></a><a href="" id="bx-panel-expander" onmouseover="BX.hint(this, 'Развернуть', 'Развернуть Панель управления. (&amp;nbsp;Ctrl+Alt+E&amp;nbsp;) ')"><span id="bx-panel-expander-text">Развернуть</span><span id="bx-panel-expander-arrow"></span></a><a id="bx-panel-hotkeys" href="javascript:void(0)" onclick="BXHotKeys.ShowSettings();" onmouseover="BX.hint(this, 'Настройки горячих клавиш (&amp;nbsp;Ctrl+Alt+P&amp;nbsp;) ')"></a><a href="javascript:void(0)" id="bx-panel-pin" onmouseover="BX.hint(this, 'Фиксация Панели управления в верхней части экрана.')"></a>
			<script type="text/javascript"> BXHotKeys.Add("Ctrl+Alt+79", "var d=BX(\'bx-panel-logout\'); if (d) location.href = d.href;", 133, 'Выход пользователя из системы.', 19); </script>
			<script type="text/javascript"> BXHotKeys.Add("Ctrl+Alt+68", "location.href=\"/?bitrix_include_areas=Y&finish=\";", 117, 'Режим правки', 16); </script>
			<script type="text/javascript"> BXHotKeys.Add("Ctrl+Alt+69", "var d=BX(\'bx-panel-expander\'); if (d) BX.fireEvent(d, \'click\');", 118, 'Развернуть/Свернуть', 21); </script>
		</div>
	</div>
</div>
</div>
</div>
*}