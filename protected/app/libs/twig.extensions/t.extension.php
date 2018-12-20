<?php

class TExtension extends \Twig_Extension
{
    public function getFunctions()
    {
        return [
            't' => new \Twig_SimpleFunction('t', [$this, 'Translate']),
        ];
    }

    public function Translate($key = '', $params = [])
    {
        return t($key, $params);
    }

    public function getName() {
        return 't';
    }
}
