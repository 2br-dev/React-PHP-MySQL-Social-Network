<?php

namespace Fastest\Core;

require_once PATH_VENDORS.DS.'autoload.php';

# Functions
#
$fn_list = [
    'fn.inc.php',
    'fn.predicts.php',
    'fn.sandbox.php',
    'fn.i18n.php',
    'fn.user.php'
];

foreach ($fn_list as $file) {
    if (file_exists(PATH_KERNEL.DS.'functions'.DS.$file)) {
        require PATH_KERNEL.DS.'functions'.DS.$file;
    }
}

// set_error_handler(function($errno, $error_message, $err_file, $errline){
//     // echo "<style>.error_message{background-color:blue;color:white;border: 2px black solid;}</style>";
//     echo "<div class='error_message'>Произошла ошибка уровня $errno. Попробуйте заглянуть позже.</div>";

//     if (($errno == E_USER_ERROR) || ($errno == E_ERROR)) {
//         echo "<p>Fatal error. Program ending.</p>";
//         exit;
//     }

//     echo "<hr/>";
//     return false;
// });

# Autoload
#
spl_autoload_register(function ($_class) {
    clearstatcache(true);

    $_dump = $_class;
    $_temp = explode('\\', strtolower($_class));
    $_class = end($_temp);

    if (strstr($_class, 'controller')) {
        if (file_exists(PATH_KERNEL.DS.'controllers'.DS.$_dump.'.php')) {
            require_once PATH_KERNEL.DS.'controllers'.DS.$_dump.'.php';
        }
    } elseif (strstr($_class, 'helper')) {
        $_class = str_replace('helper', '', $_class);

        if (file_exists(PATH_SECURE.DS.'helpers'.DS.$_class.'.helper.php')) {
            require_once PATH_SECURE.DS.'helpers'.DS.$_class.'.helper.php';
        }
    }
    elseif (strstr($_class, 'extension')) {
        $_name = str_replace('extension', '', $_class);

        if (file_exists(PATH_KERNEL.DS.'libs'.DS.'twig.extensions'.DS.$_name.'.extension.php')) {
            require_once PATH_KERNEL.DS.'libs'.DS.'twig.extensions'.DS.$_name.'.extension.php';
        }
    } elseif (strstr($_class, 'interface')) {
        $_name = str_replace('interface', '', $_class);

        if (file_exists(PATH_CORE.DS.'interface'.DS.$_name.'.interface.php')) {
            require_once PATH_CORE.DS.'interface'.DS.$_name.'.interface.php';
        }
    } elseif (in_array('api', $_temp)) {
        if (file_exists(PATH_KERNEL.DS.'api'.DS.$_class.'.class.php')) {
            require_once PATH_KERNEL.DS.'api'.DS.$_class.'.class.php';
        }
    } else {
        if (file_exists(PATH_KERNEL.DS.'classes'.DS.$_class.'.class.php')) {
            require_once PATH_KERNEL.DS.'classes'.DS.$_class.'.class.php';
        }

        if (file_exists(PATH_CORE.DS.'classes'.DS.$_class.'.class.php')) {
            require_once PATH_CORE.DS.'classes'.DS.$_class.'.class.php';
        }
    }
});
