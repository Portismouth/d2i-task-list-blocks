<?php

class D2i_Tasks_Custom_Routes extends WP_REST_Controller
{
	public function register_routes()
	{
		$version = '1';
		$namespace = 'd2i-task-list/v' . $version;
		$base = 'task-items';
		register_rest_route($namespace, $base . '/by-folder', array(
			'methods'  => WP_REST_Server::READABLE,
			'callback' => array($this, 'd2i_get_empty_tasks_by_folder')
		));

		register_rest_route($namespace, $base, array(
			'methods'  => 'POST',
			'callback' => array($this, 'd2i_create_task')
		));

		register_rest_route($namespace, $base . '/(?P<schoolId>\d+)', array(
			'methods'  => WP_REST_Server::READABLE,
			'callback' => array($this, 'd2i_get_tasks_by_folder_and_school')
		));

		register_rest_route('d2i-school-list/v1', 'schools', array(
			'methods'  => 'GET',
			'callback' => array($this, 'd2i_schools')
		));

		register_rest_route($namespace, $base . '/confirm-new', array(
			'methods'  => 'POST',
			'callback' => array($this, 'd2i_confirm_tasks')
		));

		register_rest_route($namespace, $base . '/folders', array(
			'methods'  => 'GET',
			'callback' => array($this, 'd2i_get_folders')
		));

		register_rest_route($namespace, $base . '/(?P<schoolId>\d+)', array(
			array(
				'methods'  => WP_REST_Server::EDITABLE,
				'callback' => array($this, 'd2i_update_task')
			),
			array(
				'methods'  => WP_REST_Server::DELETABLE,
				'callback' => array($this, 'd2i_delete_task')
			),
		));
	}

	function d2i_get_folders()
	{
		$data = [];
		global $wpdb; //(this is required when are you inside the function)

		$values = $wpdb->get_results("SELECT DISTINCT meta_value FROM $wpdb->postmeta pm, $wpdb->posts p WHERE meta_key  = 'folder' and p.post_type='task_item' ",ARRAY_A);

		foreach ($values as $value) {
			# code...
			array_push($data, $value['meta_value']);
		}

		return $data;
	}

	function d2i_schools($data)
	{

		$args = [
			'numberposts' => -1,
			'post_type' => 'school'
		];

		$posts = get_posts($args);

		$data = [];
		$i = 0;

		foreach ($posts as $post) {
			$data[$i]['id'] = $post->ID;
			$data[$i]['title'] = $post->post_title;
			$data[$i]['slug'] = $post->post_name;
			$data[$i]['isCompleted'] = get_field('is_completed', $post->ID);
			$data[$i]['newTaskType'] = get_field('task_type', $post->ID);
			$data[$i]['schoolName'] = get_field('school_name', $post->ID);
			$data[$i]['folder'] = get_field('folder', $post->ID);
			$data[$i]['documents'] = get_field('documents', $post->ID);
			$data[$i]['schoolId'] = get_field('school', $post->ID)[0];
			$i++;
		}

		return $data;
	}

	public function d2i_confirm_tasks($request)
	{
		$new_tasks = $request->get_json_params();
		$results = array();

		foreach ($new_tasks as $task) {
			# code...
			$new_task = array(
				'post_type'   => 'task_item',
				'post_title'  => $task['title'],
				'meta_input'  => array(
					'school'        => [$task['schoolId']],
					'is_completed'  => $task['isCompleted'],
					'task_type'     => $task['taskType'],
					'folder'        => $task['directoryName'],
					'document_link' => array(
						'title' => $task['documentLink']['title'],
						'url'   => $task['documentLink']['url']
					)
				),
				'post_status' => 'publish'
			);

			$new_task_id = wp_insert_post($new_task);

			$post = get_post($new_task_id);
			array_push($results, $this->prepare_task_for_response($post));
		}

		return new WP_REST_Response($results, 200);
	}

	public function d2i_get_empty_tasks_by_folder($request)
	{
		$directory = $request->get_param('directoryName');
		$args = array(
			"numberposts" => -1,
			"post_type"   => "task_item",
			"meta_query"  => array(
				array(
					"key"     => "folder",
					"value"   => $directory,
					"compare" => "="
				)
			),
		);

		$tasks = get_posts($args); //do a query, call another class, etc
		$data = array();
		foreach ($tasks as $task) {
			$taskData = $this->prepare_empty_task_for_response($task);
			array_push($data, $taskData);
		}

		$unique_array = [];
		foreach ($data as $element) {
			$hash = $element['title'];
			$unique_array[$hash] = $element;
		}
		$result = array_values($unique_array);

		return new WP_REST_Response($result, 200);
	}

	public function d2i_delete_task($request)
	{
		$post = get_post(intval($request['schoolId']));
		if ($post) {
			$deleted = wp_trash_post($post->ID);
			if ($deleted) {
				return new WP_REST_Response(true, 200);
			}

			return new WP_Error('cant-delete', __('There was a problem deleting this task', 'd2i_task-list'), array('status' => 500));
		}

		return new WP_Error('cant-delete', __('Task does not exist or has been deleted', 'd2i_task-list'), array('status' => 500));
	}

