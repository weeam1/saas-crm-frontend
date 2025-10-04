// ContactPair.jsx
import React from 'react';
import { VStack, HStack, Text, Icon, Tooltip } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { handleCopy } from '../utils/utils';
import { safeValue } from 'utils';

const ContactPair = ({ label, value, color }) => (
	<VStack align='start' spacing={0} flex='1' minW={0}>
		<HStack spacing={1}>
			<Text fontSize='12px' color='#C1C1C1' fontFamily='DM Sans'>
				{label}
			</Text>
			<Tooltip label={`Copy ${label}`}>
				<Icon
					as={CopyIcon}
					color='gray.500'
					cursor='pointer'
					boxSize={3}
					onClick={() => handleCopy(value)}
				/>
			</Tooltip>
		</HStack>
		<Text
			fontSize={label === 'Phone' ? '12px' : 'xs'}
			color={color}
			isTruncated
		>
			{safeValue(value) || 'N/A'}
		</Text>
	</VStack>
);

export default ContactPair;
