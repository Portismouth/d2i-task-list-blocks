import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';
import {
	CheckboxControl,
	TextControl,
	Button,
	RadioControl,
	Card,
	CardBody,
	CardHeader,
	ExternalLink,
} from '@wordpress/components';
import './editor.scss';
import { useState, useEffect, useRef } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function TaskEdit( {task} ) {
	console.log(task);
	const taskTitleRef = useRef();
	const [ newTaskTitle, setNewTaskTitle ] = useState( task.title );
	const [ newTaskType, setNewTaskType ] = useState( task.taskType );
	const [ externalLink, setExternalLink ] = useState( task.documentLink );
	const [ addingTask, setAddingTask ] = useState( false );

	const onLinkTitleChange = ( v ) => {
		const externalLinkCopy = {
			...externalLink,
		};
		externalLinkCopy.title = v;
		setExternalLink( externalLinkCopy );
	};

	const onLinkUrlChange = ( v ) => {
		const externalLinkCopy = {
			...externalLink,
		};
		externalLinkCopy.url = v;
		setExternalLink( externalLinkCopy );
	};

	const onSetNewTaskType = ( v ) => {
		setExternalLink();
		if ( v === 'external_link' ) {
			setExternalLink( {
				title: '',
				url: '',
			} );
		}

		setNewTaskType( v );
	};

	return (
		<form
			className="addtodo-form"
		>
			<TextControl
				ref={ taskTitleRef }
				label={ __( 'Task name', 'd2i-task-list-blocks' ) }
				value={ newTaskTitle }
				onChange={ ( v ) => setNewTaskTitle( v ) }
			/>
			<RadioControl
				selected={ newTaskType }
				label={ __( 'Document Type', 'd2i-task-list-blocks' ) }
				help={ __(
					'Whether this doc is an upload or link to download',
					'd2i-task-list-blocks'
				) }
				options={ [
					{ label: 'Upload', value: 'upload' },
					{
						label: 'External Link',
						value: 'external_link',
					},
				] }
				onChange={ onSetNewTaskType }
			/>
			{ newTaskType === 'external_link' && (
				<>
					<TextControl
						label={ __( 'Link Title', 'd2i-task-list-blocks' ) }
						value={ externalLink.title }
						onChange={ onLinkTitleChange }
					/>
					<TextControl
						label={ __( 'Link URL', 'd2i-task-list-blocks' ) }
						value={ externalLink.url }
						onChange={ onLinkUrlChange }
					/>
				</>
			) }
			<Button disabled={ addingTask } type="submit" isPrimary>
				{ __( 'Add Task', 'todo-list' ) }
			</Button>
		</form>
	);
}
