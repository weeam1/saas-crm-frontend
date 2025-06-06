import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Icon, Image } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import LeaderBoardIcon from '../../../../assets/img/survey/LeaderBoardIcon.png';

const NavigationLinks = () => {
	const navigate = useNavigate();
	const user = localStorage.getItem('user');
	const isAdmin = user ? JSON.parse(user).role === 'superAdmin' : false;

	return (
		<Flex direction='column' width='100%'>
			{/* Navigation Links */}
			<Flex
				gap={{ base: 2, md: 4, lg: 5 }}
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'center', sm: 'stretch' }}
				p='4'
			>
				{/* New Survey Card */}
				{isAdmin && (
					<Box
						bg='#FF5757'
						width={{ base: '80%', sm: '80px', md: '130px' }}
						height={{ base: '120px', sm: '80px', md: '130px' }}
						borderRadius='12px'
						cursor='pointer'
						position='relative'
						_hover={{ bg: '#FF7A7A' }}
						transition='background 0.2s ease'
						onClick={() => navigate('/survey/create-survey')}
					>
						<Flex
							direction='column'
							justify='center'
							align='center'
							height='100%'
							color='white'
						>
							<Icon
								as={FiPlus}
								boxSize={{ base: 6, md: 8 }}
								mb={2}
								bg='white'
								color='#FF5757'
								borderRadius='full'
								p='1'
							/>
							<Text fontSize={{ base: 'xs', md: 'xs' }} fontWeight='bold' textAlign={"center"}>
								New Survey
							</Text>
						</Flex>
					</Box>
				)}

				{/* Leaderboard Card */}
				<Box
					bg='#57FF5D'
					width={{ base: '80%', sm: '80px', md: '130px' }}
					height={{ base: '120px', sm: '80px', md: '130px' }}
					borderRadius='12px'
					cursor='pointer'
					position='relative'
					_hover={{ bg: '#7AFF7F' }}
					transition='background 0.2s ease'
					onClick={() => navigate('/survey/survey-leader-board')}
				>
					<Flex
						direction='column'
						justify='center'
						align='center'
						height='100%'
						color='white'
					>
						<Image
							src={LeaderBoardIcon}
							alt='LeaderBoardIcon'
							mb={2}
							boxSize={{ base: 6, md: 8 }}
						/>
						<Text fontSize={{ base: 'xs', md: 'xs' }} fontWeight='bold' textAlign={"center"}>
							Leader board
						</Text>
					</Flex>
				</Box>
			</Flex>
		</Flex>
	);
};

export default NavigationLinks;
