<?php

class Log
{
    public $num_rows    = 1000;        //	Max records in the table
    public $table        = "#__sys_log"; //	Max records in the table
    public $mysql        = null;

    public function __construct($type='', $msg='')
    {
        $this->checkOverflow();

        if ($type && $msg) {
            $this->write($type, $msg);
        }
    }
    
    public function write($type = '', $msg = '')
    {
        Q("INSERT INTO `".$this->table."` SET 
		`type`	='".$type."', 
		`msg`	='".$msg."', 
		`desc`	='".to_base($this->getUserInfo())."',
		`server`='".to_base($this->getAllInfo())."',
		`date`	=NOW()") ;
    }
    
    public function delLog($id=0)
    {
        if ($id) {
            Q("DELETE FROM `".$this->table."` WHERE `id`=?i LIMIT 1", array( $id ));
        }
    }
    
    public function read($pager=10)
    {
        $arr = Q("SELECT `id`, `msg`, `type`, `desc`, `server`, `date` FROM `".$this->table."` ORDER BY `id` DESC")->all();
        return $arr;
    }
    
    public function getUserInfo()
    {
        $arr = array(
            "Хост/Домен"        => @$_SERVER['HTTP_HOST'],
            "Браузер"            => @$_SERVER['HTTP_USER_AGENT'],
            "Страница сайта"    => "http://".@$_SERVER['HTTP_HOST'].@$_SERVER['REQUEST_URI'],
            "Внешний ip адрес"    => @$_SERVER['REMOTE_ADDR'],
            "ip адрес подсети"    => @$_SERVER['HTTP_X_FORWARDED_FOR'],
            "Пользователь"        => @$_SESSION['user'],
        );

        return serialize($arr);
    }
    
    public function getAllInfo()
    {
        return serialize($_SERVER);
    }

    public function checkOverflow()
    {
        $limit = Q("SELECT COUNT(*) as `count` FROM `".$this->table."`")->row('count');

        if ($limit>0) {
            Q("DELETE FROM `".$this->table."` ORDER BY `id` LIMIT ".($limit));
        }
    }
}
