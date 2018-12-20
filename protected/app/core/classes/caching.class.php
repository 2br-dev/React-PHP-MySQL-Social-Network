<?php

declare(strict_types=1);

namespace Fastest\Core;

use phpFastCache\Helper\Psr16Adapter;

class Caching
{
    private $cache = null;
    private $prefix = null;
    private $enabled = true;
    private $compress = null;
    private $lifetime = 3600;
    private $environment = 'page';

    private static $_instance = null;

    public function __construct()
    {
        $this->prefix = md5(gethostname());
        $this->enabled = defined('ENABLECACHE') && ENABLECACHE;
        $this->compress = defined('MEMCACHE_COMPRESSED') && MEMCACHE_COMPRESSED;

        if (extension_loaded('memcached')) {
            $this->init('memcached', [
                'servers' => [[
                    'host' => '127.0.0.1',
                    'port' => 11211,
                ],
                'compress_data' => $this->compress,
            ], ]);
        } else {
            $this->init('Files', [
                'path' => PATH_CACHE,
                'itemDetailedDate' => false,
            ]);
        }

        if (!$this->enabled) {
            $this->clearCache();
        }
    }

    public static function getInstance()
    {
        if ( !(self::$_instance instanceof self) ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    protected function getKey($key = '')
    {
        $key = str_replace([' ', ',', ':'], '_', $key);

        return md5($this->prefix.$key);
    }

    protected function init($driver = '', $config = [])
    {
        $this->cache = new Psr16Adapter($driver, $config);
    }

    public function getCache($key = '')
    {
        $key = $this->getKey($key);

        if (!$this->enabled) {
            return false;
        }

        if (!($this->cache->get($key) === false)) {
            return $this->cache->get($key);
        }

        return false;
    }

    public function setCache($key = '', $value = '')
    {
        $key = $this->getKey($key);

        if ($this->enabled) {
            $this->cache->set($key, $value, $this->lifetime);
        }
    }

    public function getCompiled($key = '')
    {
        $key = $this->getKey($key);

        if (!$this->enabled || !($data = $this->cache->get($key))) {
            return false;
        }

        return $data;
    }

    public function deleteCache($key = '')
    {
        $key = $this->getKey($key);

        if ($this->enabled && $key) {
            $this->cache->delete($key);
        }

        gc_collect_cycles();
    }

    public function clearCache()
    {
        if ($this->enabled) {
            $this->cache->clear();
        }

        gc_collect_cycles();
    }
}
