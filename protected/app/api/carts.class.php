<?php

declare(strict_types=1);

namespace Fastest\Core\Api;

/**
 * @SWG\Definition(
 *    definition="Carts",
 *    description="The unique identifier of a product in our catalog"
 * )
 */
final class Carts extends \Fastest\Core\Api\Api
{
    /**
     * The cart list
     * @var string
     * @SWG\Property()
     */
    public $list = [];

    /**
     * The products list
     * @var string
     * @SWG\Property()
     */
    private $products = null;

    /**
     * The session cart key name
     * @var string
     *
     * @SWG\Property(
     *   property="session",
     *   type="string",
     *   description="The key name"
     * )
     */
    private $session = 'cartform';

    /**
     * @SWG\Property(ref="#/definitions/product_id")
     */
    private $product_id = 0;

    /**
     * @SWG\Property(
     *   ref="$/definitions/product_id",
     *   format="int32"
     * )
     */
    public $id;

    public function __construct()
    {
        parent::__construct();
        // http_response_code(404);

        if (!empty($_SESSION[$this->session])) {
            $this->list = $_SESSION[$this->session];
        }
    }

    /**
     * @SWG\Get(
     *     path="/api/carts/list",
     *     @SWG\Response(response="200", description="An example resource")
     * )
     */
    public function list()
    {
        return $this->response($this->list);
    }

    /**
     * @SWG\Get(
     *     path="/api/carts/add",
     *     @SWG\Response(response="200", description="An example resource")
     * )
     */
    public function add(int $id = 0, int $quantity = 1)
    {
        if (($item = $this->find($id)))
        {
            $product = $item['product'];
            $quantity = $item['quantity'] + 1;
        }
        else
        {
            $this->products = new \Fastest\Core\Api\Products();
            $product = $this->products->find($id);
        }

        if (!empty($product))
        {
            $this->append($id, [
                'product' => $product,
                'quantity' => $quantity
            ]);
        }

        return $this->response($this->find($id));
    }

    /**
     * @SWG\PATCH(
     *     path="/api/carts/update",
     *     @SWG\Response(response="200", description="An example resource")
     * )
     */
    public function update(int $id = 0, int $quantity = 0)
    {
        if (($item = $this->find($id)))
        {
            $item['quantity'] = $quantity;

            $this->append($id, $item);

            $this->save();
        }

        return $this->total();
    }

    /**
     * @SWG\POST(
     *     path="/api/carts/remove",
     *     @SWG\Response(response="200", description="An example resource")
     * )
     */
    public function remove(int $id = 0)
    {
        if ($this->find($id))
        {
            unset($this->list['items'][$id]);
        }

        $this->save();

        return $this->response(true);
    }

    /**
     * @SWG\GET(
     *     path="/api/carts/total",
     *     @SWG\Response(response="200", description="An example resource")
     * )
     */
    public function total()
    {
        return $this->response($this->calc());
    }

    /**
     * @SWG\Get(
     *     path="/api/carts/clear",
     *     @SWG\Response(response="200", description="An example resource")
     * )
     */
    public function clear()
    {
        $this->list = [];

        $this->save();

        return $this->response(true);
    }

    private function find(int $id = 0)
    {
        if (!empty($this->list['items'][$id]))
        {
            return $this->list['items'][$id];
        }

        return false;
    }

    private function append(int $id = 0, $item = [])
    {
        $this->list['items'][$id] = $item;
        $this->save();
    }

    private function calc()
    {
        $amount = 0;
        $quantity = 0;

        if (!empty($this->list['items']))
        {
            $items = $this->list['items'];

            foreach ($items as $item)
            {
                if (!empty($item['product']))
                {
                    $quantity += $item['quantity'];
                    $amount += $item['product']['price'] * $item['quantity'];
                }
            }
        }

        return [
            'amount' => $amount,
            'quantity' => $quantity
        ];
    }

    private function save()
    {
        $this->list['total'] = $this->calc();
        $_SESSION[$this->session] = $this->list;
    }
}
