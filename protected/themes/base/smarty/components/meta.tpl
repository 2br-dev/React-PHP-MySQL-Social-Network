<!DOCTYPE html>
{strip}
<html class="no-js" itemscope="itemscope" itemtype="http://schema.org/{if !isset($uri[1])}WebPage{else}ItemPage{/if}" lang="{$_page.lang}">
<head>
	<title itemprop="name">{$_meta.title}</title>
	<meta charset="utf-8">
    <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta content="{$_meta.robots}" name="robots">
    <meta content="{$_meta.keywords}" name="keywords">
    <meta content="{$_meta.description}" name="description" itemprop="description">
	{if isset($pagination.prev) && $pagination.prev !== ''}
		<link rel="prev" href="?page={$pagination.prev}">
	{/if}
	{if isset($pagination.next) && $pagination.next !== ''}
		<link rel="next" href="?page={$pagination.next}">
	{/if}
	<link rel="home" href="/">
	<!-- CSS -->
	<link type="text/css" rel="stylesheet" href="/css/normalize.css" >
	<link type="text/css" rel="stylesheet" href="/frontend/build/static/css/main.9445af82.chunk.css" >
	<link type="text/css" rel="stylesheet" href="/css/style.css" >	
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

</head>
<body class="page-{$_page.system}" style='overflow: hidden'>
{/strip}