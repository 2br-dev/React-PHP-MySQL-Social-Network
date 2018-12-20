<?php

$t1 = microtime(true);

require 'define.php';

$app = new Fastest\Core\App();

$app->terminate($_SERVER);

# Load time
// $app->logger($t1);
