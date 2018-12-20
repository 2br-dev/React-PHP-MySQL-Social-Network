<?php

class Shopping
{
    use Tools;

    private $user       = [];
    private $words      = [];
    private $categories = [];

    private $db = [
                    'users' => '#__shop_customer',
                    'orders' => '#__shop_orders',
                    'storage' => '#__shop_storage',
                    'address' => '#__shop_address',
                    'catalog' => '#__shop_catalog',
                    'category' => '#__shop_category',
                    'discount' => '#__shop_discount',
                    'settings' => '#__shop_settings',
                    'manufacturer' => '#__shop_manufacturer'
                ];

    public function __construct()
    {
        if (!empty($_SESSION['userinf'])) {
            $this->user = $_SESSION['userinf'];
        }
    }

    public function getSettings()
    {
        return Q("SELECT * FROM `" . $this->db['settings'] . "` ORDER BY `ord`")->all();
    }

    public function getOrdersCount()
    {
        return Q("SELECT COUNT(`id`) as `count` FROM `" . $this->db['orders'] . "` LIMIT 1")->row('count');
    }

    public function getStatisticItem($start = 0, $end = 0)
    {
        $response = [
            'cost' => 0,            # Общая сумма
            'count' => 0,           # Количество продаж
            'unique' => 0,          # Количество уникальных товаров
            'average' => 0,         # Средний чек
            'products' => 0,        # Количество проданных товаров
            'hits' => []            # Самые продаваемые товары
        ];

        $orders = Q("SELECT `purchase` FROM `" . $this->db['orders'] . "` WHERE `purchase`!='null' AND `date` BETWEEN ?i AND ?i ORDER BY `email`", [
            $start, $end
        ])->all();

        if (!empty($orders))
        {
            $cost = 0;
            $count = 0;
            $unique = 0;
            $products = 0;
            $hits = [];

            foreach ($orders as $order)
            {
                if (!empty($order['purchase']))
                {
                    $count += 1;
                    $purchase = json_decode($order['purchase'], true);

                    if (!empty($purchase))
                    {
                        $unique += count($purchase);

                        foreach ($purchase as $product)
                        {
                            if (isset($product['item']))
                            {
                                $id = $product['item']['id'];

                                if (!isset($hits[$id]))
                                {
                                    $hits[$id]['id'] = $id;
                                    $hits[$id]['name'] = $product['item']['name'];
                                    $hits[$id]['count'] = $product['count'];
                                }
                                else {
                                    $hits[$id]['count'] += $product['count'];
                                }

                                $cost += $product['item']['price'] * $product['count'];
                                $products += $product['count'];
                            }
                        }
                    }
                }
            }

            $average = round($cost / $count, 2);

            usort($hits, function ($a, $b) {
                return $a['count'] - $b['count'];
            });

            $hits = array_slice(array_reverse($hits), 0, 5);

            $response['cost'] = $cost;
            $response['count'] = $count;
            $response['unique'] = $unique;
            $response['average'] = $average;
            $response['hits'] = $hits;
            $response['products'] = $products;
        }

        return $response;
    }

    public function getStatistic($page = 0)
    {
        $stats = [];

        $now = time();

        $one_day = 60 * 60 * 24;

        $today = mktime(0, 0, 0, date('m'), date('j'), date('Y'));
        $yesterday = $today - $one_day;
        $month = mktime(0, 0, 0, date('m'), 1, date('Y'));

        $stats['total'] = [
            'name'  =>  'Всего',
            'list'  =>  $this->getStatisticItem(0, $now)
        ];

        $stats['today'] = [
            'name'  =>  'Сегодня',
            'list'  =>  $this->getStatisticItem($today, $now)
        ];

        $stats['yesterday'] = [
            'name'  =>  'Вчера',
            'list'  =>  $this->getStatisticItem($yesterday, $today)
        ];

        $stats['month'] = [
            'name'  =>  'В этом месяце',
            'list'  =>  $this->getStatisticItem($month, $now)
        ];

        $stats['year'] = [
            'name'  =>  'В этом году',
            'list'  =>  $this->getStatisticItem(mktime(0, 0, 0, 1, 1, date('Y')), $now)
        ];

        return $stats;
    }

    public function getOrders($page = 0, $limit = 12)
    {
        $orders = Q("SELECT
                        `id`, `number`, `user`, `name`,
                        `surname`, `phone`, `email`, `address`,
                        `delivery`, `payment`, `cost`, `discount`,
                        `status_delivery`, `status_payment`, `date`
                     FROM `" . $this->db['orders'] . "`
                     ORDER BY `date` DESC
                     LIMIT ?i, ?i", [
                        $page, $limit
                    ])->all();

        if (!empty($orders))
        {
            foreach ($orders as &$rec)
            {
                $user = $this->getUser($rec['user'], false, [
                    'id', 'name', 'firstname', 'lastname', 'email', 'phone', 'address'
                ]);

                if (empty($user))
                {
                    $fullname = $rec['surname'];

                    if (!empty($fullname))
                    {
                        $fullname .= ' ';
                    }

                    $fullname .= $rec['name'];

                    $user = [
                        'id'        => '',
                        'name'      => $fullname,
                        'firstname' => $rec['name'],
                        'lastname'  => $rec['surname'],
                        'email'     => $rec['email'],
                        'phone'     => $rec['phone'],
                        'address'   => $rec['address']
                    ];
                }

                $rec['user'] = $user;

                $rec['date'] = $this->dateFormat($rec['date'], 'd.m.Y H:i');
            }
        }