	public function d2i_update_task($request)
	{
		$request_body = $request->get_json_params();
		$new_task = array(
			'ID'          => $request['id'],
			'post_type'   => 'task_item',
			'post_title'  => $request_body['title'],
			'meta_input'  => array(
				'school'       => [$request['schoolId']],
				'is_completed' => $request['isCompleted'],
				'task_type'    => $request['taskType'],
				'folder'       => $request['folder'],
				'document_link' => array(
					'title' => $request['documentLink']['title'],
					'url'   => $request['documentLink']['url']
				)
			)
		);
		$new_task_id = wp_update_post($new_task);

		$post = get_post($new_task_id);
		$data = $this->prepare_task_for_response($post);

		return new WP_REST_Response($data, 200);
	}

	function d2i_get_tasks_by_folder_and_school($request)
	{
		$directory = $request->get_param('directoryName');
		$schoolId = intval($request['schoolId']);
		$args = array(
			'numberposts' => -1,
			'post_type'   => 'task_item',
			'meta_query'  => array(
				'relation' => 'AND',
				array(
					'key'     => 'folder',
					'value'   => $directory,
					'compare' => '='
				),
				array(
					'key'     => 'school',
					'value'   => $schoolId,
					'compare' => 'LIKE'
				)
			),
		);

		$posts = get_posts($args);

		$data = [];
		$i = 0;

		foreach ($posts as $post) {
			$data[$i]['id'] = $post->ID;
			$data[$i]['title'] = $post->post_title;
			$data[$i]['slug'] = $post->post_name;
			$data[$i]['isCompleted'] = get_field('is_completed', $post->ID);
			$data[$i]['taskType'] = get_field('task_type', $post->ID);
			$data[$i]['schoolName'] = get_field('school_name', $post->ID);
			$data[$i]['folder'] = get_field('folder', $post->ID);
			$data[$i]['documents'] = get_field('documents', $post->ID);
			$data[$i]['schoolId'] = get_field('school', $post->ID)[0];
			$data[$i]['api'] = 'hi';
			$document_link = get_field('document_link', $post->ID);
			if (!$document_link['title'] == null && !$document_link['url'] == null) {
				$data[$i]['documentLink'] = $document_link;
			}
			$i++;
		}

		return $data;
	}

	public function d2i_create_task($request)
	{
		$request_body = $request->get_json_params();

		$new_task = array(
			'post_type'   => 'task_item',
			'post_title'  => $request_body['title'],
			'meta_input'  => array(
				'school'        => [$request['schoolId']],
				'is_completed'  => $request['isCompleted'],
				'task_type'     => $request['newTaskType'],
				'folder'        => $request['directoryName'],
				'document_link' => array(
					'title' => $request['documentLink']['title'],
					'url'   => $request['documentLink']['url']
				)
			),
			'post_status' => 'publish'
		);
		$new_task_id = wp_insert_post($new_task);

		$post = get_post($new_task_id);

		$data = array();

		$data['id'] = $post->ID;
		$data['title'] = $post->post_title;
		$data['slug'] = $post->post_name;
		$data['isCompleted'] = get_field('is_completed', $post->ID);
		$data['taskType'] = get_field('task_type', $post->ID);
		$data['schoolName'] = get_field('school_name', $post->ID);
		$data['folder'] = get_field('folder', $post->ID);
		$data['schoolId'] = get_field('school', $post->ID)[0];
		$document_link = get_field('document_link', $post->ID);
		if (!$document_link['title'] == null && !$document_link['url'] == null) {
			$data['documentLink'] = $document_link;
		}

		return $data;
	}

	public function prepare_empty_task_for_response($item)
	{
		$fresh_task = array();
		$fresh_task['title'] = $item->post_title;
		$fresh_task['isCompleted'] = '0';
		$fresh_task['taskType'] = get_field('task_type', $item->ID);
		$fresh_task['folder'] = get_field('folder', $item->ID);
		$fresh_task['isEdit'] = false;
		$document_link = get_field('document_link', $item->ID);
		if (!$document_link['title'] == null && !$document_link['url'] == null) {
			$fresh_task['documentLink'] = $document_link;
		}
		return $fresh_task;
	}

	public function prepare_task_for_response($task)
	{
		$data = array();

		$data['id'] = $task->ID;
		$data['title'] = $task->post_title;
		$data['slug'] = $task->post_name;
		$data['isCompleted'] = get_field('is_completed', $task->ID);
		$data['taskType'] = get_field('task_type', $task->ID);
		$data['schoolName'] = get_field('school_name', $task->ID);
		$data['folder'] = get_field('folder', $task->ID);
		$data['schoolId'] = get_field('school', $task->ID)[0];
		$document_link = get_field('document_link', $task->ID);
		if (!$document_link['title'] == null && !$document_link['url'] == null) {
			$data['documentLink'] = $document_link;
		}

		return $data;
	}
}
