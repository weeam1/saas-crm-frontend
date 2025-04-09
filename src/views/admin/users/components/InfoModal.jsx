import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Box,
	Text,
	Flex,
	Icon,
	CloseButton,
} from '@chakra-ui/react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { MdOutlineAssignment, MdOutlineNotificationsOff } from 'react-icons/md';
import { buttonStyle } from 'utils/btn';

// Reusable InfoItem component
const InfoItem = ({ icon, color, text }) => (
	<Flex as='li' align='center' mb={3}>
		<Icon as={icon} color={color} boxSize={5} mr={3} />
		<Text
			fontSize='md'
			color='gray.800'
			dangerouslySetInnerHTML={{ __html: text }}
		/>
	</Flex>
);

const InfoModal = ({ isOpen, onClose, username, handleProceed }) => {
	const consequences = [
		{
			icon: AiOutlineCloseCircle,
			color: 'red.500',
			text: 'This user will no longer be able to <strong>log in</strong> to the system.',
		},
		{
			icon: MdOutlineAssignment,
			color: 'orange.400',
			text: 'They will lose access to all <strong>system features</strong>.',
		},
		// {
		// 	icon: AiOutlineUser,
		// 	color: 'blue.500',
		// 	text: 'Any assigned tasks or leads will be <strong>reassigned</strong>.',
		// },
		{
			icon: MdOutlineNotificationsOff,
			color: 'gray.400',
			text: 'Notifications and alerts will no longer be sent to this user.',
		},
	];

	return (
		<Modal isOpen={isOpen} isCentered size='lg'>
			<ModalOverlay />
			<ModalContent borderRadius='lg' fontFamily="'DM Sans', sans-serif">
				<ModalHeader
					fontSize='lg'
					fontWeight='bold'
					color='red.500'
					display='flex'
					justifyContent='space-between'
					alignItems='center'
					p={4}
					borderBottom='1px solid'
					borderColor='gray.200'
				>
					<Box>
						<Text as='span' fontSize='lg' fontWeight='bold'>
							Warning! User Disabled
						</Text>
						<Text fontSize='sm' color='gray.500'>
							Please review the implications of this action.
						</Text>
					</Box>
					<CloseButton size='sm' onClick={onClose} />
				</ModalHeader>
				<ModalBody>
					<Box>
						<Text fontSize='md' mb={4}>
							The user <strong>{username}</strong> has been disabled. Here are
							the consequences:
						</Text>
						<Box as='ul' pl={4} color='gray.700' fontSize='md'>
							{consequences.map((item, index) => (
								<InfoItem
									key={index}
									icon={item.icon}
									color={item.color}
									text={item.text}
								/>
							))}
						</Box>
					</Box>
				</ModalBody>
				<ModalFooter>
					<Button
						{...buttonStyle}
						variant='solid'
						bg='gray.200'
						color='gray.800'
						_active={{ bg: 'gray.300' }}
						mr='3'
						fontSize='md'
						aria-label='close'
						onClick={onClose}
					>
						Close
					</Button>
					<Button
						{...buttonStyle}
						variant='solid'
						bg='brand.400'
						fontSize='md'
						aria-label='proceed'
						onClick={handleProceed}
					>
						Proceed
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default InfoModal;
