<?php

class templateRender
{
    protected $data = [];
    protected $strip = true;
    protected $charset = 'utf-8';
    protected $template_dir = null;
    protected $fileExtension = '.php';

    public function __construct($dir = '', $caching = null)
    {
        $this->template_dir = $dir;
    }

    public function assign($key = '', $value = '', $caching = false)
    {
        if (is_array($value)) {
            $this->data[$key] = $value;
        } elseif (is_object($value)) {
            $this->data[$key] = get_object_vars($value);
        } else {
            $this->data[$key] = htmlspecialchars($value, ENT_QUOTES, $this->charset);
        }
    }

    public function fetch($template = '', $cache_id = '', $compile_id = '')
    {
        if (file_exists($template . $this->fileExtension)) {
            return include($template . $this->fileExtension);
        }

        return '';
    }

    /**
     * Safely escape/encode the provided data.
     */
    public function e($v = '')
    {
        return htmlspecialchars((string) $v, ENT_QUOTES, $this->charset);
    }

    public function display($template = '')
    {
        try {
            $file = PATH_THEMES . '/' . $this->template_dir . $template . $this->fileExtension;

            if (file_exists($file)) {
                extract($this->data);

                ob_start();

                if (extension_loaded('zlib')) {
                    ob_implicit_flush(0);
                    header('Content-Encoding: gzip');
                }

                include_once($file);

                $output = ob_get_contents();

                ob_end_clean();

                if ($this->strip) {
                    $output = preg_replace("#[\n\t]#", '', $output);
                }

                echo $output;
            } else {
                throw new Exception('Template ' . $template . ' not found!');
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }
}

// Путь до папки с шаблонами
// define('VIEWS_BASEDIR', dirname(__FILE__).'/views/');

// class View {
//     // получить отренедеренный шаблон с параметрами $params
//     function fetchPartial($template, $params = array()){
//         extract($params);
//         ob_start();
//         include VIEWS_BASEDIR.$template.'.php';
//         return ob_get_clean();
//     }

//     // вывести отренедеренный шаблон с параметрами $params
//     function renderPartial($template, $params = array()){
//         echo $this->fetchPartial($template, $params);
//     }

//     // получить отренедеренный в переменную $content layout-а
//     // шаблон с параметрами $params
//     function fetch($template, $params = array()){
//         $content = $this->fetchPartial($template, $params);
//         return $this->fetchPartial('layout', array('content' => $content));
//     }

//     // вывести отренедеренный в переменную $content layout-а
//     // шаблон с параметрами $params
//     function render($template, $params = array()){
//         echo $this->fetch($template, $params);
//     }
// }