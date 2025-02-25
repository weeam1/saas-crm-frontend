import React from 'react';
import { Box, Icon, Tooltip } from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { FiFileText } from 'react-icons/fi';

const OfferLetterIcon = ({ status, onClick }) => {
	let mailColor = 'gray.400';
	let overlayIcon = null;
	let tooltipMessage = '';

	if (status === 'accepted') {
		mailColor = 'green.400';
		tooltipMessage = 'Offer letter accepted';
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
		tooltipMessage = 'Offer letter rejected';
		overlayIcon = (
			<Icon
				onClick={onClick}
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
		<Tooltip
			label={tooltipMessage}
			aria-label='Offer status tooltip'
			placement='bottom'
			hasArrow
			cursor='pointer'
		>
			<Box
				position='relative'
				display='flex'
				alignItems='center'
				justifyContent='center'
				p={0}
				m={0}
				// Attach onClick to the Box only when status is 'rejected'
				onClick={status === 'rejected' ? onClick : undefined}
				cursor={status === 'rejected' ? 'pointer' : 'default'}
			>
				<Icon as={FiFileText} boxSize={4} color={mailColor} />
				{overlayIcon}
			</Box>
		</Tooltip>
	);
};

export default OfferLetterIcon;
