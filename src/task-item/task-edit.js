import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { TextControl, Button, RadioControl } from '@wordpress/components';
import './editor.scss';
import { useState, useRef } from '@wordpress/element';

export default function TaskEdit( { task, index, toggleTaskEdit } ) {
	const actions = useDispatch( 'd2i/tasks' );
	const editTask = actions && actions.editTask;

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

	const onTaskSubmit = async ( e ) => {
		e.preventDefault();
		if ( editTask && newTaskTitle ) {
			const newTask = {
				title: newTaskTitle,
				schoolId: task.schoolId,
				folder: task.folder,
				taskType: task.taskType,
				isCompleted: '0',
				id: task.id,
			};
			if ( externalLink ) {
				newTask.documentLink = externalLink;
			}
			setAddingTask( true );
			const newSavedTask = await editTask( newTask );
			newSavedTask.task.isEdit = task.isEdit;
			setNewTaskTitle( '' );
			setNewTaskType( '' );
			setExternalLink();
			setAddingTask( false );
			toggleTaskEdit(newSavedTask.task, index);
		}
	};

	return (
		<form className="addtodo-form" onSubmit={ onTaskSubmit }>
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
						value={ externalLink ? externalLink.title : null }
						onChange={ onLinkTitleChange }
					/>
					<TextControl
						label={ __( 'Link URL', 'd2i-task-list-blocks' ) }
						value={ externalLink ? externalLink.url : null }
						onChange={ onLinkUrlChange }
					/>
				</>
			) }
			<Button disabled={ addingTask } type="submit" isPrimary>
				{ __( 'Save Changes', 'todo-list' ) }
			</Button>
			<Button
				disabled={ addingTask }
				onClick={ () => toggleTaskEdit( task, index ) }
				variant="tertiary"
			>
				{ __( 'Cancel', 'todo-list' ) }
			</Button>
		</form>
	);
}
