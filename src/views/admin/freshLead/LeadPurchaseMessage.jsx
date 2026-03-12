import { useState, useEffect } from 'react';
import { Box, Text, CloseButton, Slide, Flex } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

const LeadPurchaseMessage = ({ purchaseStatus = false, onClose }) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setVisible(true);
	}, [purchaseStatus]);

	if (!visible) return null;

	const bgColor = purchaseStatus ? 'green.500' : 'red.500';
	const icon = purchaseStatus ? (
		<CheckCircleIcon mr={2} />
	) : (
		<WarningIcon mr={2} />
	);
	const title = purchaseStatus ? 'Lead Purchased!' : 'Lead Already Taken';
	const message = purchaseStatus
		? 'You successfully purchased this lead.'
		: 'Oops! This lead has already been purchased by another user.';

	return (
		<Slide direction='top' in={visible} style={{ zIndex: 1000 }}>
			<Box
				position='fixed'
				top='4'
				right='4'
				bg={bgColor}
				color='white'
				p={4}
				borderRadius='md'
				shadow='lg'
				minW='320px'
			>
				<Flex justify='space-between' align='center'>
					<Flex align='center'>
						{icon}
						<Text fontWeight='bold'>{title}</Text>
					</Flex>
					<CloseButton
						onClick={() => {
							setVisible(false);
							onClose?.();
						}}
						color='white'
					/>
				</Flex>
				<Text mt={2} fontSize='sm'>
					{message}
				</Text>
			</Box>
		</Slide>
	);
};

export default LeadPurchaseMessage;
