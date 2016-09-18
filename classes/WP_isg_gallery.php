<?php

/**
 * Created by PhpStorm.
 * User: Filatov Alex
 * Date: 12.09.2016
 * Time: 14:41
 */
class WP_isg_gallery
{
    public $id, $url, $images;

    function __construct($id, $url, $images){
        $this -> id = $id;
        $this -> url = $url;
        $this -> images = $images;
    }
}