<?php

trait Singleton
{
    private static $instance;

    private function __clone()
    {
    }

    private function __construct()
    {
    }

    public static function getInstance()
    {
        if (!(self::$instance instanceof self)) {
            self::$instance = new self;
        }
        return self::$instance;
    }
}
