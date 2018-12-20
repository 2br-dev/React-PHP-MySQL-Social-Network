<?php

class Caching
{
    private $cache = null;
    private $cache_enable = false;

    public function __construct()
    {
        $this->initCache();
        $this->cache_enable = ENABLECACHE;
    }

    public function initCache($driver = 'memcached')
    {
        $driver = strtolower($driver);

        switch ($driver) {
            case 'MemoryStore':
                $this->cache = new \MatthiasMullie\Scrapbook\Adapters\MemoryStore();
            break;

            case 'redis':
                $client = new \Redis();
                $client->connect('127.0.0.1');

                $this->cache = new \MatthiasMullie\Scrapbook\Adapters\Redis($client);
            break;

            case 'couchbase':
                $cluster = new \CouchbaseCluster('couchbase://localhost');
                $bucket = $cluster->openBucket('default');

                $this->cache = new \MatthiasMullie\Scrapbook\Adapters\Couchbase($bucket);
            break;

            case 'apc':
                $this->cache = new \MatthiasMullie\Scrapbook\Adapters\Apc();
            break;

            case 'mysql':
                $client = new \PDO('mysql:dbname='.DB_BASE.';host='.DB_HOST.'', DB_USER, DB_PASS);

                $this->cache = new \MatthiasMullie\Scrapbook\Adapters\MySQL($client);
            break;

            case 'flysystem':
                $adapter = new \League\Flysystem\Adapter\Local(PATH_CACHE, LOCK_EX);
                $filesystem = new \League\Flysystem\Filesystem($adapter);

                $this->cache = new \MatthiasMullie\Scrapbook\Adapters\Flysystem($filesystem);
            break;

            case 'memcache':
            case 'memcached':
                // $client = new \Memcached();
                // $client->addServer('localhost', 11211);

                // $this->cache = new \MatthiasMullie\Scrapbook\Adapters\Memcached($client);
            break;
        }
    }

    protected function getCache($key = '', $global = false)
    {
        if (!$this->cache_enable)
        {
            return false;
        }

        if (!$global)
        {
            $key .= $this->cache_path;
        }

        $hash = md5($this->domain.$key);

        if (!($this->cache->get($hash) === false))
        {
            return $this->cache->get($hash);
        }

        return false;
    }

    protected function setCache($key = '', $value = '', $global = false)
    {
        if ($this->cache_enable)
        {
            if (!$global)
            {
                $key .= $this->cache_path;
            }

            $hash = md5($this->domain.$key);

            $this->cache->set($hash, $value);
        }
    }

    public function getCompiled($key = '')
    {
        $hash = md5($this->domain.$key);

        if (!$this->cache_enable || !($data = $this->getCache($hash))) {
            return false;
        }

        return $data;
    }

    protected function clearCache()
    {
        if ($this->cache_enable)
        {
            // $this->cache->flush();
        }
    }
}
