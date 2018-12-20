<?php

class Files
{
    public $table            = '#__sys_files';
    public $table_fields    = '#__mdd_fields';
    public $updir            = "/upload_dir/";
    public $prefix            = "";
    public $group_id        = "";
    public $lang            = "ru";
    public $last_id        = 0;

    public $m_type  = [
        'hqx' => 'application/mac-binhex40', 'cpt'=>'application/mac-compactpro', 'csv'=>array('text/x-comma-separated-values', 'text/comma-separated-values', 'application/octet-stream', 'application/vnd.ms-excel', 'text/csv', 'application/csv', 'application/excel', 'application/vnd.msexcel'), 'bin' => 'application/macbinary', 'ai' => 'application/postscript', 'dir' => 'application/x-director', 'tar' => 'application/x-tar', 'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'flv' => 'application/octet-stream', 'dms' => 'application/octet-stream', 'lha' => 'application/octet-stream', 'lzh' => 'application/octet-stream', 'exe' => 'application/octet-stream', 'class' => 'application/octet-stream', 'psd' => 'application/x-photoshop', 'so' => 'application/octet-stream', 'sea' => 'application/octet-stream', 'dll' => 'application/octet-stream', 'oda' => 'application/oda', 'pdf' => array('application/pdf', 'application/x-download'), 'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'eps' => 'application/postscript', 'ps' => 'application/postscript', 'smi' => 'application/smil', 'smil' => 'application/smil', 'mif' => 'application/vnd.mif', 'xls' => array('application/excel', 'application/vnd.ms-excel', 'application/msexcel'), 'ppt' => array('application/powerpoint', 'application/vnd.ms-powerpoint'), 'wbxml' => 'application/wbxml', 'wmlc' => 'application/wmlc', 'dcr' => 'application/x-director', 'word' => array('application/msword', 'application/octet-stream'),
        'dxr' => 'application/x-director', 'dvi' => 'application/x-dvi', 'gtar' => 'application/x-gtar', 'gz' => 'application/x-gzip', 'php' => 'application/x-httpd-php', 'php4' => 'application/x-httpd-php', 'php3' => 'application/x-httpd-php', 'phtml' => 'application/x-httpd-php', 'phps' => 'application/x-httpd-php-source', 'js' => 'application/x-javascript', 'swf' => 'application/x-shockwave-flash', 'sit' => 'application/x-stuffit', 'xl' => 'application/excel', 'eml' => 'message/rfc822',
        'tgz' => 'application/x-tar', 'xhtml' => 'application/xhtml+xml', 'xht' => 'application/xhtml+xml', 'zip' => array('application/x-zip', 'application/zip', 'application/x-zip-compressed'), 'mid' => 'audio/midi', 'midi' => 'audio/midi', 'mpga' => 'audio/mpeg', 'mp2' => 'audio/mpeg', 'mp3' => array('audio/mpeg', 'audio/mpg'), 'aif' => 'audio/x-aiff', 'aiff' => 'audio/x-aiff', 'aifc' => 'audio/x-aiff', 'ram' => 'audio/x-pn-realaudio', 'rm' => 'audio/x-pn-realaudio',
        'rpm' => 'audio/x-pn-realaudio-plugin', 'ra' => 'audio/x-realaudio', 'rv' => 'video/vnd.rn-realvideo', 'wav' => 'audio/x-wav', 'bmp' => 'image/bmp', 'gif' => 'image/gif', 'jpeg' => array('image/jpeg', 'image/pjpeg'), 'jpg' => array('image/jpeg', 'image/pjpeg'), 'jpe' => array('image/jpeg', 'image/pjpeg'), 'png' => array('image/png',  'image/x-png'), 'tiff' => 'image/tiff', 'tif' => 'image/tiff', 'css' => 'text/css', 'html' => 'text/html', 'htm' => 'text/html',
        'shtml' => 'text/html', 'txt' => 'text/plain', 'text' => 'text/plain', 'log' => array('text/plain', 'text/x-log'), 'rtx' => 'text/richtext', 'rtf' => 'text/rtf', 'xml' => 'text/xml', 'xsl' => 'text/xml', 'mpeg' => 'video/mpeg', 'mpg' => 'video/mpeg', 'mpe' => 'video/mpeg', 'qt' => 'video/quicktime', 'mov' => 'video/quicktime', 'avi' => 'video/x-msvideo', 'movie' => 'video/x-sgi-movie', 'doc' => 'application/msword'
    ];

    public function __construct()
    {
    }

    public function getGroupByFileId($id)
    {
        return Q("SELECT `gid` FROM `".$this->table."` WHERE `id`=?i LIMIT 1", array( $id ))->row('group_id');
    }

    public function getPhotoSettings($fid)
    {
        return Q("SELECT `photo_settings` FROM `".$this->table_fields."` WHERE `id`=LIMIT 1", array( $fid ))->row('photo_settings');
    }

