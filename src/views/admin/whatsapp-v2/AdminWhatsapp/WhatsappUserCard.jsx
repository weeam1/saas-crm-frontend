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
	useColorModeValue,
	Button,
	FormControl,
	FormLabel,
	Switch,
} from '@chakra-ui/react';
import {
	FaWhatsapp,
	FaPhone,
	FaUserTie,
	FaBuilding,
	FaCalendarAlt,
	FaUser,
} from 'react-icons/fa';
import UserAvatar from 'components/shared/UserAvatar';
import { formatPostDate } from 'utils/helpers';
import { useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';

const WhatsappUserCard = ({ data }) => {
	const navigate = useNavigate();
	const { user, instanceName, isActive, createdAt } = data || {};

	// Color values based on color mode
	const cardBg = useColorModeValue('#dcf8c6', 'gray.800');
	const whatsappGreen = useColorModeValue('#25D366', '#128C7E');
	const borderColor = useColorModeValue('gray.200', 'gray.700');
	const hoverBorderColor = useColorModeValue('#25D366', '#128C7E');
	const textColor = useColorModeValue('gray.700', 'gray.300');
	const secondaryTextColor = useColorModeValue('gray.500', 'gray.400');

	const [updateInstance, { isLoading }] = useUpdateItemMutation();

	const updateInstanceStatus = async (val) => {
		try {
			await updateInstance({
				path: `/whatsapp/instances/status/${data?._id}`,
				body: { isActive: val },
			}).unwrap();

			toast.success(`Instance ${val ? 'enabled' : 'disabled'} successfully`);
		} catch (error) {
			toast.error('Failed to update instance status');
		}
	};
	return (
		<Box
			bg={cardBg}
			rounded='lg'
			p={5}
			borderWidth='1px'
			borderColor={borderColor}
			transition='all 0.3s ease'
			_hover={{
				transform: 'translateY(-2px)',
				shadow: 'lg',
				borderColor: hoverBorderColor,
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

			{/* Header with instance info + status toggle */}
			<Flex justify='space-between' align='flex-start' mb={4}>
				<Flex gap={4} align='center' flex='1'>
					<UserAvatar name={instanceName} size='md' />
					<Box flex='1' minW={0}>
						<Text
							fontWeight='bold'
							fontSize='xl'
							noOfLines={1}
							color={textColor}
						>
							{instanceName}
						</Text>
						<Flex
							align='center'
							gap={2}
							fontSize='sm'
							color={secondaryTextColor}
							mt={1}
						>
							<FaUser size='1em' />
							<Text>{user?.fullName}</Text>
						</Flex>
					</Box>
				</Flex>

				{/* Status Toggle */}
				<FormControl display='flex' alignItems='center' w='auto'>
					<FormLabel
						htmlFor={`status-${data?._id}`}
						mb='0'
						fontSize='sm'
						color={secondaryTextColor}
					>
						{isActive ? 'Active' : 'Disabled'}
					</FormLabel>
					<Switch
						id={`status-${data?._id}`}
						isChecked={isActive}
						onChange={(e) => updateInstanceStatus(e.target.checked ? 1 : 0)}
						colorScheme='whatsapp'
						size='md'
						isDisabled={isLoading}
						transition='all 0.2s ease'
					/>
				</FormControl>
			</Flex>

			<Divider borderColor={borderColor} my={3} />

			{/* Details */}
			<Stack spacing={3} fontSize='sm' color={textColor} mb={4}>
				<Flex align='center' gap={3}>
					<Box color={secondaryTextColor}>
						<FaUserTie size='1em' />
					</Box>
					<Text>
						<Text as='span' color={secondaryTextColor}>
							Role:{' '}
						</Text>
						{user?.roles?.[0]?.roleName || user?.role}
					</Text>
				</Flex>
				<Flex align='center' gap={3}>
					<Box color={secondaryTextColor}>
						<FaCalendarAlt size='1em' />
					</Box>
					<Text>
						<Text as='span' color={secondaryTextColor}>
							Member since:{' '}
						</Text>
						{formatPostDate(createdAt)}
					</Text>
				</Flex>
			</Stack>

			{/* Action Button */}
			<Flex justify='flex-end' align='center'>
				<Button
					leftIcon={<FaWhatsapp size='1.2em' />}
					colorScheme='whatsapp'
					bg={whatsappGreen}
					_hover={{ bg: whatsappGreen, transform: 'scale(1.02)' }}
					_active={{ bg: whatsappGreen }}
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
