import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { schoolId } = attributes;
	return (
		<div
			{ ...useBlockProps.save() }
		>
			<InnerBlocks.Content />
		</div>
	);
}
