<?php

class cartItem extends Module
{
    public $product;

    protected $sample = [
        'id', 'name', 'system', 'balance', 'discount', 'article',
        'category', 'infinity', 'special', 'sales', 'photo', 'price', 'old_price', 'manufacturer'
    ];

    public function __construct($product = [])
    {
        if (!empty($product)) {
            $this->product = $this->convertToObject(
                array_intersect_key($product, array_flip($this->sample))
            );
        }
    }

    # Id
    public function getId()
    {
        return $this->product->id;
    }

    # Name
    public function getName()
    {
        return $this->product->name;
    }

    # Price
    public function getPrice()
    {
        return $this->product->price;
    }
}

class Cart extends Module
{
    protected $ids = [];
    protected $items = [];
    protected $sessname = 'cart';

    public function __construct()
    {
        $this->items = [];
        $this->ids = [];

        // $this->clean();
        
        $this->session();
    }

    public function getProduct($id)
    {
        $product = Q("SELECT * FROM `#__shop_catalog` WHERE `id`=?i AND `visible`=?i LIMIT 1", [ $id, 1 ])->row();

        if ($product['discount'] > 0) {
            $product['old_price'] = $product['price'];
            $product['price'] = ceil($product['price'] - ($product['price'] / (100 / $product['discount'])));
        }

        return $product;
    }

    public function addItem(cartItem $product)
    {
        if (!empty($product->product)) {
            $id = $product->getId();

            if (isset($this->items[$id])) {
                $this->updateItem($product, $this->items[$id]['count'] + 1);
            } else {
                $this->items[$id] = ['item' => $product->product, 'count' => 1, 'time' => time()];
                $this->ids[] = $id;

                $this->save($product);
            }
    
            $this->checkEmpty();
        }
    }

    public function updateItem(cartItem $product, $count = 1)
    {
        if (!empty($product->product)) {
            $id = $product->getId();

            if ($count === 0) {
                $this->deleteItem($product);
            } elseif (($count > 0) && ($count != $this->items[$id]['count'])) {
                $this->items[$id]['count'] = $count;
            }

            $this->save($product);
        }
    }

    public function deleteItem(cartItem $product)
    {
        if (!empty($product->product)) {
            $id = $product->getId();

            if (isset($this->items[$id])) {
                unset($this->items[$id]);
        
                $index = array_search($id, $this->ids);
                unset($this->ids[$index]);

                $this->ids = array_values($this->ids);
            }

            $this->save();
        }
    }

    public function clean()
    {
        if (isset($_SESSION[$this->sessname])) {
            unset($_SESSION[$this->sessname]);
        }
    }

    public function count()
    {
        $count = 0;

        foreach ($this->items as $product) {
            $count += intval($product['count']);
        }

        return $count;
    }

    public function amount()
    {
        $amount = 0;

        if (!empty($this->items)) {
            foreach ($this->items as $product) {
                if (isset($product['item'])) {
                    if (isset($product['item']->price) || isset($product['count'])) {
                        $amount += $product['item']->price * intval($product['count']);
                    }
                }
            }
        }

        return $amount;
    }

    public function cartContent()
    {
        if (!$this->isEmpty()) {
            $files = new Files();

            foreach ($this->items as &$item) {
                if (isset($item['item'])) {
                    if (!isset($item['item']->image)) {
                        $item['item']->image = $files->getFilesByGroupCount($item['item']->photo, array( 'original' ), array( 'id', 'title', 'file', 'ord' ), true);
                    }

                    if (!isset($item['item']->link)) {
                        $category = Q("SELECT `id`, `system` FROM `#__shop_category` WHERE `id`=?i LIMIT 1", [ $item['item']->category ])->row();

                        if (!empty($category)) {
                            $item['item']->link = '/' . $category['id'] . '-' . $category['system'] . '/' . $item['item']->id . '-' . $item['item']->system;
                        }
                    }

                    if (!isset($item['date'])) {
                        $item['date'] = Dates($item['time']);
                    }

                    $item['item']->total = $item['item']->price * $item['count'];
                }
            }

            $this->save();

            return $this->items;
        }
    }

    protected function checkEmpty()
    {
        foreach ($this->items as $id => $product) {
            if (!isset($product['item'])) {
                unset($this->items[$id]);
                unset($_SESSION[$this->sessname]['items'][$id]);
            }
        }
    }

    protected function session()
    {
        if (isset($_SESSION[$this->sessname])) {
            if (isset($_SESSION[$this->sessname]['ids'])) {
                $this->ids = $_SESSION[$this->sessname]['ids'];
            }

            if (isset($_SESSION[$this->sessname]['items'])) {
                $this->items = $_SESSION[$this->sessname]['items'];
            }
        }
    }

