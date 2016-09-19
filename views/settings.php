<?php
function wp_isg_settings_render_html($keys, $options){
    ob_start();
    echo '<form method="POST" name="edit_settings">';
                for ($i = 0; $i < count($keys); $i++){
                    echo '<p>';
                        echo '<label for="modalWidth">Enter ' . $keys[$i] . '</label>';
                        echo '<input type="text" name="' . $keys[$i] . '" value="' . $options[$keys[$i]] . '" maxlength="20" pattern="^[ 0-9]+$" required/>';
                    echo '</p>';
                }
    echo '<input type="submit" value="save"/>';
    echo '</form>';
    ob_end_flush();
}