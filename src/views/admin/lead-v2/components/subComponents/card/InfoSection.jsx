import { Box, Text } from '@chakra-ui/react';
import InfoItem from './InfoItem';
import { leadlabelFontSize } from '../../constants';

const InfoSection = ({ lead }) => {
	const infoFields = [
		{ label: 'Source Content', value: lead?.leadSourceDetails },
		{ label: 'Campaign', value: lead?.leadCampaign },
		{ label: 'Campaign Url', value: lead?.pageUrl },
		{ label: 'Medium', value: lead?.leadSourceMedium },
		{
			label: 'In UAE?',
			value:
				typeof lead?.r_u_in_uae === 'object'
					? lead?.r_u_in_uae?.text
					: lead?.r_u_in_uae,
		},
	];

	return (
		<Box>
			<Text fontSize={leadlabelFontSize} color='gray.400' mb={1}>
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
