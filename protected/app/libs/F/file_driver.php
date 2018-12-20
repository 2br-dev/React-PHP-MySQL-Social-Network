<?php

use Intervention\Image\ImageManager;

class file_driver
{
    use Singleton, Tools;

    private static $_instance    = null;

    private static $config  = [
        'image_driver'      => 'Gd', // Imagick Gd
        'upload_dir'        => DS.'upload_dir'.DS,
        'upload_lvl'        => 1,
        'upload_sym'        => 2,
        'use_temp_dir'      => false,
        'options'           => [
            'jpeg_quality'          => 75,
            'png_compression_level' => 9
        ]
    ];

    protected $_args        = [];
    protected $_temp        = [];
    protected $_config      = [];
    protected $_handle      = null;
    protected $_folder      = null;
    protected $_upload_dir  = '';
    protected $_upload_lvl  = 2;

    protected $last_id      = 0;
    protected $file_id      = 0;
    protected $group_id     = '';
    protected $isMulti      = false;
    protected $insertData   = true;

    protected $db           = '#__sys_files';
    protected $file_prefix  = 'original';
    protected $file_width   = 0;
    protected $file_height  = 0;
    protected $file_method  = 'resize';
    protected $file_offset  = false;
    protected $isCrop       = false;
    protected $file_name    = '';
    protected $file_path    = '';

    protected $valid = [
            0 => UPLOAD_ERR_OK,
            1 => UPLOAD_ERR_INI_SIZE,
            2 => UPLOAD_ERR_FORM_SIZE,
            3 => UPLOAD_ERR_PARTIAL,
            4 => UPLOAD_ERR_NO_FILE,
            6 => UPLOAD_ERR_NO_TMP_DIR,
            7 => UPLOAD_ERR_CANT_WRITE,
            8 => UPLOAD_ERR_EXTENSION
        ];

    public static function getInstance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function __construct($args = [])
    {
        $this->_args = $args;
        $this->_config = self::$config;

        $this->_validate();

        if (extension_loaded($this->_config['image_driver'])) {
            $_driver = $this->_config['image_driver'];
        } else {
            $_driver = null;

            $drivers = [
                'Imagick',
                'Gmagick',
                'Gd'
            ];

            $alternative = array_diff($drivers, [
                $this->_config['image_driver']
            ]);

            foreach ($alternative as $a) {
                if (extension_loaded($a) && $_driver === null) {
                    $_driver = $a;
                }
            }
        }

        $this->_imageDriver($_driver);
    }

    public static function config($config = [])
    {
        if (!empty($config)) {
            self::$config = array_merge(self::$config, $config);
        }
    }

    public function define($group_id = '')
    {
        $this->group_id = $group_id;

        if (!$this->group_id)
        {
            $this->group_id = substr(md5(uniqid().time()), 0, 12);
        }

        if (!empty($this->_args))
        {
            $flag = false;

            if (!$this->isMulti)
            {
                $this->_temp = $this->_args;
                $this->_create();
            }
            else
            {
                $this->_args = $this->_prepareArray($this->_args);

                foreach ($this->_args as $name => $file)
                {
                    $this->_temp = $file;
                    $this->_create();
                }
            }
        }

        return $this;
    }

    public function upload($group_id = '')
    {
        $this->group_id = $group_id;

        if (!$this->group_id) {
            $this->group_id = substr(md5(uniqid().time()), 0, 12);
        }

        if (!empty($this->_args)) {
            $flag = false;

            if (!$this->isMulti) {
                $this->_temp = $this->_args;

                // Создаем подпапки
                $this->_create();

                // Загружаем файлы
                $this->_upload();
            } else {
                $this->_args = $this->_prepareArray($this->_args);

                foreach ($this->_args as $name => $file) {
                    $this->_temp = $file;

                    // Создаем подпапки
                    $this->_create();

                    // Загружаем файлы
                    $this->_upload();
                }
            }
        }

        return $this;
    }

    public function readDir($recursive = false, $ignore = [])
    {
        $dir = ltrim(str_replace(PATH_ROOT, '', $this->_args), '/');

        if (is_dir(PATH_ROOT.DS.$dir)) {
            $handle = opendir(PATH_ROOT.DS.$dir);

            $resource = [];

            while (false !== ($entry = readdir($handle))) {
                if (is_file(PATH_ROOT.DS.$dir.DS.$entry)) {
                    $resource[] = DS.$dir.DS.$entry;
                }
            }

            closedir($handle);

            $this->_temp = array_diff(
                $resource,
                array_merge(
                    $ignore, [
                        '.',
                        '..',
                        '.gitkeep',
                        '.gitignore'
                    ]
                )
            );
        }

        return $this;
    }

