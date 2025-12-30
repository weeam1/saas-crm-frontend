import {
	Box,
	Avatar,
	IconButton,
	Flex,
	Text,
	Badge,
	HStack,
	VStack,
	useBreakpointValue,
	Tooltip,
	Image,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import { getImageUrl } from 'views/admin/Listing/client-listings/propertyUtils';
import { useSelector } from 'react-redux';

// import {
// 	Box,
// 	Flex,
// 	Avatar,
// 	Text,
// 	Badge,
// 	IconButton,
// 	VStack,
// 	HStack,
// 	useBreakpointValue,
// } from '@chakra-ui/react';
// import { EditIcon } from '@chakra-ui/icons';

const LG_IMAGE_BOX_SIZE = '250px';
const SM_IMAGE_BOX_SIZE = '200px';

const StatusBadge = ({ isOnline }) => {
	const color = isOnline ? 'green.500' : 'gray.400';
	const label = isOnline ? 'Online' : 'Offline';

	return (
		<Flex
			align='center'
			gap={2}
			px={3}
			py={1}
			borderRadius='full'
			bg={isOnline ? 'green.50' : 'gray.100'}
			border='1px solid'
			borderColor={isOnline ? 'green.200' : 'gray.300'}
			w='fit-content'
			position='relative'
		>
			{/* Dot */}
			<Box w='8px' h='8px' borderRadius='full' bg={color} position='relative'>
				{isOnline && (
					<Box
						position='absolute'
						inset={0}
						borderRadius='full'
						bg='green.400'
						animation='pulse 1.6s infinite'
						opacity={0.6}
						sx={{
							'@keyframes pulse': {
								'0%': { transform: 'scale(1)', opacity: 0.6 },
								'70%': { transform: 'scale(2)', opacity: 0 },
								'100%': { opacity: 0 },
							},
						}}
					/>
				)}
			</Box>

			<Text fontSize='xs' fontWeight='600' color={color}>
				{label}
			</Text>
		</Flex>
	);
};

const AvatarSection = ({ user, onEdit }) => {
	const hasImage = Boolean(user?.profileImage);

	const onlineUsers = useSelector((state) => state.onlineUsers);

	const isOnline = onlineUsers?.users?.includes(user?._id?.toString());

	return (
		<Box w='100%' position='relative'>
			<Flex
				w='100%'
				gap={6}
				align='center'
				flexDir={{ base: 'column', md: 'row' }}
			>
				{/* LEFT: Image / Avatar */}
				<Box
					position='relative'
					w={{ base: SM_IMAGE_BOX_SIZE, lg: LG_IMAGE_BOX_SIZE }}
					h={{ base: SM_IMAGE_BOX_SIZE, lg: LG_IMAGE_BOX_SIZE }}
					bg='gray.100'
					overflow='hidden'
					borderRadius='md'
					flexShrink={0}
				>
					{/* Edit Button */}
					<IconButton
						icon={<EditIcon />}
						position='absolute'
						top={3}
						right={3}
						zIndex={2}
						size='sm'
						colorScheme='gray'
						borderRadius='full'
						onClick={onEdit}
						shadow='md'
						aria-label='Edit profile'
					/>

					{hasImage ? (
						<Image
							src={getImageUrl(user.profileImage)}
							alt={user.fullName}
							w='100%'
							h='100%'
							objectFit='cover'
							fallback={
								<Avatar
									w='100%'
									h='100%'
									name={user.fullName}
									size='lg'
									borderRadius='md'
								/>
							}
						/>
					) : (
						<Avatar
							w='100%'
							h='100%'
							name={user.fullName}
							fontSize='5xl'
							borderRadius='md'
						/>
					)}
				</Box>

				{/* RIGHT: User Info */}
				<Flex flexDir='column' align={{ base: 'center', md: 'start' }} gap={3}>
					<Text
						fontSize={{ base: '2xl', md: '3xl' }}
						fontWeight='bold'
						color='gray.800'
					>
						{user.fullName}
					</Text>

					<Badge
						colorScheme='blue'
						w='fit-content'
						px={3}
						py={1}
						borderRadius='full'
					>
						{user.roles?.[0]?.roleName || 'User'}
					</Badge>

					<Badge
						colorScheme={user?.isActive ? 'green' : 'red'}
						variant='subtle'
						w='fit-content'
						px={3}
						py={1}
						borderRadius='full'
					>
						{user?.isActive ? 'Active' : 'Disabled'}
					</Badge>

					<StatusBadge isOnline={isOnline} />
					{/* 
					<Text fontSize='sm' color='gray.500'>
						Member since: {new Date(user?.createdAt).toLocaleDateString()}
					</Text> */}
				</Flex>
			</Flex>
		</Box>
	);
};

// const AvatarSection = ({ user, onEdit }) => {
// 	const statusColor = user.isActive ? 'green' : 'red';
// 	const onlineColor = user.isOnline ? 'green.400' : 'gray.400';

// 	return (
// 		<Box position='relative'>
// 			<Flex direction='column' align='center' position='relative'>
// 				{/* Edit Button */}
// 				<IconButton
// 					icon={<EditIcon />}
// 					position='absolute'
// 					top={2}
// 					right={2}
// 					zIndex={2}
// 					size='sm'
// 					colorScheme='green'
// 					borderRadius='full'
// 					onClick={onEdit}
// 					aria-label='Edit profile'
// 				/>

// 				{/* Avatar */}
// 				<Box position='relative' mb={4}>
// 					<Avatar
// 						size='2xl'
// 						name={`${user.firstName} ${user.lastName}`}
// 						src={getImageUrl(user?.profileImage)}
// 						bg='blue.500'
// 						color='white'
// 						fontSize='3xl'
// 					/>
// 					{/* Online Status Indicator */}
// 					<Box
// 						position='absolute'
// 						bottom={2}
// 						right={2}
// 						w={4}
// 						h={4}
// 						borderRadius='full'
// 						bg={onlineColor}
// 						border='2px solid white'
// 					/>
// 				</Box>

// 				{/* User Info */}
// 				<Text
// 					fontSize={{ base: 'lg', lg: 'xl', xl: '2xl' }}
// 					fontWeight='bold'
// 					color='gray.800'
// 				>
// 					{user.fullName}
// 				</Text>

// 				{/* Badges */}
// 				<Flex flexDir='column' gap={2} mb={3} align='center' justify='center'>
// 					<Badge
// 						colorScheme='blue'
// 						fontSize={{ base: 'xs', md: 'sm' }}
// 						px={3}
// 						py={1}
// 						borderRadius='full'
// 						w='fit-content'
// 					>
// 						{user.roles?.[0]?.roleName || 'User'}
// 					</Badge>
// 				</Flex>

// 				{/* Member Since */}
// 				<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500'>
// 					Member since: {new Date(user.createdAt).toLocaleDateString()}
// 				</Text>
// 			</Flex>
// 		</Box>
// 	);
// };

AvatarSection.propTypes = {
	user: PropTypes.object.isRequired,
	onEdit: PropTypes.func.isRequired,
};

export default AvatarSection;
