<?php

final class tasksController extends CPLoader
{
    use Singleton;
    
    public function __construct()
    {
        parent::__construct();
    }
    
    public function index()
    {
        $info['tasks_list'] = Q("SELECT * FROM `#__cp_tasks`")->all();

        return $info;
    }
}
