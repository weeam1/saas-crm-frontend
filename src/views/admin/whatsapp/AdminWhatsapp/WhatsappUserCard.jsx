// import { useNavigate } from 'react-router-dom';
// import {
// 	Box,
// 	Flex,
// 	Text,
// 	Badge,
// 	Divider,
// 	Stack,
// 	IconButton,
// 	Tooltip,
// 	useColorModeValue,
// 	Button,
// } from '@chakra-ui/react';
// import {
// 	FaWhatsapp,
// 	FaPhone,
// 	FaUserTie,
// 	FaBuilding,
// 	FaCalendarAlt,
// } from 'react-icons/fa';
// import UserAvatar from 'components/shared/UserAvatar';
// import { formatPostDate } from 'utils/helpers';

// const WhatsappUserCard = ({ data }) => {
// 	const navigate = useNavigate();
// 	const { user, phoneNumber, isActive, createdAt } = data || {};

// 	// Color values based on color mode
// 	const cardBg = useColorModeValue('#dcf8c6', 'gray.800');
// 	const whatsappGreen = useColorModeValue('#25D366', '#128C7E');
// 	const borderColor = useColorModeValue('gray.200', 'gray.700');
// 	const hoverBorderColor = useColorModeValue('#25D366', '#128C7E');
// 	const textColor = useColorModeValue('gray.700', 'gray.300');
// 	const secondaryTextColor = useColorModeValue('gray.500', 'gray.400');

// 	// WhatsApp gradient for the button
// 	const whatsappGradient = `linear-gradient(to right, ${whatsappGreen}, #34B7F1)`;

// 	return (
// 		<Box
// 			bg={cardBg}
// 			rounded='lg'
// 			p={5}
// 			borderWidth='1px'
// 			borderColor={borderColor}
// 			transition='all 0.3s ease'
// 			_hover={{
// 				transform: 'translateY(-2px)',
// 				shadow: 'lg',
// 				borderColor: hoverBorderColor,
// 			}}
// 			shadow='md'
// 			position='relative'
// 			overflow='hidden'
// 		>
// 			{/* WhatsApp-themed accent */}
// 			<Box
// 				position='absolute'
// 				top={0}
// 				left={0}
// 				h='full'
// 				w='4px'
// 				bg={whatsappGreen}
// 			/>

// 			<Flex justify='space-between' align='flex-start' mb={4}>
// 				<Flex gap={4} align='center' flex='1'>
// 					<UserAvatar
// 						src={user?.profileImage}
// 						name={user?.fullName}
// 						size='lg'
// 					/>
// 					<Box flex='1' minW={0}>
// 						<Flex align='center' gap={2}>
// 							<Text
// 								fontWeight='bold'
// 								fontSize='xl'
// 								noOfLines={1}
// 								color={textColor}
// 							>
// 								{user?.fullName || 'Unnamed'}
// 							</Text>
// 						</Flex>
// 						<Flex
// 							align='center'
// 							gap={2}
// 							fontSize='sm'
// 							color={secondaryTextColor}
// 							mt={1}
// 						>
// 							<FaPhone size='0.8em' />
// 							<Text>{phoneNumber}</Text>
// 						</Flex>
// 					</Box>
// 				</Flex>
// 			</Flex>

// 			<Divider borderColor={borderColor} my={3} />

// 			<Stack spacing={3} fontSize='sm' color={textColor} mb={4}>
// 				<Flex align='center' gap={3}>
// 					<Box color={secondaryTextColor}>
// 						<FaBuilding size='1em' />
// 					</Box>
// 					<Text>
// 						<Text as='span' color={secondaryTextColor}>
// 							Agency:{' '}
// 						</Text>
// 						{user?.agency?.name || 'N/A'}
// 					</Text>
// 				</Flex>
// 				<Flex align='center' gap={3}>
// 					<Box color={secondaryTextColor}>
// 						<FaUserTie size='1em' />
// 					</Box>
// 					<Text>
// 						<Text as='span' color={secondaryTextColor}>
// 							Role:{' '}
// 						</Text>
// 						{user?.roles?.[0]?.roleName || user?.role}
// 					</Text>
// 				</Flex>
// 				<Flex align='center' gap={3}>
// 					<Box color={secondaryTextColor}>
// 						<FaCalendarAlt size='1em' />
// 					</Box>
// 					<Text>
// 						<Text as='span' color={secondaryTextColor}>
// 							Created on:{' '}
// 						</Text>
// 						{formatPostDate(createdAt)}
// 					</Text>
// 				</Flex>
// 			</Stack>

// 			<Flex justify='space-between' align='center'>
// 				<Badge
// 					colorScheme={isActive ? 'green' : 'red'}
// 					px={3}
// 					py={1}
// 					rounded='full'
// 					fontSize='sm'
// 					fontWeight='medium'
// 				>
// 					{isActive ? 'Active' : 'Disabled'}
// 				</Badge>

