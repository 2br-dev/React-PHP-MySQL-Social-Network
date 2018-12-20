<?php

final class shoppingController extends CPLoader
{
    use Singleton, Tools;

    private $shopping = null;

    public function __construct()
    {
        parent::__construct();

        $this->shopping = new Shopping();
    }

    private function getSettings($key = '')
    {
        if (!$this->cache_enable || !($settings = $this->getCache('_shop_settings_'))) {
            $settings = [];

            $temp = $this->shopping->getSettings();

            if (!empty($temp)) {
                foreach ($temp as $item) {
                    $settings[$item['class']][$item['value']] = $item;
                }
            }

            $this->setCache('_sitemap_', $settings);
        }

        if (isset($key) && isset($settings[$key])) {
            return $settings[$key];
        }

        return $settings;
    }

    public function updateStructure()
    {
        $oid = isset($_POST['oid']) ? intval($_POST['oid']) : '';
        $pid = isset($_POST['pid']) ? intval($_POST['pid']) : '';
        $nid = isset($_POST['nid']) ? intval($_POST['nid']) : '';

        $ord = $this->shopping->categoryOrder($pid, $nid);

        $this->shopping->categoryUpdate($pid, $ord, $oid);

        exit(
            json_encode(
                array(
                    'status' => true
                ), 64 | 256
            )
        );
    }

    public function getStructure()
    {
        $category = $this->shopping->structureCategory();

        exit(
            json_encode(
                $category, 64 | 256
            )
        );
    }

    private function getUser($id = 0)
    {
        return $this->shopping->getUser($id);
    }

    public function set()
    {
        switch ($this->method) {
            case 'balance':

                $data = [
                    'infinity' => 0
                ];

                if (($_POST['id']))
                {
                    $id = intval($_POST['id']);

                    if (isset($_POST['disabled']))
                    {
                        $data['infinity'] = intval($_POST['disabled']);
                    }

                    if (isset($_POST['value']) && $data['infinity'] == 0)
                    {
                        $data['balance'] = intval($_POST['value']);
                    }

                    $this->shopping->updateBalance($id, $data);
                }

            break;
        }

        return false;
    }

    public function index()
    {
        if ($this->method == 'list') {
            redirect($this->base_path . '/orders');
        }
    }

    public function update()
    {
        if (count($_POST)) {
            $data = $_POST;

            $available = [
                'visible',
                'special',
                'novelty',
                'infinity'
            ];

            if (in_array($data['name'], $available)) {
                $this->shopping->update($data['name'], $data['value'], $data['id']);
            }
        }
    }

    public function orders()
    {
        $info = [];
        $settings = $this->getSettings();
        $backuri = isset($_GET['backuri']) ? base64_decode($_GET['backuri']) : '';
        $addurl  = isset($_GET['backuri']) ? '?backuri=' . $_GET['backuri'] : '';

        switch ($this->method) {

            case 'item':
            case 'print':

                $order = $this->shopping->getOrderItem($this->element);

                if (in_array($order['delivery'], [4]))
                {
                    $order['address'] = [];
                }

                $order['date'] = Dates($order['date']);

                if (isset($settings['payment']) && isset($settings['payment'][$order['payment']]['variable']))
                {
                    $order['payment'] = $settings['payment'][$order['payment']]['variable'];
                }

                if (isset($settings['delivery']) && isset($settings['delivery'][$order['delivery']]['variable']))
                {
                    $order['delivery'] = $settings['delivery'][$order['delivery']]['variable'];
                }

                $info['order'] = $order;

            break;

            case 'del':

                $this->shopping->deleteOrder($this->element);

                if ($backuri) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/orders');
                }

            break;

            default:

                $query = '';

                $limit = isset($_COOKIE['module_pages_orders']) ? intval($_COOKIE['module_pages_orders']) : 5;

                $makePager = new Pager('#__shop_orders', $query, $_GET, $limit);

                $pager = $makePager->make();

                $orders = $this->shopping->getOrders($pager->startItem, $pager->limit);

                if (!empty($orders))
                {
                    foreach ($orders as &$rec)
                    {
                        if (isset($rec['user']['phone']))
                        {
                            $rec['user']['tel'] = $this->phone($rec['user']['phone']);
                            $rec['user']['phone'] = $this->formatPhone($rec['user']['tel']);
                        }

                        if (isset($settings['payment'][$rec['payment']]['variable'])) {
                            $rec['payment'] = $settings['payment'][$rec['payment']]['variable'];
                        }

                        if (isset($settings['delivery'][$rec['delivery']]['variable'])) {
                            $rec['delivery'] = $settings['delivery'][$rec['delivery']]['variable'];
                        }

                        if (isset($settings['status_delivery'][$rec['status_delivery']]['variable'])) {
                            $rec['status_delivery'] = $settings['status_delivery'][$rec['status_delivery']]['variable'];
                        }

                        if (isset($settings['status_payment'][$rec['status_payment']]['variable'])) {
                            $rec['status_payment'] = $settings['status_payment'][$rec['status_payment']]['variable'];
                        }
                    }
                }

                $info['limit']      = $limit;
                $info['pager']      = get_object_vars($pager);

                $info['statistic']  = $this->shopping->getStatistic();

                $info['count']      = $this->shopping->getOrdersCount();
                $info['orders']     = $orders;
                $info['settings']   = $settings;

            break;
        }

