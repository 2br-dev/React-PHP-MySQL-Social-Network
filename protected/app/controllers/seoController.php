<?php

final class seoController extends CPLoader
{
    use Singleton;
    private $robot_file        = null;
    private $sitemap_path    = null;
    private $settings_file    = null;
    
    public function __construct()
    {
        parent::__construct();
        
        $this->robot_file        = PATH_ROOT . '/robots.txt';
        $this->settings_file    = PATH_ROOT . '/' . ADMIN_DIR . '/json/settings.json';
        $this->sitemap_path    = PATH_ROOT . '/';
    }
    
    public function index()
    {
        $info['ping'] = array(
            'google'    =>    'информировать <span class="google"><span class="g">g</span><span class="o">o</span><span class="o">o</span><span class="g">g</span><span class="l">l</span><span class="e">e</span></span>',
            'bing'        =>    'информировать Bing',
            'yahoo'        =>    'информировать Yahoo',
            'weblogs'    =>    'информировать Weblogs',
            'ask'        =>    'информировать ASK'
        );

        $info['lastmod'] = array(
            'dissabled'    =>    'Отключено, не использовать',
            'filedate'    =>    'Получить время изменения страницы',
            'current'    =>    'Использовать текущее время'
        );

        $info['lastmod_format'] = array(
            'long'    =>    'Длинный формат (со временем)',
            'short'    =>    'Краткий формат (только дата)'
        );

        $info['priority'] = array(
            'dissabled'    =>    'Отключено, не использовать',
            'fixed'        =>    'Используйте этот приоритет для каждого файла'
        );

        $info['changefreq'] = array(
            'dissabled'    =>    'Отключено, не использовать',
            'dynamic'    =>    'Рассчитать частоту изменений от даты последнего изменения',
            'fixed'        =>    'Используйте эту частоту изменений для каждого файла'
        );

        $priority_fixed = [];

        $fixed = 0.1;
        for ($i=0; $i<10; $i++) {
            $fx = [];

            if ($fixed == '0.5') {
                $fx['default'] = true;
            }
            
            $fx['value']    = $fixed;
            $fx['text']        = $fixed;

            $fixed += 0.1;
            $fixed = number_format((float)$fixed, 1, '.', '');

            $priority_fixed[] = $fx;
        }

        $info['priority_fixed'] = $priority_fixed;

        $changefreq_fixed = [];
        $changefreq_fixed_temp = array('always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never');

        foreach ($changefreq_fixed_temp as $cf) {
            $cfx = [];
            
            $cfx['value']    = $cf;
            $cfx['text']    = $cf;

            $changefreq_fixed[] = $cfx;
        }

        $info['changefreq_fixed'] = $changefreq_fixed;

        $info['settings']    = json_decode(file_get_contents($this->settings_file), true);
        
        if (strstr($info['settings']['website'], '//cms.dev')) {
            $info['settings']['website'] = 'http://' . $this->domain;
        }

        return $info;
    }

