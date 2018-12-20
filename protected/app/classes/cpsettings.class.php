<?php

class cpSettings extends cpPage
{
    protected $db = [ 'name' => '#__sys_settings' ];

    public function __construct()
    {
        parent::__construct($this->db);
    }

    public function pages()
    {
        return Q("SELECT `id`, `name`, `sys_name` FROM `#__cp_structure` WHERE `pid`=0 ORDER BY `ord`")->all();
    }

    public function timezone()
    {
        return Q("SELECT * FROM `#__data_timezone` ORDER BY `name`")->all();
    }

    public function languages()
    {
        return Q("SELECT * FROM `#__str_locale` ORDER BY `ord`")->all();
    }
}
