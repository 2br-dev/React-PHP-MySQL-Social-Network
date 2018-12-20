<?php

use MatthiasMullie\Minify;

class CompressExtension extends \Twig_Extension
{
    private $stack = [];

    private $handle = true;

    private $filemtime = 0;

    private $template = '';
    private $attributes = '';
    private $inlineTemplate = '';

    private $minifier = null;
    private $targetFile = null;
    private $nonceToken = null;

    public function set($name = '', $value = null)
    {
        $this->{$name} = $value;
    }

    public function getFunctions()
    {
        return [
            'compress' => new \Twig_SimpleFunction('compress', [$this, 'Compress']),
        ];
    }

    public function Compress($params = [])
    {
        $this->stack = [];

        if (!empty($params['source']))
        {
            $inline = false;

            $styles = [];
            $scripts = [];

            $source = $params['source'];

            if (isset($params['inline']))
            {
                $inline = $params['inline'];
            }

            $attr_c = [
                'media'
            ];

            $attr_j = [
                'async', 'defer', 'data-no-instant'
            ];

            $_attr_j = array_intersect_key($params, array_flip($attr_j));

            $_attr_c = array_intersect_key($params, array_flip($attr_c));

            if (is_array($source))
            {
                $list = 'l';
                $hash = 'h';

                foreach ($source as $item)
                {
                    if (isset($item['file']))
                    {
                        $file = $item['file'];

                        $invalid = true;

                        if (file_exists(PATH_ROOT.$file))
                        {
                            $invalid = false;
                        }

                        if (!$invalid)
                        {
                            $e = pathinfo($file, PATHINFO_EXTENSION);

                            if ($e == 'js')
                            {
                                $scripts[$hash][] = $file;
                                $scripts[$list][] = PATH_ROOT.$file;
                            }

                            if ($e == 'css')
                            {
                                $styles[$hash][] = $file;
                                $styles[$list][] = PATH_ROOT.$file;
                            }
                        }
                    }
                }
            }

            $this->_walk($styles, 'css', $_attr_c, $inline);
            $this->_walk($scripts, 'js', $_attr_j, $inline);
        }

        return implode('', $this->stack);
    }

    private function _attributes($attr = [])
    {
        $this->attributes = '';

        if (!empty($attr))
        {
            $a = [];

            foreach ($attr as $name => $value)
            {
                $s = '';

                if (!is_bool($value) || (is_bool($value) && $value))
                {
                    $s .= $name;
                }

                if (!is_bool($value))
                {
                    $s .= '="'.$value.'"';
                }

                if ($s)
                {
                    $a[] = $s;
                }
            }

            $this->attributes = ' '.implode(' ', $a);
        }
    }

    private function _createFile($files = [], $ext = '')
    {
        if (!empty($files) && $ext)
        {
            $name = substr(md5(implode('|', $files)), 0, 5);

            $this->targetFile = PATH_STATIC.DS.$name.'.'.$ext;
            $this->targetFileGzip = $this->targetFile.'.gz';


            if (file_exists($this->targetFile))
            {
                $this->filemtime = filemtime($this->targetFile);
            }
        }
    }

    private function _concat($files = [])
    {
        foreach ($files as $file)
        {
            $this->minifier->add($file);
        }
    }

    private function _checkFreshness($files = [])
    {
        $time = 0;

        if ($this->filemtime > 0)
        {
            foreach ($files as $file)
            {
                $temp_time = filemtime($file);

                if ($temp_time > $time) {
                    $time = $temp_time;
                }
            }
        }

        if ($time < $this->filemtime)
        {
            $this->handle = false;
        }
    }

    private function _template($ext = '')
    {
        switch ($ext) {
            case 'js':
                $this->template = '<script nonce="'. $this->nonceToken .'" src="{{file}}"{{attr}}></script>';
                $this->inlineTemplate = '<script nonce="'. $this->nonceToken .'">{{content}}</script>';
            break;

            case 'css':
                $this->template = '<link rel="stylesheet" href="{{file}}"{{attr}}>';
                $this->inlineTemplate = '<style>{{content}}</style>';
            break;
        }
    }

    private function _walk($files = [], $ext = '', $attr = [], $inline = false)
    {
        $r = '';

        if (!empty($files) && $ext)
        {
            $this->_createFile($files['h'], $ext);
            $this->_checkFreshness($files['l']);
            $this->_attributes($attr);
            $this->_template($ext);

            switch ($ext) {
                case 'js':
                    $this->minifier = new Minify\JS();
                break;

                case 'css':
                    $this->minifier = new Minify\CSS();
                break;
            }

            if ($this->handle)
            {
                switch ($ext) {
                    case 'js':
                        $this->minifier = new Minify\JS();
                    break;

                    case 'css':
                        $this->minifier = new Minify\CSS();
                    break;
                }


                if (!empty($files['l']))
                {
                    $this->_concat($files['l']);
                    $this->_createFile($files['h'], $ext);

                    $this->minifier->minify($this->targetFile);

                    if (!$inline)
                    {
                        $this->minifier->gzip($this->targetFileGzip);
                    }
                }
            }

            if (!$inline)
            {
                $public = str_replace(PATH_ROOT, '', $this->targetFile);

                $result = $this->template;
                $result = str_replace('{{file}}', $public, $result);
                $result = str_replace('{{attr}}', $this->attributes, $result);

                $this->stack[] = $result;
            }
            else
            {
                $content = file_get_contents($this->targetFile);

                $this->stack[] = str_replace('{{content}}', $content, $this->inlineTemplate);
            }
        }
    }

    public function getName() {
        return 'compress';
    }
}