    public function getFileId()
    {
        return $this->last_id;
    }

    public function getFile()
    {
        return $this->_temp;
    }

    public function resize($settings = [], $insertData = true)
    {
        if (empty($this->_temp) && empty($this->_args))
        {
            return $this;
        }

        if (!empty($settings))
        {
            $this->insertData = $insertData;

            if (empty($this->_temp))
            {
                $this->_temp = $this->_args;
            }

            if ($this->is_associative($this->_temp))
            {
                foreach ($this->_temp as $source)
                {
                    $this->_resize($source, $settings);
                }
            }
            else
            {
                $alt = isset($this->_temp['title']) ? $this->_temp['title'] : '';
                $name = isset($this->_temp['name']) ? $this->_temp['name'] : '';
                $this->file_id = isset($this->_temp['id']) ? $this->_temp['id'] : 0;
                $this->_resize($this->_temp['file'], $settings, $name, $alt);
            }

            return $this;
        }
    }

    private function _resize($source = '', $settings = [], $name = '', $alt = '')
    {
        $_source  = PATH_ROOT.$source;

        if (file_exists($_source))
        {
            list($w, $h) = getimagesize($_source);

            $ratio = max($w, $h) / min($w, $h);

            $this->handle = $this->manager->make($_source);

            foreach ($settings as $p)
            {
                $this->file_width  = $p['width'];
                $this->file_height = $p['height'];
                $this->file_method = $p['method'];
                $this->file_prefix = $p['prefix'];
                $this->file_offset = isset($p['offset']) ? $p['offset'] : false;

                $this->isCrop = $this->file_method === 'crop';

                $_max = max($this->file_width, $this->file_height);

                if ($_max > 0)
                {
                    if ($this->file_width == 0 && $this->file_height !== 0)
                    {
                        $this->file_width = ceil($this->file_height * $ratio);
                    }

                    if ($this->file_height == 0 && $this->file_width !== 0)
                    {
                        $this->file_height = ceil($this->file_width * $ratio);
                    }

                    $_padding = 0;

                    if ($this->file_offset)
                    {
                        $_percent = 10;
                        $_padding = $this->file_width > $this->file_height ?
                                    ceil($this->file_width / 100 * $_percent) :
                                    ceil($this->file_height / 100 * $_percent);
                    }

                    $this->file_name = $name !== '' ? $name : strtolower(basename($_source));
                    $this->file_name = $this->_prepare_name($this->file_name);

                    $this->_createDir();

                    $this->file_path = '';
                    $this->file_path .= $this->_config['upload_dir'].$this->_filedir.DS;
                    $this->file_path .= preg_replace('/(\.[a-z]+$)/', '_'.$this->file_method.'_'.$this->file_prefix.'.jpg', $this->file_name);

                    $_cloned = clone $this->handle;

                    $_handle = $this->manager->canvas($w, $h, 'ffffff');
                    $_handle->insert($_cloned, 'center');

                    if ($w >= $this->file_width || $h >= $this->file_height)
                    {
                        if (($this->isCrop && $w < $h) || (!$this->isCrop && $w >= $h))
                        {
                            $_handle->widen($this->file_height - $_padding);
                        }
                        else
                        {
                            $_handle->heighten($this->file_height - $_padding);
                        }
                    }

                    if ($this->isCrop)
                    {
                        $x = 0;
                        $y = 0;

                        $rw = $_handle->width();
                        $rh = $_handle->height();

                        if ($rw > $rh)
                        {
                            $_canvas = $_handle->fit($this->file_width, $this->file_height);
                        }
                        else
                        {
                            if ($rh !== $this->file_height) {
                                $y = ceil(($rh - $this->file_height) / 2);
                            }

                            if ($rw !== $this->file_width) {
                                $x = ceil(($rw - $this->file_width) / 2);
                            }

                            $_canvas = $_handle->crop($this->file_width, $this->file_height, $x, $y);
                        }
                    }
                    else
                    {
                        $_canvas = $this->manager->canvas($this->file_width, $this->file_height, '#ffffff');
                        $_canvas->insert($_handle, 'center');
                    }

                    $_canvas->interlace();

                    $_canvas->encode('jpg', $this->_config['options']['jpeg_quality']);

                    if (strtolower($this->_config['image_driver']) === 'imagick')
                    {
                        $_canvas->getCore()->stripImage();
                    }

                    $_canvas->save(PATH_ROOT.$this->file_path);

                    if ($this->insertData)
                    {
                        $this->_insert($this->file_name, $this->file_path, filesize(PATH_ROOT.$this->file_path), $alt);
                    }

                    unset($_handle, $_canvas);
                }
            }
        }
    }

