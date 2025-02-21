import { Box, Text } from '@chakra-ui/react';
import InfoItem from './InfoItem';

const InfoSection = () => {
	const infoFields = [
		{ label: 'Source Content', value: 'The origin of this lead' },
		{ label: 'Campaign', value: 'Campaign details go here' },
		{ label: 'Campaign Url', value: 'https://example.com' },
		{ label: 'Medium', value: 'Online Ad' },
		{ label: 'In UAE?', value: 'Yes' },
	];

	return (
		<Box>
			<Text fontSize='10px' color='gray.400' mb={1}>
				Info
			</Text>
			<Box width='fit-content'>
				{infoFields.map((item, idx) => (
					<InfoItem key={idx} label={item.label} value={item.value} mb={1} />
				))}
			</Box>
		</Box>
	);
};

export default InfoSection;
