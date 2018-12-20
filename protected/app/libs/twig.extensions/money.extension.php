<?php

class MoneyExtension extends \Twig_Extension
{
    public function getFunctions()
    {
        return [
            'money' => new \Twig_SimpleFunction('money', [$this, 'Money']),
        ];
    }

    public function Money($value = 0)
    {
        return to_money(intval(str_replace(' ', '', $value)));
    }

    public function getName() {
        return 'money';
    }
}
