<?php

class UrlExtension extends \Twig_Extension
{
    public function getFunctions()
    {
        return [
            'url' => new \Twig_SimpleFunction('url', [$this, 'Create']),
        ];
    }

    public function Create()
    {
        $arguments = func_get_args();

        __($arguments);

        return sprintf('/%s', implode($arguments, '/'));
    }

    public function getName() {
        return 'url';
    }
}
