<?php

declare(strict_types=1);

namespace Fastest\Core;

final class hooksHelper extends \Fastest\Core\Init
{
    protected $regexpAPI = '/\/api(\/\w+)+/i';
    protected $regexpAPIDocs = '/\/api\/docs\/?/i';
    protected $regexpAPISwagger = '/\/api\/swagger\/?/i';

    protected $sitemenu = [];

    public function __construct()
    {
        parent::__construct();
    }

    private function shopping()
    {
        # Category
        #
        if (!($category = $this->cache->getCompiled('hooks.category.list')))
        {
            $category = [];

            $list = Q("SELECT `id`, `system` FROM `#__shop_category` WHERE `visible`=?i", [ 1 ])->all();

            foreach ($list as $c) {
                $category[] = $c['system'];
            }

            $this->cache->setCache('hooks.category.list', $category);
        }

        if (isset($this->path[0]) && in_array($this->path[0], $category)) {
            array_unshift($this->path, CATALOG_ROOT);
        }
    }

    private function sitemenu()
    {
        # Получение списка
        #
        if (!($sitemenu = $this->cache->getCompiled('hooks.sitemenu.list')))
        {
            $sitemenu = Q("SELECT `id`, `name`, `system` as `sys_name` FROM `#_mdd_shedulecategory` WHERE `visible`=1 AND `parent`=0 ORDER BY `ord`")->all();

            foreach ($sitemenu as &$item)
            {
                $item['link'] = sprintf('/schedule/%s', $item['sys_name']);
            }

            $this->cache->setCache('hooks.sitemenu.list', $sitemenu);
        }

        $this->sitemenu = [
            'schedule' => $sitemenu
        ];
    }

    public function hooks()
    {
        if (preg_match($this->regexpAPISwagger, $this->request))
        {
            $jsonString = \Swagger\scan(PATH_KERNEL.DS.'api');

            $serializer = new \Swagger\Serializer();
            $swagger = $serializer->deserialize($jsonString, 'Swagger\Annotations\Swagger');

            header('Content-Type: application/json');

            exit($swagger);
        }

        if (preg_match($this->regexpAPIDocs, $this->request))
        {
            exit(file_get_contents(PATH_ROOT.DS.'apps'.DS.'docs'.DS.'index.html'));
        }

        if (preg_match($this->regexpAPI, $this->request))
        {
            return (new \Fastest\Core\Api\Api())->load($this->path);
        }
    }

    public function init()
    {
        $this->hooks();

        // $this->shopping();
        // $this->sitemenu();

        return [
            'path' => $this->path,
            // 'sitemenu' => $this->sitemenu
        ];
    }
}
