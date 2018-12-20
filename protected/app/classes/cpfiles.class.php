<?php

class cpFiles extends CPLoader
{
    use Tools, Singleton;

    private $table          = '#__sys_files';
    private $table_fields   = '#__mdd_fields';
    private $updir          = '/upload_dir/';
    private $prefix         = '';
    private $group          = '';
    private $last_id        = 0;

    public function __construct($db = null) {}

    public function get(string $group = '', int $count = 0, int $page = 0, int $limit) {}

    public function delete(array $files = [], bool $recursive = true)
    {
        $status = false;

        // if (!empty($files))
        // {
        //     if (isset($files[0]))
        //     {
        //         foreach ($files as $file)
        //         {
        //             if ($file['file'] !== '')
        //             {
        //                 $status = true;

        //                 Q('DELETE FROM `'.$this->table.'` WHERE `id`=?i LIMIT 1', [ $file['id'] ]);

        //                 if (file_exists(PATH_ROOT . $file['file']))
        //                 {
        //                     unlink(PATH_ROOT . $file['file']);
        //                 }
        //             }
        //         }
        //     }
        //     elseif (isset($files['file']))
        //     {
        //         if ($files['file'] !== '')
        //         {
        //             $status = true;

        //             Q('DELETE FROM `'.$this->table.'` WHERE `id`=?i LIMIT 1', [ $files['id'] ]);

        //             if (file_exists(PATH_ROOT.$files['file']))
        //             {
        //                 unlink(PATH_ROOT.$files['file']);
        //             }
        //         }
        //     }
        // }

        return $status;
    }

    public function humanize(int $bytes = 0)
    {
        $translate = [
            'ru' => [
                'gb'    => 'Гб',
                'mb'    => 'Мб',
                'kb'    => 'Кб',
                'b'     => 'б'
            ],
            'en' => [
                'gb'    => 'Gb',
                'mb'    => 'Mb',
                'kb'    => 'Kb',
                'b'     => 'b'
            ],
            'de' => [
                'gb'    => 'Gb',
                'mb'    => 'Mb',
                'kb'    => 'Kb',
                'b'     => 'b'
            ]
        ];

        if ($bytes >= 1073741824) {
            $bytes = round($bytes / 1073741824 * 100) / 100 .'&nbsp;'. $translate[$this->locale]['gb'];
        } elseif ($bytes >= 1048576) {
            $bytes = round($bytes / 1048576 * 100) / 100 .'&nbsp;'. $translate[$this->locale]['mb'];
        } elseif ($bytes >= 1024) {
            $bytes = round($bytes / 1024 * 100) / 100 .'&nbsp;'. $translate[$this->locale]['kb'];
        } else {
            $bytes = $bytes .'&nbsp;' . $translate[$this->locale]['b'];
        }

        return $bytes;
    }
}
