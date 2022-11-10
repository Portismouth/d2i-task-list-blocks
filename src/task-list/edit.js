import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
	RichText,
} from '@wordpress/block-editor';
import {
	CheckboxControl,
	TextControl,
	Button,
	SelectControl,
	PanelBody,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { schoolId, listName } = attributes;
	const onChangeSchool = ( newSchool ) => {
		setAttributes( { schoolId: parseInt( newSchool ) } );
	};
	const onChangeListName = ( newListName ) => {
		setAttributes( { listName: newListName } );
	};
	const schools = useSelect( ( select ) => {
		const schoolsArray = [];
		const schoolsStore = select( 'd2i/schools' );
		if ( schoolsStore ) {
			schoolsArray.push( {
				value: 0,
				label: 'Select a school',
				disabled: true,
			} );

			const schoolsFromStore = schoolsStore.getSchools();
			schoolsFromStore.forEach( ( school ) => {
				schoolsArray.push( {
					label: school.title,
					value: school.id,
				} );
			} );
		}

		return schoolsArray;
	}, [schoolId, listName] );
	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody>
					<SelectControl
						label={ __( 'School', 'd2i-task-list-block' ) }
						options={ schools }
						value={ schoolId }
						onChange={ onChangeSchool }
					/>
				</PanelBody>
			</InspectorControls>
			<RichText
				placeholder={ __( 'Task Name', 'd2i-task-list-block' ) }
				tagName="h4"
				onChange={ onChangeListName }
				value={ listName }
				allowedFormats={ [] }
			/>
			<InnerBlocks
				allowedBlocks={ [ 'd2i-blocks/task-item' ] }
				renderAppender={ false }
				template={ [ [ 'd2i-blocks/task-item' ] ] }
				templateLock={ 'all' }
			/>
		</div>
	);
}
