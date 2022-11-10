<?php

/**
 * Plugin Name:       D2i Task List Blocks
 * Description:       A custom plugin for blocks to create task lists for D2i clients.
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Ozzy Gonzalez
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       d2i-task-list-blocks
 *
 * @package           d2i-task-list-blocks
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

function d2i_task_list_render_tasks($attributes, $content, $block)
{
	$school_id = $block->context['d2i-task-list/schoolId'];
	$folder = $block->context['d2i-task-list/listName'];

	$args = array(
		'numberposts' => -1,
		'post_type'   => 'task-item',
		'meta_query'  => array(
			array(
				'key'     => 'school',
				'value'   => intval($school_id),
				'compare' => 'LIKE'
			),
			array(
				'key'     => 'folder',
				'value'   => $attributes['directoryName'],
				'compare' => 'LIKE'
			)
		)
	);

	$school_tasks = get_posts($args);
	$tasks = '<ul>';
	foreach ($school_tasks as $task) {
		$tasks .= '<li>';
		$tasks .= get_the_title($task);
		$tasks .= '</li>';
	}
	$tasks .= '</ul>';

	return $tasks;
}

function d2i_task_list_block_init()
{
	register_block_type(__DIR__ . '/build/task-list');
	register_block_type(__DIR__ . '/build/task-item', array(
		'render_callback' => 'd2i_task_list_render_tasks'
	));
}
add_action('init', 'd2i_task_list_block_init');

add_filter( 'rest_task-item_query', function( $args, $request ){

    if ( $meta_key = $request->get_param( 'folder' ) ) {
        $args['meta_key'] = $meta_key;
        $args['meta_value'] = $request->get_param( 'folderName' );
    }

    return $args;
}, 10, 2 );

function add_custom_field()
{
	register_rest_field(
		'task-item',
		'folder',
		array(
			'get_callback'  => 'rest_get_post_field',
			'update_callback'   => null,
			'schema'            => null,
		)
	);
	register_rest_field(
		'task-item',
		'school',
		array(
			'get_callback'  => 'rest_get_school_field',
			'update_callback'   => null,
			'schema'            => null,
		)
	);
}
add_action('rest_api_init', 'add_custom_field');

function rest_get_post_field($post, $field_name, $request)
{
	return get_post_meta($post['id'], $field_name, true);
}

function rest_get_school_field($post, $field_name, $request)
{
	return get_post_meta($post['id'], $field_name, true);
}
