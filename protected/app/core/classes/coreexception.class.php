<?php

declare(strict_types=1);

namespace Fastest\Core;

class CoreException extends \Exception
{
    public function errorMessage()
    {
        $errorMsg = 'Error on line '.$this->getLine().' in '.$this->getFile()
        .': <b>'.$this->getMessage().'</b> is not a valid E-Mail address';

        return $errorMsg;
    }
}
