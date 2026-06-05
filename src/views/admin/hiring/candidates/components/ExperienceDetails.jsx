import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useModalColors } from 'hooks/useModalColors';

const ExperienceDetails = ({ experience }) => {
	const colors = useModalColors();

	return (
		<Box width='full' fontSize='sm' py='2'>
			<Text fontWeight='500' fontSize='md' mb={1} color={colors.headingText}>
				Experience Details
			</Text>
			<Box
				bg={colors.bgInput}
				p='3'
				rounded='md'
				boxShadow='xs'
				textAlign='justify'
				height='100px'
				overflowY='auto'
				color={colors.bodyText}
				sx={{
					'::-webkit-scrollbar': {
						width: '8px',
					},
					'::-webkit-scrollbar-track': {
						background: colors.bgDeep,
						borderRadius: '4px',
					},
					'::-webkit-scrollbar-thumb': {
						background: colors.accentGold,
						borderRadius: '4px',
					},
					'::-webkit-scrollbar-thumb:hover': {
						background: colors.goldLight,
					},
				}}
			>
				{experience}
			</Box>
		</Box>
	);
};

export default ExperienceDetails;