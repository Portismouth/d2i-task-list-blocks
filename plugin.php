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
	$args = array(
        'numberposts' => -1,
        'post_type'   => 'task-item',
        'meta_query'  => array(
            array(
                'key'     => 'school',
                'value'   => intval($school_id),
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
