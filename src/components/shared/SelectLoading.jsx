import { CircularProgress, Text } from '@chakra-ui/react';

const SelectLoading = ({ textSize = 'sm', loadingSize = '5' }) => {
	return (
		<option disabled>
			<CircularProgress size={loadingSize} isIndeterminate />
			<Text margin='4px' fontSize={textSize}>
				Updating...
			</Text>
		</option>
	);
};

export default SelectLoading;
