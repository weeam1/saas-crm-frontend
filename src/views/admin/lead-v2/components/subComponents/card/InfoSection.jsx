import { Box, Text } from '@chakra-ui/react';
import InfoItem from './InfoItem';
import { leadlabelFontSize } from '../../constants';

const InfoSection = ({ lead }) => {
	const hiddenFields = JSON.parse(
		localStorage.getItem('userCustomColumns') || '[]',
	);

	const infoFields = [
		{ key: 'nationality', label: 'Nationality', value: lead?.nationality },
		{ key: 'budget', label: 'Budget', value: lead?.budget },
		// { key: 'adset', label: 'Adset', value: lead?.adset },
		{ key: 'timetocall', label: 'Time to call', value: lead?.timetocall },
		{ key: 'leadCampaign', label: 'Campaign Name', value: lead?.leadCampaign },
		{ key: 'pageUrl', label: 'Campaign Url', value: lead?.pageUrl },
		{
			key: 'leadSourceMedium',
			label: 'Placement',
			value: lead?.leadSourceMedium,
		},
		// { key: 'leadSourceMedium', label: 'Medium', value: lead?.leadSourceMedium },
		{
			key: 'attendanceDay',
			label: 'Attendance Day',
			value: lead?.attendanceDay,
		},
		// {
		// 	key: 'leadLang',
		// 	label: 'Lead Lang',
		// 	value: lead?.leadLang,
		// },
		// {
		// 	key: 'r_u_in_uae',
		// 	label: 'In UAE?',
		// 	value:
		// 		typeof lead?.r_u_in_uae === 'object'
		// 			? lead?.r_u_in_uae?.text
		// 			: lead?.r_u_in_uae,
		// },
	];

	const visibleInfoFields = infoFields.filter(
		(field) => !hiddenFields.includes(field.key),
	);

	return (
		<Box>
			<Text fontSize={leadlabelFontSize} color='gray.400' mb={1}>
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
