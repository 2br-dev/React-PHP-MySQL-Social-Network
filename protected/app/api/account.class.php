<?php

declare(strict_types=1);

namespace Fastest\Core\Api;

final class Account extends \Fastest\Core\Api\Api
{
    public function __construct()
    {
        // http_response_code(404);
        parent::__construct();
    }

    /**
     * @SWG\Get(
     *     path="/api/products/product",
     *     @SWG\Response(response="200", description="An example resource")
     * )
     */
    public function verify(string $phone = '')
    {
        exit(__($this->request));

        return $this->response([
            'status' => 'sms_sent',
            'code' => '783389'
        ]);
    }

    public function auth(string $code = '', string $phone = '')
    {
        exit(__('code: ', $code, 'phone: ', $phone, $this->request));

        return $this->response([
            'status' => 'sms_sent',
            'code' => '783389'
        ]);
    }

    public function find(int $id = 0)
    {
        $cache = 'api.products.product'.$id;

        if (!($product = $this->cache->getCompiled($cache)))
        {
            $product = O('__shop_catalog', $id)->find(['id', 'name', 'system', 'price', 'discount', 'discount_type', 'article'])->row();
            $this->cache->setCache($cache, $product);
        }

        return $product;
    }
}
