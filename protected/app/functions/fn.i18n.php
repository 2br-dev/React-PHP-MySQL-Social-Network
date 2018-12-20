<?php declare(strict_types = 1);

// found_elements:
//     few: "Найдено %{count} элемента"
//     many: "Найдено %{count} элементов"
//     one: "Найден один элемент"
//     other: "Найдено %{count} элементов"
//     zero: "Ничего не найдено"

function t($key = '', $params = [])
{
    // Locale
    $locale = Tools::getLocale($_SERVER['REQUEST_URI']);

    if (defined('SYSTEM_LOCALE') && SYSTEM_LOCALE !== $locale)
    {
        $path = preg_split('/\/+/', urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)), -1, PREG_SPLIT_NO_EMPTY);

        if (isset($path[0]) && defined('ADMIN_DIR') && $path[0] == ADMIN_DIR)
        {
            $locale = SYSTEM_LOCALE;
        }
    }

    // Check enable cache
    $cache_enable = defined('MEMCACHE_COMPRESSED') ? MEMCACHE_COMPRESSED : false;

    // Get dictionary
    // if (!$cache_enable || !($dictionary = getCache('str_dictionary_'.$locale)))
    // {

        $dictionary = [];
        $temp = Q("SELECT `key`, `val` FROM `#__str_dictionary` WHERE `locale` LIKE ?s", [ $locale ])->all('key');

        if (!empty($temp))
        {
            foreach ($temp as $k => $val)
            {
                $dictionary[$k] = $val['val'];
            }
        }

    //     $this->setCache('str_dictionary'.$locale, $dictionary);
    // }

    $translate = isset($dictionary[$key]) ? $dictionary[$key] : '';

    if ($translate)
    {
        if (!empty($params))
        {
            foreach ($params as $key => $value)
            {
                $translate = str_replace('#' . $key, $value, $translate);
            }
        }

        return $translate;
    }

    return ucfirst(str_replace('.', ' ', $key));
}