    public function scan()
    {
        $settings    = json_decode(file_get_contents($this->settings_file), true);

        $disallow_dir   = isset($settings['disallow_dir']) ? explode("\r\n", $settings['disallow_dir']) : [];
        $disallow_file  = isset($settings['disallow_file']) ? explode("\r\n", $settings['disallow_file']) : [];
        
        $robots = PATH_ROOT . '/robots.txt';

        $bots = array(
            '*', 'googlebot', 'yandex'
        );

        $disallow_robots = [];

        if (file_exists($robots)) {
            $handle = fopen($robots, "r");

            if ($handle) {
                $consider = false;

                while (($buffer = fgets($handle, 4096)) !== false) {
                    $buffer = mb_strtolower($buffer);

                    if (stristr($buffer, 'user-agent:')) {
                        $consider = false;

                        $tmp = explode(':', $buffer);
                        $agent = trim($tmp[1]);

                        if (in_array($agent, $bots)) {
                            $consider = true;
                        }
                    }

                    if (stristr($buffer, 'disallow:') && $consider) {
                        $tmp = explode(':', $buffer);
                        $dir = trim($tmp[1]);

                        if ($dir !== '') {
                            $disallow_robots[] = urldecode($dir);
                        }
                    }
                }

                fclose($handle);
            }
        }

        $disallow = array_merge($disallow_dir, $disallow_file);
        $disallow = array_merge($disallow, $disallow_robots);
        $disallow = array_unique($disallow);

        $sitemap = new sitemap;
        $sitemap->set_ignore($disallow);
        $sitemap->get_links($settings['website']);
        
        if (!isset($settings['sitemap_file']) || $settings['sitemap_file'] == '') {
            $settings['sitemap_file'] = 'sitemap.xml';
        }

        $sitemap_file = $this->sitemap_path . str_replace('/', '', $settings['sitemap_file']);

        $sets = [];

        if (isset($settings['lastmod']) && in_array($settings['lastmod'], array('filedate', 'current'))) {
            if (isset($settings['lastmod_format']) && $settings['lastmod_format'] == 'short') {
                $sets['lastmod'] = time();
            } else {
                $sets['lastmod'] = time();
            }
        } else {
            $sets['lastmod'] = null;
        }

        if (isset($settings['changefreq']) && in_array($settings['changefreq'], array('dynamic', 'fixed'))) {
            if ($settings['changefreq'] == 'fixed' && isset($settings['changefreq_fixed'])) {
                $sets['changefreq'] = $settings['changefreq_fixed'];
            } else {
                $sets['changefreq'] = 'weekly';
            }
        } else {
            $sets['lastmod'] = null;
        }

        if (isset($settings['priority']) && $settings['priority'] == 'fixed' && isset($settings['priority_fixed'])) {
            $sets['priority'] = $settings['priority_fixed'];
        } else {
            $sets['priority'] = null;
        }

        if (!empty($sitemap->sitemap_urls)) {
            $xmlSitemap = new xmlSitemap($sitemap_file);

            foreach ($sitemap->sitemap_urls as $url) {
                $xmlSitemap->addItem($url, $sets['lastmod'], $sets['changefreq'], $sets['priority']);
            }

            $xmlSitemap->write();
        }

        /*
        $xml = html_entity_decode($sitemap->generate_sitemap($sets), ENT_NOQUOTES, 'UTF-8');

        if (class_exists('DOMDocument'))
        {
            $dom = new DOMDocument('1.0');
            $dom->preserveWhiteSpace = true;
            $dom->formatOutput = true;
            $dom->loadXML($xml);

            $dom->save($sitemap_file);
        }
        else
        {
            file_put_contents($sitemap_file, $xml, LOCK_EX);
        }
        */

        if (isset($settings['compress_sitemap']) && $settings['compress_sitemap'] == '1' && function_exists('gzencode')) {
            if (!isset($settings['compress_file']) || $settings['compress_file'] == '') {
                $settings['compress_file'] = 'sitemap.xml.gz';
            }

            $compress_file = $this->sitemap_path . str_replace('/', '', $settings['compress_file']);
            
            if (file_exists($sitemap_file)) {
                file_put_contents($compress_file, gzencode(file_get_contents($sitemap_file), 9));
            }
        }

        if (isset($settings['ping']) && !empty($settings['ping'])) {
            $sitemap->ping($sitemap_file, $settings['ping']);
        }

        if (!isset($_GET['msg'])) {
            redirect('?msg=apply');
        }
    }

    public function robots()
    {
        $info = [];

        if (file_exists($this->robot_file)) {
            $info['robots'] = file_get_contents($this->robot_file);
        }

        return $info;
    }

    public function counters()
    {
        $info['counter_type'] = Q("SELECT `id`, `system`, `name` FROM `#__seo_counters_type` ORDER BY `name`")->all('system');

        if ($this->method == 'edit') {
            $info['counter'] = Q("SELECT * FROM `#__seo_counters` WHERE `id`=?i LIMIT 1", array( $this->element ))->row();
        } elseif ($this->method == 'edit_type') {
            $info['counter'] = Q("SELECT * FROM `#__seo_counters_type` WHERE `id`=?i LIMIT 1", array( $this->element ))->row();
        } elseif ($this->method == 'del_type') {
            if ($this->element) {
                Q("DELETE FROM `#__seo_counters_type` WHERE `id`=?i LIMIT 1", array( $this->element ));
            }

            redirect($this->base_path . '/counters/');
        } elseif ($this->method == 'del') {
            if ($this->element) {
                Q("DELETE FROM `#__seo_counters` WHERE `id`=?i LIMIT 1", array( $this->element ));
            }

            redirect($this->base_path . '/counters/');
        } else {
            $info['counters'] = Q("SELECT * FROM `#__seo_counters`")->all();

            if (!empty($info['counters'])) {
                foreach ($info['counters'] as &$counter) {
                    $counter['type'] = $info['counter_type'][$counter['type']]['name'];
                }
            }
        }

        return $info;
    }

