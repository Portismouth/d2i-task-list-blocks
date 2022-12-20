<?php

function activate_d2i_task_list_plugin()
{
	d2i_task_list_register_task_item();
	d2i_task_list_register_school();
}

function d2i_task_list_register_task_item()
{
	$labels = array(
		'name'               => _x('School Task Items', 'post type general name', 'd2i-task-list'),
		'singular_name'      => _x('Task Item', 'post type singular name', 'd2i-task-list'),
		'menu_name'          => _x('School Task Items', 'admin menu', 'd2i-task-list'),
		'name_admin_bar'     => _x('School Task Item', 'add new on admin bar', 'd2i-task-list'),
		'add_new'            => _x('Add New', 'book', 'd2i-task-list'),
		'add_new_item'       => __('Add New Task', 'd2i-task-list'),
		'new_item'           => __('New Task', 'd2i-task-list'),
		'edit_item'          => __('Edit Task', 'd2i-task-list'),
		'view_item'          => __('View Task', 'd2i-task-list'),
		'all_items'          => __('All Tasks', 'd2i-task-list'),
		'search_items'       => __('Search Tasks', 'd2i-task-list'),
		'not_found'          => __('No tasks found', 'd2i-task-list'),
		'not_found_in_trash' => __('No tasks found in Trash.', 'd2i-task-list')
	);

	$args = array(
		'labels'             => $labels,
		'description'        => __('Description.', 'd2i-task-list'),
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'rewrite'            => array('slug' => 'task-item'),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => null,
		'show_in_rest'       => true,
		'rest_base'          => 'task-items',
		'supports'           => array('title', 'custom-fields')
	);
	register_post_type('task_item', $args);
}

function d2i_task_list_register_school()
{
	$labels = array(
		'name'               => _x('Schoolw', 'post type general name', 'd2i-task-list'),
		'singular_name'      => _x('School', 'post type singular name', 'd2i-task-list'),
		'menu_name'          => _x('Schools', 'admin menu', 'd2i-task-list'),
		'name_admin_bar'     => _x('Schools', 'add new on admin bar', 'd2i-task-list'),
		'add_new'            => _x('Add New', 'book', 'd2i-task-list'),
		'add_new_item'       => __('Add New School', 'd2i-task-list'),
		'new_item'           => __('New School', 'd2i-task-list'),
		'edit_item'          => __('Edit School', 'd2i-task-list'),
		'view_item'          => __('View School', 'd2i-task-list'),
		'all_items'          => __('All Schools', 'd2i-task-list'),
		'search_items'       => __('Search Schools', 'd2i-task-list'),
		'not_found'          => __('No schools found', 'd2i-task-list'),
		'not_found_in_trash' => __('No schools found in Trash.', 'd2i-task-list')
	);

	$args = array(
		'labels'             => $labels,
		'description'        => __('Schhols', 'd2i-task-list'),
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'rewrite'            => array('slug' => 'school'),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => null,
		'show_in_rest'       => true,
		'rest_base'          => 'schools',
		'supports'           => array('title', 'custom-fields', 'editor')
	);
	register_post_type('school', $args);
}

add_action('init', 'activate_d2i_task_list_plugin');

function d2i_task_list_plugin_flush_rewrites()
{
	activate_d2i_task_list_plugin();
	flush_rewrite_rules();
}

register_activation_hook(__FILE__, 'd2i_task_list_plugin_flush_rewrites');

register_uninstall_hook(__FILE__, 'my_plugin_uninstall');
function my_plugin_uninstall()
{
	// Uninstallation stuff here
	unregister_post_type('task_item');
	unregister_post_type('school');
}

add_filter('manage_task_item_posts_columns', 'set_custom_edit_task_item_columns');
function set_custom_edit_task_item_columns($columns)
{
    $columns['school'] = __('School', 'd2i_task_list');
    $columns['folder'] = __('Folder', 'd2i_task_list');

    return $columns;
}

add_action('manage_task_item_posts_custom_column', 'custom_book_column', 10, 2);
function custom_book_column($column, $post_id)
{
    switch ($column) {
        case 'school':
            $school_id = get_field('school', $post_id)[0];
            $school_name = 'No school assigned';
            if ($school_id) {
                $school = get_post($school_id);
                $school_name = $school->post_title;
            }
            echo $school_name;
            break;
        case 'folder':
            $folder = get_field('folder', $post_id);
            $folder_name = 'No folder specified';
            if ($folder) {
                $folder_name = $folder;
            }
            echo $folder_name;
            break;
    }
}
