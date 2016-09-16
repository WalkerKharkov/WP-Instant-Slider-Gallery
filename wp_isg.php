<?php
/*
Plugin Name: WPInstantSliderGallery
Plugin URI: http://
Description: this plugin allows you to create instance slider gallery on your page by several mouse clicks
Version: 1.0
Author: Filatov Alex (El_Diablo)
Author URI: http://filatovalex.com/
*/

require_once 'assets/php/WP_isg_gallery.php';

class WP_isg
{

    public $images = array();

	function add_tinymce_button(){
		if (!current_user_can('edit_posts') && !current_user_can('edit_pages'))
			return;
		if (get_user_option('rich_editing') == 'true') {
			add_filter('mce_external_plugins', array($this, 'add_plugin'));
			add_filter('mce_buttons', array($this, 'register_button'));
		}
	}

	function register_button($buttons) {
		array_push($buttons, 'addisgshortcode');
		return $buttons;
	}

	function add_plugin($plugin_array) {
		$plugin_array['addisgshortcode'] = plugins_url('/WPInstantSliderGallery/assets/js/tinymce_editor_plugin/editor_plugin.js');
		return $plugin_array;
	}

	function js_data_load(){
        $wp_isg_data = $this -> images;
        wp_localize_script('wp_isg', 'wp_isg_data', $wp_isg_data);
    }

    function add_gallery($atts, $content = null){
        extract(shortcode_atts(array(
            'gallery_id' => '',
            'gallery_url' => '',
            'gallery' => '',
            'cover_url' => '',
	        'cover_float' => 'none',
	        'cover_margin' => '10',
            'cover_width' => '200',
            'cover_height' => '100',
            'gallery_width' => '800',
            'gallery_height' => '600'
        ), $atts));
        array_push($this -> images, new WP_isg_gallery($gallery_id, $gallery_url, $gallery));
		$this -> js_data_load();
		$cover_style = ($cover_float != 'none') ? 'style="float:' . $cover_float . ';' : '';
	    $cover_style = ($cover_style != '') ? $cover_style . 'margin:' . $cover_margin . 'px;"' : 'style="margin:' . $cover_margin .
	                                                                                              'px;"';
		return '<img src="' . $cover_url . '" alt="wordpress instant gallery" width="' . $cover_width .
            '" height="' . $cover_height . '" class="wp_isg" onclick="wp_isg.showGallery(this.getAttribute(\'data-instant-gallery-id\'))"
             data-instant-gallery-id="' . $gallery_id . '" data-instant-gallery-settings="' . $gallery_width . ':' . $gallery_height . '"' .
	        $cover_style . ' title="click to view the gallery" />';
    }

    function __construct(){
        wp_register_script('wp_isg_slider', plugins_url('/WPInstantSliderGallery/assets/js/wp_isg_slider.js'), array(), '', true);
        wp_register_script('wp_isg', plugins_url('/WPInstantSliderGallery/assets/js/wp_isg_app.js'), array(), '', true);
		wp_register_script("wp_mce_dialog_plugin", plugins_url("/WPInstantSliderGallery/assets/js/tinymce_editor_plugin/editor_plugin.js"), array(), '', true);
		$this -> js_data_load();
        wp_enqueue_script('wp_isg_slider');
        wp_enqueue_script('wp_isg');
		wp_enqueue_script("wp_mce_dialog_plugin");
	    wp_register_style('wp_isg_style', plugins_url('/WPInstantSliderGallery/assets/css/wp_isg_style.css'), array(), '', 'all');
		wp_register_style("wp_mce_dialog_style", plugins_url("/WPInstantSliderGallery/assets/js/tinymce_editor_plugin/dialog_style.css"), array(), '', 'all');
	    wp_enqueue_style('wp_isg_style');
		wp_enqueue_style("wp_mce_dialog_style");
        add_shortcode('isg', array($this, 'add_gallery'));
	    add_action('admin_head', array($this, 'add_tinymce_button'));
    }

}

new WP_isg();