<?php

class UnitExtension extends \Twig_Extension
{
    public function getFunctions()
    {
        return [
            'unit' => new \Twig_SimpleFunction('unit', [$this, 'getUnit'], [
                'needs_environment' => true,
                'needs_context' => true,
                'is_safe' => array(
                    'getUnit' => true
                )
            ])
        ];
    }

    public function getUnit(\Twig_Environment $environment, $context, $item = '')
    {
        if (empty($item)) return '';

        $page = current(explode('?', $_SERVER['REQUEST_URI']));
        $path = preg_split('/\/+/', $page, -1, PREG_SPLIT_NO_EMPTY);

        $block = Q("SELECT `id`, `pages_on`, `pages_off`, `block_cont`, `module`
                    FROM `#__blc_blocks`
                    WHERE `visible`=1 AND `id`=?i
                    LIMIT 1", [
                        $item
                    ])->row();

        $result = '';

        $pages_on = $block['pages_on'] == '' || $block['pages_on'] !== '' && checkUrlLink($path, $block['pages_on']) === true;
        $pages_off = $block['pages_off'] == '' || $block['pages_off'] !== '' && checkUrlLink($path, $block['pages_off']) === false;

        if ($pages_on && $pages_off)
        {
            $request    =    urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
            $uri        =    preg_split('/\/+/', $request, -1, PREG_SPLIT_NO_EMPTY);

            if ($block['module'] == '' || $block['module'] == '0' || $block['module'] == 0)
            {
                $result = twig_template_from_string($environment, stripslashes($block['block_cont']))->render($context);
            }
            else
            {
                $method = 'blockMethod';

                $module =
                    Q("SELECT `id`, `func_name`, `cache` " .
                        "FROM `#__mdd_binds` " .
                        "WHERE `id` = ?i " .
                        "LIMIT 1", [
                        $block['module']
                    ])->row();

                if (!empty($module) && !function_exists($module['func_name']))
                {
                    $class = PATH_MODULE.DS.$module['func_name'].DS.$module['func_name'] . 'Module.class.php';

                    if (file_exists($class)) {
                        require_once $class;
                    }

                    $controller = $module['func_name'] . 'Module';

                    if (class_exists($controller))
                    {
                        $controller = new $controller;
                        $controller->module = $module;

                        if (method_exists($controller, $method))
                        {
                            $data = $controller->{$method}();
                            $data['uri'] = $uri;

                            $template = isset($data['template']) ? $data['template'] : 'list';

                            if (file_exists(PATH_MODULE.DS.$module['func_name'].DS.'tpl'.DS.$template.'.twig'))
                            {
                                $loader = $environment->getLoader();
                                $loader->addPath(PATH_MODULE.DS.$module['func_name'].DS.'tpl'.DS);
                                $result = $environment->render($template.'.twig', $data);
                            }
                        }
                    }
                }
            }
        }

        return $result;
    }

    public function getName() {
        return 'unit';
    }
}
