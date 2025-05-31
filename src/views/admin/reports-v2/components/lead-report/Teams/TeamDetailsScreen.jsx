import { useNavigate, useParams } from 'react-router-dom';
import {
	Avatar,
	Box,
	Flex,
	Grid,
	Heading,
	HStack,
	Icon,
	Image,
	Text,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react';

import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import { TeamStatsOverview } from './TeamStatsOverview';
import { FaChevronLeft } from 'react-icons/fa';
import AppButton from 'components/shared/AppButton';
import { constant } from 'constant';
import TopAgents from './TopAgentsByLeads';
import TopAgentsByLeads from './TopAgentsByLeads';
import TopAgentsByNotes from './TopAgentsByNotes';
import { FiBriefcase, FiMail } from 'react-icons/fi';

const TeamDetailsScreen = () => {
	const { id } = useParams();

	const { data, isLoading, error } = useFetchItemsQuery({
		path: `/v2/reporting/team_details`,
		params: { managerId: id },
	});

	// if (error) {
	// 	toast({
	// 		title: 'Error loading team data',
	// 		status: 'error',
	// 		isClosable: true,
	// 	});
	// }

	const textColor = useColorModeValue('gray.700', 'gray.100');

	const navigate = useNavigate();

	return (
		<Box p={6} bg='white' rounded='xl' shadow='sm'>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<AppButton
						leftIcon={<FaChevronLeft />}
						onClick={() => navigate('/reporting-analytics')}
						mb='4'
					>
						Back
					</AppButton>

					<Heading mb={8} fontSize='2xl'>
						{data?.doc?.fullName}'s Team Overview
					</Heading>

					{/* Manager Details */}
					{/* Manager Details - Enhanced */}
					<Box
						bg='softGray.100'
						p='4'
						mb='4'
						rounded='lg'
						borderWidth='1px'
						borderColor='gray.200'
						boxShadow='sm'
					>
						<Flex align='center' gap={4}>
							<Avatar
								src={
									data?.doc?.profileImage
										? `${constant.baseUrl}${data?.doc.profileImage}`
										: ''
								}
								name={data?.doc?.fullName}
								size='xl'
								borderWidth='2px'
								borderColor='brand.400'
								boxShadow='md'
							/>

							<VStack align='start' flex='1'>
								<Heading size='sm' color={textColor} isTruncated maxW='100%'>
									{data?.doc?.fullName || 'No name provided'}
								</Heading>

								<HStack spacing={3} color='gray.500' w='full'>
									<Flex align='center' gap={2}>
										<Icon as={FiMail} boxSize={4} />
										<Text
											fontSize={{ base: 'xs', md: 'sm' }}
											isTruncated
											maxW={{ base: '150px', md: '200px' }}
										>
											@{data?.doc?.username || 'username'}
										</Text>
									</Flex>

									<Flex align='center' gap={2}>
										<Icon as={FiBriefcase} boxSize={4} />
										<Text
											fontSize={{ base: 'xs', md: 'sm' }}
											isTruncated
											maxW={{ base: '150px', md: '200px' }}
										>
											{data?.doc?.agency?.name || 'No agency'}
										</Text>
									</Flex>
								</HStack>
							</VStack>
						</Flex>
					</Box>

					{/* Overview Cards */}
					<Grid
						templateColumns='repeat(auto-fit, minmax(250px, 1fr))'
						gap={6}
						mb={8}
					>
						<TeamStatsOverview data={data?.doc} />
					</Grid>

					{/* Main Content Area */}
					<Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
						<TopAgentsByLeads agents={data?.doc?.agents} />
						<TopAgentsByNotes agents={data?.doc?.agents} />

						{/* <Box>
							<LeadStatusChart statusStats={data?.statusStats} mb={8} />
							<ActivityTimeline teamId={id} />
						</Box> */}
					</Grid>
				</>
			)}
		</Box>
	);
};

export default TeamDetailsScreen;
