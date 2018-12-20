<?php

class Search extends Sitemap
{
    public $base;
    public $protocol;
    public $check       = [];
    public $proxy       = '';
    public $start_separator = '<!-- content -->';
    public $end_separator   = '<!-- /content -->';

    public $site;
    public $rules  = [];
    public $cat_rules  = [];
    public $templates  = [];

    public function __construct()
    {
        $this->site = trim($_SERVER['HTTP_HOST']);
        $this->getSettings();
    }

    public function initSearch()
    {
        $this->get_links();
        $this->check_links();
        $this->updateData();
    }

    public function getSettings()
    {
        $settings = Q("SELECT `id`, `param`, `val`, `dt` FROM `#__srch_links_settings`")->all('param');

        $this->rules        = explode(' ', stripslashes($settings['rules']['val']));
        $this->cat_rules    = explode(' ', stripslashes($settings['cat_rules']['val']));
        $this->templates    = explode(' ', stripslashes($settings['templates']['val']));

        $ignore = array_merge($this->rules, $this->cat_rules);
        $ignore = array_merge($ignore, $this->templates);
        $ignore = array_unique($ignore);

        $this->set_ignore($ignore);
    }

    public function getInfo()
    {
        $res = [];
        $res['index_records'] = Q("SELECT COUNT(*) as `count` FROM `#__srch_links`")->row('count');
        return $res;
    }

    public function saveSettings($post = array())
    {
        $new_rules      = __post('new_rules', $post);
        $new_cat_rules  = __post('new_cat_rules', $post);
        $new_templates  = __post('new_templates', $post);

        Q("TRUNCATE TABLE `#__srch_links_settings`");

        Q("INSERT INTO `#__srch_links_settings` SET `param`='rules', `val`=?s", array( $new_rules ));
        Q("INSERT INTO `#__srch_links_settings` SET `param`='cat_rules', `val`=?s", array( $new_cat_rules ));
        Q("INSERT INTO `#__srch_links_settings` SET `param`='templates', `val`=?s", array( $new_templates ));
    }

    protected function truncateLinks()
    {
        Q("TRUNCATE TABLE `#__srch_links`;");
        return true;
    }

    public function getTitle($html)
    {
        $title = strstr($html, '<title');
        $title = trim(substr($title, 7));
        $title = trim(substr($title, 0, (0 - strlen($title) + strpos($title, '</title>'))));

        $title = '<title' . $title . '</title>';
        $title = trim(strip_tags($title));

        return $title;
    }

    public function getDescription($html)
    {
        preg_match_all('/<[\s]*meta[\s]*name="?' . '([^>"]*)"?[\s]*' . 'content="?([^>"]*)"?[\s]*[\/]?[\s]*>/si', $html, $match);

        if (isset($match) && is_array($match) && count($match) == 3) {
            $originals = $match[0];
            $names = $match[1];
            $values = $match[2];

            if (count($originals) == count($names) && count($names) == count($values)) {
                $meta = [];

                for ($i=0, $limiti=count($names); $i < $limiti; $i++) {
                    $meta[$names[$i]] = trim($values[$i]);
                }
            }

            if (!empty($meta['description'])) {
                return $meta['description'];
            }
        }

        return '';
    }

    public function getContent($html)
    {
        $html = str_replace("\n", " ", str_replace("\r", "", $html));

        $content = '';

        if ($content = strstr($html, $this->start_separator)) {
            $content = trim(substr($content, strlen($this->start_separator)));
            $content = trim(substr($content, 0, (0 - strlen($content) + strpos($content, $this->end_separator))));
        }

        $content = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', "", $content);
        $content = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', "", $content);
        $content = preg_replace("/<[^>]*>/", " ", $content);
        $content = preg_replace("/\&[^\;]*\;/", " ", $content);
        $content = htmlspecialchars($content);
        $content = str_replace('&quot;', '', $content);
        $content = trim($content);

        return $content;
    }

    public function getData($url)
    {
        if (function_exists('curl_init')) {
            $ch = curl_init();
            $userAgent = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)';

            curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
            curl_setopt($ch, CURLOPT_FAILONERROR, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_AUTOREFERER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);

            $data = curl_exec($ch);
            curl_close($ch);
        } else {
            $data = file_get_contents($url);
        }

        return $data;
    }

    public function insertPage($url, $html)
    {
        $title   = $this->getTitle($html);
        $description   = $this->getDescription($html);
        $content = $this->getContent($html);

        if ($content) {
            if ($description) {
                $content = $description;
            }

            Q("INSERT INTO `#__srch_links` SET `link`=?s, `page_title`=?s, `content_index`=?s, `dt`=NOW()", array(
                urldecode(addslashes($url)), addslashes($title), addslashes($content)
            ));
        }
    }

    public function updateData()
    {
        $this->truncateLinks();

        if (!empty($this->sitemap_urls)) {
            foreach ($this->sitemap_urls as $link) {
                $html = $this->getData($link);

                $this->insertPage($link, $html);
            }

            exit('good');
        }
    }
}
