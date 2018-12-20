<?php

final class settingsController extends CPLoader
{
    use Singleton;

    public function __construct()
    {
        parent::__construct();

        $this->settings = new cpSettings;
    }

    public function index()
    {
        $info = [];
        $settings = [];

        $_settings = $this->settings->get(['var', 'value'], 'var', 0, 100);

        if (!empty($_settings))
        {
            foreach ($_settings as $item)
            {
                $settings[$item['var']] = $item['value'];
            }
        }

        $info['settings'] = $settings;
        $info['pages'] = $this->settings->pages();
        $info['timezone'] = $this->settings->timezone();
        $info['languages'] = $this->settings->languages();

        // exit(__($info));

        return $info;
    }

    public function menu()
    {
        if ($this->method == 'edit') {
            $info['menu_edit'] = Q("SELECT `id`, `name`, `system`, `tree` FROM `#__str_menu` WHERE `id`=?i LIMIT 1", array( $this->element ))->row();
        } elseif ($this->method == 'del') {
            Q("DELETE FROM `#__str_menu` WHERE `id`=?i LIMIT 1", array( $this->element ));
            redirect($this->base_path);
        } else {
            $info['menu_list'] = Q("SELECT `id`, `name`, `system`, `tree` FROM `#__str_menu` ORDER BY `name`")->all();
        }

        return $info;
    }

    public function widgets()
    {
    }

    public function modules()
    {
        if ($this->method == 'visible' && $this->element) {
            Q("UPDATE `#__cp_structure` SET `visible`=IF(`visible`!=1, 1, 0) WHERE `id`=?i LIMIT 1", array( $this->element ));

            return array(
                'status' => true
            );
        } else {
            $structure = [];
            $temp = Q("SELECT * FROM `#__cp_structure`")->all();

            foreach ($temp as $mod) {
                $structure[$mod['pid']][] = $mod;
            }

            $main = $structure[0];
            unset($structure[0]);

            $bind = $structure;
            unset($structure);

            $structure['main'] = $main;
            $structure['bind'] = $bind;

            $info['structure'] = $structure;
        }

        return $info;
    }

    public function caching()
    {
    }

    public function filemanager()
    {
    }

    public function support()
    {
    }

    public function knowledge()
    {
    }

    public function optimize()
    {
        $supported = [];
        $ext = array(
            'ADVPNG', 'Gifsicle', 'JpegOptim', 'JPEGTRAN', 'OPTIPNG', 'PNGCrush', 'PNGOUT'
        );

        foreach ($ext as $item) {
            if (extension_loaded($item)) {
                $supported[] = $item;
            }
        }

        $info['images']     = scandir(PATH_ROOT . '/upload_dir/');
        $info['supported']  = $supported;
    }

    public function tinipng()
    {
        $key = 'fiZxjIh3dTZNwFPP7YTmW4rfZkCPUg0S';

        $input = "large-input.png";
        $output = "tiny-output.png";

        $request = curl_init();
        curl_setopt_array($request, array(
            CURLOPT_URL => "https://api.tinypng.com/shrink",
            CURLOPT_USERPWD => "api:" . $key,
            CURLOPT_POSTFIELDS => file_get_contents($input),
            CURLOPT_BINARYTRANSFER => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => true,
            // CURLOPT_CAINFO => __DIR__ . "/cacert.pem",
            CURLOPT_SSL_VERIFYPEER => true
        ));

        $response = curl_exec($request);

        if (curl_getinfo($request, CURLINFO_HTTP_CODE) === 201) {
            $headers = substr($response, 0, curl_getinfo($request, CURLINFO_HEADER_SIZE));

            foreach (explode("\r\n", $headers) as $header) {
                if (substr($header, 0, 10) === "Location: ") {
                    $request = curl_init();
                    curl_setopt_array($request, array(
                        CURLOPT_URL => substr($header, 10),
                        CURLOPT_RETURNTRANSFER => true,
                        CURLOPT_SSL_VERIFYPEER => true
                    ));

                    file_put_contents($output, curl_exec($request));
                }
            }
        } else {
            print(curl_error($request));
            print("Compression failed");
        }

        $input = "large-input.png";
        $output = "tiny-output.png";

        $url = "https://api.tinypng.com/shrink";
        $options = array(
            "http" => array(
                "method" => "POST",
                "header" => array(
                    "Content-type: image/png",
                    "Authorization: Basic " . base64_encode("api:$key")
                ),
                "content" => file_get_contents($input)
            ),
            "ssl" => array(
                "verify_peer" => true
            )
        );

        $result = fopen($url, "r", false, stream_context_create($options));
        if ($result) {
            foreach ($http_response_header as $header) {
                if (substr($header, 0, 10) === "Location: ") {
                    file_put_contents($output, fopen(substr($header, 10), "rb", false));
                }
            }
        } else {
            print("Compression failed");
        }
    }

    public function post()
    {
        $action = __post('action');

        if ($action == 'add') {
            if (isset($_POST['apply'])) {
                redirect($this->base_path);
            } else {
                redirect($this->base_path);
            }
        } elseif ($action == 'edit') {
            if (isset($_POST['apply'])) {
                redirect($this->base_path);
            } else {
                redirect($this->base_path);
            }
        } elseif ($action == 'save_setting') {
            $constants = array(
               'COMPANY_NAME', 'SYSTEM_TIMEZONE', 'SYSTEM_LOCALE', 'SYSTEM_MAINPAGE', 'SYSTEM_DEBUG', 'SYSTEM_TRANSLATE', 'ENABLECACHE'
            );

            foreach ($constants as $item) {
                if (isset($_POST[$item])) {
                    Q("INSERT INTO `#__sys_settings` (`var`, `value`, `date`, `uid`) VALUES ('" . $item . "', '".$_POST[$item]."', NOW(), '".$_SESSION['userinf']['id']."') ON DUPLICATE KEY UPDATE `var` = VALUES(`var`), `value` = VALUES(`value`), `date` = VALUES(`date`), `uid` = VALUES(`uid`)");
                }
            }

            redirect($this->base_path);
        } elseif ($action == 'menu_add') {
            $name = __post('name');
            $system = __post('system');
            $tree = __post('tree');
            
            Q("INSERT INTO `#__str_menu` SET `name`=?s, `system`=?s, `tree`=?s", array( $name, $system, $tree ));
            
            redirect($this->base_path . '/menu');
        } elseif ($action == 'menu_edit') {
            $name = __post('name');
            $system = __post('system');
            $tree = __post('tree');
            $post_id = __post('post_id');
            
            Q("UPDATE `#__str_menu` SET `name`=?s, `system`=?s, `tree`=?i WHERE `id`=?i LIMIT 1", array( $name, $system, $tree, $post_id ));

            if (isset($_POST['apply'])) {
                redirect($this->base_path . '/menu/edit/' . $post_id);
            } else {
                redirect($this->base_path . '/menu');
            }
        }
    }
}
