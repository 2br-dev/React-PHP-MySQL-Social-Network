<!DOCTYPE html>
<!-- (c) lnk. celebro | http://www.celebro.ru/ -->
{strip}
<html>
<head>
    {compress
        mode   = 'css'
        type   = 'inline'
        source = [
            [
                'file'  => '/css/main.min.css'
            ]
        ]
    }

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="cms" content="celebro.cms">
    <meta name="author" content="http://celebro.ru/">
    <meta name="viewport" content="width=device-width; user-scalable=yes">
    <meta name="keywords" content="{$_page.keywords}">
    <meta name="description" content="{$_page.description}">
    <meta name="robots" content="noindex,nofollow">
    
    <meta http-equiv="Cache-Control" content="public">
    <meta http-equiv="Cache-Control" content="max-age=3600, must-revalidate">
    
    <link rel="icon" type="image/png" href="/images/favicon.png">
    <!--[if IE]><link rel="shortcut icon" type="image/x-icon" href="/images/favicon.ico"><![endif]-->
    <title>{$_page.title}</title>
</head>
<body class="error-page">
<div class="error-page__wrapper">

    <h1 class="error-page__title">{$_page.name}</h1>
    
    <form action="/search" class="error-page__search">
        <input name="q" placeholder="Найти на сайте" class="error-page__search__input">
        <button type="submit" class="error-page__search__button">Поиск</button>
    </form>
    
    <a href="/" class="error-page__goto">&larr; <span class="error-page__goto__label">На главную</span></a>

    <ul class="error-page__sitemap">
        {include file="../system/sitemap.tpl" tree=$_sitemap link='/' nocache}
    </ul>
</div>
</body>
</html>
{/strip}