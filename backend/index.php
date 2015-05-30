<?php

require 'vendor/autoload.php';
require 'wiki.php';

$wiki = new Wiki;

$app = new \Slim\Slim();

$app->get('/search/:title', function ($title) use ($app, $wiki) {

  $data = $wiki->getPage($title);
  
  $response = $app->response();
  $response['Content-Type'] = 'application/json';
  $response->status(200);
  $response->body(json_encode($data));

});

$app->run();
