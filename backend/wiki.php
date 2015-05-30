<?php

class Wiki {

  private $baseUrl = "http://en.wikipedia.org/w/api.php?";

  private $defaults = array(
    "format" => "json",
    "action" => "query"
  );

  function __construct(){

    $this->curl = new \Curl\Curl();

  }

  public function getPage($title){

    return array_merge($this->getInfo($title), $this->getLinks($title));

  }

  private function getInfo($title){

    $params = array(
      "prop" => "info|pageimages|extracts",
      "inprop" => "displaytitle",
      "piprop" => "original",
      "exsentences" => "1",
      "exlimit" => "1",
      "exsectionformat" => "plain",
      "titles" => $title,
      "redirects" => ""
    );   
    
    $params = array_merge($this->defaults, $params);

    $queryString = http_build_query($params);

    $url = $this->baseUrl . $queryString;

    $this->curl->get($url);

    if ($this->curl->error){
      echo "OH SHIT";
      echo $this->curl->error_code;
      exit;
    }

    $response = json_decode($this->curl->response);

    // if(empty($response->query->pages)) // No results

    $page = current($response->query->pages);

    $data = array(
      "title" => $page->displaytitle 
    );

    if(isset($page->extract) && strlen($page->extract)){
      $data['extract'] = $page->extract;
    }

    if(isset($page->thumbnail)){
      $data['image'] = $page->thumbnail->original;
    } else {
      $data['image'] = $this->getGoogleImage($title);    
    }

    return $data;

  }  

  private function getLinks($title){

    $params = array(
      "titles" => $title,
      "continue" => "", 
      "prop" => "links",
      "plnamespace" => 0, // Only get links from main content
      "pllimit" => 500, // Ammount of results to load
      "redirects" => ""
    );

    $params = array_merge($this->defaults, $params);

    $links = array();

    do{

      $queryString = http_build_query($params);

      $url = $this->baseUrl . $queryString;

      $this->curl->get($url);

      if ($this->curl->error){
        echo "OH SHIT";
        echo $this->curl->error_code;
        exit;
      }

      $response = json_decode($this->curl->response);

      $page = current($response->query->pages);

      foreach($page->links as $link){
        $links[] = $link->title;
      }

      if(isset($response->continue)){

        if(isset($response->continue->continue) && strlen($response->continue->continue) > 2){
          $params['continue'] = $response->continue->continue;
        } else if(isset($response->continue->plcontinue) && strlen($response->continue->plcontinue) > 2) {
          $params['plcontinue'] = $response->continue->plcontinue;
        }

      } else {

        unset($params['continue']);

      }

    } while (isset($params['continue']));

    $pattern = '/^List of/';

    $links = array_filter($links, function($link) use($pattern){
      return !preg_match($pattern, $link);
    });

    return array(
      "links" => $links
    );

  }

  private function getGoogleImage($stitle){

    return "";

    $params = array(
      "tbm" => 'isch',
      "q" => $title,
    );

    $baseUrl = "https://www.google.co.uk/search";

    $queryString = http_build_query($params);

    $url = $this->baseUrl . $queryString;

    $this->curl->get($url);

    if ($this->curl->error){
      echo "OH SHIT";
      echo $this->curl->error_code;
      exit;
    }

  }

};