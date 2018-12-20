<?php

// EXAMPLE
include __DIR__ . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . 'pubsub.php';

// Basic usage
PS::on('beforeSave', function ($message) {
    echo 'PS::beforeSave', '<br>', print_r($message), '<br>', '<br>';
});

PS::on('beforeSave', function ($message) {
    echo 'PS::beforeSave', '<br>', print_r($message), '<br>', '<br>';
});

PS::on('beforeSave', function ($message) {
    echo 'PS::beforeSave', '<br>', print_r($message), '<br>', '<br>';
});

PS::on('afterSave', function ($message) {
    echo 'PS::afterSave', '<br>', print_r($message), '<br>', '<br>';
});

// 
PS::trigger('beforeSave', 'test-before');
PS::trigger('afterSave', 'test-after');
PS::trigger('afterSave');

// 
PS::off('beforeSave');

// 
PS::flush();
