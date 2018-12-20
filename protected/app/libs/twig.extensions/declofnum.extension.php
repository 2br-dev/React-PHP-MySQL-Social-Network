<?php

class DeclofnumExtension extends \Twig_Extension
{
    public function getFunctions()
    {
        return [
            'declofnum' => new \Twig_SimpleFunction('declofnum', [$this, 'Translate']),
        ];
    }

    public function Translate($key = '', $params = [])
    {
        return declofnum($key, $params);
    }

    public function getName() {
        return 'declofnum';
    }
}
