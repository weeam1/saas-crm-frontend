import { Box, Text } from '@chakra-ui/react';
import InfoItem from './InfoItem';
import { leadlabelFontSize } from '../../constants';
import { formatTimeToCall } from 'views/admin/lead-v2/leadUtil';

const InfoSection = ({ lead }) => {
	const hiddenFields = JSON.parse(
		localStorage.getItem('userCustomColumns') || '[]',
	);

	const infoFields = [
		{ key: 'nationality', label: 'Nationality', value: lead?.nationality },
		{ key: 'budget', label: 'Budget', value: lead?.budget },
		{
			key: 'timetocall',
			label: 'Time to Call',
			value: formatTimeToCall(lead),
		},
		{ key: 'leadCampaign', label: 'Campaign Name', value: lead?.leadCampaign },
		{ key: 'pageUrl', label: 'Campaign Url', value: lead?.pageUrl },
		{
			key: 'leadSourceMedium',
			label: 'Placement',
			value: lead?.leadSourceMedium,
		},
		{
			key: 'attendanceDay',
			label: 'Attendance Day',
			value: lead?.attendanceDay,
		},
	];

	const visibleInfoFields = infoFields.filter(
		(field) => !hiddenFields.includes(field.key),
	);

	return (
		<Box>
			<Text fontSize={leadlabelFontSize} color='text.muted' mb={1}>
				Info
			</Text>
			<Box width='fit-content'>
				{visibleInfoFields.map((item, idx) => (
					<InfoItem key={idx} label={item.label} value={item.value} />
				))}
			</Box>
		</Box>
	);
};

export default InfoSection;