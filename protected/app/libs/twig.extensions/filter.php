<?php

class RainbowExtension extends \Twig_Extension
{
    private static $rainbowColors = array(
        '#FF0000',
        '#FF7F00',
        '#FFFF00',
        '#00FF00',
        '#0000FF',
        '#4B0082',
        '#8F00FF',
    );

    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('rainbow', array($this, 'rainbow'), array('is_safe' => array('html'))),
        );
    }

    public function rainbow($string)
    {
        $output = '';
        foreach (preg_split('//u', $string) as $i => $char) {
            $output .= sprintf('<span style="color:%s">%s</span>', self::$rainbowColors[$i % 7], $char);
        }

        return $output;
    }

    public function getName()
    {
        return 'rainbow';
    }
}
