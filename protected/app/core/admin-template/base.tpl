<!DOCTYPE html>
<!-- (c) lnk. celebro | celebro.ru -->
{strip}
<html lang="ru" class="no-js">
<head>
    <link rel="stylesheet" href="/{$ADMIN_DIR}/css/vendors.min.css">
    <link rel="stylesheet" href="/{$ADMIN_DIR}/css/main.min.css">

    <meta charset="UTF-8">
    <meta content="IE=Edge,chrome=1" http-equiv="X-UA-Compatible">
    <meta content="width=device-width, initial-scale=1, minimum-scale=1, user-scalable=no" name="viewport">
    <meta content="no-cache" http-equiv="cache-control">
    <meta content="no-cache" http-equiv="pragma">
    <meta content="320" name="MobileOptimized">
    <meta content="true" name="HandheldFriendly">
    <meta content="notranslate" name="google">

    <meta content="CELEBRO.CMS" name="CMS">
    <meta content="http://cms.celebro.ru/" name="author">
    <meta content="celebro.ru" name="copyright">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css">

    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="57x57" href="/{$ADMIN_DIR}/favicon/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/{$ADMIN_DIR}/favicon/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/{$ADMIN_DIR}/favicon/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/{$ADMIN_DIR}/favicon/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/{$ADMIN_DIR}/favicon/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/{$ADMIN_DIR}/favicon/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/{$ADMIN_DIR}/favicon/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/{$ADMIN_DIR}/favicon/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/{$ADMIN_DIR}/favicon/apple-touch-icon-180x180.png">
    <link rel="icon" type="image/png" href="/{$ADMIN_DIR}/favicon/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/{$ADMIN_DIR}/favicon/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="/{$ADMIN_DIR}/favicon/favicon-194x194.png" sizes="194x194">
    <link rel="icon" type="image/png" href="/{$ADMIN_DIR}/favicon/android-chrome-192x192.png" sizes="192x192">
    <link rel="manifest" href="/{$ADMIN_DIR}/favicon/manifest.json">
    <link rel="mask-icon" href="/{$ADMIN_DIR}/favicon/safari-pinned-tab.svg" color="#4169e1">
    <link rel="shortcut icon" href="/{$ADMIN_DIR}/favicon/favicon.ico">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="msapplication-TileImage" content="/{$ADMIN_DIR}/favicon/mstile-144x144.png">
    <meta name="msapplication-config" content="/{$ADMIN_DIR}/favicon/browserconfig.xml">
    <meta name="theme-color" content="#4169e1">

    {if isset($_config.redactor )}
	    {foreach from=$_config.redactor item=item}
	        {if isset($item.path )}
	            {if isset($item.lib.style ) && !empty( $item.lib.style )}
	                {foreach from=$item.lib.style item=style}
	                <link rel="stylesheet" href="{$PATH_PUBLIC}{$item.path}{$style}">
	                {/foreach}
	            {/if}
	        {/if}
	    {/foreach}
	{/if}

	{if isset($_config.editor )}
	    {foreach from=$_config.editor item=item}
	        {if isset($item.path )}
	            {if isset($item.lib.style ) && !empty( $item.lib.style )}
	                {foreach from=$item.lib.style item=style}
	                <link rel="stylesheet" href="{$PATH_PUBLIC}{$item.path}{$style}">
	                {/foreach}
	            {/if}
	        {/if}
	    {/foreach}
	{/if}

	<script>
        var eventsJson = {};
        var initialFiles = {};
	    var ADMIN_DIR = '{$ADMIN_DIR}',
            PATH_HASH = '{$PATH_HASH}',
	        ADMIN_LOCALE = '{$ADMIN_LOCALE}',
	        CONFIGURE = {$_config|json_encode},
	        URL_TRANSLATE = "{if $smarty.const.SYSTEM_TRANSLATE}{$smarty.const.SYSTEM_TRANSLATE}{else}latin{/if}",
	        TRANSLATE_API = "{if $smarty.const.TRANSLATE_API}{$smarty.const.TRANSLATE_API}{/if}";

        {if isset($modules_json)}
        var MODULE_LIST = {$modules_json};
        {/if}
	</script>

    <title>{$smarty.const.COMPANY_NAME}</title>
</head>
<body>

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden;">
    <defs><!-- inject:svg --><symbol id="close" viewBox="0 0 39 39"><path d="M22.582 19.812l15.09-15.09a2.4 2.4 0 0 0 0-3.394 2.395 2.395 0 0 0-3.391 0l-15.093 15.09-15.09-15.09A2.4 2.4 0 1 0 .703 4.722l15.094 15.09L.703 34.902a2.402 2.402 0 0 0 3.395 3.395l15.09-15.09 15.093 15.09a2.394 2.394 0 0 0 3.391 0 2.402 2.402 0 0 0 0-3.395l-15.09-15.09z"/></symbol><!-- endinject --></defs>
</svg>

<noscript>
    <div class="js_disabled">В вашем браузере отключена поддержка JavaScript! Для нормальной работоспособности сайта необходимо разрешить использование JavaScript.</div>
</noscript>

<div class="loader" id="loader"><img src="/{$ADMIN_DIR}/images/preloader.gif" width="32" height="32" alt="Идет загрузка"> <span>Подождите...</span></div>

