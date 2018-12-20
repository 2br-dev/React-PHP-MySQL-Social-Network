<?php

final class dispatchController extends CPLoader
{
    use Singleton;
    private $dispatch = null;
    
    public function __construct()
    {
        parent::__construct();
        
        $this->dispatch = new Dispatch();
    }
    
    public function configure()
    {
        //$info['list_dispatch'] = $this->dispatch->list_dispatch();
        return $info;
    }

    public function index()
    {
        if ($this->method == 'del' && $this->element) {
            $this->dispatch->del($this->element);
            redirect($this->base_path . '/configure/');
        } elseif ($this->method == 'add') {
            $info['item_modules'] = $this->dispatch->get_modules();
            $info['item_groups'] = $this->dispatch->get_groups();
        } elseif ($this->method == 'edit' && $this->element) {
            $info['item_dispatch'] = $this->dispatch->item_dispatch($this->element);
            $info['item_modules'] = $this->dispatch->get_modules();
            $info['item_groups'] = $this->dispatch->get_groups();
            $info['item_fields'] = $this->dispatch->get_fields($this->dispatch->getFieldId($this->element), 'all');
        } else {
            $info['list_dispatch_send'] = $this->dispatch->list_dispatch();
        }

        return $info;
    }

    public function send()
    {
        if (isset($_GET['module_id']) && $_GET['module_id'] != '' && $this->element) {
            $result = $this->dispatch->sendToModule($_GET['module_id'], $this->element);
            redirect($this->base_path . '/result/?good=' . $result['goods'] . '&error=' . $result['error']);
        }
    }

    public function post($post = array())
    {
        $action    = __post('action', $post);
        $post_id    = __post('id', $post);

        if ($action == 'save_conf') {
            $srch = new Search();
            $srch->save_settings();
        }

        $__settings = '';
        $__settings = $this->dispatch->doSerialize($post);

        if ($action == 'add') {
            $send_group = (__post('send_group') != '') ? implode(',', __post('send_group')) : '';
            
            $last_id = Q("INSERT INTO `#__dispatch` SET 
				`name`='".__post('name')."',
				`module`='".__post('module')."',
				`settings`='".$__settings."',
				`send_to`='".__post('send_to')."',
				`send_to_field`='".__post('send_to_field')."',
				`send_group`='".$send_group."',
				`send_list`='".__post('send_list')."' ");
        } elseif ($action == 'edit' && $post_id) {
            $send_group = (__post('send_group') != '') ? implode(',', __post('send_group')) : '';
            
            $last_id = Q("UPDATE `#__dispatch` SET 
				`name`='".__post('name')."',
				`module`='".__post('module')."',
				`settings`='".$__settings."',
				`send_to`='".__post('send_to')."',
				`send_to_field`='".__post('send_to_field')."',
				`send_group`='".$send_group."',
				`send_list`='".__post('send_list')."' WHERE `id`='".$post_id."' ");
        }
        
        if (isset($post['apply'])) {
            redirect($this->base_path . '/edit/' . $last_id . '/?msg=apply');
        } else {
            redirect($this->base_path . '/configure/');
        }
    }
}
