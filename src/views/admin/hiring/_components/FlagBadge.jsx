import { Image, Tooltip } from '@chakra-ui/react';
import React from 'react';

const FlagBadge = ({ item }) => {
	return (
		<div>
			{item.country?.flags?.png && (
				<Tooltip label={item.nationality} hasArrow cursor={'pointer'}>
					<Image
						rounded='sm'
						src={item.country?.flags.png}
						alt={item.country?.flags.alt}
						h='12px'
						w='full'
						objectFit='cover'
						shadow='md'
					/>
				</Tooltip>
			)}
		</div>
	);
};

export default FlagBadge;
