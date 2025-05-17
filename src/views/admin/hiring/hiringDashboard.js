import { Box, Button, Flex, Heading, Icon, SimpleGrid } from '@chakra-ui/react';
import { FaUserCheck, FaUsers } from 'react-icons/fa';
import IconBox from 'components/icons/IconBox';
import { useNavigate } from 'react-router-dom';
import MiniStatistics from 'components/card/MiniStatistics';
import { MdDashboard } from 'react-icons/md';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import RunningInterviews from './interview/RunningInterviews';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addPositions } from '../../../redux/positionsSlice';
import { IoSettings } from 'react-icons/io5';
const HiringDashboard = () => {
	const dispatch = useDispatch();

	const user = JSON.parse(localStorage.getItem('user'));

	const isAdmin = user?.role === 'superAdmin';
	const isManager = user?.roles[0]?.roleName === 'Manager';

	const { data, isLoading, refetch } = useFetchItemsQuery(
		{
			path: `/hiring/stats`,
		},
		{ refetchOnMountOrArgChange: true }
	);
	const { data: positionOptions, isLoading: positionsLoading } =
		useFetchItemsQuery(
			{
				path: `/positions/options`,
			},
			{ refetchOnMountOrArgChange: true }
		);

	useEffect(() => {
		if (!positionsLoading && positionOptions?.doc) {
			dispatch(addPositions(positionOptions?.doc));
		}
	}, [positionsLoading, positionOptions, dispatch]);

	const { data: runningInterviews, isLoading: interviewLoading } =
		useFetchItemsQuery(
			{
				path: `/interviews/running`,
			},
			{ refetchOnMountOrArgChange: true }
		);

	const stats = [
		{
			title: 'Candidates',
			total: data?.doc?.totalCandidates || 0,
			icon: MdDashboard,
			path: '/hiring/candidates',
		},
		{
			title: 'Short Listed',
			total: data?.doc?.totalShortListed || 0,
			icon: FaUsers,
			path: '/hiring/short-listed',
		},
		{
			title: 'Interviewed Candidates',
			total: data?.doc?.totalCompletedInterviews || 0,
			icon: FaUserCheck,
			path: '/hiring/interviewed-candidates',
		},
		// {
		// 	title: 'Running Interviews',
		// 	total: data?.doc?.totalRunningInterviews || 0,
		// 	icon: FaUserCheck,
		// 	path: '/hiring/running-interviews',
		// },
	];

	const filteredStats = isManager
		? stats.filter((stat) => stat.title === 'Short Listed')
		: stats;

	const navigate = useNavigate();

	return isLoading || interviewLoading ? (
		<Loader />
	) : (
		<Box>
			<Flex justifyContent='flex-end' alignItems='center'>
				{isAdmin && (
					<Button
						colorScheme='gray'
						borderRadius='5px'
						size={{ base: 'sm', md: 'md' }}
						px={{ base: 4, md: 6 }}
						py={{ base: 2, md: 3 }}
						fontSize={{ base: 'sm', md: 'md' }}
						leftIcon={<Icon as={IoSettings} boxSize={4} />}
						onClick={() => navigate('/hiring/settings')}
						mb={4}
					>
						Settings
					</Button>
				)}
			</Flex>

			<SimpleGrid columns={[1, 2, 3]} spacing={6} p={5}>
				{filteredStats.map((stat, index) => (
					<MiniStatistics
						key={index}
						fontsize='md'
						// onClick={() => navigate(stat.path)}
						startContent={
							<IconBox
								w='56px'
								h='56px'
								bg='linear-gradient(90deg, #D99A36 0%,rgb(221, 184, 92) 100%)'
								icon={<Icon w='28px' h='28px' as={stat.icon} color='white' />} // Change icon here
							/>
						}
						name={stat.title}
						value={stat.total || 0}
					/>
				))}
			</SimpleGrid>

			{runningInterviews?.total > 0 && (
				<RunningInterviews
					interviews={runningInterviews?.doc}
					totals={runningInterviews?.total}
				/>
			)}
		</Box>
	);
};

export default HiringDashboard;
