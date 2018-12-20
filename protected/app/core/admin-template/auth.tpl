<!DOCTYPE html>
<!-- (c) lnk. celebro | celebro.ru -->
{strip}
<html lang="ru" class="no-js">
<head>
    <meta charset="UTF-8">
    <meta content="on" http-equiv="cleartype">
    <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <meta content="noindex,nofollow" name="robots">
    <meta content="CELEBRO.CMS" name="CMS">
    <meta content="http://cms.celebro.ru/" name="author">
    <meta content="celebro.ru" name="copyright">

    <link rel="stylesheet" href="/{$ADMIN_DIR}/css/main.min.css">

    <link rel="icon" type="image/png" href="/{$ADMIN_DIR}/images/favicon.png">

    <title>{$locale.authorization|capi} | CELEBRO.CMS</title>
</head>
<body class="page-auth">

<div class="auth-wrapper">
    <form method="post" class="auth-form clearfix">
        <div class="celebro-cms">CELEBRO<span>.CMS</span></div>
        <h1>{$locale.authorization|capi}</h1>

        <input type="hidden" name="auth" value="1">

        <input name="login" placeholder="{$locale.login|capi}" class="input">
        <input type="password" name="password" placeholder="{$locale.password|capi}" class="input">

        <div class="buttons">
            <button type="submit" class="m-btn blue button">{$locale.log_in|capi}</button>
            <div class="checkbox-conteiner">
                {include file="system/controll.tpl"
                    type        =   "checkbox"
                    needle      =   $smarty.cookies.savepassword
                    name        =   "save"
                    value       =   "1"
                    text        =   $locale.remember_me|capi
                }
            </div>
        </div>
    </form>
</div>

</body>
</html>
{/strip}