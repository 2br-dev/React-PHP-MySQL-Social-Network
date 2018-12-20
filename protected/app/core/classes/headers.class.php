<?php

declare(strict_types=1);

namespace Fastest\Core;

class Headers extends \Fastest\Core\Init
{
    private $cacheEnable = false;

    private $headers = [];

    private $oneMonth = 2592000;

    public function __construct($cacheEnable = true, $nonce = '')
    {
        parent::__construct();

        $this->headers[] = 'X-POWERED-CMS: Fastest-CMF ('.md5($this->domain).')';

        if (!count($_POST)) {
            $this->cacheEnable = $cacheEnable;
        }

        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            $this->headers[] = 'Content-Type: application/json';
        }

        $this->_xss();

        $this->_p3p();

        $this->_csp($nonce);

        $this->_cache();

        $this->_expectCT();

        $this->_apply();

        // $this->_list();
    }

    private function _cache()
    {
        if ($this->cacheEnable)
        {
            $this->_add('Cache-control: max-age='.$this->oneMonth.', private, must-revalidate');
            $this->_add('Expires: '.gmdate('D, d M Y H:i:s', time() + $this->oneMonth).' GMT');
            $this->_add('Last-Modified: '.gmdate('D, d M Y H:i:s', (time() - 3600)).' GMT');
        }
        else
        {
            $this->_add('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
            $this->_add('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');
            $this->_add('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
            $this->_add('Strict-Transport-Security: max-age='.$this->oneMonth.'; includeSubDomains; preload');
            $this->_add('Pragma: no-cache');
        }
    }

    private function _xss()
    {
        if (!$this->cacheEnable)
        {
            $this->_add('X-XSS-Protection: 1; mode=block');
        }
    }

    private function _csp($nonce = '')
    {
        if (defined('ENABLE_CPS') && ENABLE_CPS)
        {
            // https://habrahabr.ru/company/nixsolutions/blog/271575/

            if (defined('ENABLE_CPS_REPORT_ONLY') && ENABLE_CPS_REPORT_ONLY)
            {
                $_header = 'Content-Security-Policy-Report-Only: ';
            }
            else
            {
                $_header = 'Content-Security-Policy: ';
            }

            // $_csp = [
            //     'connect-src'       => [ "'self'", 'https://mc.yandex.ru', '*.google-analytics.com', 'google-analytics.com', 'https://*.google-analytics.com', 'https://google-analytics.com' ],
            //     'default-src'       => [ "'self'" ],
            //     'font-src'          => [ "'self'", 'https://fonts.gstatic.com', 'data:', ],
            //     'frame-ancestors'   => [ "'self'" ],
            //     'object-src'        => [ "'none'" ],
            //     'child-src blob'    => [ "'self'", 'https://mc.yandex.ru' ],
            //     'frame-src blob'    => [ "'self'", 'https://mc.yandex.ru' ],
            //     'img-src'           => [ "'self'", 'data:', 'https:', "'unsafe-inline'", 'https://mc.yandex.ru' ],
            //     'media-src'         => [ "'self'", sprintf('*.%s', $this->domain) ],
            //     'script-src'        => [ "'self'", "'unsafe-inline'", 'https://ssl.google-analytics.com', 'api-maps.yandex.ru', 'https://*.googleapis.com', '*.googleapis.com', '*.google-analytics.com', 'https://mc.yandex.ru', 'https://yastatic.net', sprintf("'nonce-%s'", $this->nonceToken) ],
            //     'style-src'         => [ "'self'", "'unsafe-inline'", "'unsafe-eval'" ],
            //     'report-uri'        => [ sprintf('%s/policies', $this->host) ]
            // ];

            $_csp = [
                'default-src' => ["'none'"],
                'connect-src' => ["'self'", '*.google-analytics.com', 'https://mc.yandex.ru'],
                'base-uri' => ["'self'"],
                'font-src' => ["'self'", 'data:', 'https://fonts.gstatic.com'],
                'frame-ancestors' => ["'self'"],
                'object-src' => ["'none'"],
                'child-src blob' => ["'self'"],
                'frame-src blob' => ["'self'"],
                'form-action' => ["'self'"],
                'img-src' => ["'self'", 'data:', 'https:', "'unsafe-inline'"],
                'manifest-src' => ["'self'"],
                'media-src' => ["'self'", sprintf('*.%s', $this->domain)],
                'script-src' => ["'self'", "'unsafe-inline'", 'https:', sprintf("'nonce-%s'", $nonce), "'strict-dynamic'"],
                'style-src' => ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                'report-uri' => [sprintf('%s/api/policies/report', $this->host)],
                'worker-src' => ["'self'"]
            ];

            // exit(__(
            //     base64_encode(hash('sha256', file_get_contents(PATH_ROOT.DS.'js/vendors.min.js'), true))
            // ));

            // Content-Security-Policy: script-src 'self' 'sha256-78iKLlw3hSqddlf6qm/PGs1MvBzpvIEWioaoNxXIZwk='
            // header("Content-Security-Policy: script-src 'self' 'sha256-".base64_encode(hash('sha256', 'alert("allowed");', true))."'");
            // Content-Security-Policy: script-src js.example.com 'sha256-xzi4zkCjuC8lZcD2UmnqDG0vurmq12W/XKM5Vd0+MlQ=';

            foreach ($_csp as $name => $data) {
                $_header .= sprintf('%s %s; ', $name, implode(' ', $data));
            }

            $this->_add($_header);
        }
    }

    private function _p3p()
    {
        if (defined('ENABLE_P3P') && ENABLE_P3P)
        {
            $this->_add('P3P: policyref="/api/policies/p3p", CP="IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT"');
        }
    }

    private function _expectCT()
    {
        if (defined('ENABLE_EXPECT_CT') && ENABLE_EXPECT_CT)
        {
            $this->_add('Expect-CT: enforce; max-age='.$this->oneMonth.'; report-uri="'.$this->host.'/api/policies/expect_ct"');
        }
    }

    private function _list()
    {
        exit(__(headers_list()));
    }

    private function _add($header = '')
    {
        if ($header)
        {
            $this->headers[] = $header;
        }
    }

    private function _apply()
    {
        foreach ($this->headers as $header)
        {
            header($header);
        }
    }
}
