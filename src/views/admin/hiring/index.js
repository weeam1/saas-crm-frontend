import { Icon, SimpleGrid } from '@chakra-ui/react';
import { FaUserFriends, FaBriefcase, FaTasks } from 'react-icons/fa';
import IconBox from 'components/icons/IconBox';
import { useNavigate } from 'react-router-dom';
import MiniStatistics from 'components/card/MiniStatistics';
import { MdDashboard } from 'react-icons/md';

const Hiring = () => {
	const stats = [
		{ title: 'Candidates', total: 120, icon: FaUserFriends },
		// { title: "Jobs Posted", total: 45, icon: FaBriefcase },
		// { title: "Tasks Completed", total: 300, icon: FaTasks },
	];

	const navigate = useNavigate();

	return (
		<SimpleGrid columns={[1, 2, 3]} spacing={6} p={5}>
			{stats.map((stat, index) => (
				<MiniStatistics
					fontsize='md'
					onClick={() => navigate('/hiring/candidates')}
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg='linear-gradient(90deg, #D99A36 0%,rgb(221, 184, 92) 100%)'
							icon={<Icon w='28px' h='28px' as={MdDashboard} color='white' />} // Change icon here
						/>
					}
					name='Candidates'
				/>
			))}
		</SimpleGrid>
	);
};

export default Hiring;