    public function watermark($source = '')
    {
        // $img->insert('public/watermark.png');
    }

    private function _insert($name = '', $file = '', $size = '', $title = '')
    {
        if (empty($title))
        {
            $title = $name;
        }

        $ord = 0;

        $file = str_replace('/', '/', $file);

        $time = time();

        $this->last_id =
            Q("INSERT INTO `".$this->db."` SET
                `gid`=?s,
                `fid`=?i,
                `prefix`=?s,
                `name`=?s,
                `file`=?s,
                `size`=?i,
                `alt`=?s,
                `title`=?s,
                `ord`=?i,
                `created`=?i,
                `updated`=?i ON DUPLICATE KEY UPDATE `updated`=?i",
            [
                $this->group_id,
                $this->file_id,
                $this->file_prefix,
                $name,
                $file,
                $size,
                $title,
                $title,
                $ord,
                $time,
                $time,
                $time
            ]);

        if ($this->file_id == 0) {
            $this->file_id = $this->last_id;
        }
    }

    /**
     *
     */

    public function search()
    {
        /*
        $dir = "./backups/";
        // проверяем, что $dir - каталог
        if (is_dir($dir)) {
            // открываем каталог
            if ($dh = opendir($dir)) {
                // читаем и выводим все элементы
                // от первого до последнего
                while (($file = readdir($dh)) !== false) {
                    if(fnmatch('myfile_*.txt', $file))
                        echo 'Резервная копия: ';

                    echo "$file : " .
                         filetype($dir.$file)."<br />\n";

                }
                // закрываем каталог
                closedir($dh);
            }
        }

        foreach (glob("./backups/*.txt") as $filename) {
            echo "$filename : ".filesize($filename)." байт\n";
        }
        */
    }

    /**
     *
     */

    public function save()
    {
        /*
        Создаёт в системном временном каталоге временный файл со случайным именем. Созданный файл удаляется немедленно после закрытия.
        $temp_file = tmpfile();
        fwrite($temp, "=пишем в файл...=");
        fseek($temp, 0);
        echo fread($temp, 1024);
        // выводится
        // =пишем в файл...=
        fclose($temp); // закрываем и удаляем файл
        */

        return $this;
    }

    /**
     *
     */

    protected function remove()
    {
        /*
        $file = "./backups/readme_123.txt";

        if(!unlink($file)) {
            echo "Ошибка удаления файла $file...<br />\n";
        }

        //удаления каталогов

        $directory = "./backups";

        if(!rmdir($directory)) {
            echo "Ошибка удаления каталога $directory...<br />\n";
        }
        */

        return $this;
    }

    /**
     *
     */

    protected function duplicate()
    {
        /*
        $source = 'readme.txt';
        $dest = 'readme_copy.txt';

        if(!copy($source, $dest)) {
            echo "Ошибка копирования файла $source...<br />\n";
        }
        */

        return $this;
    }

    /**
     *
     */

    protected function relocate()
    {
        /*
        $number = 123;

        $source = 'readme.txt';
        $dest = "./backups/readme_$number.txt";

        if(!rename($source, $dest)) {
            echo "Ошибка перемещения файла $source...<br />\n";
        }
        */

        return $this;
    }


    /**
     *
     */

    private function _upload()
    {
        $this->_upload_file($this->_temp);
    }

    /**
     *
     */

    protected function _createDir()
    {
        if (isset($this->file_name))
        {
            $this->_filedir = substr(md5($this->file_name), 0, $this->_config['upload_sym']);

            $dir = PATH_ROOT.$this->_config['upload_dir'];

            if (!is_dir($dir.$this->_filedir))
            {
                if (!is_dir($dir))
                {
                    mkdir($dir);
                    chmod($dir, 0777);
                }

                mkdir($dir.$this->_filedir);
                chmod($dir.$this->_filedir, 0777);
            }
        }

        return $this;
    }

