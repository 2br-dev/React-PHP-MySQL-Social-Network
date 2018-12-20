<?php

declare(strict_types=1);

namespace Fastest\Core;

class Init extends \Fastest\Core\Viewer
{
    use \Tools, \Singleton;

    public $path = [];
    public $root = [];

    protected $url = null;
    protected $host = null;
    protected $proto = null;
    protected $query = null;
    protected $locale = null;
    protected $domain = null;
    protected $request = null;
    protected $original = null;
    protected $backuri = null;
    protected $server = 'localhost';

    protected $caching = false;

    protected $search_var = 'q';

    public function __construct()
    {
        $this->proto = $_SERVER['proto'];
        $this->domain = $_SERVER['HTTP_HOST'];
        $this->query = $_SERVER['QUERY_STRING'];
        $this->request = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
        $this->backuri = base64_encode($this->request);
        $this->locale = $this->getLocale($this->request);
        $this->url = current(explode('?', $this->request));
        $this->path = preg_split('/\/+/', $this->url, -1, PREG_SPLIT_NO_EMPTY);
        $this->host = sprintf('%s://%s', $this->proto, $this->domain);

        $this->search_var = defined('SEARCH_VAR') ? SEARCH_VAR : 'query';

        $this->checkCaptcha();

        parent::__construct();
    }

    protected static function generateToken($length = 33)
    {
        if (function_exists('random_bytes')) {
            $token = bin2hex(random_bytes($length));
        } else {
            $token = bin2hex(openssl_random_pseudo_bytes($length));
        }

        return $token;
    }

    protected static function base64Token($length = 33)
    {
        return \Base64Url\Base64Url::encode(self::generateToken($length));
    }

    private function checkCaptcha()
    {
        if (isset($this->path[0]) && $this->path[0] === 'captcha') {
            $captcha = new \Captcha;
        }
    }
}
