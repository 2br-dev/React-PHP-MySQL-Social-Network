<?php

declare(strict_types=1);

namespace Fastest\Core;

final class App extends \Fastest\Core\Kernel
{
    use \Tools, \Singleton;

    // Private
    private $pattern = 'base';

    private $submenu = [];

    // Public
    public $page = [];
    public $meta = [];
    public $dynamic = false;
    public $breadcrumbs = [];

    public $sitemap = [];
    public $sitemenu = [];
    public $openGraph = [];

    // Protected
    protected $arguments = [];

    // protected $template_vars    = [];
    // protected $_server          = [];
    // protected $arguments        = [];
    // private $router             = [];

    // public $cachetree           = [];
    // public $breadcrumbsTree     = [];

    public function __construct()
    {
        $this->template = [
            'dir' => SITE_THEME.'/#/',
            'driver' => TEMPLATING,
            'caching' => $this->caching,
        ];

        $this->declare();

        parent::__construct();
    }

    private function _content()
    {
        $html = '';
        $cache = 'app.page.content'.$this->page['id'];

        if (!($filling = $this->cache->getCompiled($cache))) {
            $filling = Q('SELECT `id`, `system`, `type`, `item`, `mode`, `indexer`, `caching`, `indynamic`
						 FROM `#__str_content`
						 WHERE `pid`=?i AND `visible`=1
						 ORDER BY `ord`', [$this->page['id']])->all();

            $this->cache->setCache($cache, $filling);
        }

        foreach ($filling as $section) {
            $is_dynamic = $section['indexer'] == 1 || $section['indexer'] == 2 && $this->dynamic;

            if ($section['system']) {
                $html .= '<a name="'.$section['system'].'"></a>';
            }

            if ($is_dynamic) {
                $html .= '<!-- content -->';
            }

            $html .= $this->_pageSection($section);

            if ($is_dynamic) {
                $html .= '<!-- /content -->';
            }
        }

        $content = str_replace('<!-- /content --><!-- content -->', '', stripslashes($html));

        $this->page['content'] = $content;
    }

    private function _pageSection($section = [])
    {
        $cache = 'app.content.block'.$section['id'].intval($this->dynamic);

        if (!($content = $this->cache->getCompiled($cache)) || !$section['caching'] || ($section['type'] == 'module')) {
            $this->cache->setCache($cache, $content = $this->getSection($section));
        }

        return $content;
    }

    private function _meta()
    {
        $cache = 'app.content.meta';

        if (!($meta = $this->cache->getCompiled($cache))) {
            $meta = Q(' SELECT `id`, `title`, `keywords`, `description`, `robots`
						FROM `#__str_structure`
						WHERE `visible`=1')->all('id');

            foreach ($meta as &$item) {
                unset($item['id']);
            }

            $this->cache->setCache($cache, $meta);
        }

        $id = $this->page['id'];

        if (isset($meta[$id])) {
            $this->meta = $meta[$id];
        }
    }

    private function _page()
    {
        $this->original = sprintf('/%s', implode($this->path, '/'));

        try {
            array_walk($this->structure, function ($page, $key) use (&$stop) {
                $pattern = sprintf('/^\/%s?(\/)/i',
                    str_replace(['-', '/'], ['\-', '\/'], trim($page['link'], '/'))
                );

                if (($page['link'] === $this->original) || ($page['dynamic'] && preg_match($pattern, $this->original))) {
                    $this->page = $page;
                    throw new CoreException();
                }
            });
        } catch (CoreException $e) {
            $this->page['url'] = $this->host.$this->request;
            $this->page['pathname'] = $this->request;
            $this->page['canonical'] = $this->host.$this->request;
            $this->root = preg_split('/\/+/', $this->page['link'], -1, PREG_SPLIT_NO_EMPTY);
        }

        if (empty($this->page)) {
            $this->page = $this->errorPage;
        }
    }

    private function _pageData()
    {
        $this->page['lang'] = $this->locale;

        if ($this->page['dynamic'] == 1 && $this->page['system'] != end($this->path)) {
            $this->dynamic = true;
        }
    }

    public function _helpers()
    {
        $hooks = new hooksHelper();
        $response = $hooks->init();

        if (!empty($response))
        {
            $this->assignVars($response);
        }
    }

    private function _template()
    {
        if ($this->page['id'] == 0) {
            $this->pattern = 'core/404';
        } else {
            $cache = 'app.template';

            if (!($this->pattern = $this->cache->getCompiled($cache))) {
                $this->pattern = Q('SELECT `sys_name` FROM `#__str_templates` WHERE `id`=?i LIMIT 1', [
                    $this->page['tid'],
                ])->row('sys_name');

                $this->cache->setCache($cache, $this->pattern);
            }
        }
    }

    private function _render()
    {
        $this->headers(DEV_MODE);

        if ($this->page['id'] == 0) {
            header('HTTP/1.1 404 Not Found', true, 404);
        }

        $this->viewer->display($this->pattern);
    }

    public function terminate()
    {
        // Load site pages
        $this->getStructure();

        // Generate sitemap
        $this->getSitemap();

        $this->_helpers();

        // Get current page
        $this->_page();

        // Get page meta data
        $this->_meta();

        // Assign vars from modules & helpers
        $this->assignVars();

        // Build tree menu
        $this->getSitemenu();

        // Set current page
        $this->setCurrent($this->path, $this->sitemenu);

        if (!empty($this->page) || $this->page['id'] == 0) {
            // Set page data
            $this->_pageData();

            // Get page content
            $this->_content();

            // Get page template file
            $this->_template();
        }

        // exit(__($this->assets));

        $this->viewer->assign('_og', $this->openGraph, true);
        $this->viewer->assign('_page', $this->page, true);
        $this->viewer->assign('_meta', $this->meta, true);
        $this->viewer->assign('_sitemap', $this->sitemap, false);
        $this->viewer->assign('_sitemenu', $this->sitemenu, true);
        $this->viewer->assign('_breadcrumbs', $this->breadcrumbs, true);

        // $this->viewer->assign('_submenu',           $this->submenu, true);

        // Render page
        $this->_render();
    }
}
