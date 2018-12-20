<?php

// https://packagist.org/packages/matthiasmullie/minify

// use MatthiasMullie\Minify;

// $sourcePath = '/path/to/source/css/file.css';
// $minifier = new Minify\CSS($sourcePath);

// // we can even add another file, they'll then be
// // joined in 1 output file
// $sourcePath2 = '/path/to/second/source/css/file.css';
// $minifier->add($sourcePath2);

// or we can just add plain CSS
// $css = 'body { color: #000000; }';
// $minifier->add($css);

// // save minified file to disk
// $minifiedPath = '/path/to/minified/css/file.css';
// $minifier->minify($minifiedPath);

// // or just output the content
// echo $minifier->minify();

// use MatthiasMullie\Minify;
// $minifier = new Minify\JS($path1, $path2);

// $minifier->add($path3);
// $minifier->add($js);

// $minifier->minify('/target/path.js');

// $minifier->gzip('/target/path.js');

// $minifier->setMaxImportSize(10);

// $extensions = array(
//     'gif' => 'data:image/gif',
//     'png' => 'data:image/png',
// );

// $minifier->setImportExtensions($extensions);

use tubalmartin\CssMin\Minifier as CSSmin;

/**
 * Smarty plugin
 * @package Smarty
 * @subpackage plugins
 */

function smarty_function_compress($data = array(), &$smarty)
{
    $variable = array(
        'attr', 'type', 'file', 'media', 'squeeze', 'mode', 'source'
    );

    // Default

    $attr = '';
    $type = 'include';
    $file = '';
    $media = 'all';
    $squeeze = true;
    $mode = 'css';
    $source = [];

    // Redeclare

    foreach ($variable as $var) {
        if (!empty($data[$var])) {
            $$var = $data[$var];
        }
    }

    $squeeze = !!$squeeze;

    if (!in_array($media, array('all', 'braille', 'handheld', 'print', 'screen', 'speech', 'projection', 'tty', 'tv'))) {
        $media = 'all';
    }

    // Pack

    if (!empty($source)) {
        $request = urldecode(current(explode('?', $_SERVER["REQUEST_URI"])));
        $query  = $_SERVER['QUERY_STRING'] ? '?' . urldecode($_SERVER['QUERY_STRING']) : '';

        $url = implode('|', preg_split('/\/+/', $request, -1, PREG_SPLIT_NO_EMPTY));

        $hash = [];
        $files = [];
        $time_cached_file = 0;

        foreach ($source as $key => $item) {
            $resource = isset($item['file']) ? $item['file'] : (isset($item['link']) ? $item['link']: '');

            $valid_file = (is_url($resource) && checkLink($resource));

            $allow      = isset($item['allow']) ? $item['allow'] : [];
            $disallow   = isset($item['disallow']) ? $item['disallow'] : [];

            if ($valid_file || file_exists(PATH_ROOT . $resource)) {
                if (!empty($disallow)) {
                }

                if (!empty($allow)) {
                }

                if ($valid_file) {
                    $files[] = $resource;
                } else {
                    $files[] = PATH_ROOT . $resource;
                }

                $hash[] = md5($resource);
            }
        }

        $hash_string = implode('|', $hash);

        if (!$file) {
            if ($type === 'inline') {
                $cache_dir = PATH_SECURE . str_replace(PATH_SECURE, '', PATH_RUNTIME).DS.'cache';
            } else {
                $cache_dir = PATH_ROOT.DS.$mode;
            }

            $file = $cache_dir.DS.md5($hash_string).'.'.$mode;
        }

        if (file_exists(PATH_ROOT . $file))
        {
            $time_cached_file = filemtime(PATH_ROOT . $file);
        }

        if (!empty($files)) {
            $collect = false;

            $time_real_file = 0;

            foreach ($files as $link)
            {
                if (!is_url($link)) {
                    $temp_time = filemtime($link);

                    if ($temp_time > $time_real_file) {
                        $time_real_file = $temp_time;
                    }
                }
            }

            if ($time_real_file > $time_cached_file) {
                $collect = true;
            }

            if (defined('ENABLECACHE') && ENABLECACHE == false) {
                $collect = true;
            }

            if ($collect) {
                $code = '';

                foreach ($files as $link)
                {
                    $code .= file_get_contents($link);

                    if ($mode == 'js') {
                        $code .= ';';
                    }
                }

                if ($squeeze) {
                    Packing($code, $file, $mode, $type);
                }
            }

            Inserting($type, $mode, $file, $attr, $media);
        }
    }
}

function Packing($code = '', $resource = '', $mode = '', $type = 'inline', $packing = false)
{
    if ($packing) {
        $result = '';

        if ($mode == 'css') {
            $CSSmin = new CSSmin;
            $result = $CSSmin->run($code, false);
        } elseif ($mode == 'js') {
            $result = JSMin::minify($code);
        }

        $code = str_replace("\r\n", '', $result);
        $code = str_replace("\n", '', $result);
    }

    # Gzip
    if ($type !== 'inline') {
        $gzipped = preg_replace('/(\.[a-z]+$)/', '$1.gz', $resource);
        file_put_contents($gzipped, gzencode($code, 9));
    }

    # File
    file_put_contents($resource, $code);
}

function Inserting($type = 'include', $mode = 'css', $file = '', $attr = '', $media = 'all')
{
    if (file_exists($file) || file_exists(PATH_ROOT . $file)) {
        if ($type === 'inline') {
            $file = PATH_SECURE . str_replace(PATH_SECURE, '', $file);
            $code = file_get_contents($file);
        } else {
            $file = str_replace(PATH_ROOT, '', $file);
        }

        if ($mode == 'css') {
            if ($type == 'inline') {
                echo '<style>' . $code . '</style>';
            } else {
                echo '<link media="' . $media . '" rel="stylesheet" href="' . $file . '">';
            }
        } elseif ($mode == 'js') {
            if ($type == 'inline') {
                echo '<script ' . $attr . '>' . $code . '</script>';
            } else {
                echo '<script type="text/javascript" src="' . $file . '" ' . $attr . '></script>';
            }
        }
    }
}
