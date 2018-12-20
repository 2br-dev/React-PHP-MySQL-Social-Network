<?php

session_start();

if (isset($_SESSION['userinf']['gid']) && in_array($_SESSION['userinf']['gid'], [ 1, 10 ]))
{
	phpinfo();
}
else
{
	exit('У вас нет прав для просмотра этой страницы');
}