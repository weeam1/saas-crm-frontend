import React from 'react';
import { Box, Icon } from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { FiFileText } from 'react-icons/fi';

const OfferLetterIcon = ({ status }) => {
	let mailColor = 'gray.400';
	let overlayIcon = null;

	console.log({ status });

	if (status === 'accepted') {
		mailColor = 'green.400';
		overlayIcon = (
			<Icon
				as={CheckCircleIcon}
				boxSize={3}
				color='green.400'
				position='absolute'
				top='0'
				right='0'
				transform='translate(30%, -30%)'
				bg='white'
				borderRadius='full'
			/>
		);
	} else if (status === 'rejected') {
		mailColor = 'red.400';
		overlayIcon = (
			<Icon
				as={MdClose}
				boxSize={3}
				color='red.400'
				position='absolute'
				top='0'
				right='0'
				transform='translate(30%, -30%)'
				bg='white'
				borderRadius='full'
			/>
		);
	}

	return (
		<Box
			position='relative'
			display='flex'
			alignItems='center'
			justifyContent='center'
			p={0}
			m={0}
		>
			<Icon as={FiFileText} boxSize={4} color={mailColor} />
			{overlayIcon}
		</Box>
	);
};

export default OfferLetterIcon;