{include file="system/include.code.tpl"}

<div class="page" id="page">
	<aside class="sidebar">
		<div class="sidebar__logo">
			<a href="#" class="sandwich menu-trigger">
				<span class="sandwich__layer">Menu</span>
			</a>
			<div class="sidebar__logo__celebro-cms secondary-items">CELEBRO<span>.CMS</span></div>
		</div>

		<div class="sidebar__inner">
			{if isset($navigation )}
			<ul class="navigation">
			{foreach from=$navigation item=item name=nav}
				<li class="navigation__item">
					<a href="/{$ADMIN_DIR}{$item.dir}" rel="{$item.name}" class="navigation__link{if isset($_path[1]) && $_path[1] == $item.root} navigation__link_current{/if} trigger-navigation" id="navi-{$smarty.foreach.nav.iteration}" data-instant>
						<span class="navigation__link__middle">
							<span class="navigation__link__icon">
								{*
								<img src="/{$ADMIN_DIR}/images/ico/{$item.icon}.svg" width="24" class="navigation__link__icon__image" alt="">
								*}
								<i class="navigation__link__icon__item zmdi zmdi-{$item.icon}"></i>
							</span>
							<span class="navigation__link__text secondary-items">{$item.name}</span>
							{if isset($item.count)}
								<span class="navigation__link__badge badge bg-{if $item.count > 0}danger{else}success{/if}">{$item.count}</span>
							{/if}
						</span>
					</a>
				</li>
			{/foreach}
			</ul>
			{/if}
		</div>
	</aside>

	<section class="wrapper clearfix" id="page-wrapper">
		<div class="overlay" id="overlay"></div>

		<header class="header">
			<div class="header__right-side">
			    <div class="header__recycle">
					<a href="./?cleancache=all&backuri={$_backuri}" class="header__recycle__button trigger-tooltip trigger-cache" title="Очистить кеш"></a>
					<span class="header__recycle__dropdown trigger-popover" data-popover="dropdown_menu">
						<span class="zmdi zmdi-chevron-down"></span>
					</span>
				</div>

				<a href="/" target="_blank" class="header__site-link"><i class="zmdi zmdi-link"></i>{$locale.view_website|capi}</a>
				<a href="./?logout=1" class="header__logout" title="{$locale.logout|capi}" title="Выйти">Выйти</a>
			</div>

			<div class="header__title">{$header}</div>
		</header>

		{if $breadcrumbs}
		<ul class="bread-crumbs">
			{foreach from=$breadcrumbs item=bc name=bc}
                <li class="bread-crumbs__item">{if !$smarty.foreach.bc.last}<a href="{$bc.link}" class="bread-crumbs__item__link" data-instant>{/if}{$bc.name}{if !$smarty.foreach.bc.last}</a>{/if}</li>
            {/foreach}
		</ul>
		{/if}

		{if $submenu}
		<nav class="tabs">
			<ul class="tabs__list">
	            {foreach from=$submenu item=sub name=sub}
	            	<li class="tabs__list__item"><a href="/{$ADMIN_DIR}{$sub.dir}" class="tabs__list__link{if isset($_path[2]) && $_path[2] == $sub.root || isset($_path[2]) && $_path[2] == 'index' && $sub.root == 'list' || !isset($_path[2]) && $smarty.foreach.sub.first} tabs__list__link_current{/if}" data-instant>{$sub.name}</a></li>
	            {/foreach}
	        </ul>
		</nav>
		{/if}

		<article class="content clearfix">
			{$content}
		</article>

	</section>
</div>

<script src="/{$ADMIN_DIR}/js/vendors.min.js"></script>
<script src="/{$ADMIN_DIR}/js/libs.min.js"></script>

{if isset($_config.scripts)}
    {foreach from=$_config.scripts item=item}
        {if isset($item.path)}
            {if isset($item.lib.script) && !empty($item.lib.script)}
                {foreach from=$item.lib.script item=script}
                <script src="{$PATH_PUBLIC}{$item.path}{$script}" async></script>
                {/foreach}
            {/if}
        {/if}
    {/foreach}
{/if}

{if isset($_config.redactor)}
    {foreach from=$_config.redactor item=item}
        {if isset($item.path)}
            {if isset($item.lib.script) && !empty($item.lib.script)}
                {foreach from=$item.lib.script item=script}
                <script src="{$PATH_PUBLIC}{$item.path}{$script}"></script>
                {/foreach}
            {/if}
        {/if}
    {/foreach}
{/if}

{if isset($_config.editor)}
    {foreach from=$_config.editor item=item}
        {if isset($item.path)}
            {if isset($item.lib.script) && !empty($item.lib.script)}
                {foreach from=$item.lib.script item=script}
                <script src="{$PATH_PUBLIC}{$item.path}{$script}" async></script>
                {/foreach}
            {/if}
        {/if}
    {/foreach}
{/if}

<script src="/{$ADMIN_DIR}/js/scripts.min.js" async></script>
<script src="/{$ADMIN_DIR}/js/shopping.min.js" async></script>
<script src="/{$ADMIN_DIR}/js/module.min.js" async></script>

</body>
</html>
{/strip}