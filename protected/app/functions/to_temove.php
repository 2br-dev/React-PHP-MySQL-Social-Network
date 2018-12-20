<?php

// sendMail2('subject', 'test message', 'mr.tobiko@bk.ru', ['ed.proff@gmail.com' => 'ed.proff@gmail.com'], 'qwert54321', 'smtp.mail.ru');
// sendMail2('subject', 'test message', '2tobiko2@gmail.com', ['ed.proff@gmail.com' => 'ed.proff@gmail.com'], 'qwert54321', 'smtp.google.com');

function sendMail2($subject = '', $message = '', $from = '', $to = '', $password = '', $host = '')
{
    $tpl = new Smarty;

    $tpl->setTemplateDir(PATH_THEMES);
    $tpl->setCompileDir(PATH_CACHE);
    $tpl->setCacheDir(PATH_CACHE);
    $tpl->setCaching(false);

    $tpl->addPluginsDir(PATH_CORE.DS.'lib/templaters/smarty/plugins/');
    $tpl->addPluginsDir(PATH_CORE.DS.'lib/templaters/smarty/plugins_cms/');

    $domain = str_replace(array('http://', 'www.', 'www') , '', $_SERVER['SERVER_NAME']);

    $tpl->assign('domain', $domain);
    $tpl->assign('subject', $subject);
    $tpl->assign('message', $message);

    $mail = new PHPMailer;

    try {
        if (!empty($to))
        {
            $mail->isSMTP();

            $mail->Host             = $host;            // sets the SMTP server
            $mail->SMTPKeepAlive    = true;

            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );

            $mail->SMTPDebug  = 2;                      // enables SMTP debug information (for testing)
            $mail->Debugoutput = 'html';

            $mail->Username   = $from;                  // SMTP account username
            $mail->Password   = $password;              // SMTP account password

            $mail->Port             = 587;
            $mail->SMTPSecure       = 'tls';
            $mail->SMTPAuth         = true;             // enable SMTP authentication

            $mail->setFrom($from, $from);

            if (file_exists(PATH_ROOT.'/images/logo.png'))
            {
                $mail->addAttachment(PATH_ROOT.'/images/logo.png', '/images/logo.png');
            }

            if (is_array($to))
            {
                foreach ($to as $key => $email)
                {
                    if (is_email($email))
                    {
                        $mail->AddAddress(trim($email));
                    }
                }
            }
            elseif (is_email($to))
            {
                $mail->AddAddress(trim($to));
            }

            $mail->CharSet = 'utf-8';
            $mail->Subject = $subject;

            $mail->isHTML(true);
            $mail->msgHTML($tpl->fetch(PATH_THEMES.DS.SITE_THEME.'/smarty/message/default.tpl'));

            if ($mail->send())
            {
                return true;
            }
            else {
                echo "Mailer Error: " . $mail->ErrorInfo;
            }

            $mail->ClearAddresses();
            $mail->ClearAttachments();
        }

        return false;
    }
    catch (phpmailerException $e)
    {
        echo $e->errorMessage();
    }
    catch (Exception $e)
    {
        echo $e->getMessage();
    }
}

function sendMail($subject = '', $message = '', $from = '', $to = '', $password = '', $host = '')
{
    $tpl = new Smarty();

    $tpl->setTemplateDir(PATH_THEMES);
    $tpl->setCompileDir(PATH_CACHE);
    $tpl->setCacheDir(PATH_CACHE);
    $tpl->setCaching(false);

    $tpl->addPluginsDir(PATH_CORE.DS.'lib/templaters/smarty/plugins/');
    $tpl->addPluginsDir(PATH_CORE.DS.'lib/templaters/smarty/plugins_cms/');

    $domain = str_replace(array('http://', 'www.', 'www'), '', $_SERVER['SERVER_NAME']);

    $tpl->assign('domain', $domain);
    $tpl->assign('subject', $subject);
    $tpl->assign('message', $message);

    $mail = new PHPMailer();

    try {
        if (!empty($to)) {
            $mail->IsSMTP();
            $mail->IsHTML(true);

            $mail->Host       = $host;                    // sets the SMTP server
            $mail->SMTPAuth   = true;                      // enable SMTP authentication
            $mail->SMTPKeepAlive = true;

            // $mail->SMTPDebug  = 1;                     	// enables SMTP debug information (for testing)

            $mail->Username   = $from;                    // SMTP account username
            $mail->Password   = $password;                // SMTP account password

            $mail->SMTPSecure        = "ssl";
            $mail->Port                = 465;

            $mail->setFrom($from, $from);

            if (file_exists(PATH_ROOT.'/images/logo.png')) {
                $mail->addAttachment('/images/logo.png');
            }

            if (is_array($to)) {
                foreach ($to as $email => $value) {
                    if (is_email($email)) {
                        $mail->AddAddress(trim($email));
                    }
                }
            } elseif (is_email($to)) {
                $mail->AddAddress(trim($to));
            }

            $mail->CharSet = 'utf-8';
            $mail->Subject = $subject;

            $mail->msgHTML($tpl->fetch(PATH_THEMES.DS.SITE_THEME.'/smarty/message/default.tpl'));

            if ($mail->send()) {
                return true;
            } else {
                // echo "Mailer Error: " . $mail->ErrorInfo;
            }

            $mail->ClearAddresses();
            $mail->ClearAttachments();
        }

        return false;
    } catch (phpmailerException $e) {
        echo $e->errorMessage();
    } catch (Exception $e) {
        echo $e->getMessage();
    }
}
