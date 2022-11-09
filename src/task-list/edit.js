import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
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
	} );
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

			<InnerBlocks
				allowedBlocks={ [ 'd2i-blocks/task-item' ] }
				template={ [ [ 'd2i-blocks/task-item' ] ] }
			/>
		</div>
	);
}
