<?php
include_once('./Sharepoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/wp-load.php');

if ($_FILES['fileInput']['name']) {
    // var_dump(($_POST));
    // var_dump($_FILES);
    require_once(ABSPATH . 'wp-admin/includes/image.php');
    require_once(ABSPATH . 'wp-admin/includes/file.php');
    require_once(ABSPATH . 'wp-admin/includes/media.php');

    $file_id = media_handle_upload('fileInput', 0);

    if (is_wp_error($file_id)) {
        wp_die('Error loading file!');
    } else {
        // var_dump(($_POST));
        // var_dump($_FILES);
        $folderName = null;
        if ($_POST['folderName']) {
            $folderName = $_POST['folderName'];
        }
        $result = executeUpload($file_id, $folderName);
        // var_dump($file_id);
        echo $result;
    }
}

function executeUpload($file, $folderName = null)
{
    $sp = new SchoolDocs();

    $result = $sp->uploadFile($file, $folderName);

    return $result;
}

// if ($_POST['ajax']) {
//     echo executeUpload();
// } else {
//     echo 'blah';
// }