import { Box, CircularProgress, Text } from '@chakra-ui/react';
import React from 'react';

const BoxLoading = ({ size = 'sm', textSize = 'sm', loadingSize = '5' }) => {
	return (
		<Box
			border='1px solid gray.800'
			borderRadius='4px'
			display='flex'
			// padding={'3px'}
			alignItems='center'
			size={size}
		>
			<CircularProgress size={loadingSize} isIndeterminate />
			<Text margin='4px' fontSize={textSize}>
				Updating...
			</Text>
		</Box>
	);
};

export default BoxLoading;
