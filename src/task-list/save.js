import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { schoolId, listName } = attributes;
	return (
		<div { ...useBlockProps.save() }>
			{ listName && <RichText.Content tagName="h4" value={ listName } /> }
			<InnerBlocks.Content />
		</div>
	);
}
