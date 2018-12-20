<?php

//{declofnum count=$smarty.session.cart.result.count titles=['товар', 'товара', 'товаров']}

function smarty_function_declofnum($params)
{
    if (isset($params['count']) && isset($params['titles'])) {
        $count  = $params['count'];
        $titles = $params['titles'];

        $cases = array( 2, 0, 1, 1, 1, 2 );

        return $titles[ ($count%100>4 && $count%100<20)? 2 : $cases[($count%10<5)?$count%10:5] ];
    }

    return '';
}
