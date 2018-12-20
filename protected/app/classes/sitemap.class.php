<?php

class Sitemap
{
    public $sitemap_urls = [];
    public $base;
    public $protocol;
    public $check = [];
    public $proxy = "";
    public $start_separator    = '<!-- content -->';
    public $end_separator      = '<!-- /content -->';
    
    public $site;
    
    public function __construct()
    {
        $this->site = trim($_SERVER['HTTP_HOST']);
    }

    //setting list of substring to ignore in urls
    public function set_ignore($ignore_list)
    {
        $this->check = $ignore_list;
    }
    
    //set a proxy host and port (such as someproxy:8080 or 10.1.1.1:8080
    public function set_proxy($host_port)
    {
        $this->proxy = $host_port;
    }
    
    //validating urls using list of substrings
    public function validate($url)
    {
        $valid = true;

        //add substrings of url that you don't want to appear using set_ignore() method
        foreach ($this->check as $val) {
            if (stripos($url, $val) !== false || in_array($url, array( 'a', '' ))) {
                $valid = false;
                break;
            }
        }
        return $valid;
    }
 
    public function multi_curl($urls)
    {
        $curl_handlers = [];
        
        foreach ($urls as $url) {
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            if (isset($this->proxy) && !$this->proxy == '') {
                curl_setopt($curl, CURLOPT_PROXY, $this->proxy);
            }
            $curl_handlers[] = $curl;
        }

        $multi_curl_handler = curl_multi_init();
 
        foreach ($curl_handlers as $key => $curl) {
            curl_multi_add_handle($multi_curl_handler, $curl);
        }
 
        do {
            $multi_curl = curl_multi_exec($multi_curl_handler, $active);
        } while ($multi_curl == CURLM_CALL_MULTI_PERFORM  || $active);
 
        foreach ($curl_handlers as $curl) {
            if (curl_errno($curl) == CURLE_OK) {
                $content = curl_multi_getcontent($curl);
                $this->parse_content($content);
            }
        }

        curl_multi_close($multi_curl_handler);
        return true;
    }
 
    public function check_links()
    {
        if (!empty($this->sitemap_urls)) {
            foreach ($this->sitemap_urls as $key => $url) {
                $tmp = explode('?', $url);

                if (substr($tmp[0], -1) !== '/') {
                    $new_url = $tmp[0] . '/' . (isset($tmp[1]) ? '?' . $tmp[1] : '');
                    $this->sitemap_urls[$key] = $new_url;
                }
            }

            $this->sitemap_urls = array_flip(array_flip($this->sitemap_urls));
        }
    }

    public function get_links($website = '')
    {
        if ($website !== '') {
            $this->site = $website;
        }
        
        $this->base = str_replace(array('http://', 'https://'), '', $this->site);
        
        $host = explode("/", $this->base);
        $this->base = $host[0];

        if (strpos($this->site, "http") !== 0) {
            $this->protocol = "http://";
            $this->site = $this->protocol.$this->site;
        } else {
            $protocol = explode("//", $this->site);
            $this->protocol = $protocol[0]."//";
        }
 
        if (!in_array($this->site, $this->sitemap_urls)) {
            $this->sitemap_urls[] = $this->site;
        }
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $this->site);

        if (isset($this->proxy) && !$this->proxy == '') {
            curl_setopt($curl, CURLOPT_PROXY, $this->proxy);
        }
        
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $page = curl_exec($curl);
        curl_close($curl);

