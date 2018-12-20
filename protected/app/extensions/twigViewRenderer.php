<?php

use Symfony\Component\DependencyInjection\Definition;

class templateRender
{
    protected $dir = null;
    protected $data = [];
    protected $loader = null;
    protected $template = null;
    protected $charset = 'utf-8';
    protected $fileExtension = '.twig';

    public function __construct($dir = '', $caching = null, $aliases = [], $root = null, $nonceToken = null)
    {
        if (is_null($root)) {
            $root = PATH_THEMES.DS.$dir;
        } else {
            $root = $root.DS.$dir;
        }

        $this->dir = $root;

        $this->loader = new Twig_Loader_Filesystem($root);

        if (!empty($aliases))
        {
            foreach ($aliases as $name => $path)
            {
                $this->loader->addPath($path, $name);
            }
        }

        $this->template = new Twig_Environment($this->loader, [
            'template_dir'      =>  $root,
            'cache'             =>  PATH_CACHE,
            'debug'             =>  DEV_MODE,
            'auto_reload'       =>  DEV_MODE,
            'autoescape'        =>  false, // 'html',
            'strict_variables'  =>  false, // !DEV_MODE,
            'optimizations'     =>  -1,
            'charset'           =>  $this->charset
        ]);

        $this->cover();

        $compress = new CompressExtension();
        $compress->set('nonceToken', $nonceToken);

        $this->template->addExtension($compress);
        $this->template->addExtension(new TExtension());
        $this->template->addExtension(new UrlExtension());
        $this->template->addExtension(new UnitExtension());
        $this->template->addExtension(new AssetExtension());
        $this->template->addExtension(new MoneyExtension());
        $this->template->addExtension(new DeclofnumExtension());
        $this->template->addExtension(new Twig_Extension_StringLoader());

        // if (!function_exists('asset'))
        // {
        //    function asset()
        //    {
        //       return base_url() . 'assets/';
        //    }
        // }

        // $this->template->addFunction(
        //     new Twig_SimpleFunction('asset', 'asset',
        //         array('is_safe' => array('html')))
        // );

        // $loader = new Twig_Loader_Filesystem('/path/to/templates');
        // $twig = new Twig_Environment($loader, array(
        //     'cache' => '/path/to/compilation_cache',
        // ));

        // $twig->addExtension(new \Odan\Twig\TwigAssetsExtension($twig, $options));








        // $container[\Slim\Views\Twig::class] = function (Container $container) {
        //     $settings = $container->get('settings');
        //     $viewPath = $settings['twig']['path'];

        //     $twig = new \Slim\Views\Twig($viewPath, [
        //         'cache' => $settings['twig']['cache_enabled'] ? $settings['twig']['cache_path']: false
        //     ]);

        //     /* @var Twig_Loader_Filesystem $loader */
        //     $loader = $twig->getLoader();
        //     $loader->addPath($settings['public'], 'public');

        //     // Instantiate and add Slim specific extension
        //     $basePath = rtrim(str_ireplace('index.php', '', $container->get('request')->getUri()->getBasePath()), '/');
        //     $twig->addExtension(new Slim\Views\TwigExtension($container->get('router'), $basePath));

        //     // Add the Assets extension to Twig
        //     $twig->addExtension(new \Odan\Twig\TwigAssetsExtension($twig->getEnvironment(), $settings['assets']));

        //     return $twig;
        // };

        // {{ assets({files: ['Login/login.css']}) }}

        // {{ assets({files: ['Login/login.css'], inline: true}) }}

        // {{ assets({files: ['Login/login.js']}) }}

        // {{ assets({files: [
        //     '@public/css/default.css',
        //     '@public/css/print.css',
        //     'User/user-edit.css'
        //     ], name: 'layout.css'})
        // }}

        // {{ assets({files: [
        //     '@public/js/my-js-lib.js',
        //     '@public/js/notify.js',
        //     'Layout/app.js'
        //     ], name: 'layout.js'})
        // }}

        // {% block assets %}
        //     {{ assets({files: ['Home/home.js'], name: 'home.js'}) }}
        //     {{ assets({files: ['Home/home.css'], name: 'home.css'}) }}
        // {% endblock %}

        $this->template->addGlobal('_cookies', $_COOKIE);
        $this->template->addGlobal('_session', $_SESSION);
        $this->template->addGlobal('_post', $_POST);
        $this->template->addGlobal('_get', $_GET);

        $lexer = new Twig_Lexer($this->template, [
            'tag_comment'   => ['{#', '#}'],
            'tag_block'     => ['{%', '%}'],
            'tag_variable'  => ['{{', '}}'],
            'interpolation' => ['#{', '}']
        ]);

        // if (DEV_MODE)
        // {
        //     $profile = new Twig_Profiler_Profile();
        //     $this->template->addExtension(new Twig_Extension_Profiler($profile));

        //     $dumper = new Twig_Profiler_Dumper_Blackfire();
        //     file_put_contents(PATH_CACHE.DS.'profile.prof', $dumper->dump($profile).PHP_EOL, FILE_APPEND);
        // }

        $this->template->setLexer($lexer);
    }

    private function cover()
    {
        $dirs = array_diff(scandir(PATH_MODULE), ['.', '..', '.DS_Store']);

        foreach ($dirs as $dirname)
        {
            $this->loader->addPath(PATH_MODULE.DS.$dirname.DS.PATH_MODULE_TEMPLATE, $dirname);
        }
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
        if (strstr($template, 'eval:'))
        {
            $template = $this->template->createTemplate(str_replace('eval:', '', $template));
            $render = $template->render($this->data);
        }
        else
        {
            $path = dirname($template.$this->fileExtension);
            $file = basename($template.$this->fileExtension);

            $fetchDir = str_replace($this->dir, '', $path);
            $fetchFile = $fetchDir.DS.$file;

            if (strstr($template, PATH_MODULE))
            {
                $namespace = str_replace(PATH_MODULE.DS, '', dirname($path));
            }
            else
            {
                $namespace = md5(str_replace(PATH_SECURE, '', $template));

                if (is_dir($fetchDir))
                {
                    $this->loader->addPath($fetchDir, $namespace);
                }
                else
                {
                    $this->loader->addPath($this->dir.$fetchDir, $namespace);
                }
            }

            $render = $this->template->render(sprintf('@%s/%s', $namespace, $file), $this->data);
        }

        return $render;
    }

    public function display($template = '')
    {
        $this->template->loadTemplate($template.$this->fileExtension)->display($this->data);
    }
}
