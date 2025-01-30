import { Box, Heading, Icon, SimpleGrid, Spinner } from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';
import IconBox from 'components/icons/IconBox';
import { useNavigate } from 'react-router-dom';
import MiniStatistics from 'components/card/MiniStatistics';
import { MdDashboard } from 'react-icons/md';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';

const Hiring = () => {
	const { data: allShortListed, isLoading: shortListedLoading } =
		useFetchItemsQuery({
			path: `/applications/short-listed`,
		});

	const { data: allApplications, isLoading: applicationLoading } =
		useFetchItemsQuery({
			path: `/applications`,
		});

	const stats = [
		{
			title: 'Candidates',
			total: allApplications?.totalDocs || 0,
			icon: MdDashboard,
			path: '/hiring/candidates',
		},
		{
			title: 'Short Listed',
			total: allShortListed?.totalDocs || 0,
			icon: FaUsers,
			path: '/hiring/short-listed',
		},
		// { title: "Tasks Completed", total: 300, icon: FaTasks },
	];

	const navigate = useNavigate();

	return applicationLoading || shortListedLoading ? (
		<Loader />
	) : (
		<Box>
			<Heading px={5} size='lg' color='gray.800'>
				Hiring
			</Heading>

			<SimpleGrid columns={[1, 2, 3]} spacing={6} p={5}>
				{stats.map((stat, index) => (
					<MiniStatistics
						key={index}
						fontsize='md'
						onClick={() => navigate(stat.path)}
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
		</Box>
	);
};

export default Hiring;
