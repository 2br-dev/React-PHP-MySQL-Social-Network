<?php

class Api extends Module
{
    private $keyName = 'cart';

    public function __construct()
    {
        parent::__construct();
    }

    public function _getMethod()
    {
        $response = [];

        if (!empty($_SESSION[$this->keyName]['items']))
        {
            $items = $_SESSION[$this->keyName]['items'];
        }

        if (!empty($items))
        {
            foreach ($items as $item)
            {
                $id = $item['id'];

                $cache = 'module.cartitem.product.'.$id;

                if (!($product = $this->compiled($cache)))
                {
                    $product = Q("SELECT `id`, `name`, `system`, `category`, `price`, `discount`, `weight`, `photo`, `description`
                                FROM `#__shop_catalog`
                                WHERE `id`=?i
                                LIMIT 1", [
                                    $id
                                ])->row();

                    if (!empty($product))
                    {
                        $file = new Files();
                        $photo = $file->getFilesByGroupCount($product['photo'], [ 'cp' ], [ 'file' ], true);
                        $product['photo'] = isset($photo['file']) ? $photo['file'] : '/images/cart-no-photo.png';
                    }

                    $this->cache->setCache($cache, $product);
                }

                if (!empty($product))
                {
                    $response[] = [
                        'id'            => $product['id'],
                        'image'         => $product['photo'],
                        'name'          => $product['name'],
                        'count'         => $item['count'],
                        'weight'        => $product['weight'],
                        'price'         => intval($product['price']),
                        'composition'   => strip_tags($product['description'])
                    ];
                }
                else {
                    unset($_SESSION[$this->keyName]['items'][$id]);
                }
            }
        }

        return $response;
    }

    public function _addMethod($id = 0, $count = 1)
    {
        $cache = 'module.cart.product.'.$id;

        if (!($product = $this->compiled($cache)))
        {
            $product = Q("SELECT `id`, `name`, `price`, `weight`, `photo`, `description`, `discount` FROM `#__shop_catalog` WHERE `id`=?i LIMIT 1", [
                $id
            ])->row();

            if (!empty($product))
            {
                $file = new Files();
                $photo = $file->getFilesByGroupCount($product['photo'], [ 'market' ], [ 'file' ], true);

                $product['photo'] = isset($photo['file']) ? $photo['file'] : '';
            }

            $this->cache->setCache($cache, $product);
        }

        if (isset($_SESSION[$this->keyName]['items'][$id]))
        {
            $_SESSION[$this->keyName]['items'][$id]['count'] = $_SESSION[$this->keyName]['items'][$id]['count'] + 1;
        }
        else
        {
            $_SESSION[$this->keyName]['items'][$id] = [
                'id' => $id,
                'price' => $product['price'],
                'count' => $count
            ];
        }

        $this->calculate();

        $response = [
            'count'     => $_SESSION[$this->keyName]['count'],
            'amount'    => $_SESSION[$this->keyName]['amount']
        ];

        return $response;
    }

    public function _updateMethod($id = 0, $count = 1)
    {
        if (isset($_SESSION[$this->keyName]['items'][$id]))
        {
            $_SESSION[$this->keyName]['items'][$id]['count'] = $count;
        }
        else {
            $this->_addMethod($id, $count);
        }

        $this->calculate();

        return [
            'count'     => $_SESSION[$this->keyName]['count'],
            'amount'    => $_SESSION[$this->keyName]['amount']
        ];
    }
}
