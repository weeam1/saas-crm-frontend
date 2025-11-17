import React from 'react';
import {
	Box,
	VStack,
	HStack,
	Text,
	Avatar,
	useColorModeValue,
	Container,
	Flex,
	Badge,
	Divider,
} from '@chakra-ui/react';

// Manager Component
const ManagerNode = ({ manager }) => {
	const cardBg = useColorModeValue('blue.50', 'blue.900');
	const borderColor = useColorModeValue('blue.200', 'blue.600');

	return (
		<Box
			bg={cardBg}
			border='2px'
			borderColor={borderColor}
			shadow='lg'
			minW='300px'
		>
			<Box textAlign='center'>
				<VStack spacing={3}>
					{/* <Avatar size='lg' name={manager.managerName} bg='blue.500' /> */}
					<Box>
						<Text fontWeight='bold' fontSize='lg' color='blue.600'>
							{manager.managerName}
						</Text>
						<Text fontSize='sm' color='gray.600'>
							Manager
						</Text>
						<Text fontSize='xs' color='gray.500'>
							{manager.managerEmail}
						</Text>
					</Box>
					<Badge colorScheme='blue' variant='subtle'>
						Team Manager
					</Badge>
				</VStack>
			</Box>
		</Box>
	);
};

// Team Leader Component
const TeamLeaderNode = ({ teamLeader }) => {
	const cardBg = useColorModeValue('green.50', 'green.900');
	const borderColor = useColorModeValue('green.200', 'green.600');

	return (
		<Box
			bg={cardBg}
			border='2px'
			borderColor={borderColor}
			shadow='md'
			minW='280px'
		>
			<Box>
				<VStack spacing={2}>
					<HStack spacing={3} w='100%'>
						{/* <Avatar size='md' name={teamLeader.fullName} bg='green.500' /> */}
						<Box flex='1'>
							<Text fontWeight='bold'>{teamLeader.fullName}</Text>
							<Text fontSize='sm' color='gray.600'>
								Team Leader
							</Text>
							<Text fontSize='xs' color='gray.500' isTruncated>
								{teamLeader.username}
							</Text>
						</Box>
					</HStack>
					<Badge colorScheme='green' variant='subtle'>
						{teamLeader.agents?.length || 0} Agents
					</Badge>
				</VStack>
			</Box>
		</Box>
	);
};

// Agent Component
const AgentNode = ({ agent }) => {
	const cardBg = useColorModeValue('gray.50', 'gray.700');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	return (
		<Box
			bg={cardBg}
			border='1px'
			borderColor={borderColor}
			shadow='sm'
			p='2'
			minW='250px'
		>
			<Box>
				<HStack spacing={3}>
					{/* <Avatar size='sm' name={agent.fullName} bg='purple.500' /> */}
					<Box>
						<Text fontWeight='medium' fontSize='sm'>
							{agent.fullName}
						</Text>
						<Text fontSize='xs' color='gray.500' isTruncated>
							{agent.username}
						</Text>
					</Box>
				</HStack>
			</Box>
		</Box>
	);
};

// Direct Agents Component (Agents under Manager)
const DirectAgentsSection = ({ agents }) => {
	if (!agents || agents.length === 0) return null;

	return (
		<Box>
			<Text
				fontWeight='bold'
				color='gray.600'
				mb={3}
				textAlign='center'
				fontSize='sm'
			>
				Direct Agents Under Manager
			</Text>
			<VStack spacing={2}>
				{agents.map((agent) => (
					<AgentNode key={agent._id} agent={agent} />
				))}
			</VStack>
		</Box>
	);
};

// Connection Lines Component
const ConnectionLine = () => (
	<Box
		w='2px'
		bg='gray.300'
		h='40px'
		mx='auto'
		position='relative'
		_after={{
			content: '""',
			position: 'absolute',
			bottom: '-5px',
			left: '50%',
			transform: 'translateX(-50%)',
			width: '10px',
			height: '10px',
			bg: 'gray.400',
			borderRadius: '50%',
		}}
	/>
);

// Main Organizational Chart Component
const OrganizationalChart = ({ teamData }) => {
	const backgroundColor = useColorModeValue('gray.50', 'gray.900');

	return (
		<Box bg={backgroundColor} minH='100vh' py={8}>
			<Container maxW='6xl'>
				<VStack spacing={8}>
					{/* Header */}
					<Box textAlign='center'>
						<Text fontSize='3xl' fontWeight='bold' color='blue.600' mb={2}>
							Team Structure
						</Text>
						<Text color='gray.600'>
							Organizational hierarchy from Manager to Agents
						</Text>
					</Box>

					{/* Manager Level */}
					<VStack spacing={6}>
						<ManagerNode manager={teamData} />
						<ConnectionLine />
					</VStack>

					{/* Team Leaders and Direct Agents Container */}
					<Flex
						direction={{ base: 'column', lg: 'row' }}
						gap={8}
						align='flex-start'
						justify='center'
						w='100%'
					>
						{/* Direct Agents Section */}
						<Box flex='1' maxW={{ base: '100%', lg: '400px' }}>
							<DirectAgentsSection agents={teamData.agentsUnderManager} />
						</Box>

						{/* Team Leaders Section */}
						<Box flex='2'>
							<Text
								fontWeight='bold'
								color='gray.600'
								mb={4}
								textAlign='center'
								fontSize='lg'
							>
								Team Leaders & Their Agents
							</Text>

							<VStack spacing={8} align='stretch'>
								{teamData.teamLeaders.map((teamLeader) => (
									<Box key={teamLeader._id}>
										{/* Team Leader */}
										<Box textAlign='center' mb={4}>
											<TeamLeaderNode teamLeader={teamLeader} />
											<ConnectionLine />
										</Box>

										{/* Agents under Team Leader */}
										{teamLeader.agents && teamLeader.agents.length > 0 && (
											<Flex
												wrap='wrap'
												gap={4}
												justify='center'
												maxW='800px'
												mx='auto'
											>
												{teamLeader.agents.map((agent) => (
													<AgentNode key={agent._id} agent={agent} />
												))}
											</Flex>
										)}
									</Box>
								))}
							</VStack>
						</Box>
					</Flex>
				</VStack>
			</Container>
		</Box>
	);
};

export default OrganizationalChart;
