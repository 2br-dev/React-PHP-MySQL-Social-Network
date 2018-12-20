<?php

class cpParameters extends cpPage
{
    protected $db = [ 'name' => '#__sys_parameters' ];

    public function __construct()
    {
        parent::__construct($this->db);
    }
}