    protected function _create()
    {
        if (isset($this->_temp['name']))
        {
            if (is_array($this->_temp['name']))
            {
                $name = $this->_temp['name'][0];
            }
            else
            {
                $name = $this->_temp['name'];
            }

            $dir = PATH_ROOT.$this->_config['upload_dir'];

            $this->_filedir = substr(md5($name), 0, $this->_config['upload_sym']);

            if (!is_dir($dir.$this->_filedir))
            {
                if (!is_dir($dir))
                {
                    mkdir($dir);
                }

                mkdir($dir.$this->_filedir);
            }
        }

        return $this;
    }

    private function _validate()
    {
        if (is_array($this->_args)) {
            if ($this->is_associative($this->_args)) {
                $this->isMulti = true;

                foreach ($this->_args as $key => $value) {
                    if (isset($value['error']) && ($value['error'] == 4 || $value['error'][0] == 4)) {
                        unset($this->_args[$key]);
                    }

                    if (isset($value['link'])) {
                        $ch = curl_init($value['link']);

                        curl_setopt($ch, CURLOPT_NOBODY, true);
                        curl_exec($ch);

                        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                        curl_close($ch);

                        if ($code !== 200) {
                            unset($this->_args[$key]);
                        }
                    }
                }
            } else {
                $this->isMulti = false;

                if (isset($this->_args['error']) && ($this->_args['error'] == 4 || $this->_args['error'][0] == 4)) {
                    unset($this->_args);
                }

                if (isset($this->_args['link'])) {
                    $ch = curl_init($this->_args['link']);

                    curl_setopt($ch, CURLOPT_NOBODY, true);
                    curl_exec($ch);

                    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    curl_close($ch);

                    if ($code !== 200) {
                        unset($this->_args);
                    }
                }
            }
        }
    }

    public function download($link = '', $output_filename = '', $absolute = false)
    {
        if (!empty($link))
        {
            if ($absolute) {
                $output_file = $output_filename;
            } else {
                $output_file = PATH_ROOT.$output_filename;
            }

            if (function_exists('curl_version'))
            {
                set_time_limit(0);

                $url = parse_url($link);

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $link);
                curl_setopt($ch, CURLOPT_VERBOSE, 1);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_AUTOREFERER, false);
                curl_setopt($ch, CURLOPT_REFERER, $url['host']);
                curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
                curl_setopt($ch, CURLOPT_HEADER, 0);
                $result = curl_exec($ch);
                curl_close($ch);

                $fp = fopen($output_file, 'w');
                fwrite($fp, $result);
                fclose($fp);

                return true;
            }
            else
            {
                return file_put_contents($output_file, file_get_contents($link));
            }
        }

        return false;
    }

    private function _imageDriver($driver = 'Gd')
    {
        $this->manager = new ImageManager([
            'driver' => strtolower($driver)
        ]);
    }

    private function _upload_file($file = [])
    {
        $is_link = false;
        $is_file = false;
        $is_source = false;

        if (isset($file['tmp_name'])) {
            $is_file = true;
            $tmp_name = $file['tmp_name'];
        } elseif (isset($file['source'])) {
            $is_source = true;
            $tmp_name = $file['source'];
        } elseif (isset($file['link'])) {
            $is_link = true;
            $tmp_name = $file['link'];
        }

        $file_name = $this->_prepare_name($file['name'], $tmp_name);
        $file_path = $this->_config['upload_dir'].$this->_filedir.DS.strtolower($file_name);

        if (($is_source && copy($tmp_name, PATH_ROOT.$file_path)) ||
            ($is_file && move_uploaded_file($tmp_name, PATH_ROOT.$file_path)) ||
            ($is_link && $this->download($tmp_name, $file_path))) {

            chmod(PATH_ROOT.$file_path, 0644);

            $this->_insert($file_name, $file_path, filesize(PATH_ROOT.$file_path), $file['name']);
            $this->_temp['id'] = $this->last_id;
            $this->_temp['gid'] = $this->group_id;
            $this->_temp['file'] = $file_path;

            return $file_path;
        }

        return false;
    }

    private function _prepare_name($name = '', $tmp_name = '')
    {
        $extension = pathinfo($name, PATHINFO_EXTENSION);

        $file_name = substr(md5(uniqid()), 0, 4);
        $file_name .= '_';
        $file_name .= substr(md5($name), 4, 9);

        $file_name .= '.'.$extension;

        return $file_name;
    }

    private function is_associative(array $arr)
    {
        return isset($this->_args[0]) || isset($this->_args['name']) && is_array($this->_args['name']);
    }
}
