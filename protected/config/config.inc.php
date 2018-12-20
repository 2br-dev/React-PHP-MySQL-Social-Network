<?php

declare(strict_types = 1);

mb_detect_order('auto');

date_default_timezone_set('Europe/Moscow');

if (!defined('MEMCACHE_COMPRESSED')) {
    define('MEMCACHE_COMPRESSED', true);
}

if (!session_id() && (!defined('NO_SESSION') || !NO_SESSION)) {
    session_start([
        'cookie_secure' => false,
        'cookie_httponly' => true
    ]);
}

if (!IS_CONSOLE && (extension_loaded('zlib') && (!defined('GZIP_COMPRESS') || defined('GZIP_COMPRESS') && GZIP_COMPRESS)))
{
    ini_set('zlib.output_compression', 'On');
    ini_set('zlib.output_compression_level', '7');
}

if (LOCAL_SERVER && file_exists(PATH_SECURE.DS.'config'.DS.'dev'.DS.'config.db.php')) {
    require_once PATH_SECURE.DS.'config'.DS.'dev'.DS.'config.db.php';
} else {
    require_once PATH_SECURE.DS.'config'.DS.'config.db.php';
}

require_once PATH_KERNEL.DS.'bootstrap'.DS.'autoload.php';

require_once PATH_KERNEL.DS.'libs'.DS.'F'.DS.'F.php';
require_once PATH_KERNEL.DS.'libs'.DS.'O'.DS.'O.php';

# I18N

if (!defined('IS_CONSOLE') || !IS_CONSOLE)
{
    // ini_set('display_errors', strval(intval(DEV_MODE)));
    // ini_set('display_startup_errors', strval(intval(DEV_MODE)));
    // ini_set('error_reporting', '32767');

    // ini_set('session.auto_start', '0');
    // ini_set('session.use_cookies', '1');
    // ini_set('session.use_trans_sid', '0');
    // ini_set('session.use_only_cookies', '1');
    // ini_set('session.gc_maxlifetime', '2678400');
    // ini_set('session.cookie_lifetime', '2678400');

    setlocale(LC_ALL, Tools::getLocale($_SERVER['REQUEST_URI']));
}

# SQL log
if (DEV_MODE) {
    $_SESSION['sql'] = 0;
    $_SESSION['sql_log'] = [];
}

if (empty($_SESSION['cart']))
{
    $_SESSION['cart'] = [
        'items' => [],
        'count' => 0,
        'amount' => 0
    ];
}

# Connect database
QF('mysqli://'.DB_USER.':'.DB_PASS.'@'.DB_HOST.':'.DB_PORT.'/'.DB_BASE.'?encoding=utf8')->connect()->alias('default')->tablePrefix(DB_PREF);

# File config
FConfig([
    'upload_dir'    => DS.'upload_dir'.DS,
    'upload_lvl'    => 2,
    'upload_sym'    => 2,
    'use_temp_dir'  => false,
    'image_driver'  => 'Gd' // Imagick Gd
]);
