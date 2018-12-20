<?php

final class blocksController extends CPLoader
{
    use Singleton;

    private $mdd = null;
    private $block = null;

    public function __construct()
    {
        parent::__construct();

        $this->mdd = new MDD();
        $this->block = new Block();
    }

    public function index()
    {
        if ($this->method == 'add') {
            $info['tid_list']    = $this->block->getTid();
        } elseif ($this->method == 'edit') {
            $info['zone_item']    = $this->block->itemZone($this->element);
            $info['tid_list']    = $this->block->getTid();
        } elseif ($this->method == 'del') {
            $this->block->delZone($this->element);
            redirect($this->base_path);
        } else {
            $info['tid_list']    =    $this->block->getTid();
            $info['list_form']    =    $this->block->listZones();
        }

        return $info;
    }

    public function items()
    {
        if ($this->method == 'add') {
            $info['modules_list']    = $this->mdd->getBinds();

            $info['next_ord']    = nextOrd('#__blc_blocks');
            $info['zone_list']    = $this->block->listZones();
        } elseif ($this->method == 'edit') {
            $info['modules_list']    = $this->mdd->getBinds();
            $info['zone_list']        = $this->block->listZones();
            $info['block_item']    = $this->block->itemBlock($this->element);
        } elseif ($this->method == 'del') {
            $this->block->delBlock($this->element);
            redirect($this->base_path . '/items/');
        } else {
            $info['list_form']      = $this->block->listZonesShort();
            $info['blocks_list']    = $this->block->listBlocks();
        }

        return $info;
    }

    public function banners()
    {
        if ($this->method == 'add') {
            $info['file_gid'] = 'banner_file_' . uniqid();
        } elseif ($this->method == 'edit') {
            $info['banner_item'] = $this->block->itemBanner($this->element);
            $info['file_gid']     = isset($info['banner_item']['file']) ? $info['banner_item']['file'] : 'banner_file_' . uniqid();
        } elseif ($this->method == 'del') {
            $info['banner_item'] = $this->block->delBanner($this->element);
            redirect($this->base_path . '/banners/');
        } else {
            $info['blocks_list'] = $this->block->listBanners();
        }
        
        return $info;
    }

    public function post($post = [])
    {
        $data = [];

        $action  = isset($_POST['action']) ? $_POST['action'] : '';

        $addurl  = isset($_GET['backuri']) ? '&backuri=' . $_GET['backuri'] : '';
        $backuri = isset($_GET['backuri']) ? base64_decode($_GET['backuri']) : '';

        #
        if (in_array($action, ['block_add', 'block_edit'])) {
            $data['s:name']            = $post['name'];
            $data['s:locale']        = $post['locale'];
            $data['i:pid']            = $post['zone_id'];
            $data['s:pages_on']     = $post['pages_on'];
            $data['s:pages_off']    = $post['pages_off'];
            $data['s:block_cont']    = $post['block_cont'];
            // $data['s:rotation']		= $post['rotation'];

            $data['i:module']        = $post['module'];
            $data['i:visible']        = $post['visible'];
            $data['i:ord']            = $post['ord'];
        }

        #
        elseif ($action == 'zone_add') {
            $last_id = $this->block->addZone(__post('name'), __post('sys_name'), __post('template'), __post('visible'));

            if (isset($post['apply'])) {
                redirect($this->base_path . '/index/' . $last_id . '/?msg=apply');
            } else {
                redirect($this->base_path);
            }
        } elseif ($action == 'zone_edit') {
            $this->block->editZone($this->element, __post('name'), __post('sys_name'), __post('template'), __post('visible'));
            
            if (isset($post['apply'])) {
                redirect($this->base_path . '/index/edit/' . $this->element . '/?msg=apply');
            } else {
                redirect($this->base_path);
            }
        }

        #
        elseif ($action == 'banners_add') {
            $last_id = $this->block->addBanner($post);

            if (isset($post['apply'])) {
                redirect($this->base_path . '/banners/edit/' . $last_id . '/?msg=apply');
            } else {
                redirect($this->base_path . '/banners/');
            }
        } elseif ($action == 'banners_edit') {
            $last_id = $this->block->editBanner($this->element, $post);

            if (isset($post['apply'])) {
                redirect($this->base_path . '/banners/edit/' . $this->element . '/?msg=apply');
            } else {
                redirect($this->base_path . '/banners/');
            }
        }

        switch ($action) {

            case 'block_add':

                $last_id = $this->block->addBlock($data);

                if (isset($post['apply'])) {
                    redirect($this->base_path . '/items/edit/' . $last_id . '/?msg=apply'.$addurl);
                } else {
                    redirect($this->base_path . '/items');
                }

            break;

            case 'block_edit':

                $this->block->editBlock($data, $this->element);
                
                if (isset($post['apply'])) {
                    redirect($this->base_path . '/items/edit/' . $this->element . '/?msg=apply'.$addurl);
                } else {
                    redirect($this->base_path . '/items');
                }

            break;
        }
    }
}
