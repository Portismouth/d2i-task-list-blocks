import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { listName } = attributes;
	return (
		<div { ...useBlockProps.save() }>
			{ listName && (
				<RichText.Content
					tagName="h2"
					value={ listName }
				/>
			) }
			<InnerBlocks.Content />
		</div>
	);
}
