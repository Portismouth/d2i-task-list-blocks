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

export default function Edit( { attributes, setAttributes, context } ) {
	const schoolId = context[ 'd2i-task-list/schoolId' ];
	const directoryNameFromContext = context[ 'd2i-task-list/directoryName' ];
	const { directoryName } = attributes;

	const [ newTaskTitle, setNewTaskTitle ] = useState( '' );
	const [ newTaskType, setNewTaskType ] = useState( '' );
	const [ externalLink, setExternalLink ] = useState();
	const [ addingTask, setAddingTask ] = useState( false );
	const [ tasksState, setTasks ] = useState( { tasks: [] } );

	const taskTitleRef = useRef();

	useEffect( () => {
		apiFetch( {
			path: `/d2i-task-list/v1/task-items/${ schoolId }?directoryName=${ directoryName }`,
		} ).then( ( res ) => {
			// return res;
			setTasks( { tasks: res } );
		} );
	}, [ schoolId, directoryNameFromContext ] );

	// useEffect( async () => {
	// 	const initialTasks = await fetchTasks();
	// 	setTasks( { tasks: initialTasks } );
	// }, [] );

	useEffect( () => {
		setAttributes( { directoryName: directoryNameFromContext } );
	}, [ null, directoryNameFromContext ] );

	const fetchTasks = async () => {
		apiFetch( {
			path: `/d2i-task-list/v1/task-items/${ schoolId }?directoryName=${ directoryName }`,
		} ).then( ( res ) => {
			// return res;
			return res;
		} );
	};

	const onToggleTask = ( task, index ) => {
		task.isCompleted = task.isCompleted === '1' ? '0' : '1';
		const tasksCopy = [ ...tasksState.tasks ];
		tasksCopy[ index ] = {
			...tasksCopy[ index ],
			isCompleted: task.isCompleted,
		};
		apiFetch( {
			path: `/d2i-task-list/v1/task-items/${ task.id }`,
			method: 'POST',
			data: tasksCopy[ index ],
		} ).then( ( res ) => {
			console.log( res );

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

	console.log( tasksState.tasks );

	const actions = useDispatch( 'd2i/tasks' );
	const addTask = actions && actions.addTask;
	return (
		<div { ...useBlockProps() }>
			{ ! tasksState.tasks ||
				( tasksState.tasks.length < 1 && (
					<Card>
						<CardBody>
							<p>
								{ __(
									'Please add some tasks using the form below',
									'todo-list'
								) }
							</p>
						</CardBody>
					</Card>
				) ) }
			{ tasksState.tasks && (
				<>
					<Card>
						<CardHeader size="xSmall">Tasks</CardHeader>
						<CardBody>
							<ul>
								{ tasksState.tasks.map( ( task, index ) => (
									<li
										key={ index }
										className={
											task.isCompleted === '1' &&
											'is-completed'
										}
									>
										<CheckboxControl
											disabled={ task.loading }
											label={ task.title }
											checked={ task.isCompleted === '1' }
											onChange={ () => {
												onToggleTask( task, index );
											} }
											className={ 'task-check-control' }
										/>
										{ task.documentLink && (
											<ExternalLink
												href={ task.documentLink.url }
												target={
													task.documentLink.target
												}
											>
												{ task.documentLink.title }
											</ExternalLink>
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
								onSubmit={ async ( e ) => {
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
										const newSavedTask = await addTask(
											newTask
										);
										setNewTaskTitle( '' );
										setNewTaskType( '' );
										setExternalLink();
										setTasks( {
											tasks: [
												...tasksState.tasks,
												newSavedTask.task,
											],
										} );
										setAddingTask( false );
										taskTitleRef.current.focus();
									}
								} }
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
