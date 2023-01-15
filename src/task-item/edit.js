import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
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
import TaskEdit from './task-edit';

export default function Edit( { attributes, setAttributes, context } ) {
	const schoolId = context[ 'd2i-task-list/schoolId' ];
	const { directoryName } = attributes;

	const [ newTaskTitle, setNewTaskTitle ] = useState( '' );
	const [ newTaskType, setNewTaskType ] = useState( '' );
	const [ externalLink, setExternalLink ] = useState();
	const [ addingTask, setAddingTask ] = useState( false );
	const [ tasksState, setTasks ] = useState( { tasks: [] } );
	const [ isUnsavedTasksConfirmed, setUnsavedTasksConfirmed ] =
		useState( false );

	const taskTitleRef = useRef();
	const actions = useDispatch( 'd2i/tasks' );
	const addTask = actions && actions.addTask;
	const deleteTask = actions && actions.deleteTask;

	useEffect( () => {
		if ( schoolId !== 0 && directoryName ) {
			apiFetch( {
				path: `/d2i-task-list/v1/task-items/${ schoolId }?directoryName=${ directoryName }`,
			} ).then( ( res ) => {
				if ( res.length > 0 ) {
					setTasks( { tasks: res } );
					setUnsavedTasksConfirmed( true );
				} else {
					apiFetch( {
						path: `/d2i-task-list/v1/task-items/by-folder?directoryName=${ directoryName }`,
					} ).then( ( emptyTasks ) => {
						setTasks( { tasks: emptyTasks } );
						if ( emptyTasks.length < 1 ) {
							setUnsavedTasksConfirmed( true );
						}
					} );
				}
			} );
		} else if ( directoryName && schoolId === 0 ) {
			apiFetch( {
				path: `/d2i-task-list/v1/task-items/by-folder?directoryName=${ directoryName }`,
			} ).then( ( emptyTasks ) => {
				setTasks( { tasks: emptyTasks } );
				if ( emptyTasks.length < 1 ) {
					setUnsavedTasksConfirmed( true );
				}
			} );
		}
	}, [ directoryName ] );

	useEffect( () => {
		setAttributes( { directoryName } );
	}, [ null, directoryName ] );

	const onToggleTask = ( task, index ) => {
		if ( task.isCompleted === '1' ) {
			task.isCompleted = '0';
		} else if ( task.isCompleted === '0' ) {
			task.isCompleted = '1';
		} else if ( task.isCompleted === true ) {
			task.isCompleted = false;
		} else {
			task.isCompleted = true;
		}
		const tasksCopy = [ ...tasksState.tasks ];
		tasksCopy[ index ] = {
			...task,
			isCompleted: task.isCompleted,
		};

		apiFetch( {
			path: `/d2i-task-list/v1/task-items/${ task.id }`,
			method: 'POST',
			data: tasksCopy[ index ],
		} ).then( () => {
			setTasks( { tasks: tasksCopy } );
		} );
	};

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

	const onConfirmUnsavedTasks = () => {
		const tasks = tasksState.tasks.map( ( task ) => {
			const newTask = { ...task, schoolId, directoryName };
			if ( task.documentLink ) {
				newTask.documentLink = task.documentLink;
			}

			return newTask;
		} );

		apiFetch( {
			path: '/d2i-task-list/v1/task-items/confirm-new',
			method: 'POST',
			data: tasks,
		} ).then( ( res ) => {
			setTasks( { tasks: res } );
			if ( tasksState.tasks ) {
				setUnsavedTasksConfirmed( true );
			}
		} );
	};

	const onEditTaskItem = ( task, index ) => {
		task.isEdit = ! task.isEdit;
		const tasksCopy = [ ...tasksState.tasks ];
		tasksCopy[ index ] = {
			...task,
		};

		setTasks( { tasks: tasksCopy } );
	};

	const onChangeName = ( newName ) => {
		setAttributes( { directoryName: newName } );
	};

	const onTaskSubmit = async ( e ) => {
		e.preventDefault();
		if ( addTask && newTaskTitle ) {
			const newTask = {
				title: newTaskTitle,
				schoolId,
				directoryName,
				newTaskType,
				isCompleted: '0',
			};
			if ( externalLink ) {
				newTask.documentLink = externalLink;
			}
			setAddingTask( true );
			const newSavedTask = await addTask( newTask );
			setNewTaskTitle( '' );
			setNewTaskType( '' );
			setExternalLink();
			setTasks( {
				tasks: [ ...tasksState.tasks, newSavedTask.task ],
			} );
			setAddingTask( false );
			taskTitleRef.current.focus();
		}
	};

	const onDeleteTask = async ( task, index ) => {
		await deleteTask( task, index );
		const tasksCopy = [ ...tasksState.tasks ];
		tasksCopy.splice( index, 1 );
		setTasks( { tasks: tasksCopy } );
	};

	return (
		<div { ...useBlockProps() }>
			<RichText
				placeholder={ __( 'Folder Name', 'team-member' ) }
				tagName="h2"
				onChange={ onChangeName }
				value={ directoryName }
				allowedFormats={ [] }
			/>
			{ ! tasksState.tasks ||
				( tasksState.tasks.length < 1 && (
					<Card>
						<CardBody>
							<p>
								{ __(
									'Please add some tasks using the form below',
									'd2i-task-list-blocks'
								) }
							</p>
						</CardBody>
					</Card>
				) ) }
			{ tasksState.tasks && (
				<>
					<Card>
						<CardHeader size="xSmall">
							<>
								Tasks
								{ ! isUnsavedTasksConfirmed && (
									<Button
										disabled={
											addingTask ||
											schoolId === 0 ||
											! schoolId
										}
										onClick={ onConfirmUnsavedTasks }
										isPrimary
									>
										{ __(
											'Confirm New Tasks',
											'd2i-task-list-blocks'
										) }
									</Button>
								) }
							</>
						</CardHeader>
						<CardBody>
							<ul>
								{ tasksState.tasks.map( ( task, index ) => (
									<li
										key={ index }
										className={
											( task.isCompleted === '1' ||
												task.isCompleted === true ) &&
											'is-completed'
										}
									>
										{ ! task.isEdit && (
											<>
												<CheckboxControl
													disabled={ task.loading }
													label={ task.title }
													checked={
														task.isCompleted ===
															'1' ||
														task.isCompleted ===
															true
													}
													onChange={ () => {
														onToggleTask(
															task,
															index
														);
													} }
													className={
														'task-check-control'
													}
												/>
												{ task.documentLink && (
													<ExternalLink
														href={
															task.documentLink
																.url
														}
														target={
															task.documentLink
																.target
														}
													>
														{
															task.documentLink
																.title
														}
													</ExternalLink>
												) }
												<Button
													disabled={
														addingTask ||
														task.isCompleted ===
															'1' ||
														task.isCompleted ===
															true ||
														!isUnsavedTasksConfirmed
													}
													onClick={ () =>
														onEditTaskItem(
															task,
															index
														)
													}
													variant="secondary"
													isSmall={ true }
												>
													{ __(
														'Edit',
														'd2i-task-list-blocks'
													) }
												</Button>
												<Button
													disabled={
														task.isCompleted ===
															'1' ||
														task.isCompleted ===
															true ||
														!isUnsavedTasksConfirmed
													}
													onClick={ () =>
														onDeleteTask(
															task,
															index
														)
													}
													isDestructive={ true }
													variant="tertiary"
													isSmall={ true }
												>
													{ __(
														'Delete',
														'd2i-task-list-blocks'
													) }
												</Button>
											</>
										) }

										{ task.isEdit && (
											<TaskEdit
												task={ task }
												index={ index }
												toggleTaskEdit={
													onEditTaskItem
												}
											/>
										) }
									</li>
								) ) }
							</ul>
						</CardBody>
					</Card>
					<Card>
						<CardHeader size={ 'xSmall' }>New Tasks</CardHeader>
						<CardBody>
							<form
								onSubmit={ onTaskSubmit }
								className="addtodo-form"
							>
								<TextControl
									ref={ taskTitleRef }
									label={ __(
										'Task name',
										'd2i-task-list-blocks'
									) }
									value={ newTaskTitle }
									onChange={ ( v ) => setNewTaskTitle( v ) }
								/>
								<RadioControl
									selected={ newTaskType }
									label={ __(
										'Document Type',
										'd2i-task-list-blocks'
									) }
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
											label={ __(
												'Link Title',
												'd2i-task-list-blocks'
											) }
											value={ externalLink.title }
											onChange={ onLinkTitleChange }
										/>
										<TextControl
											label={ __(
												'Link URL',
												'd2i-task-list-blocks'
											) }
											value={ externalLink.url }
											onChange={ onLinkUrlChange }
										/>
									</>
								) }
								<Button
									disabled={ addingTask }
									type="submit"
									isPrimary
								>
									{ __( 'Add Task', 'todo-list' ) }
								</Button>
							</form>
						</CardBody>
					</Card>
				</>
			) }
		</div>
	);
}
