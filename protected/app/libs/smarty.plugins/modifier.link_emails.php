<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     modifier.link_emails.php
 * Type:     modifier
 * Name:     link_emails
 * Purpose:  make emails in text into HTML links
 * -------------------------------------------------------------
 */
function smarty_modifier_link_emails($string)
{
    return preg_replace('!(\w+@\w+)!', '<a href="mailto:$1">$1</a>', $string);
}