    protected function check($data = [], $fields = [], $system = '')
    {
        $errors = [];

        if (!$system) {
            $system = $this->current['system'];
        }

        if (in_array($system, [ 'courier', 'address', 'ems', 'pickup' ])) {
            $system = 'delivery';
        }

        if (in_array($system, [ 'register', 'guest' ])) {
            unset($_SESSION['auth_user'], $_SESSION['cart_user']);
            $_SESSION['cart_user'] = $data;
        }

        unset($_SESSION[$system]);

        $_SESSION[$system]['data'] = $data;

        foreach ($data as $name => $item) {
            if (!empty($fields)) {
                if (isset($fields[$name])) {
                    if (isset($fields[$name]['required'])) {
                        $required = $fields[$name]['required'];

                        if (is_array($required)) {
                            $check = [];
                            $values = [];

                            foreach ($required as $val) {
                                $values[$val] = $data[$val];

                                if (!$data[$val]) {
                                    $check[$val] = $data[$val];
                                }
                            }

                            if ((count($check) == count($required)) || (count(array_unique($values)) == 2)) {
                                foreach ($required as $val) {
                                    $errors[] = $val;
                                }
                            }
                        } else {
                            if (!$item) {
                                $errors[] = $name;
                            }
                        }
                    }

                    if (isset($fields[$name]['is_email']) && !is_email($item)) {
                        $errors[] = $name;
                    }

                    if (isset($fields[$name]['is_phone']) && !is_phone($item)) {
                        $errors[] = $name;
                    }
                }
            } else {
                if (!$item && in_array($name, $this->required)) {
                    $errors[] = $name;
                }
            }
        }

        $errors = array_flip(array_flip($errors));

        $_SESSION[$system]['errors'] = $errors;

        return empty($errors);
    }

    protected function handle($data = [])
    {
        $next = $this->getNext();

        $_backuri = $this->module_root;

        if (isset($data['_backuri'])) {
            $_backuri = base64_decode($data['_backuri']);
        }

        if (isset($data['_method']) && isset($this->fields[$data['_method']])) {
            $method = $data['_method'];
            $fields = $this->fields[$method];

            if (!$this->check($data, $fields, $method)) {
                redirect($_backuri);
            }
        } else {
            if (!$this->check($data)) {
                redirect($_backuri);
            }
        }

        redirect($this->module_root . '/' . $next['system']);
    }

    protected function getAddress()
    {
        $region = getfl('region');

        $address = Q("SELECT `id`, `coords`, `region`, `street`, `work_time`, `phone` FROM `#_mdd_addresses` WHERE `visible`=1 ORDER BY `ord`")->all();

        foreach ($address as &$a) {
            if (isset($region[$a['region']])) {
                $a['city'] = $region[$a['region']];
            }

            $phone = preg_split('/\,+/', $a['phone'], -1, PREG_SPLIT_NO_EMPTY);

            if (!empty($phone)) {
                foreach ($phone as &$p) {
                    $p = $this->formatPhone($this->phone($p));
                }
            }

            $a['phone'] = $phone;
        }

        return $address;
    }

    protected function getCurrent()
    {
        $current = 'index';

        if (isset($this->arguments[0]) && isset($this->step[$this->arguments[0]])) {
            $current = $this->arguments[0];
        }

        $this->current = $this->step[$current];
    }

    /*
     * Вернуться на шаг назад
     * функция возвращает ссялку на предфдущий раздел
     */

    protected function getPrevious()
    {
        $prev = [];
        $step = $this->current['system'];

        foreach ($this->step as $key => $ar) {
            if ($ar['system'] == $step) {
                $prev = prev($this->step);
                
                break;
            }
        }

        return $prev;
    }


    /*
     * Текущий шаг
     */

    protected function getNext()
    {
        $next = [];
        $step = $this->current['system'];

        $list = array_keys($this->step);
        $index = array_search($step, $list);

        if (isset($list[$index+1])) {
            $next = $this->step[$list[$index+1]];
        }

        return $next;
    }

    protected function isAjax()
    {
        return (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
    }

    protected function isEmpty()
    {
        return (empty($this->items));
    }

    protected function response()
    {
        $count = $this->count();

        $response = [
            'count' => $count,
            'amount' => $this->amount(),
            'label' => declofnum($count, ['товар', 'товара', 'товаров'])
        ];

        $_SESSION[$this->sessname]['result'] = $response;

        return $response;
    }

    protected function save(cartItem $product = null)
    {
        if (!isset($_SESSION[$this->sessname])) {
            $_SESSION[$this->sessname] = [
                'ids' => [],
                'items' => []
            ];
        }

        if (!empty($product->product)) {
            if (!in_array($product->product->id, $_SESSION[$this->sessname]['ids'])) {
                $_SESSION[$this->sessname]['ids'][] = $product->product->id;
            }

            $_SESSION[$this->sessname]['items'][$product->product->id] = $this->items[$product->product->id];
        } else {
            $_SESSION[$this->sessname]['items'] = $this->items;
        }
    }
}
