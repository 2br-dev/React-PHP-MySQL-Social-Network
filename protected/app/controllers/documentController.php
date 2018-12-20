<?php

final class documentController extends CPLoader
{
    use Singleton;
    private $document = null;

    public function __construct()
    {
        parent::__construct();

        $this->document = new Document();
    }

    public function index()
    {
        if ($this->method == 'add') {
            $info['time']            = time();
        } elseif ($this->method == 'edit') {
            $info['docs_item']     = $this->document->getInfoGroupDocsById($this->element);
            $info['time']         = time();
        } elseif ($this->method == 'del') {
            $this->document->delGroup($this->element);

            if (isset($_GET['backuri'])) {
                redirect($_GET['backuri']);
            } else {
                redirect($this->base_path . '/index/');
            }
        } else {
            if (isset($_GET['page']) && $_GET['page']) {
                $info['back_to_page'] = '?back_to_page='.$_GET['page'];
            } else {
                $info['docs_list'] = $this->document->infoGroup('`id`,`title`,`key`');
            }
        }

        return $info;
    }

    public function post($post = array())
    {
        $action = __post('action', $post);

        if ($action == 'add') {
            $last_id =$this->document->insertGroup(__post('name'), __post('key'), __post('docs'));

            if (isset($post['apply'])) {
                redirect($this->base_path . '/index/edit/' . $last_id . '/?msg=apply');
            } elseif (isset($_GET['backuri'])) {
                redirect($_GET['backuri']);
            } else {
                redirect($this->base_path . '/index/');
            }
        } elseif ($action == 'edit') {
            $this->document->editGroup($item_id, __post('name'), __post('key'), __post('visible'));

            if (isset($post['apply'])) {
                redirect($this->base_path . '/index/edit/' . $item_id . '/?msg=apply');
            } elseif (isset($_GET['backuri'])) {
                redirect($_GET['backuri']);
            } elseif (__post('back_to_page')) {
                redirect($this->base_path . '/index/?page=' . __post('back_to_page'));
            } else {
                redirect($this->base_path . '/index/');
            }
        }
    }
}
