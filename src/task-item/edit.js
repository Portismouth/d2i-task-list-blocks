import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	CheckboxControl,
	TextControl,
	Button,
	Icon,
	Tooltip,
} from '@wordpress/components';
import './editor.scss';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Edit( { attributes, setAttributes, context } ) {
	const schoolId = context[ 'd2i-task-list/schoolId' ];
	const directoryNameFromContext = context[ 'd2i-task-list/directoryName' ];
	const { directoryName } = attributes;

	const [ newTaskTitle, setNewTaskTitle ] = useState( '' );
	const [ addingTask, setAddingTask ] = useState( false );
	const [ tasksState, setNewTasks ] = useState( { tasks: [] } );

	useEffect( () => {
		apiFetch( {
			path: `/d2i-task-list/v1/task-items/${ schoolId }?directoryName=${ directoryName }`,
		} ).then( ( res ) => {
			// return res;
			setNewTasks( { tasks: res } );
		} );
	}, [ schoolId, directoryNameFromContext ] );

	useEffect( async () => {
		const initialTasks = await fetchTasks();
		setNewTasks( { tasks: initialTasks } );
	}, [] );

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
	// const tasks = useSelect( ( select ) => {
	// 	const tasksStore = select( 'd2i/tasks' );
	// 	return tasksStore && listName && tasksStore.getTasks( schoolId, listName );
	// } );

	const actions = useDispatch( 'd2i/tasks' );
	const addTask = actions && actions.addTask;
	const toggleTask = actions && actions.toggleTask;
	return (
		<div { ...useBlockProps() }>
			{ ! tasksState.tasks ||
				( tasksState.tasks.length < 1 && (
					<p>{ __( 'Please add some tasks', 'todo-list' ) }</p>
				) ) }
			{ tasksState.tasks && (
				<>
					<ul>
						{ tasksState.tasks.map( ( task, index ) => (
							<li key={ index }>
								<div>
									<CheckboxControl
										disabled={ task.loading }
										label={ task.title }
										checked={ task.completed }
										onChange={ ( val ) =>
											console.log( val )
										}
									/>
									{ task.documents && (
										<>
											<ul>
												{ task.documents.map(
													( doc, docIndex ) => {
														return (
															<li
																key={ docIndex }
																className="task-list-doc-item"
															>
																{
																	doc.document_name
																}
															</li>
														);
													}
												) }
											</ul>
											<div>
												<Tooltip
													text={ __(
														'Add Document',
														'd2i-task-lists-block'
													) }
												>
													<button
														aria-label={ __(
															'Add Document',
															'team-members'
														) }
														onClick={ () =>
															console.log(
																'click'
															)
														}
													>
														<Icon icon="plus" />
													</button>
												</Tooltip>
											</div>
										</>
									) }
								</div>
							</li>
						) ) }
					</ul>
					<form
						onSubmit={ async ( e ) => {
							e.preventDefault();
							if ( addTask && newTaskTitle ) {
								const newTask = {
									title: newTaskTitle,
									schoolId,
									directoryName,
								};
								setAddingTask( true );
								const newSavedTask = await addTask( newTask );
								console.log( newSavedTask );
								setNewTaskTitle( '' );
								setNewTasks( {
									tasks: [
										...tasksState.tasks,
										newSavedTask.task,
									],
								} );
								setAddingTask( false );
							}
						} }
						className="addtodo-form"
					>
						<TextControl
							value={ newTaskTitle }
							onChange={ ( v ) => setNewTaskTitle( v ) }
						/>
						<Button disabled={ addingTask } type="submit" isPrimary>
							{ __( 'Add Task', 'todo-list' ) }
						</Button>
					</form>
				</>
			) }
		</div>
	);
}
