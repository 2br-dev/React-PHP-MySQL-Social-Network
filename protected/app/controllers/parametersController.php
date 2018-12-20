<?php

final class parametersController extends CPLoader
{
    use Singleton;

    private $document = null;

    public function __construct()
    {
        parent::__construct();

        $this->params = new cpParameters;
    }

    public function index()
    {
        $info = [
            'list' => $this->params->get(['id', 'key', 'value', 'long'], [ 'created' => 'desc' ], 0, 10)
        ];

        return $info;
    }

    public function add()
    {
        $info = [
            'tpl_exbody' => 'add/index'
        ];

        return $info;
    }

    public function edit()
    {
        $info = [
            'tpl_exbody' => 'edit/index'
        ];

        if ($this->method)
        {
            $info['item'] = $this->params->get($this->method, ['id', 'key', 'value', 'long']);
        }

        return $info;
    }

    public function del()
    {
        $this->params->delete($this->method);

        redirect($this->base_path);
    }


    public function post()
    {
        $action = __post('form_action');
        $addurl  = isset($_GET['backuri']) ? '&backuri=' . $_GET['backuri'] : '';
        $backuri = isset($_GET['backuri']) ? base64_decode($_GET['backuri']) : '';

        $redirect_url = '?'.substr($addurl, 1);

        if ($action == "add")
        {
            // if (isset($_POST['apply'])) {
            //     redirect($this->base_path. '/edit/' . $list_name . '/?msg=apply' . $addurl);
            // } elseif ($backuri) {
            //     redirect($backuri);
            // } else {
            //     redirect($this->base_path);
            // }
        } elseif ($action == 'edit') {

        }
    }
}
