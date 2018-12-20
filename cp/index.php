<?php
$t1 = microtime(true);

include_once '../define.php';

$_SESSION['file_array'] = [];

$cp = new cpLoader;
$cp->run();

/*
 * Log load time
 */

// $cp->log($t1, false);
