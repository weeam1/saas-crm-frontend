import React from 'react';
import {
	Box,
	Text,
	Tooltip,
	Icon,
	HStack,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import {
	leadIconSize,
	leadlabelFontSize,
	leadValueFontSize,
} from '../../constants';
import { format } from 'date-fns';

const LastNoteField = ({ label, lead }) => {
	const isLatestNote = lead?.latestNote?.createdAt;

	const tooltipLabel = lead?.lastNote ? (
		<Box>
			{lead?.latestNote?.addedBy?.fullName && (
				<Text fontWeight="bold" mb={1} fontSize="xs">
					Added By: {lead?.latestNote?.addedBy?.fullName}
				</Text>
			)}
			<Text mb={1} fontSize="xs">
				{lead?.lastNote}
			</Text>
			{isLatestNote && (
				<Text fontSize="xs" color="text.muted">
					{format(new Date(lead?.latestNote.createdAt), 'MMM d, yyyy h:mm a')}
				</Text>
			)}
		</Box>
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
					<Text fontSize={leadlabelFontSize} color='text.muted'>
						{label}
					</Text>
				)}

				<Tooltip
					label={tooltipLabel}
					placement="top"
					hasArrow
					openDelay={300}
					bg='bg.surface'
					color='text.body'
					border='1px solid'
					borderColor='border.default'
					borderRadius='md'
					p={2}
					fontSize='xs'
				>
					<span style={{ display: 'inline-flex' }}>
						<Icon
							as={InfoIcon}
							boxSize={leadIconSize}
							color='text.accent'
							cursor='pointer'
							_hover={{ color: 'accent.goldLight' }}
						/>
					</span>
				</Tooltip>
			</HStack>

			{/* Value */}
			<Text
				fontSize={leadValueFontSize}
				textAlign='left'
				fontWeight='normal'
				isTruncated
				color='text.body'
			>
				{lead.lastNote || 'N/A'}
			</Text>

			{isLatestNote && (
				<Text fontSize={leadlabelFontSize} color='text.muted'>
					{format(new Date(lead?.latestNote.createdAt), 'MMM d, yyyy h:mm a')}
				</Text>
			)}
		</Box>
	);
};

export default LastNoteField;