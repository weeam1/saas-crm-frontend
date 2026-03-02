import {
	Container,
	Grid,
	GridItem,
	Heading,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Button,
	Flex,
	useToast,
	Skeleton,
	Alert,
	Box,
	AlertIcon,
	IconButton,
	Text,
	useDisclosure,
	HStack,
} from '@chakra-ui/react';
import { ChevronRightIcon, EditIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import AvatarSection from './AvatarSection';
import SectionCard from './SectionCard';
import PersonalInfoSection from './PersonalInfoSection';
import WorkInfoSection from './WorkInfoSection';
import ParentTeamSection from './ParentTeamSection';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchItemsQuery } from 'api/apiSlice';
import { FiChevronLeft } from 'react-icons/fi';
import UserModal from '../AddUserModal';
import { usePermissions } from 'hooks/usePermissions';
import { FaUserShield } from 'react-icons/fa';

const UserDetailsPage = () => {
	const { id: userId } = useParams();

	const [showSkeleton, setShowSkeleton] = useState(true);
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	const { hasPermission } = usePermissions();

	const {
		data,
		isLoading,
		isFetching,
		error,
		refetch: refetchUser,
	} = useFetchItemsQuery(
		{
			path: `/v3/users/${userId}`,
		},
		{
			skip: !userId,
			refetchOnFocus: true,
			refetchOnMountOrArgChange: true,
		},
	);

	useEffect(() => {
		if (data?.doc) setUser(data?.doc);
	}, [data?.doc]);

	const {
		isOpen: userIsOpen,
		onClose: userOnClose,
		onOpen: userOpen,
	} = useDisclosure();

	const handleEditProfile = () => {
		userOpen();
	};

	useEffect(() => {
		if (isLoading || isFetching) {
			setShowSkeleton(true);
			return;
		}

		const timer = setTimeout(() => {
			setShowSkeleton(false);
		}, 500); // 1s minimum

		return () => clearTimeout(timer);
	}, [isLoading, isFetching]);

	if (showSkeleton) {
		return (
			<Box py={8}>
				<Grid templateColumns={{ base: '1fr' }} gap={6}>
					<Skeleton height='100px' />
					<Skeleton height='250px' />
					<Skeleton height='400px' />
					<Skeleton height='200px' />
				</Grid>
			</Box>
		);
	}

	if (error) {
		return (
			<Box py={8}>
				<Alert status='error' borderRadius='lg'>
					<AlertIcon />
					{error}
				</Alert>
			</Box>
		);
	}

	if (!user) {
		return (
			<Container maxW='container.xl' py={8}>
				<Alert status='warning' borderRadius='lg'>
					<AlertIcon />
					No user data found
				</Alert>
			</Container>
		);
	}

	return (
		<Box>
			{hasPermission('users') && (
				<IconButton
					aria-label='Go back'
					icon={<FiChevronLeft />}
					onClick={() => navigate(-1)}
					// variant='ghost'
					size='md'
					isRound
				/>
			)}

			{/* Header */}
			<Flex
				bg='white'
				shadow='sm'
				py={4}
				px={6}
				borderRadius='md'
				justify='space-between'
				align='center'
				mb={4}
				mt={2}
			>
				<Text
					fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
					fontWeight='bold'
					color='gray.800'
				>
					User Profile
				</Text>
				<HStack gap={2}>
					<Button
						onClick={() => navigate(`/users-v2/permissions/${userId}`)}
						size='sm'
						variant='outline'
						colorScheme='gray'
						borderWidth='1px'
						borderColor='gray.300'
						leftIcon={<FaUserShield />}
						_hover={{
							bg: 'gray.50',
							borderColor: 'gray.400',
						}}
						_active={{
							bg: 'gray.100',
						}}
					>
						Permissions
					</Button>
					<Button
						onClick={handleEditProfile}
						size='sm'
						variant='outline'
						colorScheme='gray'
						borderWidth='1px'
						borderColor='gray.300'
						leftIcon={<EditIcon />}
						_hover={{
							bg: 'gray.50',
							borderColor: 'gray.400',
						}}
						_active={{
							bg: 'gray.100',
						}}
					>
						Edit
					</Button>
				</HStack>
			</Flex>

			{/* Main Content Grid */}
			<Grid templateColumns={{ base: '1fr' }} gap={6}>
				{/* Left Column - Avatar */}
				<GridItem>
					<SectionCard>
						<AvatarSection user={user} refetchUser={refetchUser} />
					</SectionCard>
				</GridItem>

				{/* Right Column - Details */}
				<GridItem>
					<Grid templateRows='auto' gap={6}>
						{/* Statistics Section */}
						{/* <SectionCard title='Performance Statistics'>
							<StatsSection user={user} />
						</SectionCard> */}

						{/* Personal Information */}
						<SectionCard title='Personal Information'>
							<PersonalInfoSection user={user} />
						</SectionCard>

						{/* Work Information */}
						<SectionCard title='Work Information'>
							<WorkInfoSection user={user} />
						</SectionCard>

						{/* Parent/Team Leader Section - Only show if exists */}
						{(user.parent || user.teamLead) && (
							<SectionCard title='Reporting Structure'>
								<ParentTeamSection user={user} />
							</SectionCard>
						)}
					</Grid>
				</GridItem>
			</Grid>

			{userIsOpen && (
				<UserModal
					isOpen={userIsOpen}
					onClose={userOnClose}
					mode={'edit'}
					userData={user}
					refetchUser={refetchUser}
				/>
			)}
		</Box>
	);
};

export default UserDetailsPage;
