<?php

final class dashboardController extends CPLoader
{
    use Singleton;

    private $meta = null;
    private $mdd = null;
    private $dispatch = null;
    private $folders = [];

    public function __construct()
    {
        parent::__construct();

        $this->meta = new Meta($this->element);
        $this->mdd = new Mdd();
        $this->dispatch = new Dispatch();
    }

    protected function setFolders()
    {
        $this->folders = [];

        $this->folders[] = ['folder' => PATH_ROOT.DS.'static', 'important' => true];
        $this->folders[] = ['folder' => PATH_ROOT.DS.'exchange', 'important' => false];
        $this->folders[] = ['folder' => PATH_ROOT.DS.'upload_dir', 'important' => true];
        $this->folders[] = ['folder' => PATH_SECURE.DS.'modules', 'important' => true];
        $this->folders[] = ['folder' => PATH_RUNTIME.DS.'logs', 'important' => true];
        $this->folders[] = ['folder' => PATH_RUNTIME.DS.'cache', 'important' => true];
    }

    public function perm()
    {
        $this->setFolders();

        if (isset($this->folders[$this->element])) {
            $folder = $this->folders[$this->element]['folder'];

            if (is_dir($folder)) {
                chmod($folder, 0777);
            } else {
                mkdir($folder, 0777);
            }
        }

        redirect($this->base_path);
    }

    public function index()
    {
        /*
        $bytes = disk_free_space(".");
        $si_prefix = array( 'B', 'KB', 'MB', 'GB', 'TB', 'EB', 'ZB', 'YB' );
        $base = 1024;
        $class = min((int)log($bytes , $base) , count($si_prefix) - 1);
        echo $bytes . '<br />';
        echo sprintf('%1.2f' , $bytes / pow($base,$class)) . ' ' . $si_prefix[$class] . '<br />';


        function HumanSize($Bytes)
        {
          $Type=array("", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta");
          $Index=0;
          while($Bytes>=1024)
          {
            $Bytes/=1024;
            $Index++;
          }
          return("".$Bytes." ".$Type[$Index]."bytes");
        }

        $dir = 'home/'
        $free = disk_free_space($dir);
        $total = disk_total_space($dir);
        $free_to_mbs = $free / (1024*1024)*1024;
        $total_to_mbs = $total / (1024*1024)*1024;
        echo 'You have '.$free_to_mbs.' MBs from '.$total_to_mbs.' total MBs';
        */

        function sys_getloadavg_hack()
        {
            return 0;

            // $str = substr(strrchr(shell_exec("uptime"),":"),1);
            // $avs = preg_split('/\ +/', $str, -1, PREG_SPLIT_NO_EMPTY);

            // return $avs;
        }

        function get_server_load()
        {
            $serverload = [];

            // DS checks if running windows
            if (DS != '\\') {
                if (function_exists('sys_getloadavg')) {
                    // sys_getloadavg() will return an array with [0] being load within the last minute.
                    $serverload = sys_getloadavg();
                    $serverload[0] = round($serverload[0], 4);
                } elseif (@file_exists('/proc/loadavg') && $load = @file_get_contents('/proc/loadavg')) {
                    $serverload = explode(' ', $load);
                    $serverload[0] = round($serverload[0], 4);
                }
                if (!is_numeric($serverload[0])) {
                    if (@ini_get('safe_mode') == 'On') {
                        return 'Unknown';
                    }

                    // Suhosin likes to throw a warning if exec is disabled then die - weird
                    if ($func_blacklist = @ini_get('suhosin.executor.func.blacklist')) {
                        if (strpos(','.$func_blacklist.',', 'exec') !== false) {
                            return 'Unknown';
                        }
                    }
                    // PHP disabled functions?
                    if ($func_blacklist = @ini_get('disable_functions')) {
                        if (strpos(','.$func_blacklist.',', 'exec') !== false) {
                            return 'Unknown';
                        }
                    }

                    $load = @exec('uptime');
                    $load = explode('load average: ', $load);
                    $serverload = explode(',', $load[1]);
                    if (!is_array($serverload)) {
                        return 'Unknown';
                    }
                }
            } else {
                return 'Unknown';
            }

            $returnload = trim($serverload[0]);

            return $returnload;
        }

        $load = sys_getloadavg_hack();

        //1 минута, 5 минут и 15 минут
        //$load = get_server_load();

        //exit(__debug($load));

        if ($load[0] > 80) {
            header('HTTP/1.1 503 Too busy, try again later');
            die('Server too busy. Please try again later.');
        }

        $this->setFolders();

        foreach ($this->folders as $k => $f) {
            if (file_exists($f['folder'])) {
                $perms = substr(sprintf('%o', fileperms($f['folder'])), -4);

                if ($perms == '0777') {
                    unset($this->folders[$k]);
                } else {
                    $this->folders[$k]['perms'] = substr(sprintf('%o', fileperms($f['folder'])), -4);
                    $this->folders[$k]['owner'] = substr(sprintf('%o', fileowner($f['folder'])), -4);
                }
            }

            if (!$f['important']) {
                unset($this->folders[$k]);
            }
        }

        $info['permissions'] = $this->folders;

        $technology = [];
        $technology['php'] = phpversion();

        if (function_exists('apache_get_version')) {
            $apache_get_version = explode('/', apache_get_version());
            $technology['apache'] = end($apache_get_version);
        }

        // if (extension_loaded('mysqli')) {
        //     $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS);
        //     $technology['mysql'] = $mysqli->server_info;
        //     $mysqli->close();
        // }

        if (isset($_SERVER['SERVER_SOFTWARE'])) {
            $temp = explode('/', $_SERVER['SERVER_SOFTWARE']);
            if (count($temp) == 2) {
                $technology[$temp[0]] = $temp[1];
            }
        }

        if (extension_loaded('memcached')) {
            $m = new Memcached();
            $m->addServer($this->server, 11211);
            $version = $m->getVersion();
            $technology['memcached'] = is_array($version) ? current($version) : [];
        }

        $info['technology'] = $technology;

        return $info;
    }
}
