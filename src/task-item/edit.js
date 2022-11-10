import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	CheckboxControl,
	TextControl,
	Button,
	Icon,
} from '@wordpress/components';
import './editor.scss';
import { useState } from '@wordpress/element';

export default function Edit( { context, isSelected } ) {
	const schoolId = context[ 'd2i-task-list/schoolId' ];
	const listName = context[ 'd2i-task-list/listName' ];
	const [ newTaskTitle, setNewTaskTitle ] = useState( '' );
	const [ addingTask, setAddingTask ] = useState( false );
	const tasks = useSelect( ( select ) => {
		const tasksStore = select( 'd2i/tasks' );
		return tasksStore && listName && tasksStore.getTasks( schoolId, listName );
	} );
	console.log( tasks );
	const actions = useDispatch( 'd2i/tasks' );
	const addTask = actions && actions.addTask;
	const toggleTask = actions && actions.toggleTask;
	return (
		<div { ...useBlockProps() }>
			{ ! tasks ||
				( tasks.length < 1 && (
					<p>{ __( 'Please add some tasks', 'todo-list' ) }</p>
				) ) }
			{ tasks &&
				<>
					<ul>
						{ tasks.map( ( task, index ) => (
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
												<button
													aria-label={ __(
														'Add Social Link',
														'team-members'
													) }
													onClick={ () =>
														console.log( 'click' )
													}
												>
													<Icon icon="plus" />
												</button>
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
									listName
								};
								setAddingTask( true );
								await addTask( newTask );
								setNewTaskTitle( '' );
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
			}
		</div>
	);
}
