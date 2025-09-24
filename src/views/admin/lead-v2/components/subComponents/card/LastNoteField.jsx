import React from 'react';
import {
	Box,
	Text,
	Tooltip,
	useColorModeValue,
	Icon,
	HStack,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import {
	leadIconSize,
	leadlabelFontSize,
	leadValueFontSize,
} from '../../constants';
import CustomTooltip from 'components/shared/CustomTooltip';
import { format } from 'date-fns';

const LastNoteField = ({ label, lead }) => {
	const labelColor = useColorModeValue('softGray.200', 'gray.300');
	const valueColor = useColorModeValue('gray.800', 'green.600');

	const isLatestNote = lead?.latestNote?.createdAt;

	const tooltipLabel = lead?.lastNote ? (
		<div>
			{lead?.latestNote?.addedBy?.fullName && (
				<h4 style={{ marginBottom: '6px', fontSize: '12px' }}>
					Added By: {lead?.latestNote?.addedBy?.fullName}
				</h4>
			)}
			<p style={{ marginBottom: '6px' }}>{lead?.lastNote}</p>
			<span>
				{isLatestNote &&
					format(new Date(lead?.latestNote.createdAt), 'MMM d, yyyy h:mm a')}
			</span>
		</div>
	) : (
		'N/A'
	);

	return (
		<Box display='flex' maxWidth='200px' flexDir='column'>
			{/* Label + Copy Icon*/}
			<HStack
				alignItems='center'
				justifyContent='space-between'
				gap={2}
				flex='1'
			>
				{label && (
					<Text fontSize={leadlabelFontSize} color={labelColor}>
						{label}
					</Text>
				)}

				{/* <CustomTooltip label={tooltipLabel} persistent={true} variant='primary'> */}
				<CustomTooltip label={tooltipLabel} persistent={true}>
					<Icon
						as={InfoIcon}
						boxSize={leadIconSize}
						color='blue.300'
						cursor='pointer'
					/>
				</CustomTooltip>
			</HStack>

			{/* Value */}
			<Text
				fontSize={leadValueFontSize}
				textAlign='left'
				fontWeight='normal'
				isTruncated
				color={valueColor}
			>
				{lead.lastNote || 'N/A'}
			</Text>

			{isLatestNote && (
				<Text fontSize={leadlabelFontSize} color='gray.700'>
					{format(new Date(lead?.latestNote.createdAt), 'MMM d, yyyy h:mm a')}
				</Text>
			)}
		</Box>
	);
};
export default LastNoteField;
