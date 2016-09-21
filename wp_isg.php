<?php
/*
Plugin Name: WPInstantSliderGallery
Plugin URI: http://filatovalex.com/WordPress/plugins/WPInstantGallery/
Description: this plugin allows you to create instance slider gallery on your page by several mouse clicks
Version: 1.0
Author: Filatov Alex (El_Diablo)
Author URI: http://filatovalex.com/
*/

require_once 'classes/WP_isg_gallery.php';
require_once 'views/settings.php';

class WP_isg
{

    public $images = array();
    public $keys = array('cover_width', 'cover_height', 'cover_margin', 'gallery_width', 'gallery_height'),
        $defaults = array(200, 100, 10, 600, 400),
        $values;

    function install(){
        for ($i = 0; $i < count($this -> keys); $i++){
            add_option($this -> keys[$i], $this -> values [$i]);
        }
    }

    function update(){
        for ($i = 0; $i < count($this -> keys); $i++ ){
            update_option($this -> keys[$i], $this -> values[$i]);
        }
    }

    function load_settings(){
        if (!get_option($this -> keys[0])){
            $this -> values = $this -> defaults;
        }else{
            for ($i = 0; $i < count($this -> keys); $i++){
                $this -> values[$i] = get_option($this -> keys[$i]);
            }
        }
    }

    function edit_settings(){
        if (!empty($_POST)) {
            for ($i = 0; $i < count($this->keys); $i++) {
                $this->values[$i] = $_POST[$this->keys[$i]];
            }
            $this->update();
        }
        $options = array();
        foreach ($this -> keys as $key => $value){
            $options[$value] = get_option($value);
        }
        wp_isg_settings_render_html($this -> keys, $options);
    }

    function js_settings_load(){
        $script_data = '';
        for ($i = 0; $i < count($this -> keys); $i++){
            $script_data[$this -> keys[$i]] = $this -> values[$i];
        }
        wp_localize_script('wp_mce_dialog_plugin', 'wp_isg_settings', $script_data);
    }

    function register_settings(){
        for ($i = 0; $i < count($this -> keys); $i++){
            register_setting('option-group', $this -> keys[$i]);
        }
    }

    function add_admin_page(){
        add_options_page('ISG settings', 'ISG settings', 8, 'preview', array($this, 'edit_settings'));
    }

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
        wp_localize_script('wp_isg', 'wp_isg_data', $this -> images);
    }

    function add_gallery($atts, $content = null){
        extract(shortcode_atts(array(
            'gallery_id' => '',
            'gallery_url' => '',
            'gallery' => '',
            'cover_url' => '',
	        'cover_float' => 'none',
	        'cover_margin' => $this -> values['cover_margin'],
            'cover_width' => $this -> values['cover_width'],
            'cover_height' => $this -> values['cover_height'],
            'gallery_width' => $this -> values['gallery_width'],
            'gallery_height' => $this -> values['gallery_height']
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
        register_activation_hook(__FILE__, array($this, 'install'));
        register_deactivation_hook(__FILE__, array($this, 'uninstall'));
        wp_register_script('wp_isg_slider', plugins_url('/WPInstantSliderGallery/assets/js/wp_isg_slider.js'), array(), '', true);
        wp_register_script('wp_isg', plugins_url('/WPInstantSliderGallery/assets/js/wp_isg_app.js'), array(), '', true);
		wp_register_script("wp_mce_dialog_plugin", plugins_url("/WPInstantSliderGallery/assets/js/tinymce_editor_plugin/editor_plugin.js"), array(), '', true);
        wp_enqueue_script('wp_isg_slider');
        wp_enqueue_script('wp_isg');
		wp_enqueue_script("wp_mce_dialog_plugin");
        $this -> load_settings();
        $this -> js_data_load();
        $this -> js_settings_load();
	    wp_register_style('wp_isg_style', plugins_url('/WPInstantSliderGallery/assets/css/wp_isg_style.css'), array(), '', 'all');
		wp_register_style("wp_mce_dialog_style", plugins_url("/WPInstantSliderGallery/assets/js/tinymce_editor_plugin/editor_dialog_style.css"), array(), '', 'all');
	    wp_enqueue_style('wp_isg_style');
		wp_enqueue_style("wp_mce_dialog_style");
        add_shortcode('isg', array($this, 'add_gallery'));
	    add_action('admin_head', array($this, 'add_tinymce_button'));
        add_action('admin_menu', array($this, 'add_admin_page'));
        add_action('admin_init', array($this, 'register_settings'));
    }

}

new WP_isg();