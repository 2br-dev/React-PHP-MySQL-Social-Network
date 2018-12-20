<?php

final class localeController extends CPLoader
{
    use Singleton;

    protected $localization = null;

    public function __construct()
    {
        parent::__construct();

        $this->localization = new Localization();
    }

    public function index($search = '')
    {
        if (is_array($search))
        {
            $search = '';
        }

        $page = isset($_GET['page']) ? intval($_GET['page']) : 0;

        $dictionary = $this->localization->getDictionaryList($page, $search);

        $info['locale_list'] = $this->localization->getLocaleList();
        $info['dictionary_list'] = $dictionary['list'];
        $info['pager_info'] = $dictionary['pager'];

        $info['find_value'] = $search;

        $info['tpl_exbody'] = 'index/index';

        return $info;
    }

    public function search()
    {
        return $this->index(isset($_GET['word']) ? trim($_GET['word']) : '');
    }

    public function add()
    {
        $info['locale_list'] = $this->localization->getLocaleList();

        return $info;
    }

    public function edit()
    {
        $info['locale_list'] = $this->localization->getLocaleList();
        $info['dictionary_item'] = $this->localization->getDictionaryItem($this->method);

        $info['tpl_exbody'] = 'edit/index';

        return $info;
    }

    public function del()
    {
        if (is_numeric($this->method)) {
            $this->localization->deleteDictionaryItem($this->method);
            redirect($this->base_path);
        }
    }

    public function post()
    {
        $action = __post("form_action");
        $back_page = isset($_GET['back_to_page']) ? intval($_GET['back_to_page']) : '';

        $apply_url = '';
        $redirect_url = '';

        if ($back_page) {
            $redirect_url = '?page=' . $back_page;
            $apply_url = '&back_to_page=' . $back_page;
        }

        if (count($_POST)) {
            $arr = $_POST;

            unset($arr['form_action'], $arr['apply']);
        }

        if ($action == "add") {
            $last_key = $this->localization->insertData($arr);

            if (isset($_POST['apply']) && $last_key) {
                redirect($this->base_path . '/edit/' . $last_key . '/?msg=apply' . $apply_url);
            } elseif (isset($_GET['backuri'])) {
                redirect($_GET['backuri']);
            } else {
                redirect($this->base_path);
            }
        } elseif ($action == "edit") {
            // $this->meta->updateData($this->element, $this->argument);

            // if (isset($_POST['apply']))
            // {
            //     redirect($this->base_path . '/module/edit/' . $this->element . '/' . $this->argument . '/?msg=apply' . $apply_url);
            // }
            // elseif ( __get("backuri") )
            // {
            //     redirect($_GET['backuri']);
            // }
            // else
            // {
            //     redirect($this->base_path . '/module/list/' . $this->element . '/' . $redirect_url);
            // }
        }
    }
}
