<?php

final class statsController extends CPLoader
{
    use Singleton;
    
    public function __construct()
    {
        parent::__construct();
    }
    
    public function index()
    {
        $bot = '';
        
        if (strstr($_SERVER['HTTP_USER_AGENT'], 'Yandex')) {
            $bot='Yandex';
        } elseif (strstr($_SERVER['HTTP_USER_AGENT'], 'Googlebot')) {
            $bot='Google';
        } elseif (strstr($_SERVER['HTTP_USER_AGENT'], 'Slurp')) {
            $bot='Slurp';
        } elseif (strstr($_SERVER['HTTP_USER_AGENT'], 'WebCrawler')) {
            $bot='WebCrawler';
        } elseif (strstr($_SERVER['HTTP_USER_AGENT'], 'ZyBorg')) {
            $bot='ZyBorg';
        } elseif (strstr($_SERVER['HTTP_USER_AGENT'], 'google')) {
            $bot='Google';
        } elseif (strstr($_SERVER['HTTP_USER_AGENT'], 'scooter')) {
            $bot='AltaVista';
        } elseif (strstr($_SERVER['HTTP_USER_AGENT'], 'stack')) {
            $bot='Rambler';
        } elseif (strstr($_SERVER['HTTP_USER_AGENT'], 'aport')) {
            $bot='Aport';
        } elseif (strstr($_SERVER['HTTP_USER_AGENT'], 'lycos')) {
            $bot='Lycos';
        } elseif (strstr($_SERVER['HTTP_USER_AGENT'], 'fast')) {
            $bot='Fast Search';
        } elseif (strstr($_SERVER['HTTP_USER_AGENT'], 'rambler')) {
            $bot='Rambler';
        }

        if ($bot !== '') {
            $ip = $REMOTE_ADDR;
            $date = date("d.m.Y");
            $home = $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            $fh = fopen('sebot', "r");
            $fil = fread($fh, filesize('sebot'));
            fclose($fh);
            $con=$date.":::".$bot.":::".$ip.":::".$home."::: \r\n".$fil;
            $file=fopen("sebot", "w");
            fputs($file, $con);
            fclose($file);
        }
    }

    public function post()
    {
        $action = __post("action");

        if ($action == "settings") {
            redirect($this->base_path);
        }
    }
}
