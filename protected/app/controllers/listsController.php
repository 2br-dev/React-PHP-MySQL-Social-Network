<?php

final class listsController extends CPLoader
{
    use Singleton;
    private $user   = null;
    private $meta   = null;
    private $mdd    = null;

    public function __construct()
    {
        parent::__construct();

        $this->mdd = new Mdd();
    }

    public function index()
    {
        $info = [
            'mdd_list' => $this->mdd->getLists()
        ];

        return $info;
    }

    public function add()
    {
        $info = [
            'mdd_list' => $this->mdd->getLists()
        ];

        return $info;
    }

    public function edit()
    {
        $info = [
            'mdd_list' => $this->mdd->getLists($this->method),
            'tpl_exbody' => 'edit/index'
        ];

        return $info;
    }

    public function del()
    {
        $this->mdd->delLists($this->method);
        redirect($this->base_path);
    }

    public function post()
    {
        $action = __post('form_action');
        $addurl  = isset($_GET['backuri']) ? '&backuri=' . $_GET['backuri'] : '';
        $backuri = isset($_GET['backuri']) ? base64_decode($_GET['backuri']) : '';

        $redirect_url = '?'.substr($addurl, 1);

        if ($action == "add_list") {
            $name       = __post("name");
            $list_name  = __post("list_name");

            if (!$name) {
                return false;
            }
            if (!$list_name) {
                return false;
            }

            $this->mdd->addList();

            if (isset($_POST['apply'])) {
                redirect($this->base_path. '/edit/' . $list_name . '/?msg=apply' . $addurl);
            } elseif ($backuri) {
                redirect($backuri);
            } else {
                redirect($this->base_path);
            }
        } elseif ($action == 'edit_list') {
            $name       = __post("name");
            $list_name  = __post("list_name");
            $old_list_name  = __get("list_name");

            if (!$name) {
                return false;
            }
            if (!$list_name) {
                return false;
            }

            $this->mdd->editList();

            if (isset($_POST['apply'])) {
                redirect($this->base_path. '/edit/' . $list_name . '/?msg=apply' . $addurl);
            } elseif ($backuri) {
                redirect($backuri);
            } else {
                redirect($this->base_path);
            }
        }
    }
}