    public function checkFormat($name="", $format, $mime_type="")
    {
        if ($mime_type != "") {
            if (is_array($format) && !empty($format)) {
                foreach ($format as $v) {
                    if (isset($this->m_type[$v])) {
                        if (is_array($this->m_type[$v])) {
                            foreach ($this->m_type[$v] as $val) {
                                if ($val == $mime_type) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        } else {
                            if ($this->m_type[$v] == $mime_type) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    } else {
                        return false;
                    }
                }
            } else {
                if (isset($this->m_type[$format])) {
                    if (is_array($this->m_type[$format])) {
                        foreach ($this->m_type[$format] as $val) {
                            if ($val == $mime_type) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    } else {
                        if ($this->m_type[$format] == $mime_type) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            }
        } else {
            if (!isset($name)) {
                return false;
            } else {
                $e = explode(".", $name);
                $c = count($e) - 1;
                $type = $e[$c];
            }

            if (isset($type) && $type != '') {
                if (is_array($format) && !empty($format)) {
                    if (in_array($type, $format)) {
                        return true;
                    }
                } elseif ($format) {
                    if ($type == $format) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    public function unlinkFiles($files = [])
    {
        $status = false;

        if (!empty($files))
        {
            if (isset($files[0]))
            {
                foreach ($files as $file)
                {
                    if ($file['file'] !== '')
                    {
                        $status = true;

                        Q("DELETE FROM `".$this->table."` WHERE `id`=?i LIMIT 1", [ $file['id'] ]);

                        if (file_exists(PATH_ROOT . $file['file']))
                        {
                            unlink(PATH_ROOT . $file['file']);
                        }
                    }
                }
            }
            elseif (isset($files['file']))
            {
                if ($files['file'] !== '')
                {
                    $status = true;

                    Q("DELETE FROM `".$this->table."` WHERE `id`=?i LIMIT 1", [ $files['id'] ]);

                    if (file_exists(PATH_ROOT.$files['file']))
                    {
                        unlink(PATH_ROOT.$files['file']);
                    }
                }
            }
        }

        return $status;
    }

    public function deleteFile($id = 0, $recursive = false)
    {
        $status = false;

        $cp = Q("SELECT `id`, `fid`, `file` FROM `".$this->table."` WHERE `id`=?i LIMIT 1", [ $id ])->row();

        if (!empty($cp))
        {
            if ($cp['fid'] !== '0' && $cp['fid'] !== 0)
            {
                $fid = $cp['fid'];
            }
            else
            {
                $fid = $cp['id'];
            }

            $status = $this->unlinkFiles($cp);

            if ($recursive)
            {
                $sizes = Q("SELECT `id`, `fid`, `file` FROM `".$this->table."` WHERE `fid`=?i OR `fid`=?i", [ $fid, $id ])->all();
                $this->unlinkFiles($sizes);
            }
        }

        return $status;
    }

    public function deleteGroupFiles($gid)
    {
        $arr = Q("SELECT `id` FROM `".$this->table."` WHERE `gid` LIKE ?s", array( $gid ))->all();

        foreach ($arr as $v) {
            $this->deleteFile($v['id']);
        }

        Q("DELETE FROM `".$this->table."` WHERE `gid` LIKE ?s", array( $gid ));
    }

    public function getFile($id)
    {
        return Q("SELECT * FROM `".$this->table."` WHERE `id`=?i LIMIT 1", array( $id ))->row();
    }

    public function getFilesByGroupPager($gid = [], $page=0, $l)
    {
        $photos = [];
        $count = 0;
        $start = $page * $l;
        $limit = "LIMIT ".$start.", ".$l;

        if (is_array($gid) && !empty($gid)) {
            $in = "'0'";
            foreach ($gid as $v) {
                $in .= " ,'".$v."'";
            }

            $arr    = Q("SELECT * FROM `".$this->table."` WHERE `photo_sm`<>'' and `gid` IN(".$in.") ORDER BY `ord` DESC " . $limit)->all();
            $count += Q("SELECT COUNT(*) as `count` FROM `".$this->table."` WHERE `photo_sm`<>'' and `gid` LIKE ?s LIMIT 1", array($v))->row('count');

            $photos = $this->getPrepared($arr);
        } else {
            if ($gid != '') {
                $arr    = Q("SELECT * FROM `".$this->table."` WHERE `photo_sm`<>'' and `gid`='".to_base($gid)."' ORDER BY `ord` DESC" . $limit)->all();
                $count += Q("SELECT COUNT(*) as `count` FROM `".$this->table."` WHERE `photo_sm`<>'' and `gid` LIKE ?s LIMIT 1", array($gid))->row('count');

                $photos = $this->getPrepared($arr);
            }
        }

        $pages    = ceil($count / $l);
        $page    = $page + 1;
        $pagers = array(
            'count'    =>    $count ,
            'pages'    =>    $pages ,
            'page'    =>    $page
        );

        return array('pagers'    =>    $pagers , 'photos'    =>    $photos);
    }

    protected function getPrepared($sample = [], $columns = [], $count = 0)
    {
        $result = [];

        if (!empty($sample)) {
            foreach ($sample as $arr) {
                $extension    = explode('.', $arr['file']);
                $extension    = strtolower(end($extension));
                $preview    = '';

                if (in_array($extension, array('jpg', 'jpeg', 'png', 'gif'))) {
                    $preview = $arr['file'];
                }

                $_temp = array(
                    "id"            => $arr['id'],
                    "gid"            => from_base($arr['gid']),
                    "name"            => from_base($arr['name']),
                    "file"            => $arr['file'],
                    "prefix"        => $arr['prefix'],
                    "size"            => $this->hsize($arr['size']),
                    "bsize"        => $arr['size'],
                    "alt"            => from_base($arr['alt']),
                    "title"        => from_base($arr['title']),
                    "ord"            => $arr['ord'],
                    "preview"        => $preview,
                    "visible"        => $arr['visible'],
                    "extension"        => $extension,
                    "created"        => Dates($arr['created'], 'ru', false)
                );

                if (is_array($columns) && !empty($columns)) {
                    $_temp = array_intersect_key($_temp, array_flip($columns));
                }

                $result[] = $_temp;
            }
        }

        if ($count > 0) {
            if ($count == 1) {
                $result = array_shift($result);
            } else {
                $result = array_slice($result, 0, $count);
            }
        }

        return $result;
    }

    public function getFilesByGroupCount($gid = '', $prefix = [], $columns = [], $count = 1, $rand = false)
    {
        $ord = $rand === true ? 'RAND()' : '`ord`';

        if (is_array($prefix)) {
            $where = "`prefix` IN (?ls)";
        } else {
            $where = "`prefix` LIKE ?s";
        }

        $result = Q("SELECT * FROM `".$this->table."` WHERE `gid` LIKE ?s AND ". $where ." ORDER BY ". $ord ." LIMIT ?i", array( $gid, $prefix, $count ))->all();

        return $this->getPrepared($result, $columns, $count);
    }

    public function getFilesByGroup($gid = '', $prefix = [], $columns = [], $group = false)
    {
        if (is_array($prefix)) {
            $where = "`prefix` IN (?ls)";
        } else {
            $where = "`prefix` LIKE ?s";
        }

        $result = Q("SELECT * FROM `". $this->table ."` WHERE `gid` LIKE ?s AND " . $where . " ORDER BY `ord` DESC", array( $gid, $prefix ))->all();

        if (!$group) {
            return $this->getPrepared($result, $columns);
        } else {
            $temp = [];

            if (!empty($result)) {
                foreach ($result as $file) {
                    if ($file['visible'] == 1) {
                        $id    = $file['id'];
                        $prefix = $file['prefix'];

                        if ($file['fid'] != 0) {
                            $id = $file['fid'];
                        }

                        if (is_array($columns) && !empty($columns)) {
                            $file = array_intersect_key($file, array_flip($columns));
                        }

                        $temp[$id][$prefix] = $file;
                    }
                }
            }

            return $temp;
        }
    }

    public function genGroupId()
    {
        return substr(md5(uniqid()), 0, 10);
    }

    public function prepareName($name, $tmp_name)
    {
        $res = "";
        $arr = explode(".", $name);
        $ext = array_pop($arr);
        $arr = implode(".", $arr);
        //
        if ($this->prefix) {
            $res = $this->prefix."_";
        }
        $res .= substr(md5($arr.$tmp_name.time()), 0, 8) . '_' . substr(md5($tmp_name.$arr.time()), 8, 4);
        $res .= ".".$ext;
        return $res;
    }

    public function hsize($bytes = 0)
    {
        $translate = array(
            "ru" => array(
                "gb"    => "Гб",
                "mb"    => "Мб",
                "kb"    => "Кб",
                "b"    => "б"
            ),
            "en" => array(
                "gb"    => "Gb",
                "mb"    => "Mb",
                "kb"    => "Kb",
                "b"    => "b"
            ),
            "de" => array(
                "gb"    => "Gb",
                "mb"    => "Mb",
                "kb"    => "Kb",
                "b"    => "b"
            )
        );

        if ($bytes >= 1073741824) {
            $bytes = round($bytes / 1073741824 * 100) / 100 ."&nbsp;". $translate[$this->lang]['gb'];
        } elseif ($bytes >= 1048576) {
            $bytes = round($bytes / 1048576 * 100) / 100 ."&nbsp;". $translate[$this->lang]['mb'];
        } elseif ($bytes >= 1024) {
            $bytes = round($bytes / 1024 * 100) / 100 ."&nbsp;". $translate[$this->lang]['kb'];
        } else {
            $bytes = $bytes ."&nbsp;" . $translate[$this->lang]['b'];
        }

        return $bytes;
    }
}