        $this->parse_content($page);
    }
 
    public function parse_content($page)
    {
        preg_match_all("/<a[^>]*href\s*=\s*'([^']*)'|" . '<a[^>]*href\s*=\s*"([^"]*)"'."/is", $page, $match);

        $new_links = [];

        $count = count($match);
        
        for ($i = 1; $i < $count; $i++) {
            $match[$i] = array_diff($match[$i], array('/a', ''));

            foreach ($match[$i] as $url) {
                if (strpos($url, "http") === false && strpos($url, "https") === false && trim($url) !== "") {
                    if ($url[0] == "/") {
                        $url = substr($url, 1);
                    } elseif ($url[0] == ".") {
                        while ($url[0] != "/") {
                            $url = substr($url, 1);
                        }

                        $url = substr($url, 1);
                    }
                    
                    if ($url !== '%url%') {
                        $url = $this->protocol.$this->base ."/" . $url;
                    }
                }

                if (substr($url, -1) == '/') {
                    $url = substr($url, 0, -1);
                }

                if (!in_array($url, $this->sitemap_urls) && trim($url) !== "") {
                    $tmp_url = str_replace($this->protocol.$this->base, '', $url);

                    if ($this->validate($tmp_url)) {
                        if (strpos($url, "http://".$this->base) === 0 || strpos($url, "https://".$this->base) === 0) {
                            $this->sitemap_urls[] = urldecode($url);
                            $new_links[] = urldecode($url);
                        }
                    }
                }
            }
        }

        $this->multi_curl($new_links);
        return true;
    }
    
    //returns array of sitemap URLs
    public function get_array()
    {
        return $this->sitemap_urls;
    }

    //notifies services like google, bing, yahoo, ask and moreover about your site map update
    public function ping($sitemap_url, $se = array(), $title ="", $siteurl = "")
    {
        if (!empty($se)) {
            // for curl handlers
            $curl_handlers = [];

            $sitemap_url = trim($sitemap_url);
            if (strpos($sitemap_url, "http") !== 0) {
                $sitemap_url = "http://".$sitemap_url;
            }

            $site = explode("//", $sitemap_url);
            $start = $site[0];
            $site = explode("/", $site[1]);
            $middle = $site[0];

            if (trim($title) == "") {
                $title = $middle;
            }
            if (trim($siteurl) == "") {
                $siteurl = $start."//".$middle;
            }

            $links['google'] = "http://www.google.com/webmasters/tools/ping?sitemap=".urlencode($sitemap_url);
            $links['bing'] = "http://www.bing.com/webmaster/ping.aspx?siteMap=".urlencode($sitemap_url);
            $links['yahoo'] = "http://search.yahooapis.com/SiteExplorerService/V1/updateNotification" . "?appid=YahooDemo&url=".urlencode($sitemap_url);
            $links['ask'] = "http://submissions.ask.com/ping?sitemap=".urlencode($sitemap_url);
            $links['weblogs'] = "http://rpc.weblogs.com/pingSiteForm?name=".urlencode($title). "&url=".urlencode($siteurl)."&changesURL=".urlencode($sitemap_url);
            $links['yandex'] = "";

            $urls = [];

            foreach ($se as $item) {
                $urls[] = $links[$item];
            }
            
            //setting curl handlers
            foreach ($urls as $url) {
                $curl = curl_init();
                curl_setopt($curl, CURLOPT_URL, $url);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($curl, CURL_HTTP_VERSION_1_1, 1);
                $curl_handlers[] = $curl;
            }
            //initiating multi handler
            $multi_curl_handler = curl_multi_init();

            // adding all the single handler to a multi handler
            foreach ($curl_handlers as $key => $curl) {
                curl_multi_add_handle($multi_curl_handler, $curl);
            }

            // executing the multi handler
            do {
                $multi_curl = curl_multi_exec($multi_curl_handler, $active);
            } while ($multi_curl == CURLM_CALL_MULTI_PERFORM  || $active);

            // check if there any error
            $submitted = true;
            foreach ($curl_handlers as $key => $curl) {
                //you may use curl_multi_getcontent($curl); for getting content
                //and curl_error($curl); for getting errors
                if (curl_errno($curl) != CURLE_OK) {
                    $submitted = false;
                }
            }
            curl_multi_close($multi_curl_handler);
            
            return $submitted;
        }
    }

    //generates sitemap
    public function generate_sitemap($settings)
    {
        $sitemap = new SimpleXMLElement('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');

        foreach ($this->sitemap_urls as $url) {
            $route = $sitemap->addChild("url");

            $route->addChild("loc", htmlspecialchars($url));
            
            if (isset($settings['lastmod'])) {
                $route->addChild("lastmod", $settings['lastmod']);
            }
            
            if (isset($settings['changefreq'])) {
                $route->addChild("changefreq", $settings['changefreq']);
            }
            
            if (isset($settings['priority'])) {
                $route->addChild("priority", $settings['priority']);
            }

            //$route->addAttribute('name', 'xxx');
        }

        return $sitemap->asXML();
    }
}
