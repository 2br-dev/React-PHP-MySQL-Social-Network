<?php

final class Integration extends Crawler
{
    use Singleton;
    private $args                = [];

    public function __construct()
    {
        parent::__construct();
    }
}
