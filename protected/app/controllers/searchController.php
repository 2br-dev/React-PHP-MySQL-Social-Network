<?php

final class searchController extends CPLoader
{
    use Singleton;
    private $srch = null;
    
    public function __construct()
    {
        parent::__construct();
        
        $this->srch = new Search();
    }
    
    public function index()
    {
        $info['search_info'] = $this->srch->getInfo();
        return $info;
    }

    public function configure()
    {
        $info['search_site']            = $this->srch->site;
        $info['search_rules']            = $this->srch->rules;
        $info['search_cat_rules']        = $this->srch->cat_rules;
        $info['search_templates']        = $this->srch->templates;
        
        return $info;
    }

    public function indexer()
    {
        $this->srch = new Search();
        $this->srch->initSearch();
        exit;
    }

    public function post($post = array())
    {
        $action = __post('action', $post);
        
        if ($action == "save_conf") {
            $this->srch = new Search();
            $this->srch->saveSettings($post);
        }

        redirect('/' . ADMIN_DIR . '/search/configure/');
    }
}
