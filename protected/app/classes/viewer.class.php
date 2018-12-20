<?php

class Viewer extends Data
{
    protected $template = null;

    public function __construct($driver = 'twig', $dir = '', $alias = [], $caching = null, $root = null)
    {
        parent::__construct();

        if (is_null($root)) {
            $root = PATH_THEMES;
        }

        if (is_null($caching)) {
            $caching = defined('ENABLECACHE') ? ENABLECACHE : false;
        }

        if (file_exists(PATH_EXTENSIONS.DS.$driver.'ViewRenderer.php')) {
            if (!class_exists('templateRender')) {
                include PATH_EXTENSIONS.DS.$driver.'ViewRenderer.php';

                $this->template = new templateRender($dir, $caching, $alias, $root);
            }
        }
    }

    protected function assign($key = '', $value = '', $caching = false)
    {
        $this->template->assign($key, $value, $caching);
    }

    protected function fetch($template = '', $cache_id = '', $compile_id = '')
    {
        return $this->template->fetch($template);
    }

    protected function display($pattern = '')
    {
        if (DEV_MODE) {
            $cache = new Cache;
            $cache->clearMemory();
        }

        // ob_start();
        // $content = ob_get_contents();
        // $length = strlen($content);
        // header('Content-Length: '.$length);
        // echo $content;

        // $size = filesize($file);
        // header('Content-type: application/pdf');
        // header("Content-length: $size");
        // header('Content-Disposition: attachment; filename="downloaded.pdf"');
        // readfile($file);

        $this->template->display($pattern);
    }
}
