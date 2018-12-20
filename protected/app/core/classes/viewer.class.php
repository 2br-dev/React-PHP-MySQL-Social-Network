<?php

declare(strict_types=1);

namespace Fastest\Core;

class Viewer extends \Fastest\Core\Entity
{
    protected $assets = [];
    protected $template = null;

    public function __construct($driver = 'twig', $dir = '', $alias = [], $caching = null, $root = null, $nonceToken = null)
    {
        parent::__construct();

        if (is_null($root)) {
            $root = PATH_THEMES;
        }

        if (is_null($caching)) {
            $caching = ENABLECACHE;
        }

        if (file_exists(PATH_EXTENSIONS.DS.$driver.'ViewRenderer.php')) {
            if (!class_exists('templateRender')) {
                require_once PATH_EXTENSIONS.DS.$driver.'ViewRenderer.php';

                $this->template = new \templateRender($dir, $caching, $alias, $root, $nonceToken);
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
        $this->template->display($pattern);
    }
}
