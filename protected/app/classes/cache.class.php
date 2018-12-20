<?php

class Cache extends CPInit
{
    protected $ignore = [
        '.', '..', '.gitkeep', '.gitignore'
    ];

    public function __construct()
    {
        parent::__construct();

        array_unshift($this->path, 'main');
    }

    public function clearFiles($formats = [])
    {
        if (!empty($formats))
        {
            $dirs = [];

            $dirs[] = PATH_CACHE;

            if (in_array('css', $formats) || in_array('js', $formats))
            {
                $dirs[] = PATH_STATIC;
            }

            foreach ($dirs as $dir)
            {
                $cache = array_diff(scandir($dir), $this->ignore);

                if (!empty($cache))
                {
                    foreach ($cache as $source)
                    {
                        if (is_dir($dir.DS.$source))
                        {
                            rrmdir($dir.DS.$source);
                        }
                        else
                        {
                            $this->removeFile($dir.DS.$source, $formats);
                        }
                    }
                }
            }
        }
    }

    public function removeFile($file, $formats) {
        $extension = pathinfo($file, PATHINFO_EXTENSION);

        if ($extension && in_array($extension, $formats) && file_exists($file)) {
            unlink($file);
        }
    }

    public function clearStyles()
    {
        $this->clearFiles(['css', 'gz']);
    }

    public function clearScripts()
    {
        $this->clearFiles(['js', 'gz']);
    }

    public function clearTemplate()
    {
        $this->clearFiles(['php']);
    }

    public function clearMemory()
    {
        $caching = new Caching();
        $caching->clearCache();
    }

    public function clearSession($keys = [])
    {
        if (!empty($keys)) {
            foreach ($keys as $key) {
                if (!empty($_SESSION[$key])) {
                    unset($_SESSION[$key]);
                }
            }
        }
    }
}