        return $info;
    }

    public function catalog()
    {
        $info = [];
        $backuri = isset($_GET['backuri']) ? base64_decode($_GET['backuri']) : '';
        $addurl  = isset($_GET['backuri']) ? '?backuri=' . $_GET['backuri'] : '';

        switch ($this->method) {

            case 'list':

                $query = '';
                $sort = [];
                $search = [];
                $marked = isset($_GET['mark']) ? intval($_GET['mark']) : 0;

                $limit = isset($_COOKIE['module_pages_catalog']) ? intval($_COOKIE['module_pages_catalog']) : 5;

                if (!empty($_GET)) {
                    $format = [
                        'id'        => 'i',
                        'name'      => 's',
                        'category'  => 'i',
                        'special'   => 'i',
                        'visible'   => 'i',
                        'manufacturer'  => 'i'
                    ];

                    $search = array_intersect_key($_GET, array_flip([
                        'id',
                        'name',
                        'category',
                        'manufacturer',
                        'special',
                        'visible'
                    ]));
                }

                if (isset($_GET['sort'])) {
                    $temp = explode('-', $_GET['sort']);
                    $sort = [
                        'name' => $temp[0],
                        'by' => $temp[1]
                    ];
                }

                if ($search) {
                    $query = $this->shopping->prepareQuery($search, $format);
                }

                $makePager = new Pager('#__shop_catalog', $query, $_GET, $limit);

                $pager = $makePager->make();

                $products = $this->shopping->productList($pager->startItem, $pager->limit, $query, $sort);
                $products = $this->shopping->mapLinks($products);

                $info['sort'] = $sort;
                $info['limit'] = $limit;
                $info['marked'] = $marked;

                $info['products'] = $products;

                $info['pager'] = get_object_vars($pager);

            break;

            case 'clone':
                $clone_id = $this->shopping->productClone($this->element);
                redirect($this->base_path . '/catalog/edit/'.$clone_id.$addurl);
            break;

            case 'add':

                $products = [];
                $products['ord']   = $this->shopping->getProductsOrd();
                $info['products'] = $products;

                $info['fields'] = $this->shopping->catalogFields();

            break;

            case 'edit':

                $info['product'] = $this->shopping->productItem($this->element);
                $info['fields'] = $this->shopping->catalogFields($this->element);

            break;

            case 'import':

                $info['files'] = $this->shopping->importFiles();

                if (in_array($this->element, ['delete', 'handle', 'parse']) && isset($this->path[5]))
                {
                    $hash = $this->path[5];
                }

                switch ($this->element) {
                    case 'delete':
                        $this->shopping->deleteFile($hash);
                        redirect($this->base_path . '/catalog/import');
                    break;

                    case 'handle':
                        $this->shopping->handleFile($hash);
                        redirect($this->base_path . '/catalog/import/parse/' . $hash);
                    break;

                    case 'parse':
                        $parse = $this->shopping->readParse($hash);

                        if (!empty($parse['categories']) && !empty($parse['offers']))
                        {
                            $pure = [];
                            $links = [];

                            foreach($parse['categories'] as $key => $item)
                            {
                                $hash = hashing($item['attr']['id']);

                                $links[$item['attr']['id']] = $hash;

                                $pure[$hash] = [
                                    'key'   =>  $key,
                                    'item'  =>  [
                                        'id'        =>  $item['attr']['id'],
                                        'parentId'  =>  $item['attr']['parentId'],
                                        'name'      =>  $item['attr']['name']
                                    ],
                                    'tree'  =>  []
                                ];
                            }

                            foreach ($parse['offers'] as $item)
                            {
                                $id = $item['attr']['id'];
                                $category = $links[$item['categoryId']['value']];

                                $price = str_replace(',00', '', $item['price']['value']);
                                $price = preg_replace('/\D/', '', $price);

                                $product = [
                                    'id'          => $id,
                                    'parentId'    => $item['attr']['parentId'],
                                    'category'    => $category,
                                    'name'        => $item['НаименованиеПолное']['value'],
                                    'balance'     => intval($item['rest']['value']),
                                    'price'       => $price
                                ];

                                $pure[$category]['tree'][$id] = $product;
                            }


                            foreach($pure as &$category)
                            {
                                $category['item']['count'] = count($category['tree']);
                            }

                            $parse = $pure;
                        }

                        $info['parse'] = $parse;
                    break;
                }

            break;

            case 'export':
                //
            break;

            case 'exchange':
                //
            break;

            case 'del':

                $this->shopping->deleteProduct($this->element);

                if ($backuri) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/catalog');
                }

            break;
        }

        if (in_array($this->method, ['add', 'edit', 'list']))
        {
            $id = isset($_GET['id']) ? $_GET['id'] : '';
            $name = isset($_GET['name']) ? $_GET['name'] : '';
            $selected = isset($_GET['category']) ? intval($_GET['category']) : '';
            $special = isset($_GET['special']) ? intval($_GET['special']) : '';
            $visible = isset($_GET['visible']) ? intval($_GET['visible']) : '';
            $manufacturer = isset($_GET['manufacturer']) ? intval($_GET['manufacturer']) : '';

            $category = $this->shopping->categoryTree();

            $info['search'] = [
                'id'        => $id,
                'name'      => $name,
                'selected'  => $selected,
                'special'   => $special,
                'visible'   => $visible,
                'manufacturer'   => $manufacturer
            ];

            $info['count'] = $this->shopping->getProductCount();

            $tree = [];
            $nested = '';

            foreach ($category as $item)
            {
                $nested = '';

                $item['name'] = $nested . $item['name'];
                $subtree = $item['tree'];
                $nested .= '— ';

                $item['tree'] = [];

                $tree[] = $item;

                if (!empty($subtree))
                {
                    foreach ($subtree as $titem)
                    {
                        $titem['name'] = $nested . $titem['name'];
                        $tree[] = $titem;
                    }
                }
            }

            $info['category'] = !empty($tree) ? $tree : [];

            $info['manufacturer'] = $this->shopping->manufacturerList(0, 300);
        }

        if (in_array($this->method, ['add', 'edit'])) {
            $info['catalog_tabs'] = [
                'description'           => 'Описание',
                'ingredients'           => 'Ингредиенты',
                'testimony'             => 'Применение',
                'contraindications'     => 'Противопоказания'
            ];

            $info['category_list'] = $this->shopping->categoryTree();
            $info['manufacturer_list'] = $this->shopping->manufacturerList(0, 300);
        }

        return $info;
    }

    public function category()
    {
        $info = [];
        $backuri = isset($_GET['backuri']) ? base64_decode($_GET['backuri']) : '';

        if (in_array($this->method, array('add', 'edit'))) {
            $info['category_list'] = $this->shopping->categoryTree();
        }

        switch ($this->method) {
            case 'list':

                $info['category'] = $this->shopping->categoryTree();

            break;

            case 'add':

                $category = [];
                $category['photo'] = 'file_' . substr(str_replace('.', '_', uniqid()), 0, 5) . '_' . str_replace('.', '_', uniqid());
                $category['ord']   = $this->shopping->getCategoryOrd();

                $info['category'] = $category;

            break;

            case 'edit':

                $info['item'] = $this->shopping->categoryItem($this->element);

            break;

            case 'del':

                $this->shopping->deleteCategory($this->element, true);

                if (!empty($backuri)) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/category');
                }

            break;
        }

        return $info;
    }

    public function manufacturer()
    {
        $info = [];
        $backuri = isset($_GET['backuri']) ? base64_decode($_GET['backuri']) : '';
        $addurl  = isset($_GET['backuri']) ? '?backuri=' . $_GET['backuri'] : '';

        switch ($this->method) {

            case 'list':

                $query = '';
                $sort = [];
                $search = [];
                $marked = isset($_GET['mark']) ? intval($_GET['mark']) : 0;

                $limit = isset($_COOKIE['module_pages_manufacturer']) ? intval($_COOKIE['module_pages_manufacturer']) : 5;

                if (!empty($_GET)) {
                    $format = [
                        'id'        => 'i',
                        'name'      => 's',
                        'system'    => 's',
                        'visible'   => 'i'
                    ];

                    $search = array_intersect_key($_GET, array_flip([
                        'id',
                        'name',
                        'system',
                        'visible'
                    ]));
                }

                if (isset($_GET['sort'])) {
                    $temp = explode('-', $_GET['sort']);
                    $sort = [
                        'name' => $temp[0],
                        'by' => $temp[1]
                    ];
                }

                if ($search) {
                    $query = $this->shopping->prepareQuery($search, $format);
                }

                $makePager = new Pager('#__shop_manufacturer', $query, $_GET, $limit);
                $pager = $makePager->make();

                $manufacturer = $this->shopping->manufacturerList($pager->startItem, $pager->limit, $query, $sort);

                $info['limit'] = $limit;
                $info['pager'] = get_object_vars($pager);
                $info['manufacturer'] = $manufacturer;

            break;

            case 'add':

                $info['fields'] = $this->shopping->manufacturerFields();

            break;

            case 'edit':

                $info['item'] = $this->shopping->manufacturerItem($this->element);
                $info['fields'] = $this->shopping->manufacturerFields($this->element);

            break;

            case 'del':

                $this->shopping->deleteManufacturer($this->element);

                if ($backuri) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/manufacturer');
                }

            break;

        }

        return $info;
    }

    public function discounts()
    {
        $info = [];
        $backuri = isset($_GET['backuri']) ? base64_decode($_GET['backuri']) : '';

        if (in_array($this->method, array('add', 'edit'))) {
        }

        switch ($this->method) {
            case 'list':

                $info['discounts'] = $this->shopping->getDiscountList(0, 10);

            break;

            case 'add':

            break;

            case 'edit':

                $info['item'] = $this->shopping->getDiscountItem($this->element, true);

            break;

            case 'del':

                $this->shopping->deleteDiscount($this->element, true);

                if (!empty($backuri)) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/discounts');
                }

            break;
        }

        return $info;
    }

    public function sale()
    {
    }

    public function fileUpload()
    {
        $group_id = $_POST['groupid'];
        $settings = [];

        if (isset($_POST['settings'])) {
            $settings = json_decode($_POST['settings'], true);
        }

        if (!empty($_FILES['file'])) {
            F($_FILES['file'])
                ->upload($group_id)
                ->resize($settings);
        }
    }

    public function cart()
    {
        $info = [];
        $info['fields_type'] = Q("SELECT * FROM `#__mdd_fields_type` WHERE `special`=?i", array( 1 ))->all();

        return $info;
    }

    public function tags()
    {
        $sort = [];
        $query = '';
        $search = [];

        $limit = isset($_COOKIE['module_pages_tags']) ? intval($_COOKIE['module_pages_tags']) : 5;

        if (!empty($_GET)) {
            $format = [
                'id'        => 'i',
                'name'      => 's'
            ];

            $search = array_intersect_key($_GET, array_flip([
                'id',
                'name'
            ]));
        }

        if (isset($_GET['sort'])) {
            $temp = explode('-', $_GET['sort']);
            $sort = [
                'name' => $temp[0],
                'by' => $temp[1]
            ];
        }

        if ($search) {
            $query = $this->shopping->prepareQuery($search, $format);
        }

        $makePager = new Pager('#__shop_tags', $query, $_GET, $limit);

        $pager = $makePager->make();

        $info['tags'] = $this->shopping->tagsList($pager->startItem, $pager->limit, $query, $sort);

        $info['sort'] = $sort;
        $info['limit'] = $limit;
        $info['pager'] = get_object_vars($pager);

        return $info;
    }

    public function customers()
    {
        $info = [];
        $backuri = isset($_GET['backuri']) ? base64_decode($_GET['backuri']) : '';

        if (in_array($this->method, array('add', 'edit'))) {
        }

        switch ($this->method) {
            case 'list':

                $sort = [];
                $query = '';
                $search = [];

                $limit = isset($_COOKIE['module_pages_customers']) ? intval($_COOKIE['module_pages_customers']) : 5;

                if (!empty($_GET)) {
                    $format = [
                        'id'        => 'i',
                        'name'      => 's'
                    ];

                    $search = array_intersect_key($_GET, array_flip([
                        'id',
                        'name'
                    ]));
                }

                if (isset($_GET['sort'])) {
                    $temp = explode('-', $_GET['sort']);
                    $sort = [
                        'name' => $temp[0],
                        'by' => $temp[1]
                    ];
                }

                if ($search) {
                    $query = $this->shopping->prepareQuery($search, $format);
                }

                $makePager = new Pager('#__shop_customer', $query, $_GET, $limit);

                $pager = $makePager->make();

                $info['users'] = $this->shopping->getUsers($pager->startItem, $pager->limit, $query, $sort);

                $info['sort'] = $sort;
                $info['limit'] = $limit;
                $info['pager'] = get_object_vars($pager);

                return $info;

            break;

            case 'add':

                $customers = [];
                $customers['photo'] = 'file_' . substr(str_replace('.', '_', uniqid()), 0, 5) . '_' . str_replace('.', '_', uniqid());

                $info['customers'] = $customers;

            break;

            case 'edit':

                $info['item'] = $this->shopping->getUser($this->element, true);

            break;

            case 'del':

                $this->shopping->deleteUser($this->element, true);

                if (!empty($backuri)) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/customers');
                }

            break;
        }

        return $info;
    }

    public function settings()
    {
        $info = [];

        return $info;
    }

    public function post()
    {
        $action  = isset($_POST['form_action']) ? $_POST['form_action'] : '';
        $addurl  = isset($_GET['backuri']) ? '&backuri=' . $_GET['backuri'] : '';
        $backuri = isset($_GET['backuri']) ? base64_decode($_GET['backuri']) : '';

        $data = [];

        if (in_array($action, ['add', 'edit'])) {

            # meta
            #
            $data['s:meta_title']           = $_POST['meta_title'];
            $data['ls:meta_robots']         = $_POST['meta_robots'];
            $data['s:meta_keywords']        = $_POST['meta_keywords'];
            $data['s:meta_description']     = $_POST['meta_description'];

            # data
            #
            $data['i:price']                = !empty($_POST['price']) ? $_POST['price'] : '';
            $data['s:weight']               = !empty($_POST['weight']) ? $_POST['weight'] : '';

            $data['i:particle_price']       = !empty($_POST['particle_price']) ? $_POST['particle_price'] : '';
            $data['s:particle_weight']      = !empty($_POST['particle_weight']) ? $_POST['particle_weight'] : '';

            $data['i:discount']             = !empty($_POST['discount']) ? $_POST['discount'] : 0;
            $data['i:discount_type']        = $_POST['discount_type'];

            $data['s:name']                 = trim($_POST['name']);
            $data['s:system']               = $_POST['system'];
            $data['s:syncid']               = trim($_POST['syncid']);
            $data['i:category']             = $_POST['category'];
            $data['i:manufacturer']         = $_POST['manufacturer'];
            $data['s:article']              = $_POST['article'];
            $data['s:photo']                = $_POST['photo'];

            $data['i:special']              = isset($_POST['special']) ? $_POST['special'] : 0;
            $data['i:novelty']              = isset($_POST['novelty']) ? $_POST['novelty'] : 0;
            $data['i:infinity']             = isset($_POST['infinity']) ? $_POST['infinity'] : 0;

            $data['s:badge']                = trim($_POST['badge']);

            $data['s:description']          = trim($_POST['description']);
            $data['s:testimony']            = trim($_POST['testimony']);
            $data['s:ingredients']          = trim($_POST['ingredients']);
            $data['s:contraindications']    = trim($_POST['contraindications']);

            $data['properties']             = __post('properties');
            $data['modification']           = __post('modification');

            # system
            #
            // $data['i:ord']                   = $_POST['ord'];
            $data['i:visible']              = $_POST['visible'];
        }

        if (in_array($action, ['add_category', 'edit_category'])) {

            # meta
            #
            $data['s:meta_title']           = $_POST['meta_title'];
            $data['ls:meta_robots']         = $_POST['meta_robots'];
            $data['s:meta_keywords']        = $_POST['meta_keywords'];
            $data['s:meta_description']     = $_POST['meta_description'];

            # data
            #
            $data['i:pid']                  = $_POST['pid'];
            $data['s:name']                 = $_POST['name'];
            $data['s:system']               = $_POST['system'];
            $data['s:syncid']               = trim($_POST['syncid']);
            $data['s:description']          = $_POST['description'];

            # system
            #
            $data['i:ord']                  = $_POST['ord'];
            $data['i:visible']              = $_POST['visible'];
        }

        if (in_array($action, ['add_discount', 'edit_discount'])) {
            # data

            $data['s:name']                 = $_POST['name'];
            $data['s:code']                 = $_POST['code'];
            $data['i:limit']                = $_POST['limit'];
            $data['s:discount']             = $_POST['discount'];
            $data['i:discount_type']        = $_POST['discount_type'];
            $data['i:date_start']           = $this->timestamp($_POST['date_start']);
            $data['i:date_end']             = $this->timestamp($_POST['date_end']);
            $data['i:active']               = $_POST['active'];
        }

        if (in_array($action, ['add_manufacturer', 'edit_manufacturer'])) {

            # meta
            #
            $data['s:meta_title']           = $_POST['meta_title'];
            $data['ls:meta_robots']         = $_POST['meta_robots'];
            $data['s:meta_keywords']        = $_POST['meta_keywords'];
            $data['s:meta_description']     = $_POST['meta_description'];

            # data
            #
            $data['s:name']                 = $_POST['name'];
            $data['s:system']               = $_POST['system'];
            $data['s:anons']                = $_POST['anons'];
            $data['s:description']          = $_POST['description'];
            $data['s:photo']                = $_POST['photo'];

            # system
            #
            $data['i:visible']              = $_POST['visible'];
        }

        if (in_array($action, ['add_customers', 'edit_customers'])) {

            # data
            #
            $data['s:name']                 = $_POST['name'];
            $data['s:photo']                = $_POST['photo'];
            $data['s:email']                = $_POST['email'];
            $data['s:password']             = md5($_POST['password']);
            $data['i:phone']                = $this->phone($_POST['phone']);
            $data['i:birthday']             = $this->timestamp($_POST['birthday']);
            $data['i:balance']              = $_POST['balance'];
            $data['i:bonus']                = $_POST['bonus'];
            $data['i:status']               = $_POST['status'];
            $data['i:active']               = $_POST['active'];

            $data['address']                = $_POST['address'];

        }

        if (in_array($action, ['import'])) {

            # data
            #
            $data['file'] = [];

            if (isset($_FILES["file"]))
            {
                $data['file'] = $_FILES["file"];
            }

        }

        if (in_array($action, ['handle'])) {

            # data
            #

            $data['parse'] = [];

            $data['checked'] = $_POST['checked'];

            if (!empty($data['checked']))
            {
                $data['parse'] = $this->shopping->readParse($this->argument);
            }

        }

        // if (in_array($action, ['export'])) {
        //     exit(__($_POST, $_FILES));
        // }

        // if (in_array($action, ['exchange'])) {
        //     exit(__($_POST, $_FILES));
        // }

        switch ($action) {
            /**
             * Каталог
             */

            case 'add':

                $last_id = $this->shopping->addProduct($data);

                if (isset($_POST['apply']) && $last_id) {
                    redirect($this->base_path . '/catalog/edit/' . $last_id . '/?msg=apply'.$addurl);
                } elseif ($backuri) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/catalog');
                }

            break;

            case 'edit':

                $this->shopping->editProduct($data, $this->element);

                if (isset($_POST['apply'])) {
                    redirect($this->base_path . '/catalog/edit/' . $this->element . '/?msg=apply'.$addurl);
                } elseif ($backuri) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/catalog');
                }

            break;

            case 'add_manufacturer':

                $last_id = $this->shopping->addManufacturer($data);

                if (isset($_POST['apply']) && $last_id) {
                    redirect($this->base_path . '/manufacturer/edit/' . $last_id . '/?msg=apply'.$addurl);
                } elseif ($backuri) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/manufacturer');
                }

            break;

            case 'edit_manufacturer':

                $this->shopping->editManufacturer($data, $this->element);

                if (isset($_POST['apply'])) {
                    redirect($this->base_path . '/manufacturer/edit/' . $this->element . '/?msg=apply'.$addurl);
                } elseif ($backuri) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/manufacturer');
                }

            break;

            case 'import':

                $this->shopping->uploadImportFile($data);

                if (isset($_POST['apply'])) {
                    redirect($this->base_path . '/catalog/import/?msg=apply'.$addurl);
                } elseif ($backuri) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/catalog/import');
                }

            break;

            case 'handle':

                $this->shopping->handleImport($data);

                if (isset($_POST['apply'])) {
                    redirect($this->base_path . '/catalog/import/?msg=apply'.$addurl);
                } elseif ($backuri) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/catalog/import');
                }

            break;

            case 'export':
                exit(__('export', $data));
            break;

            case 'exchange':
                exit(__('exchange', $data));
            break;

            /**
             * Покупатели
             */
            case 'add_customers':

                $last_id = $this->shopping->addBuyers($data);

                if (isset($_POST['apply']) && $last_id) {
                    redirect($this->base_path . '/customers/edit/' . $last_id . '/?msg=apply'.$addurl);
                } elseif ($backuri) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/customers');
                }

            break;

            case 'edit_customers':

                $last_id = $this->shopping->editBuyers($data, $this->element);

                if (isset($_POST['apply'])) {
                    redirect($this->base_path . '/customers/edit/' . $this->element . '/?msg=apply'.$addurl);
                } elseif ($backuri) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/customers');
                }

            break;

            /**
             * Категории
             */
            case 'add_category':

                $last_id = $this->shopping->addCategory($data);

                if (isset($_POST['apply']) && $last_id) {
                    redirect($this->base_path . '/category/edit/' . $last_id . '/?msg=apply'.$addurl);
                } elseif ($backuri) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/category');
                }

            break;

            case 'edit_category':

                $this->shopping->editCategory($data, $this->element);

                if (isset($_POST['apply'])) {
                    redirect($this->base_path . '/category/edit/' . $this->element . '/?msg=apply'.$addurl);
                } elseif ($backuri) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/category');
                }
            break;

            /**
             * Промокоды
             */
            case 'add_discount':

                $last_id = $this->shopping->addDiscount($data);

                if (isset($_POST['apply']) && $last_id) {
                    redirect($this->base_path . '/discounts/edit/' . $last_id . '/?msg=apply'.$addurl);
                } elseif ($backuri) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/discounts');
                }

            break;

            case 'edit_discount':

                $last_id = $this->shopping->editDiscount($data, $this->element);

                if (isset($_POST['apply'])) {
                    redirect($this->base_path . '/discounts/edit/' . $this->element . '/?msg=apply'.$addurl);
                } elseif ($backuri) {
                    redirect($backuri);
                } else {
                    redirect($this->base_path . '/discounts');
                }

            break;

        }
    }
}