    public function post()
    {
        $action = __post('action');

        if ($action == 'generate') {
            unset($_POST['action']);
            file_put_contents($this->settings_file, json_encode($_POST), LOCK_EX);
        
            redirect($this->base_path);
        } elseif ($action == 'counters_add_type') {
            $name = isset($_POST['name']) ? $_POST['name'] : '';
            $system = isset($_POST['system']) ? $_POST['system'] : '';
            $template = isset($_POST['template']) ? $_POST['template'] : '';

            $this->element = O('__seo_counters_type')->create(array(
                's:name'    =>  $name,
                's:system'    =>  $system,
                's:template'=>  $template
            ));

            if (isset($_POST['apply'])) {
                redirect($this->base_path . "/counters/edit_type/" . $this->element);
            } else {
                redirect($this->base_path . '/counters');
            }
        } elseif ($action == 'counters_edit_type') {
            $name = isset($_POST['name']) ? $_POST['name'] : '';
            $system = isset($_POST['system']) ? $_POST['system'] : '';
            $template = isset($_POST['template']) ? $_POST['template'] : '';

            O('__seo_counters_type', $this->element)->update(array(
                's:name'    =>  $name,
                's:system'    =>  $system,
                's:template'=>  $template
            ));

            if (isset($_POST['apply'])) {
                redirect($this->base_path . "/counters/edit_type/" . $this->element);
            } else {
                redirect($this->base_path . '/counters');
            }
        } elseif ($action == 'counters_edit') {
            $name = isset($_POST['name']) ? $_POST['name'] : '';
            $code = isset($_POST['code']) ? $_POST['code'] : '';
            $type = isset($_POST['type']) ? $_POST['type'] : '';
            $ord = isset($_POST['ord']) ? $_POST['ord'] : '';
            $active = isset($_POST['active']) ? $_POST['active'] : '';
            $post_loading = isset($_POST['post_loading']) ? $_POST['post_loading'] : '';

            O('__seo_counters', $this->element)->update(array(
                's:name'    =>  $name,
                's:code'    =>  $code,
                's:type'    =>  $type,
                'i:active'    =>  $active,
                'i:ord'        =>  $ord,
                'i:post_loading' =>    $post_loading
            ));

            if (isset($_POST['apply'])) {
                redirect($this->base_path . "/counters/edit/" . $this->element);
            } else {
                redirect($this->base_path . '/counters');
            }
        } elseif ($action == 'counters_add') {
            $name = isset($_POST['name']) ? $_POST['name'] : '';
            $code = isset($_POST['code']) ? $_POST['code'] : '';
            $type = isset($_POST['type']) ? $_POST['type'] : '';
            $ord = isset($_POST['ord']) ? $_POST['ord'] : '';
            $active = isset($_POST['active']) ? $_POST['active'] : '';
            $post_loading = isset($_POST['post_loading']) ? $_POST['post_loading'] : '';

            $this->element = O('__seo_counters')->create(array(
                's:name'    =>  $name,
                's:code'    =>  $code,
                's:type'    =>  $type,
                'i:active'    =>  $active,
                'i:ord'        =>  $ord,
                'i:post_loading' =>    $post_loading
            ));

            if (isset($_POST['apply'])) {
                redirect($this->base_path . "/counters/edit/" . $this->element);
            } else {
                redirect($this->base_path . '/counters');
            }
        } elseif ($action == 'save_robots') {
            file_put_contents($this->robot_file, $_POST['robots'], LOCK_EX);
            redirect($this->base_path . '/robots');
        }
    }
}
