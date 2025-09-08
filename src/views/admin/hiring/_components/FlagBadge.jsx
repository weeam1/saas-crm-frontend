import { Image, Tooltip } from '@chakra-ui/react';
import React from 'react';

const FlagBadge = ({ item }) => {
	return (
		<div style={{ width: 'fit-content' }}>
			{item.country?.flags?.png && (
				<Tooltip
					label={item.nationality}
					hasArrow
					placement='top'
					cursor={'pointer'}
				>
					<Image
						rounded='sm'
						src={item.country?.flags.png}
						alt={item.country?.flags.alt}
						h='12px'
						w='auto'
						objectFit='cover'
						shadow='md'
						cursor='pointer'
					/>
				</Tooltip>
			)}
		</div>
	);
};

export default FlagBadge;
