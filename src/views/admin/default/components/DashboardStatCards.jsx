import React, { useMemo } from 'react';

import { Icon, SimpleGrid, Spinner, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import IconBox from 'components/icons/IconBox';
import MiniStatistics from 'components/card/MiniStatistics';
import { MdLeaderboard, MdPeople, MdCheckCircle } from 'react-icons/md';
import { PiBuildingsBold } from 'react-icons/pi';
import { FaUsers } from 'react-icons/fa';

const DashboardStatCards = ({ colorMode, stats }) => {
	// const user = JSON.parse(localStorage.getItem('user'));

	const navigate = useNavigate();
	const boxBg = useColorModeValue(
		'linear-gradient(90deg, #D99A36 0%, rgb(221, 184, 92) 100%)', // light mode
		'linear-gradient(90deg, #A36B12 0%, rgb(170, 126, 38) 100%)' // dark mode
	);
	const iconColor = useColorModeValue('white', '#f0e68c');
	const brandColor = useColorModeValue('brand.500', 'white');

	const cards = useMemo(
		() => [
			{
				label: 'Leads',
				value: stats.totalLeads || 0,
				icon: MdLeaderboard,
				route: '/lead',
			},
			{
				label: 'Users',
				value: stats.totalUsers || 0,
				icon: MdPeople,
				route: '/user',
			},
			// {
			// 	label: 'Interviewed',
			// 	value: stats.interviewedCandidates || 0,
			// 	icon: MdCheckCircle,
			// 	route: '/hiring/candidates',
			// },
			{
				label: 'Candidates',
				value: stats.totalCandidates || 0,
				icon: FaUsers,
				route: '/hiring/candidates',
			},
			{
				label: 'Developers',
				value: stats.totalDevelopers || 0,
				icon: PiBuildingsBold,
				route: '/invoice/developer',
			},
		],
		[stats]
	);

	return (
		<SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap='20px' mb='20px'>
			{cards.map(({ label, value, icon: SIcon, route }) => (
				<MiniStatistics
					key={label}
					onClick={() => navigate(route)}
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='28px' h='28px' as={SIcon} color={iconColor} />}
						/>
					}
					// active={colorMode === 'dark' ? true : false}
					name={label}
					value={value}
				/>
			))}

			{/* <MiniStatistics
				onClick={() => navigate('/lead')}
				startContent={
					<IconBox
						w='40px'
						h='40px'
						bg={boxBg}
						icon={
							<Icon w='20px' h='20px' as={MdLeaderboard} color={brandColor} />
						}
					/>
				}
				name='Leads'
				value={130}
			/> */}
		</SimpleGrid>
	);
};

export default DashboardStatCards;