        return $orders;
    }

    public function getOrderItem($id = 0)
    {
        $order = [];

        if ($id) {
            $order = Q("SELECT * FROM `" . $this->db['orders'] . "` WHERE `id`=?i LIMIT 1", [ $id ])->row();

            if (!empty($order))
            {
                $user = $this->getUser($order['user'], false, [
                    'id', 'name', 'firstname', 'lastname', 'email', 'phone', 'address'
                ]);

                if (empty($user))
                {
                    $fullname = $order['surname'];

                    if (!empty($fullname))
                    {
                        $fullname .= ' ';
                    }

                    $fullname .= $order['name'];

                    $user = [
                        'id'        => '',
                        'name'      => $fullname,
                        'firstname' => $order['name'],
                        'lastname'  => $order['surname'],
                        'email'     => $order['email'],
                        'phone'     => $order['phone'],
                        'address'   => $order['address']
                    ];
                }

                $order['user'] = $user;
                $order['date'] = $this->dateFormat($order['date'], 'd.m.Y H:i');

                $order['address'] = $this->getAddressItem($order['address']);
                $order['purchase'] = $this->getPurchase($order['purchase']);
            }
        }

        return $order;
    }

    public function getProductCount()
    {
        $hidden = Q("SELECT COUNT(`id`) as `count` FROM `" . $this->db['catalog'] . "` WHERE `visible`=0 LIMIT 1")->row('count');
        $visible = Q("SELECT COUNT(`id`) as `count` FROM `" . $this->db['catalog'] . "` WHERE `visible`=1 LIMIT 1")->row('count');

        return [
            'total' => $visible + $hidden,
            'hidden' => $hidden,
            'visible' => $visible
        ];
    }

    public function deleteOrder($id = 0)
    {
        if ($id !== 0) {
            Q("DELETE FROM `" . $this->db['orders'] . "` WHERE `id`=?i LIMIT 1", [ $id ]);
        }
    }

    public function getPurchase($json = '')
    {
        $products = [];

        if (!empty($json)) {
            $products = json_decode($json, true);
        }

        return $products;
    }

    public function tagsList($page = 0, $limit = 10)
    {
    }

    public function categoryOrder($pid = 0, $nid = 10)
    {
        $ord = 0;

        $min = Q("SELECT MIN(`ord`) as `ord` FROM `" . $this->db['category'] . "` WHERE `pid`=?i LIMIT 1", [ $pid ])->row('ord');

        Q("UPDATE `" . $this->db['category'] . "` SET `ord`=(`ord` - ?i + 10) WHERE `pid`=?i", [ $min, $pid ]);

        if ($nid == 0) {
            $ord = Q("SELECT (MAX(`ord`) + 5) as `ord` FROM `" . $this->db['category'] . "` WHERE `pid`=?i LIMIT 1", [ $pid ])->row('ord');
        } else {
            $ord = Q("SELECT (`ord` - 5) as `ord` FROM `" . $this->db['category'] . "` WHERE `id`=?i LIMIT 1", [ $nid ])->row('ord');
        }

        return $ord;
    }

    public function categoryUpdate($pid = 0, $ord = 0, $oid = 0)
    {
        Q("UPDATE `" . $this->db['category'] . "` SET `pid`=?i, `ord`=?i WHERE `id`=?i LIMIT 1", [
            $pid, $ord, $oid
        ]);
    }

    protected function queryPart($words = [], $current = 0)
    {
        if ($current == (count($words) - 1)) {
            return Qb("SELECT DISTINCT `id` FROM `?e` AS `t?i` WHERE (`t?i`.`name` LIKE '%?e%')", array(
                $this->db['catalog'],
                $current,
                $current,
                $words[$current]
            ));
        }

        return Qb("SELECT DISTINCT `id` FROM `?e` AS `t?i` WHERE (`t?i`.`name` LIKE '%?e%') AND `id` IN (?e)", array(
            $this->db['catalog'],
            $current,
            $current,
            $words[$current],
            $this->queryPart($words, $current + 1)
        ));
    }

    public function prepareQuery($parameters = [], $format = [])
    {
        $ids = [];
        $result = '';
        $categories = [];

        foreach ($parameters as &$value)
        {
            $value = urldecode($value);
        }

        if (isset($parameters['category'])) {
            $categories[] = $parameters['category'];

            $buf = Q("SELECT `id` FROM `".$this->db['category']."` WHERE `pid`=?i", [ $parameters['category'] ])->all();

            if (!empty($buf)) {
                foreach($buf as $c) {
                    $categories[] = $c['id'];
                }
            }
        }

        if (!empty($categories)) {
            $result .= " `category` IN (".implode(',', $categories).")";
        }

        if (isset($parameters['name'])) {
            $name = str_replace(array('”', '“', '%', '&', '#', '$', '№', '@', '\/', '\\', '(', ')', '}', '{', '^', '[', ']', '|', '+', '<', '>', '«', '»', '`', '`', '\'', '--', '"', "'", ',', '.', '!', '?', ':', ';', '*', '®', '©', '™', '℗', '§', '℠'), ' ', $parameters['name']);
            $this->words = preg_split('/\ +/', $name, -1, PREG_SPLIT_NO_EMPTY);

            $sql = $this->queryPart($this->words);
            $sql = preg_replace('/^SELECT DISTINCT `id`/', 'SELECT DISTINCT `id`', $sql);

            $temp = Q($sql)->all();

            if (!empty($temp)) {
                $ids = array_map(function ($value) {
                    return $value['id'];
                }, $temp);
            }
        }

        if (!empty($ids)) {
            if ($result !== '') {
                $result .= " AND";
            }

            $result .= " `id` IN (".implode(',', $ids).")";
        }

        if (!empty($parameters)) {
            foreach ($parameters as $name => $value) {
                if (!in_array($name, ['name', 'category'])) {
                    if ($result !== '') {
                        $result .= " AND ";
                    }

                    $result .= "`".$name."`";

                    if ($format[$name] === 'i') {
                        $result .= " = ".intval($value);
                    } else {
                        $result .= " LIKE '%".$value."%'";
                    }
                }
            }
        }

        return $result ? '('.$result.')' : '';
    }

    public function mapLinks($products = [])
    {
        if (!empty($products)) {
            foreach ($products as &$product) {
                if (isset($product['category']) && !empty($product['category']['system'])) {
                    $product['link'] = '/'.$product['category']['system'].'/'.$product['id'].'-'.$product['system'];
                }
            }
        }

        return $products;
    }

    public function productClone($id = 0)
    {
        if ($id) {
            $product = $this->productItem($id);

            $properties = isset($product['properties']) ? $product['properties'] : [];
            $modification = isset($product['modification']) ? $product['modification'] : [];

            $clone = array_diff_key($product, array_flip([
                'id',
                'gid',
                'uid',
                'photo',
                'article',
                'storage',
                'created',
                'updated',
                'properties',
                'modification'
            ]));

            $query = [];

            foreach ($clone as $key => $value)
            {
                if (is_numeric($value)) {
                    $_buf = " `".$key."`=".trim($value);
                } elseif (is_array($value)) {
                    $_buf = " `".$key."`='".implode($value, ',')."'";
                } else {
                    $_buf = " `".$key."`='".trim($value)."'";
                }

                $query[] = $_buf;
            }

            $time = time();

            $last_id = Q("INSERT INTO `" . $this->db['catalog'] . "` SET ". implode($query, ',') . ", `created`=?i ON DUPLICATE KEY UPDATE `updated`=?i", [
                1,
                $time,
                $time
            ]);

            if ($last_id) {
                $this->_updateProperties($this->_prepareArray($properties), $last_id);
                $this->_updatModifications($this->_prepareArray($modification), $last_id);
            }

            return $last_id;
        }
    }

    public function manufacturerFields($id = 0)
    {
        $list        = [];
        $fields    = [];
        $settings    = [];
        $group_id    = '';

        if ($id !== 0) {
            $manufacturer_item = Q("SELECT * FROM `" . $this->db['manufacturer'] . "` WHERE `id`=?i", [ $id ])->row();

            if (isset($manufacturer_item['photo'])) {
                $group_id = $manufacturer_item['photo'];

                $file = new Files();
                $list = $file->getFilesByGroup($group_id, ['cp']);
            }
        }

        if ($id == 0 || $group_id == '') {
            $group_id = $this->_generateGroup();
        }

        foreach ($list as &$_li) {
            $_li['uuid'] = $_li['id'];
            $_li['name'] = $_li['title'];
            $_li['size'] = $_li['bsize'];
            $_li['thumbnailUrl'] = $_li['file'];
        }

        $fields['name'] = 'photo';
        $fields['value'] = $group_id;
        $fields['action'] = 'shopping/fileUpload';
        $fields['list'] = $list;
        $fields['json']= json_encode($list, 64 | 256);

        $settings = [
            [
                'prefix'    => 'preview',
                'width'     => 560,
                'height'    => 560,
                'method'    => 'crop'
            ],
            [
                'prefix'    => 'market',
                'width'     => 500,
                'height'    => 500,
                'method'    => 'crop'
            ],
            [
                'prefix'    => 'cp',
                'width'     => 112,
                'height'    => 112,
                'method'    => 'crop'
            ]
        ];

        $settings['json'] = json_encode($settings);

        $fields['settings'] = $settings;

        return $fields;
    }

    public function manufacturerItem($id = 0)
    {
        $item = [];

        if ($id !== 0)
        {
            $item = Q("SELECT * FROM `".$this->db['manufacturer']."` WHERE `id`=?i LIMIT 1", [
                $id
            ])->row();

            $item['meta_robots'] = preg_split('/\,+/', $item['meta_robots'], -1, PREG_SPLIT_NO_EMPTY);
        }

        return $item;
    }

    public function manufacturerList($page = 0, $limit = 10, $q = '', $sort = [])
    {
        $where = '';
        $order = '';

        if ($q !== '') {
            $where = 'WHERE '.$q.' ';
        }

        if (!empty($sort)) {
            $order = '`'.$sort['name'].'` '.strtoupper($sort['by']);
        } else {
            $order = '`ord`, `id`';
        }

        $list = Q("SELECT `id`, `name`, `system`, `visible`, `ord` FROM `".$this->db['manufacturer']."` ".$where." ORDER BY ".$order." LIMIT ?i, ?i", [
                    $page, $limit
                ])->all('id');

        return $list;
    }

    public function addManufacturer($data = [])
    {
        if (!empty($data)) {
            $sql = "";

            $_query = '';
            $_value = [];

            foreach ($data as $key => $value) {
                $_t = explode(':', $key);
                $_f = $_t[0];
                $_n = $_t[1];

                if ($_query !== '') {
                    $_query .= ', ';
                }

                if (in_array($_f, ['ls', 'li'])) {
                    $_f = 's';
                    $value = implode(',', $value);
                }

                $_query .= '`'.$_n.'`=?'.$_f;

                $_value[] = $value;
            }

            $sql = ", `updated`=" . time() . ", `uid`=" . $this->user['id'] . ", `gid`=" . $this->user['gid'];

            $last_id = Q("INSERT INTO `" . $this->db['manufacturer'] . "` SET " . $_query . $sql . " ON DUPLICATE KEY UPDATE `updated`=" . time(), $_value);

            return $last_id;
        }

        return false;
    }

    public function editManufacturer($data = [], $id = 0)
    {
        if (!empty($data) && $id !== 0) {
            $sql = '';

            $_query = '';
            $_value = [];

            foreach ($data as $key => $value) {
                $_t = explode(':', $key);
                $_f = $_t[0];
                $_n = $_t[1];

                if ($_query !== '') {
                    $_query .= ', ';
                }

                if (in_array($_f, ['ls', 'li'])) {
                    $_f = 's';
                    $value = implode(',', $value);
                }

                $_query .= '`'.$_n.'`=?'.$_f;

                $_value[] = $value;
            }

            $sql = ", `updated`=" . time() . ", `uid`=" . $this->user['id'] . ", `gid`=" . $this->user['gid'];

            Q("UPDATE `" . $this->db['manufacturer'] . "` SET " . $_query . $sql . " WHERE `id`=".$id." LIMIT 1", $_value);
        }
    }

    public function deleteManufacturer($id = 0)
    {
        if ($id !== 0) {
            Q("DELETE FROM `" . $this->db['manufacturer'] . "` WHERE `id`=?i LIMIT 1", [ $id ]);
        }
    }

    public function productList($page = 0, $limit = 10, $q = '', $sort = [])
    {
        $where = '';
        $order = '';

        if ($q !== '') {
            $where = ' AND '.$q.' ';
        }

        if (!empty($sort)) {
            $order = '`'.$sort['name'].'` '.strtoupper($sort['by']);
        } else {
            $order = '`ord`, `id`';
        }

        $products = Q("SELECT `id`, `name`, `system`, `article`, " .
                      "`category`, `balance`, `discount`, `special`, `discount_type`, `infinity`, `price`, " .
                      "`photo`, `file`, `tags`, `manufacturer`, `visible`, `ord` " .
                      "FROM `" . $this->db['catalog'] . "` WHERE `variation`=0 ".$where." ORDER BY ".$order." LIMIT ?i, ?i", [ $page, $limit ])->all();

        if (!empty($products))
        {
            $file = new Files();

            $category = $this->categoryList(['id', 'name', 'system']);
            $manufacturer = $this->manufacturerList(0, 300);

            foreach ($products as &$product)
            {
                if ($product['category'] && !empty($category[$product['category']])) {
                    $product['category'] = $category[$product['category']];
                }

                if ($product['manufacturer'] && !empty($manufacturer[$product['manufacturer']])) {
                    $product['manufacturer'] = $manufacturer[$product['manufacturer']];
                }

                if ($product['photo']) {
                    $photo = $file->getFilesByGroupCount($product['photo'], ['cp'], 1);
                    $product['photo'] = isset($photo[0]) ? $photo[0] : [];
                }

                $product['modification'] = $this->_getModification($product['id']);
            }
        }

        return $products;
    }

    public function productItem($id = 0)
    {
        $item = [];

        if ($id !== 0)
        {
            $item = Q("SELECT * FROM `" . $this->db['catalog'] . "` WHERE `id`=?i LIMIT 1", [ $id ])->row();
            $item['meta_robots'] = preg_split('/\,+/', $item['meta_robots'], -1, PREG_SPLIT_NO_EMPTY);

            $item['storage'] = $this->_getStorage($id);
            $item['modification'] = $this->_getModification($id);
        }

        return $item;
    }

    public function addProduct($data = [])
    {
        if (!empty($data))
        {
            $sql = "";
            $slice = [];

            if (empty($data['s:hash']))
            {
                if (!empty($data['s:syncid']))
                {
                    $data['s:hash'] = hashing($data['s:syncid']);
                }
                else
                {
                    $hash = [];

                    if (isset($data['i:category']))
                    {
                        $hash[] = $data['i:category'];
                    }

                    if (isset($data['i:manufacturer']))
                    {
                        $hash[] = $data['i:manufacturer'];
                    }

                    if (isset($data['s:name']))
                    {
                        $hash[] = $data['s:name'];
                    }

                    $data['s:hash'] = hashing(implode('.', $hash));
                }
            }

            $properties = [];
            $modification = [];

            if (isset($data['properties']))
            {
                $properties = $data['properties'];
                unset($data['properties']);
            }

            if (isset($data['modification']))
            {
                $modification = $data['modification'];
                unset($data['modification']);
            }

            $_query = '';
            $_value = [];

            foreach ($data as $key => $value)
            {
                $_t = explode(':', $key);
                $_f = $_t[0];
                $_n = $_t[1];

                if ($_query !== '') {
                    $_query .= ', ';
                }

                if (in_array($_f, ['ls', 'li'])) {
                    $_f = 's';
                    $value = implode(',', $value);
                }

                $_query .= '`'.$_n.'`=?'.$_f;

                $_value[] = $value;
            }

            $sql = ", `created`=" . time() . ", `uid`=" . $this->user['id'] . ", `gid`=" . $this->user['gid'];

            $duplicate = [
                'i:visible' => 1,
                'i:updated' => time()
            ];

            // if (!empty($data['s:name']))
            // {
            //     $duplicate['s:name'] = $data['s:name'];
            // }

            if (!empty($data['i:price']))
            {
                $duplicate['i:price'] = $data['i:price'];
            }

            if (!empty($data['i:category']))
            {
                $duplicate['i:category'] = $data['i:category'];
            }

            if (!empty($data['i:balance']))
            {
                $duplicate['i:balance'] = $data['i:balance'];
            }

            if ($data['s:hash'])
            {
                $duplicate['s:hash'] = $data['s:hash'];
            }

            $duplicate_sql = "ON DUPLICATE KEY UPDATE ";

            $index = 0;
            $length = count($duplicate);

            foreach ($duplicate as $key => $value)
            {
                $index ++;

                $type = 's';

                if (strstr($key, ':'))
                {
                    $_t = explode(':', $key);

                    $duplicate_sql .= "`" . $_t[1] . "`=";

                    if ($_t[0] == 's')
                    {
                        if (!$value) {
                            $value = '';
                        }

                        $duplicate_sql .= "'" . $value . "'";
                    }
                    elseif ($_t[0] == 'i')
                    {
                        if (!$value) {
                            $value = 0;
                        }

                        $duplicate_sql .= $value;
                    }
                    elseif (in_array($_t[0], ['ls', 'li']))
                    {
                        $duplicate_sql .= "'" . implode(',', $value) . "'";
                    }
                }

                if ($length > $index)
                {
                    $duplicate_sql .= ", ";
                }
            }

            $last_id = Q("INSERT INTO `" . $this->db['catalog'] . "` SET " . $_query . $sql . " " . $duplicate_sql, $_value);

            if ($last_id)
            {
                if (!empty($properties))
                {
                    $this->_updateProperties($this->_prepareArray($properties), $last_id);
                }

                if (!empty($modification))
                {
                    $this->_updatModifications($this->_prepareArray($modification), $last_id);
                }
            }

            return $last_id;
        }

        return false;
    }

    public function editProduct($data = [], $id = 0)
    {
        if (!empty($data) && $id !== 0)
        {
            $sql = '';
            $slice = [];

            if (empty($data['s:hash']))
            {
                $data['s:hash'] = hashing($data['i:category'].$data['i:manufacturer'].$data['s:name']);
            }

            $this->_updateProperties($this->_prepareArray($data['properties']), $id);
            $this->_updatModifications($this->_prepareArray($data['modification']), $id);

            unset($data['properties'], $data['modification']);

            $index = 0;
            $length = count($data);

            $_query = '';
            $_value = [];

            foreach ($data as $key => $value) {
                $_t = explode(':', $key);
                $_f = $_t[0];
                $_n = $_t[1];

                if ($_query !== '') {
                    $_query .= ', ';
                }

                if (in_array($_f, ['ls', 'li'])) {
                    $_f = 's';
                    $value = implode(',', $value);
                }

                $_query .= '`'.$_n.'`=?'.$_f;

                $_value[] = $value;
            }

            $sql = ", `updated`=" . time() . ", `uid`=" . $this->user['id'] . ", `gid`=" . $this->user['gid'];

            Q("UPDATE `" . $this->db['catalog'] . "` SET " . $_query . $sql . " WHERE `id`=".$id." LIMIT 1", $_value);
        }
    }

    public function update($name = '', $value = '', $id = '')
    {
        if ($name && $id && $value !== '') {
            Q("UPDATE `" . $this->db['catalog'] . "` SET `?e`=?i, `updated`=?i WHERE `id`=?i LIMIT 1", [
                $name,
                $value,
                time(),
                $id
            ]);
        }
    }

    public function getProductsOrd()
    {
        return Q("SELECT (MAX(`ord`) + 10) AS `ord` FROM `" . $this->db['catalog'] . "` LIMIT 1")->row('ord');
    }

    public function getCategoryOrd()
    {
        return Q("SELECT (MAX(`ord`) + 10) AS `ord` FROM `" . $this->db['category'] . "` LIMIT 1")->row('ord');
    }

    public function structureCategory()
    {
        return Q("SELECT `id`, `name`, `system`, `pid`, `visible` FROM `" . $this->db['category'] . "` ORDER BY `pid`, `ord`, `id`")->all();
    }

    public function catalogFields($id = 0)
    {
        $list        = [];
        $fields    = [];
        $settings    = [];
        $group_id    = '';

        if ($id !== 0) {
            $catalog_item = Q("SELECT * FROM `" . $this->db['catalog'] . "` WHERE `id`=?i", [ $id ])->row();

            if (isset($catalog_item['photo'])) {
                $group_id = $catalog_item['photo'];

                $file = new Files();
                $list = $file->getFilesByGroup($group_id, ['cp']);
            }
        }

        if ($id == 0 || $group_id == '') {
            $group_id = $this->_generateGroup();
        }

        foreach ($list as &$_li) {
            $_li['uuid'] = $_li['id'];
            $_li['name'] = $_li['title'];
            $_li['size'] = $_li['bsize'];
            $_li['thumbnailUrl'] = $_li['file'];
        }

        $fields['name'] = 'photo';
        $fields['value'] = $group_id;
        $fields['action'] = 'shopping/fileUpload';
        $fields['list'] = $list;
        $fields['json']= json_encode($list, 64 | 256);

        $settings = [
            [
                'prefix'    => 'preview',
                'width'     => 560,
                'height'    => 560,
                'method'    => 'crop'
            ],
            [
                'prefix'    => 'market',
                'width'     => 500,
                'height'    => 500,
                'method'    => 'crop'
            ],
            [
                'prefix'    => 'cp',
                'width'     => 112,
                'height'    => 112,
                'method'    => 'crop'
            ]
        ];

        $settings['json'] = json_encode($settings);

        $fields['settings'] = $settings;

        return $fields;
    }

    public function categoryItem($id = 0)
    {
        $item = [];

        if ($id !== 0) {
            $item = Q("SELECT * FROM `" . $this->db['category'] . "` WHERE `id`=?i LIMIT 1", [ $id ])->row();

            $item['meta_robots'] = preg_split('/\,+/', $item['meta_robots'], -1, PREG_SPLIT_NO_EMPTY);
        }

        return $item;
    }

    public function categoryTree($pid = 0)
    {
        $tree = Q("SELECT `id`, `name`, `system`, `pid`, `visible` FROM `" . $this->db['category'] . "` ORDER BY `pid`, `ord`, `id`", [ $pid ])->all();

        return $this->makeTree($tree, $pid);
    }

    public function categoryList($list = ['id', 'pid', 'name', 'system'], $pid = null)
    {
        $where = "";

        if (!is_null($pid)) {
            $where = " WHERE `pid`=?i ";
        }

        return Q("SELECT `" . implode("`, `", $list) . "` FROM `" . $this->db['category'] . "` " . $where . " ORDER BY `ord` DESC, `name`", [ $pid ])->all('id');
    }

    public function deleteUser($id = 0)
    {
        if ($id) {
            Q("DELETE FROM `" . $this->db['users'] . "` WHERE `id`=?i LIMIT 1", [ $id ]);
        }
    }

    public function getUser($id = 0, $format = false, $fields = [])
    {
        $user = [];

        if ($id)
        {
            $select = '*';

            if (!empty($fields))
            {
                $select = "`".implode('`, `', $fields)."`";
            }

            $user = Q("SELECT ".$select." FROM `" . $this->db['users'] . "` WHERE `id`=?i LIMIT 1", [ $id ])->row();

            if ($format)
            {
                $user['birthday'] = date('d.m.Y', $user['birthday']);
            }

            if ($user['phone']) {
                $user['phone'] = $this->formatPhone($user['phone']);
            }

            $user['address'] = $this->getAddress($id);
        }

        return $user;
    }

    public function getUsers($page = 0, $limit = 10)
    {
        $start = $page * $limit;

        $users = Q("SELECT * FROM `" . $this->db['users'] . "` LIMIT ?i, ?i", [ $start, $limit ])->all();

        foreach ($users as &$user) {
            if ($user['birthday']) {
                $user['birthday'] = $this->dateFormat($user['birthday']);
            }
        }

        return $users;
    }

    public function getAddress($uid = 0)
    {
        $address = [];

        if ($uid) {
            $address = Q("SELECT * FROM `" . $this->db['address'] . "` WHERE `uid`=?i", [ $uid ])->all('id');
        }

        return $address;
    }

    public function getAddressItem($id = 0)
    {
        $address = [];

        if ($id) {
            $address = Q("SELECT * FROM `" . $this->db['address'] . "` WHERE `id`=?i LIMIT 1", [ $id ])->row();
        }

        return $address;
    }

    public function addBuyers($data = [])
    {
        if (!empty($data)) {
            $sql = "";
            $slice = [];

            $index = 0;
            $address = $data['address'];
            unset($data['address']);

            $length = count($data);

            foreach ($data as $key => $value) {
                $index ++;

                $type = 's';

                if (strstr($key, ':')) {
                    $_t = explode(':', $key);

                    $sql .= "`" . $_t[1] . "`=";

                    if ($_t[0] == 's') {
                        if (!$value) {
                            $value = '';
                        }

                        $sql .= "'" . $value . "'";
                    } elseif ($_t[0] == 'i') {
                        if (!$value) {
                            $value = 0;
                        }

                        $sql .= $value;
                    } elseif (in_array($_t[0], ['ls', 'li'])) {
                        $sql .= "'" . implode(',', $value) . "'";
                    }
                }

                if ($length > $index) {
                    $sql .= ", ";
                }
            }

            $sql .= ", `created`=" . time();

            $id = Q("INSERT INTO `" . $this->db['users'] . "` SET " . $sql);

            $this->updateAddress($address, $id);

            return $id;
        }
    }

    public function editBuyers($data = [], $id = 0)
    {
        if (!empty($data) && $id !== 0) {
            $sql = "";
            $slice = [];

            $index = 0;
            $address = $data['address'];
            unset($data['address']);

            $length = count($data);

            foreach ($data as $key => $value) {
                $index ++;
                $type = 's';

                if (strstr($key, ':')) {
                    $_t = explode(':', $key);

                    $sql .= "`" . $_t[1] . "`=";

                    if ($_t[0] == 's') {
                        $sql .= "'" . $value . "'";
                    } elseif ($_t[0] == 'i') {
                        $sql .= $value;
                    } elseif (in_array($_t[0], ['ls', 'li'])) {
                        $sql .= "'" . implode(',', $value) . "'";
                    }
                }

                if ($length > $index) {
                    $sql .= ", ";
                }
            }

            $sql .= ", `updated`=" . time();

            Q("UPDATE `" . $this->db['users'] . "` SET " . $sql . " WHERE `id`=?i LIMIT 1", [ $id ]);

            $this->updateAddress($address, $id);
        }
    }

    public function updateAddress($address = [], $id = 0)
    {
        if (!empty($address)) {
            $address = $this->_prepareArray($address);

            if ($id !== 0) {
                $keys = array_keys($address);
                $keys = array_filter($keys, function ($k) use ($keys) {
                    return $keys[$k] > 0;
                }, ARRAY_FILTER_USE_KEY);

                $inner = Q("SELECT `id` FROM `" . $this->db['address'] . "` WHERE `uid`=?i", [ $id ])->all('id');

                if (!empty($inner)) {
                    $remove = array_diff(array_keys($inner), $keys);

                    if (!empty($remove)) {
                        Q("DELETE FROM `" . $this->db['address'] . "` WHERE `id` IN (?li)", [ $remove ]);
                    }
                }
            }

            foreach ($address as $key => $addr) {
                if ($this->validate($addr, 'address')) {
                    $addr['uid'] = $id;

                    ksort($addr);

                    if ($key > 0) {
                        $addr['id'] = $key;

                        Q("UPDATE `" . $this->db['address'] . "` SET " .
                            "`area`=?s, " .
                            "`city`=?s, " .
                            "`country`=?s, " .
                            "`flat`=?s, " .
                            "`house`=?s, " .
                            "`postal_code`=?i, " .
                            "`region`=?s, " .
                            "`settlement`=?s, " .
                            "`street`=?s, `uid`=?i WHERE `id`=?i LIMIT 1", $addr
                        );
                    } else {
                        Q("INSERT INTO `" . $this->db['address'] . "` SET " .
                            "`area`=?s, " .
                            "`city`=?s, " .
                            "`country`=?s, " .
                            "`flat`=?s, " .
                            "`house`=?s, " .
                            "`postal_code`=?i, " .
                            "`region`=?s, " .
                            "`settlement`=?s, " .
                            "`street`=?s, `uid`=?i", $addr
                        );
                    }
                }
            }
        }
    }

    private function hideProducts()
    {
        Q("UPDATE `" . $this->db['catalog'] . "` SET `visible`=?i, `balance`=?i", [ 0, 0 ]);
    }

    private function hideCategories()
    {
        Q("UPDATE `" . $this->db['category'] . "` SET `visible`=?i", [ 0 ]);
    }

    public function addCategory($data = [])
    {
        if (!empty($data))
        {
            $sql = '';

            if (empty($data['s:hash']))
            {
                if (!empty($data['s:syncid']))
                {
                    $data['s:hash'] = hashing($data['s:syncid']);
                }
                else
                {
                    $data['s:hash'] = hashing($data['i:pid'].$data['s:name']);
                }
            }

            $index = 0;
            $syncid = '';
            $length = count($data);

            foreach ($data as $key => $value)
            {
                $index ++;

                $type = 's';

                if (strstr($key, ':')) {
                    $_t = explode(':', $key);

                    $sql .= "`" . $_t[1] . "`=";

                    if ($_t[0] == 's') {
                        if (!$value) {
                            $value = '';
                        }

                        $sql .= "'" . $value . "'";
                    } elseif ($_t[0] == 'i') {
                        if (!$value) {
                            $value = 0;
                        }

                        $sql .= $value;
                    } elseif (in_array($_t[0], ['ls', 'li'])) {
                        $sql .= "'" . implode(',', $value) . "'";
                    }
                }

                if ($length > $index) {
                    $sql .= ", ";
                }
            }

            $sql .= ", `created`=" . time() . ", `uid`=" . $this->user['id'] . ", `gid`=" . $this->user['gid'];

            $duplicate = [
                'i:count' => 0,
                'i:visible' => 0,
                'i:updated' => time()
            ];

            if ($data['i:pid'])
            {
                $duplicate['i:pid'] = $data['i:pid'];
            }

            if ($data['s:name'])
            {
                $duplicate['s:name'] = $data['s:name'];
            }

            if ($data['s:hash'])
            {
                $duplicate['s:hash'] = $data['s:hash'];
            }

            $duplicate_sql = "ON DUPLICATE KEY UPDATE ";

            $index = 0;
            $length = count($duplicate);

            foreach ($duplicate as $key => $value)
            {
                $index ++;

                $type = 's';

                if (strstr($key, ':'))
                {
                    $_t = explode(':', $key);

                    $duplicate_sql .= "`" . $_t[1] . "`=";

                    if ($_t[0] == 's')
                    {
                        if (!$value) {
                            $value = '';
                        }

                        $duplicate_sql .= "'" . $value . "'";
                    }
                    elseif ($_t[0] == 'i')
                    {
                        if (!$value) {
                            $value = 0;
                        }

                        $duplicate_sql .= $value;
                    }
                    elseif (in_array($_t[0], ['ls', 'li']))
                    {
                        $duplicate_sql .= "'" . implode(',', $value) . "'";
                    }
                }

                if ($length > $index)
                {
                    $duplicate_sql .= ", ";
                }
            }

            return Q("INSERT INTO `" . $this->db['category'] . "` SET " . $sql . " " . $duplicate_sql);
        }
    }

    public function editCategory($data = [], $id = 0)
    {
        if (!empty($data) && $id !== 0)
        {
            $sql = '';
            $slice = [];

            if (empty($data['s:hash']))
            {
                if (!empty($data['s:syncid']))
                {
                    $data['s:hash'] = hashing($data['s:syncid']);
                }
                else
                {
                    $data['s:hash'] = hashing($data['i:pid'].$data['s:name']);
                }
            }

            $index = 0;
            $length = count($data);

            foreach ($data as $key => $value)
            {
                $index ++;

                $type = 's';

                if (strstr($key, ':'))
                {
                    $_t = explode(':', $key);

                    $sql .= "`" . $_t[1] . "`=";

                    if ($_t[0] == 's') {
                        $sql .= "'" . $value . "'";
                    } elseif ($_t[0] == 'i') {
                        $sql .= $value;
                    } elseif (in_array($_t[0], ['ls', 'li'])) {
                        $sql .= "'" . implode(',', $value) . "'";
                    }
                }

                if ($length > $index)
                {
                    $sql .= ", ";
                }
            }

            $sql .= ", `updated`=" . time() . ", `uid`=" . $this->user['id'] . ", `gid`=" . $this->user['gid'];

            Q("UPDATE `" . $this->db['category'] . "` SET " . $sql . " WHERE `id`=?i LIMIT 1", [ $id ]);
        }
    }

    public function deleteDiscount($id = 0)
    {
        if ($id) {
            Q("DELETE FROM `" . $this->db['discount'] . "` WHERE `id`=?i LIMIT 1", [ $id ]);
        }
    }

    public function getDiscountItem($id = 0, $format = false)
    {
        $discount = [];

        if ($id) {
            $discount = Q("SELECT * FROM `" . $this->db['discount'] . "` WHERE `id`=?i LIMIT 1", [ $id ])->row();

            if ($format) {
                $discount['date_start'] = date('d.m.Y', $discount['date_start']);
                $discount['date_end'] = date('d.m.Y', $discount['date_end']);
            }
        }

        return $discount;
    }

    public function getDiscountList($page = 0, $limit = 10)
    {
        $start = $page * $limit;

        $discounts = Q("SELECT * FROM `" . $this->db['discount'] . "` LIMIT ?i, ?i", [ $start, $limit ])->all();

        foreach ($discounts as &$discount) {
            if ($discount['date_start']) {
                $discount['date_start'] = $this->dateFormat($discount['date_start']);
            }

            if ($discount['date_end']) {
                $discount['date_end'] = $this->dateFormat($discount['date_end']);
            }
        }

        return $discounts;
    }

    public function addDiscount($data = [])
    {
        if (!empty($data)) {
            $sql = "";
            $slice = [];

            $index = 0;
            $length = count($data);

            foreach ($data as $key => $value) {
                $index ++;

                $type = 's';

                if (strstr($key, ':')) {
                    $_t = explode(':', $key);

                    $sql .= "`" . $_t[1] . "`=";

                    if ($_t[0] == 's') {
                        if (!$value) {
                            $value = '';
                        }

                        $sql .= "'" . $value . "'";
                    } elseif ($_t[0] == 'i') {
                        if (!$value) {
                            $value = 0;
                        }

                        $sql .= $value;
                    } elseif (in_array($_t[0], ['ls', 'li'])) {
                        $sql .= "'" . implode(',', $value) . "'";
                    }
                }

                if ($length > $index) {
                    $sql .= ", ";
                }
            }

            $sql .= ", `created`=" . time();

            return Q("INSERT INTO `" . $this->db['discount'] . "` SET " . $sql);
        }
    }

    public function editDiscount($data = [], $id = 0)
    {
        if (!empty($data) && $id !== 0) {
            $sql = "";
            $slice = [];

            $index = 0;
            $length = count($data);

            foreach ($data as $key => $value) {
                $index ++;

                $type = 's';

                if (strstr($key, ':')) {
                    $_t = explode(':', $key);

                    $sql .= "`" . $_t[1] . "`=";

                    if ($_t[0] == 's') {
                        $sql .= "'" . $value . "'";
                    } elseif ($_t[0] == 'i') {
                        $sql .= $value;
                    } elseif (in_array($_t[0], ['ls', 'li'])) {
                        $sql .= "'" . implode(',', $value) . "'";
                    }
                }

                if ($length > $index) {
                    $sql .= ", ";
                }
            }

            $sql .= ", `updated`=" . time();

            Q("UPDATE `" . $this->db['discount'] . "` SET " . $sql . " WHERE `id`=?i LIMIT 1", [ $id ]);
        }
    }

    public function deleteProduct($id = 0, $recursive = false)
    {
        if ($id !== 0) {
            if ($recursive) {
                $mod = Q("SELECT `id` FROM `" . $this->db['catalog'] . "` WHERE `variation`=?i", [ $id ])->all();

                if (!empty($mod)) {
                    Q("DELETE FROM `" . $this->db['catalog'] . "` WHERE `variation`=?i", [ $id ]);
                }
            }

            Q("DELETE FROM `" . $this->db['storage'] . "` WHERE `pid`=?i AND `list`=?s", [ $id, 'properties' ]);
            Q("DELETE FROM `" . $this->db['catalog'] . "` WHERE `id`=?i LIMIT 1", [ $id ]);
        }
    }

    public function deleteCategory($id = 0, $recursive = false)
    {
        if ($id !== 0) {
            if ($recursive) {
                $this->_removeTree($id);
            } else {
                Q("DELETE FROM `" . $this->db['category'] . "` WHERE `id`=?i LIMIT 1", [ $id ]);
            }
        }
    }

    public function uploadImportFile($data = [])
    {
        if (!empty($data['file']))
        {
            $name = pathinfo($data['file']['name'], PATHINFO_FILENAME);
            $extension = pathinfo($data['file']['name'], PATHINFO_EXTENSION);

            $file = $name . '_' . time() . '.' . $extension;

            if (move_uploaded_file($data['file']['tmp_name'], PATH_EXCHANGE.DS.$file))
            {
                $data['file'] = $file;
            }
        }

    }

    public function importFiles()
    {
        $files = [];

        $support = [
            'xml',
            'yml',
            'csv',
            'xls',
            'xlsx'
        ];

        $scanned = array_diff(scandir(PATH_EXCHANGE), ['.', '..', '.DS_Store', '.gitkeep']);

        if (!empty($scanned))
        {
            $f = new Files;

            foreach ($scanned as $file) {
                $extension = pathinfo($file, PATHINFO_EXTENSION);

                if (in_array($extension, $support) && file_exists(PATH_EXCHANGE.DS.$file))
                {
                    $files[] = [
                        'name' => $file,
                        'hash' => md5($file),
                        'size' => $f->hsize(filesize(PATH_EXCHANGE.DS.$file)),
                        'extension' => $extension,
                    ];
                }
            }
        }

        return $files;
    }

    protected function _deleteHash($hash = '')
    {
        if ($hash)
        {
            Q("DELETE FROM `#__import__session` WHERE `session` LIKE ?s LIMIT 1", [
                $hash
            ]);
        }
    }

    protected function _getFileFHash($hash = '')
    {
        if ($hash)
        {
            $scanned = scandir(PATH_EXCHANGE);

            if (!empty($scanned))
            {
                foreach ($scanned as $file)
                {
                    if ($hash === md5($file))
                    {
                        return $file;
                    }
                }
            }
        }

        return '';
    }

    protected function _generateGroup()
    {
        return 'file_' . substr(str_replace('.', '_', uniqid()), 0, 5) . '_' . str_replace('.', '_', uniqid());
    }

    public function deleteFile($hash = '')
    {
        $this->_deleteHash($hash);
        $file = $this->_getFileFHash($hash);

        if (file_exists(PATH_EXCHANGE.DS.$file))
        {
            unlink(PATH_EXCHANGE.DS.$file);
        }
    }

    public function handleFile($hash = '')
    {
        $file = $this->_getFileFHash($hash);

        if (file_exists(PATH_EXCHANGE.DS.$file))
        {
            $import = new cpImport;
            $import->parse(PATH_EXCHANGE.DS.$file);
        }
    }

    public function readParse($hash = '')
    {
        $data = [];

        $session = Q("SELECT `data` FROM `#__import__session` WHERE `session` LIKE ?s", [
            $hash
        ])->all();

        if (!empty($session))
        {
            foreach ($session as &$item)
            {
                $data = array_merge($data, unserialize($item['data']));
            }
        }

        return $data;
    }

    public function importCategories($data = [])
    {
        // $all = Q("SELECT `id`, `syncid`, `name`, `pid` FROM `" . $this->db['category'] . "`")->all();

        // foreach ($all as $item)
        // {
        //     if (!empty($item['syncid']))
        //     {
        //         $hash = hashing($item['syncid']);
        //     }
        //     else
        //     {
        //         $hash = hashing($item['pid'].$item['name']);
        //     }

        //     Q("UPDATE `" . $this->db['category'] . "` SET `hash`=?s WHERE `id`=?i LIMIT 1", [
        //         $hash, $item['id']
        //     ]);
        // }

        if (!empty($data))
        {
            $this->hideCategories();

            $categories = [];
            $this->categories = [];

            if (isset($data['categories']))
            {
                foreach ($data['categories'] as $category)
                {
                    $hash = hashing($category['attr']['id']);

                    $categories[$hash]['item'] = [
                        'name' => $category['attr']['name'],
                        'syncid' => $category['attr']['id'],
                        'parent' => $category['attr']['parentId']
                    ];
                }
            }
            else
            {
                $categories = $data;
            }

            foreach ($categories as $hash => $arr)
            {
                $item = [];

                $item['s:hash'] = $hash;
                $item['s:name'] = $arr['item']['name'];
                $item['s:system'] = transliterate($arr['item']['name']);
                $item['s:picture'] = $this->_generateGroup();

                if (isset($arr['item']['syncid']))
                {
                    $item['s:syncid'] = $arr['item']['syncid'];
                }

                if (isset($arr['item']['parent']))
                {
                    $pid = '';

                    if ($arr['item']['parent'])
                    {
                        $pid = Q("SELECT `id` FROM `" . $this->db['category'] . "` WHERE `syncid` LIKE ?s LIMIT 1", [
                            $arr['item']['parent']
                        ])->row('id');
                    }

                    $item['i:pid'] = $pid;
                }

                $this->categories[$hash] = $this->addCategory($item);
            }
        }
    }

    public function handleImport($data = [])
    {
        if (!empty($data['parse']))
        {
            $this->importCategories($data['parse']);
        }

        if (!empty($data['checked']) && !empty($data['parse']))
        {
            $this->hideProducts();

            $parse = $data['parse'];
            $checked = $data['checked'];

            if (!empty($parse['offers']))
            {
                $pure = [];

                foreach ($parse['offers'] as $item)
                {
                    $id = $item['attr']['id'];
                    $category = hashing($item['categoryId']['value']);

                    $price = str_replace(',00', '', $item['price']['value']);
                    $price = preg_replace('/\D/', '', $price);
                    $balance = intval($item['rest']['value']);

                    $product = [
                        'id'          => $id,
                        'parentId'    => $item['attr']['parentId'],
                        'category'    => $category,
                        'balance'     => $balance,
                        'name'        => $item['НаименованиеПолное']['value'],
                        'price'       => $price
                    ];

                    $pure[$category]['tree'][$id] = $product;
                }

                $parse = $pure;
            }

            $checkKeys = [
                'name' => 's',
                'weight' => 's',
                'markup' => 's',
                'description' => 's',
                'real_price' => 'i',
                'balance' => 'i',
                'cost' => 'i',
                'price' => 'i'
            ];

            foreach ($checked as $hash => $arr)
            {
                if (isset($parse[$hash]['tree']))
                {
                    $intersect = array_intersect_key($parse[$hash]['tree'], array_flip($arr));

                    if (!empty($intersect))
                    {
                        foreach ($intersect as $temp)
                        {
                            $product = [];

                            $category = $this->categories[$temp['category']];

                            if (isset($temp['id']))
                            {
                                $product['s:hash'] = hashing($temp['id']);
                                $product['s:syncid'] = $temp['id'];
                            }

                            if (isset($temp['name']))
                            {
                                $product['s:system'] = transliterate($temp['name']);
                            }

                            foreach ($checkKeys as $name => $format)
                            {
                                if (isset($temp[$name]))
                                {
                                    $product[sprintf('%s:%s', $format, $name)] = $temp[$name];
                                }
                            }

                            $product = array_merge($product, [
                                'i:category'    =>  $category,
                                's:photo'       =>  $this->_generateGroup(),
                                's:file'        =>  $this->_generateGroup()
                            ]);

                            $this->addProduct($product);

                            $this->_increaseCategoryCount($category);
                        }
                    }
                }
            }
        }

    }

    protected function _prepareArray($array = [], $id = 0)
    {
        $result = [];

        if (is_array($array)) {
            foreach ($array as $key => $arr) {
                if (is_array($arr)) {
                    foreach ($arr as $k => $v) {
                        $result[$k][$key] = $v;
                    }
                }
            }
        }

        return $result;
    }

    protected function _updateProperties($data = [], $id = 0)
    {
        if (!empty($data) && $id !== 0) {
            Q("DELETE FROM `" . $this->db['storage'] . "` WHERE `list`=?s AND `pid`=?i", [ 'properties', $id ]);

            if (!empty($data)) {
                $ord = 0;

                foreach ($data as $key => $arr) {
                    $ord += 10;
                    Q("INSERT INTO `" . $this->db['storage'] . "` SET `pid`=?i, `list`=?s, `name`=?s, `value`=?s, `ord`=?i", [ $id, 'properties', $arr['name'], $arr['value'], $ord ]);
                }
            }
        }
    }

    protected function _increaseCategoryCount($id = 0)
    {
        if ($id !== 0)
        {
            Q("UPDATE `" . $this->db['category'] . "` SET `count`=`count`+1, `visible`=1 WHERE `id`=?i LIMIT 1", [ $id ]);
        }
    }

    protected function _updatModifications($data = [], $id = 0)
    {
        if (!empty($data) && $id !== 0) {
            $product = Q("SELECT `id`, `name`, `system` FROM `" . $this->db['catalog'] . "` WHERE `id`=?i LIMIT 1", [ $id ])->row();

            $modifications = Q("SELECT `id`, `variation_name`, `article`, `price`, `balance`, `infinity`, `visible` FROM `" . $this->db['catalog'] . "` WHERE `variation`=?i", [ $id ])->all('id');

            array_walk($modifications, function (&$item, $key) {
                unset($item['id']);
            });

            foreach ($data as $key => $item) {
                $system = $product['system'] . '-' . transliterate($item['variation_name']);

                if (isset($modifications[$key])) {
                    $difference = array_diff_assoc($item, $modifications[$key]);

                    if (!empty($difference)) {
                        $update = '';

                        foreach ($difference as $uk => $uv) {
                            $update .= "`". $uk . "`='" . $uv . "', ";
                        }

                        $update .= "`system`=?s";

                        Q("UPDATE `" . $this->db['catalog'] . "` SET " . $update . " WHERE `id`=?i LIMIT 1", [ $system, $key ]);
                    }
                } else {
                    $insert = '';

                    foreach ($item as $ik => $iv) {
                        $insert .= "`". $ik . "`='" . $iv . "', ";
                    }

                    $insert .= "`system`=?s, `variation`=?i";

                    Q("INSERT INTO `" . $this->db['catalog'] . "` SET " . $insert . "", [ $system, $id ]);
                }
            }
        }
    }

    protected function _getModification($pid = 0)
    {
        $result = [];

        if ($pid !== 0) {
            $result = Q("SELECT `id`, `name`, `variation_name`, `system`, `article`, `balance`, `price`, `discount`, `discount_type`, `photo`, `visible`, `infinity`, `ord` FROM `" . $this->db['catalog'] . "` WHERE `variation`=?i ORDER BY `ord`", [ $pid ])->all();
        }

        return $result;
    }

    protected function _getStorage($pid = 0)
    {
        $result = [];

        if ($pid !== 0) {
            $list = Q("SELECT `id`, `list`, `name`, `value`, `ord` FROM `" . $this->db['storage'] . "` WHERE `pid`=?i ORDER BY `ord`", [ $pid ])->all();

            if (!empty($list)) {
                foreach ($list as $_item) {
                    $result[$_item['list']][$_item['id']] = [
                        'name'    =>    $_item['name'],
                        'value'    =>    $_item['value'],
                        'ord'    =>    $_item['ord']
                    ];
                }
            }
        }

        return $result;
    }

    protected function _removeTree($pid = 0)
    {
        $tree = Q("SELECT * FROM `" . $this->db['category'] . "` WHERE `pid`=?i", [ $pid ])->all();

        if (!empty($tree)) {
            foreach ($tree as $item) {
                $this->_removeTree($item['id']);
            }
        }

        Q("DELETE FROM `" . $this->db['category'] . "` WHERE `id`=?i LIMIT 1", [ $pid ]);
    }
}
