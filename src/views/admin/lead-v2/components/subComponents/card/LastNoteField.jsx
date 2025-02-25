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

const LastNoteField = ({ label, value }) => {
	const labelColor = useColorModeValue('softGray.200', 'gray.300');
	const valueColor = useColorModeValue('gray.800', 'green.600');

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

				<Tooltip label={value} closeOnClick={false} hasArrow>
					<Icon as={InfoIcon} boxSize={leadIconSize} color='blue.300' />
				</Tooltip>
			</HStack>

			{/* Value */}
			<Text
				fontSize={leadValueFontSize}
				textAlign='left'
				fontWeight='normal'
				isTruncated
				color={valueColor}
			>
				{value || 'N/A'}
			</Text>
		</Box>
	);
};
export default LastNoteField;
