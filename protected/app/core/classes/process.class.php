<?php

declare(strict_types=1);

namespace Fastest\Core;

class Process extends \Fastest\Core\Init
{
    public $count = 100;

    public $progress = 0;

    public function __construct()
    {
        // parent::__construct();
    }

    public function tick()
    {
        $this->progress += 1;

        return $this->response([
        	'progress' => $this->progress
        ]);
    }

    public function response($data)
    {
        header('Content-Type: application/json');
        return json_encode($data, 64 | 256);
    }
}
