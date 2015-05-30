<?php

require 'vendor/autoload.php';
require 'config.php';

$app = new \Slim\Slim();

$app->get('/api/search/:title', function ($id) use ($app) {


});

$app->run();