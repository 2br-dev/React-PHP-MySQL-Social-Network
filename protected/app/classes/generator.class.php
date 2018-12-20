<?php

class generator
{
    private $replacement = array(
                '"'        =>    '&quot;',
                '&'        =>    '&amp;',
                '>'        =>    '&gt;',
                '<'        =>    '&lt;',
                "\'"    =>    '&apos;'
            );

    private $header = [
        'xml' => '<?xml version="1.0" encoding="utf-8"?>',
        'yml' => '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE yml_catalog SYSTEM "shops.dtd">'
    ];

    public function __construct()
    {
        //parent::__construct();
    }
}
