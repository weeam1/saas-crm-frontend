import { CircularProgress, Flex } from '@chakra-ui/react';
import React from 'react';

const Loader = () => {
	return (
		<Flex
			justifyContent={'center'}
			alignItems={'center'}
			height='full'
			width='100%'
			overflow={'hidden'}
		>
			<CircularProgress
				size='10'
				isIndeterminate
				color='brand.400'
				thickness='12px'
			/>
		</Flex>
	);
};

export default Loader;
