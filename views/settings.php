<?php
echo '<form method="POST" name="edit_settings">';
foreach ($options as $key => $value){
    echo '<p>';
    echo '<label for="modalWidth">Enter ' . $key . '</label>';
    echo '<input type="text" name="' . $key . '" value="' . $value . '" maxlength="20" pattern="^[ 0-9]+$" required/>';
    echo '</p>';
}
echo '<input type="submit" value="save"/>';
echo '</form>';