<?php

use Voronkovich\SberbankAcquiring\Client;
use Voronkovich\SberbankAcquiring\Currency;

class Payment
{
    use Singleton, Tools;

    private $url;

    private $client;

    private $domain;

    /** @var string $login      Логин продавца*/
    private $login = 'eat-and-trip-api';

    /** @var string $password   Пароль продавца */
    private $password = "?Y=2NgWWb%O!H!'0";

    /** @var string $stage      Стадийность платежа (one/two) */
    private $stage;

    /** @var boolean $logging   Логгирование (1/0) */
    private $logging;

    /** @var string $currency   Числовой код валюты в ISO 4217 */
    private $currency;

    public function __construct()
    {
        $this->init();
    }

    private function init()
    {
        // Создан мерчант bigfish

        // API:    bigfish-api
        // Оператор:   bigfish-operator
        // Пароль на оба логина: bigfish

        // Ваши страницы доступны по адресам:
        // страница оплаты   https://3dsec.sberbank.ru/payment/merchants/bigfish/payment_ru.html
        // страница ошибок   https://3dsec.sberbank.ru/payment/merchants/bigfish/errors_ru.html

        $this->domain = '';
        $this->domain .= $_SERVER['proto'] . '://';
        $this->domain .= $_SERVER['HTTP_HOST'];

        $options = [
            'userName' => $this->login,
            'password' => $this->password,

            // A language code in ISO 639-1 format.
            // Use this option to set a language of error messages.
            'language' => 'ru',

            // A currency code in ISO 4217 format.
            // Use this option to set a currency used by default.
            'currency' => Currency::RUB,

            // An HTTP method to use in requests.
            // Must be "GET" or "POST" ("POST" is used by default).
            'httpMethod' => 'GET',
        ];

        // An uri to send requests.
        // Use this option if you want to use the Sberbank's test server.
        if (DEV_MODE)
        {
            $options['apiUri'] = Client::API_URI_TEST;
        }
        else {
            $options['apiUri'] = Client::API_URI;
        }

        /** @var Client $client */
        $this->client = new Client($options);
    }

    public function getStatus($orderId = '')
    {
        $status = false;

        if ($orderId)
        {
            $status = $this->client->getOrderStatusExtended($orderId);
        }

        return $status;
    }

    public function create($number = 0, $amount = 0, $cart = [])
    {
        $amount = number_format($amount, 2, '', '');

        // Required arguments
        $returnUrl = $this->domain . '/cart/complete/success';

        // You can pass additional parameters like a currency code and etc.
        $params['currency'] = Currency::RUB;
        $params['failUrl']  = $this->domain . '/cart/complete/failure';

        $result = $this->client->registerOrder($number, $amount, $returnUrl, $params);

        Q("UPDATE `#__shop_orders` SET `order_id`=?s WHERE `number` LIKE ?s LIMIT 1", [
            $result['orderId'],
            $number
        ]);

        // $result = $client->registerOrder($orderId, $orderAmount, $returnUrl, [
        //     'orderBundle' => [
        //         'cartItems' => [],
        //     ]
        // ]);

        $paymentOrderId = $result['orderId'];
        $paymentFormUrl = $result['formUrl'];

        header('Location: ' . $paymentFormUrl);
    }
}
