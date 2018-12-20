<?php

if (!defined('DS')) {
    define('DS', DIRECTORY_SEPARATOR);
}

define('F_PATH', realpath(dirname(__FILE__)));

require_once F_PATH . '/file_driver.php';

function imageLoader($class)
{
    $path = PATH_KERNEL.DS.'libs'.DS.'image'.DS.'src'.DS.'Intervention'.DS.'Image'.DS.str_replace(['\\', 'Intervention/Image'], [DS, ''], $class).'.php';

    if (file_exists($path)) {
        include $path;
    }
}

spl_autoload_register('\imageLoader');

function FConfig($config = array())
{
    if (!empty($config)) {
        file_driver::config($config);
    }
}

function F($args = array())
{
    return new file_driver($args);
}

/*
exif

Дата съемки	01.01.70, 0:00
Размеры	1280 x 853
Название файла	-
Размер файла	-
Камера	-
Объектив	-
Фокусное расстояние	-
Экспозиция	-
Диафрагма	-
ISO	-
Марка фотокамеры	-
Вспышка	Не использовалась
Смещение экспозиции	-
Просмотры	-

*/