// 				<Button
// 					leftIcon={<FaWhatsapp size='1.2em' />}
// 					colorScheme='whatsapp'
// 					bg={whatsappGreen}
// 					_hover={{ bg: whatsappGreen, transform: 'scale(1.02)' }}
// 					_active={{ bg: whatsappGreen }}
// 					size='sm'
// 					rounded='full'
// 					px={4}
// 					onClick={() => navigate(`/whatsapp/chats/${user?._id}`)}
// 					shadow='md'
// 				>
// 					WhatsApp Chat
// 				</Button>
// 			</Flex>
// 		</Box>
// 	);
// };

// export default WhatsappUserCard;

import { useNavigate } from 'react-router-dom';
import {
	Box,
	Flex,
	Text,
	Badge,
	Divider,
	Stack,
	IconButton,
	Tooltip,
	Button,
} from '@chakra-ui/react';
import {
	FaWhatsapp,
	FaPhone,
	FaUserTie,
	FaBuilding,
	FaCalendarAlt,
} from 'react-icons/fa';
import UserAvatar from 'components/shared/UserAvatar';
import { formatPostDate } from 'utils/helpers';
import { useModalColors } from 'hooks/useModalColors';

const WhatsappUserCard = ({ data }) => {
	const colors = useModalColors();
	const navigate = useNavigate();
	const { user, phoneNumber, isActive, createdAt } = data || {};

	// WhatsApp brand colors (keeping original WhatsApp colors)
	const whatsappGreen = '#25D366';
	const whatsappDark = '#128C7E';

	// WhatsApp gradient for the button
	const whatsappGradient = `linear-gradient(to right, ${whatsappGreen}, #34B7F1)`;

	return (
		<Box
			bg={colors.bgInput}
			rounded='lg'
			p={5}
			borderWidth='1px'
			borderColor={colors.borderColor}
			transition='all 0.3s ease'
			_hover={{
				transform: 'translateY(-2px)',
				shadow: 'lg',
				borderColor: whatsappGreen,
			}}
			shadow='md'
			position='relative'
			overflow='hidden'
		>
			{/* WhatsApp-themed accent */}
			<Box
				position='absolute'
				top={0}
				left={0}
				h='full'
				w='4px'
				bg={whatsappGreen}
			/>

			<Flex justify='space-between' align='flex-start' mb={4}>
				<Flex gap={4} align='center' flex='1'>
					<UserAvatar
						src={user?.profileImage}
						name={user?.fullName}
						size='lg'
					/>
					<Box flex='1' minW={0}>
						<Flex align='center' gap={2}>
							<Text
								fontWeight='bold'
								fontSize='xl'
								noOfLines={1}
								color={colors.headingText}
							>
								{user?.fullName || 'Unnamed'}
							</Text>
						</Flex>
						<Flex
							align='center'
							gap={2}
							fontSize='sm'
							color={colors.mutedText}
							mt={1}
						>
							<FaPhone size='0.8em' />
							<Text>{phoneNumber}</Text>
						</Flex>
					</Box>
				</Flex>
			</Flex>

			<Divider borderColor={colors.borderColor} my={3} />

			<Stack spacing={3} fontSize='sm' color={colors.bodyText} mb={4}>
				<Flex align='center' gap={3}>
					<Box color={colors.mutedText}>
						<FaBuilding size='1em' />
					</Box>
					<Text>
						<Text as='span' color={colors.mutedText}>
							Agency:{' '}
						</Text>
						{user?.agency?.name || 'N/A'}
					</Text>
				</Flex>
				<Flex align='center' gap={3}>
					<Box color={colors.mutedText}>
						<FaUserTie size='1em' />
					</Box>
					<Text>
						<Text as='span' color={colors.mutedText}>
							Role:{' '}
						</Text>
						{user?.roles?.[0]?.roleName || user?.role}
					</Text>
				</Flex>
				<Flex align='center' gap={3}>
					<Box color={colors.mutedText}>
						<FaCalendarAlt size='1em' />
					</Box>
					<Text>
						<Text as='span' color={colors.mutedText}>
							Created on:{' '}
						</Text>
						{formatPostDate(createdAt)}
					</Text>
				</Flex>
			</Stack>

			<Flex justify='space-between' align='center'>
				<Badge
					bg={isActive ? colors.badgeSuccessBg : colors.badgeErrorBg}
					color={isActive ? colors.badgeSuccessText : colors.badgeErrorText}
					px={3}
					py={1}
					rounded='full'
					fontSize='sm'
					fontWeight='medium'
				>
					{isActive ? 'Active' : 'Disabled'}
				</Badge>

				<Button
					leftIcon={<FaWhatsapp size='1.2em' />}
					bg={whatsappGreen}
					color='white'
					_hover={{ bg: whatsappDark, transform: 'scale(1.02)' }}
					_active={{ bg: whatsappDark }}
					size='sm'
					rounded='full'
					px={4}
					onClick={() => navigate(`/whatsapp/chats/${user?._id}`)}
					shadow='md'
				>
					WhatsApp Chat
				</Button>
			</Flex>
		</Box>
	);
};

export default WhatsappUserCard;