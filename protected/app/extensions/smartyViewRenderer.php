<?php

class templateRender
{
    protected $dir = null;
    protected $data = [];
    protected $template = null;
    protected $charset = 'utf-8';
    protected $fileExtension = '.tpl';

    public function __construct($dir = '', $caching = null, $aliases = [], $root = null)
    {
        if (is_null($root)) {
            $root = PATH_THEMES.DS.$dir;
        } else {
            $root = $root.DS.$dir;
        }

        $this->template = new Smarty;

        $this->template->setCacheDir(PATH_CACHE);
        $this->template->setCompileDir(PATH_CACHE);
        $this->template->setTemplateDir($root);

        $this->template->setCaching($caching);
        $this->template->setCacheLifetime(60);

        $this->template->use_sub_dirs           = true;
        $this->template->debugging              = false;
        $this->template->cache_modified_check   = false;
        $this->template->compile_check          = true;
        $this->template->force_compile          = true;
        $this->template->error_reporting        = (defined('SYSTEM_DEBUG') && SYSTEM_DEBUG == 1) ?
                                                    E_ALL & ~E_NOTICE & ~E_WARNING :
                                                    E_ALL & ~E_NOTICE;

        $this->template->addPluginsDir(
            PATH_KERNEL.DS.'libs'.DS.'smarty.plugins'.DS
        );
    }

    public function assign($key = '', $value = '', $caching = false)
    {
        $this->template->assign($key, $value, $caching);
    }

    public function fetch($template = '', $cache_id = '', $compile_id = '')
    {
        if (file_exists($template . $this->fileExtension)) {
            return $this->template->fetch($template . $this->fileExtension);
        } elseif (!strstr(strtolower($template), strtolower(PATH_ROOT))) {
            return $this->template->fetch($template);
        }
    }

    public function display($template = '')
    {
        $this->template->display($template . $this->fileExtension);
    }
}
