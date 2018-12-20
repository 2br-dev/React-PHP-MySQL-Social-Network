<?php

class templateRender
{
    protected $data = [];
    protected $template = null;
    protected $charset = 'utf-8';
    protected $fileExtension = '.tpl';

    public function __construct($dir = '', $caching = null)
    {

        // if (!file_exists(FENOM_RESOURCES . '/compile')) {
        //     mkdir(FENOM_RESOURCES . '/compile', 0777, true);
        // } else {
        //     FS::clean(FENOM_RESOURCES . '/compile/');
        // }
        // $this->fenom = Fenom::factory(FENOM_RESOURCES . '/' . $this->template_path, FENOM_RESOURCES . '/compile');
        // $this->fenom->addProvider('persist', new Provider(FENOM_RESOURCES . '/provider'));
        // $this->fenom->addModifier('dots', __CLASS__ . '::dots');
        // $this->fenom->addModifier('concat', __CLASS__ . '::concat');
        // $this->fenom->addModifier('append', __CLASS__ . '::append');
        // $this->fenom->addFunction('test_function', __CLASS__ . '::inlineFunction');
        // $this->fenom->addBlockFunction('test_block_function', __CLASS__ . '::blockFunction');
        // $this->values = $this->getVars();


        // require_once PATH_CORE . "/lib/templaters/fenom/Fenom.php";
        
        // Fenom::registerAutoload(PATH_CORE . "/lib/templaters/fenom/Fenom/");

        // require_once PATH_CORE . "/lib/templaters/fenom/Fenom/Provider.php";
        // require_once PATH_CORE . "/lib/templaters/fenom/Fenom/ProviderInterface.php";

        // require_once PATH_CORE . "/lib/templaters/fenom/Fenom/Smarty.php";

        require_once PATH_CORE.DIRECTORY_SEPARATOR.'lib'.DIRECTORY_SEPARATOR.'templaters'.DIRECTORY_SEPARATOR.'fenom'.DIRECTORY_SEPARATOR.'Fenom.php';
        
        Fenom::registerAutoload();
    
        $this->template = Fenom::factory(PATH_CORE.DIRECTORY_SEPARATOR.'lib'.DIRECTORY_SEPARATOR.'templaters'.DIRECTORY_SEPARATOR.'fenom'.DIRECTORY_SEPARATOR.'Fenom', PATH_RUNTIME.DIRECTORY_SEPARATOR.'cache');
        $this->template = new Fenom($provider = new \Fenom\Provider(PATH_THEMES.DIRECTORY_SEPARATOR.$dir));

        $this->template->setCompileDir(PATH_RUNTIME.DIRECTORY_SEPARATOR.'cache');

        $this->template->setOptions(Fenom::AUTO_STRIP);
        $this->template->setOptions(Fenom::FORCE_COMPILE);

        // $this->fenom->getProvider()->setClearCachedStats();

        //$this->template->clearAllCompiles();

        // $this->template = Smarty::factory(PATH_THEMES . '/' . $dir, PATH_RUNTIME . '/cache/');
        // $this->template->setSmartySupport();
    }

    public function assign($key = '', $value = '', $caching = false)
    {
        if (is_array($value)) {
            $this->data[$key] = $value;
        } elseif (is_object($value)) {
            $this->data[$key] = get_object_vars($value);
        } else {
            $this->data[$key] = htmlspecialchars($value, ENT_QUOTES, $this->charset);
        }
    }

    public function fetch($template = '', $cache_id = '', $compile_id = '')
    {
        return $this->template->fetch($template, $this->data);
    }

    public function display($template = '')
    {
        $this->template->display($template . $this->fileExtension, $this->data);
    }
}
