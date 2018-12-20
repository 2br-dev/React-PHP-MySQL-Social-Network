<?php

class templateRender
{
    protected $strip = true;
    protected $charset = 'utf-8';
    protected $template_dir = null;
    protected $fileExtension = '.html';

    public function __construct($dir = '', $caching = null)
    {
        $this->template_dir = $dir;
    }

    public function assign($key = '', $value = '', $caching = false) {}

    public function fetch($template = '', $cache_id = '', $compile_id = '')
    {
        if (file_exists($template . $this->fileExtension)) {
            return include($template . $this->fileExtension);
        }

        return '';
    }

    public function display($template = '')
    {
        try {
            $file = PATH_THEMES . '/' . $this->template_dir . $template . $this->fileExtension;

            if (file_exists($file)) {
                ob_start();

                if (extension_loaded('zlib')) {
                    ob_implicit_flush(0);
                    header('Content-Encoding: gzip');
                }

                include_once($file);

                $output = ob_get_contents();

                ob_end_clean();

                if ($this->strip) {
                    $output = preg_replace("#[\t\n\r]#", '', $output);
                    $output = preg_replace('/\>\s+\</', '><', $output);
                    // $output = php_strip_whitespace($output);
                    // $output = preg_replace(
                    //     '/(\t|\n|\v|\f|\r| |\xC2\x85|\xc2\xa0|\xe1\xa0\x8e|\xe2\x80[\x80-\x8D]|\xe2\x80\xa8|\xe2\x80\xa9|\xe2\x80\xaF|\xe2\x81\x9f|\xe2\x81\xa0|\xe3\x80\x80|\xef\xbb\xbf)+/',
                    //     '',
                    //     $output
                    // );
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
