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

require_once('lib/post-types.php');
require_once('lib/TasksController.php');

function d2i_register_routes()
{
	$controller = new D2i_Tasks_Custom_Routes();
	$controller->register_routes();
}

add_action('rest_api_init', 'd2i_register_routes');

function d2i_task_list_render_tasks($attributes, $content, $block)
{
	$school_id = $block->context['d2i-task-list/schoolId'];

	$args = array(
		'numberposts' => -1,
		'post_type'   => 'task_item',
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
		),
		'orderby'     => 'date',
		'order'       => 'ASC',
	);

	$school_name = get_post($school_id)->post_title;

	$school_tasks = get_posts($args);
	if (!empty($school_tasks))
	{
		$tasks = '<h2>';
		$tasks .= get_field('folder', $school_tasks[0]->ID);
		$tasks .= '</h2>';
		$tasks .= '<ul class="task-group">';

		foreach ($school_tasks as $task) {
			$completed = get_field('is_completed', $task->ID);
			$is_completed = $completed == '1' || $completed == true;
			$document_link = get_field('document_link', $task->ID);
			$task_type = get_field('task_type', $task->ID);
			if ($is_completed == true) {
				$tasks .= '<li class="is-completed">';
			} else {
				$tasks .= '<li>';
			}

			$tasks .= '<div>';
			$tasks .= '<h4 class="task-title">' . get_the_title($task) . '</h4>';
			if ($task_type == 'upload') {
				$folder = $school_name . '/' . get_field('folder', $task->ID);
				$tasks .= '<form action="' . get_theme_file_uri( ) . '/lib/sharepoint-helper.php" enctype="multipart/form-data" method="post" id="task-form" name="task-form" class="task-form" novalidate>';
				$tasks .= '<input type="hidden" name="folderName" value="' . $folder . '">';
				if ($is_completed == true) {
					$tasks .= '<input type="file" name="fileInput" id="fileInput" class="task-group-file-input" name="file" disabled>';
				} else {
					$tasks .= '<input type="file" name="fileInput" id="fileInput" class="task-group-file-input" name="file" accept=".xls,.xlsx,.docx, .csv">';
				}
				$tasks .= '<input type="submit" value="Upload ' . get_the_title($task) . '">';
			} else if ($document_link['title'] && $document_link['url']) {
				$tasks .= '<a target="_blank" class="components-external-link task-group-external-link" href="' . $document_link['url'] . '" rel="external noreferrer noopener">' . $document_link['title'] . '<span data-wp-c16t="true" data-wp-component="VisuallyHidden" class="components-visually-hidden css-0 e19lxcc00" style="border: 0px; clip: rect(1px, 1px, 1px, 1px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; overflow-wrap: normal;">(opens in a new tab)</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="components-external-link__icon css-rvs7bx esh4a730" aria-hidden="true" focusable="false"><path d="M18.2 17c0 .7-.6 1.2-1.2 1.2H7c-.7 0-1.2-.6-1.2-1.2V7c0-.7.6-1.2 1.2-1.2h3.2V4.2H7C5.5 4.2 4.2 5.5 4.2 7v10c0 1.5 1.2 2.8 2.8 2.8h10c1.5 0 2.8-1.2 2.8-2.8v-3.6h-1.5V17zM14.9 3v1.5h3.7l-6.4 6.4 1.1 1.1 6.4-6.4v3.7h1.5V3h-6.3z"></path></svg></a>';
			}
			$tasks .= '<div id="error"></div>';
			$tasks .= '</form>';
			$tasks .= '</div>';
			$tasks .= '</li>';
		}
		$tasks .= '</ul>';
	}

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

add_filter('rest_task-item_query', function ($args, $request) {

	if ($meta_key = $request->get_param('folder')) {
		$args['meta_key'] = $meta_key;
		$args['meta_value'] = $request->get_param('folderName');
	}

	return $args;
}, 10, 2);

function add_custom_field()
{
	register_rest_field(
		'task-item',
		'folder',
		array(
			'get_callback'      => 'rest_get_post_field',
			'update_callback'   => null,
			'schema'            => null,
		)
	);
	register_rest_field(
		'task-item',
		'school',
		array(
			'get_callback'      => 'rest_get_school_field',
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
