import { Badge, Box, Flex, Text } from '@chakra-ui/react';
import { formatPostDate } from 'utils/helpers';

// function formatDateTime(date) {
// 	const options = {
// 		day: '2-digit',
// 		month: 'long',
// 		year: 'numeric',
// 		hour: '2-digit',
// 		minute: '2-digit',
// 		second: '2-digit',
// 		hour12: false,
// 		timeZone: 'Asia/Dubai',
// 	};

// 	return date.toLocaleString('en-GB', options).replace(',', '');
// }

export default function LeadHistoryTimeline({ timelineData }) {
	return (
		<>
			{timelineData.map((item, index) => (
				<Flex
					key={index}
					pb={8}
					pl={8}
					py={2}
					borderLeft='2px solid'
					borderColor='border.subtle'
					alignItems='flex-start'
					position='relative'
					bg='bg.surface'
					// _hover={{ bg: 'gray.100' }}
					transition='all 0.2s'
				>
					{/* Timeline dot */}
					<Box
						w={6}
						h={6}
						bg={getStatusColor(item.type)}
						borderRadius='full'
						position='absolute'
						top={2}
						left={0}
						transform='translateX(-50%)'
						border='3px solid'
						borderColor='bg.surface'
						boxShadow='md'
					/>

					{/* Timeline content */}
					<Box flex={1} pr='2' py='1'>
						<Flex
							flexDir={{ base: 'column', md: 'row' }}
							justify='space-between'
							align={{ base: 'flex-start', md: 'center' }}
							mb={2}
						>
							<Badge
								colorScheme={getBadgeColor(item.type)}
								variant='subtle'
								borderRadius='md'
								shadow='sm'
								px={2}
								py={1}
								fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}
								textTransform='uppercase'
							>
								{getTypeLabel(item.type)}
							</Badge>
							<Text fontSize={{ base: '10px', md: 'sm' }} color='text.muted'>
								{formatPostDate(item?.updatedAt, 'Asia/Dubai')}
							</Text>
						</Flex>

						<Box
							bg='bg.elevated'
							p={{ base: 2, md: 4 }}
							borderRadius='lg'
							boxShadow='sm'
						>
							{[
								'assignment-manager',
								'assignment-team-lead',
								'assignment-agent',
							].includes(item.type) && (
								<Box>
									<Text fontSize={{ base: 'sm', md: 'md' }} mb={1} color='text.body'>
										{item.type === 'assignment-manager' ? '👔' : '👤'}{' '}
										<Text
											as='span'
											color={getStatusColor(item.type)}
											fontWeight='600'
										>
											{item?.updatedData || 'N/A'}
										</Text>
									</Text>
									<Text fontSize={{ base: 'xs', md: 'sm' }} color='text.muted'>
										By{' '}
										<Text as='span' color='text.accent'>
											{item?.updatedBy}
										</Text>
									</Text>
								</Box>
							)}
							{[
								'unassigned-manager',
								'unassigned-team-lead',
								'unassigned-agent',
							].includes(item.type) && (
								<Box>
									<Text fontSize={{ base: 'sm', md: 'md' }} mb={1} color='text.body'>
										♻️
										<Text
											as='span'
											color={getStatusColor(item.type)}
											fontWeight='600'
										>
											{item?.updatedData}
										</Text>
									</Text>
									<Text fontSize={{ base: 'xs', md: 'sm' }} color='text.muted'>
										By{' '}
										<Text as='span' color='text.accent'>
											{item?.updatedBy}
										</Text>
									</Text>
								</Box>
							)}

							{item.type === 'status' && (
								<Box>
									<Text fontSize={{ base: 'sm', md: 'md' }} mb={1} color='text.body'>
										🔄
										<Text
											as='span'
											color={getStatusColor(item.type)}
											fontWeight='600'
										>
											{item?.updatedData}
										</Text>
									</Text>
									<Text fontSize={{ base: 'xs', md: 'sm' }} color='text.muted'>
										By{' '}
										<Text as='span' color='text.accent'>
											{item?.updatedBy}
										</Text>
									</Text>
								</Box>
							)}

							{item.type === 'mStatus' && (
								<Box>
									<Text fontSize={{ base: 'sm', md: 'md' }} mb={1} color='text.body'>
										🔄
										<Text
											as='span'
											color={getStatusColor(item.type)}
											fontWeight='600'
										>
											{item?.updatedData}
										</Text>
									</Text>
									<Text fontSize={{ base: 'xs', md: 'sm' }} color='text.muted'>
										By{' '}
										<Text as='span' color='text.accent'>
											{item?.updatedBy}
										</Text>
									</Text>
								</Box>
							)}

							{item.type === 'lead-buy' && (
								<Box>
									<Text fontSize={{ base: 'sm', md: 'md' }} mb={1} color='text.body'>
										💰
										<Text
											as='span'
											color={getStatusColor(item.type)}
											fontWeight='600'
										>
											{item?.updatedData}
										</Text>
									</Text>
									<Text fontSize={{ base: 'xs', md: 'sm' }} color='text.muted'>
										By{' '}
										<Text as='span' color='text.accent'>
											{item?.updatedBy}
										</Text>
									</Text>
								</Box>
							)}
							{item.type === 'release' && (
								<Box>
									<Text fontSize={{ base: 'sm', md: 'md' }} mb={1} color='text.body'>
										🔓
										<Text
											as='span'
											color={getStatusColor(item.type)}
											fontWeight='600'
										>
											{`${item?.role} Release Lead`}
										</Text>
									</Text>
									<Text fontSize={{ base: 'xs', md: 'sm' }} color='text.muted'>
										By{' '}
										<Text as='span' color='text.accent'>
											{item?.updatedBy}
										</Text>
									</Text>
								</Box>
							)}

							{/* Dynamic content based on type */}
							{item.type === 'creation' && (
								<Text fontSize={{ base: 'sm', md: 'md' }} color='text.body'>
									🎯 <strong>Lead created</strong> by{' '}
									<Text
										as='span'
										color={getStatusColor(item.type)}
										fontWeight='600'
									>
										{item?.updatedBy}
									</Text>
								</Text>
							)}
						</Box>
					</Box>
				</Flex>
			))}
		</>
	);
}

// Helper functions (keep as is - these are for status colors)
const getStatusColor = (type) => {
	const colors = {
		creation: 'blue.500',
		'assignment-manager': 'teal.500',
		'assignment-team-lead': 'pink.500',
		'assignment-agent': 'cyan.500',
		status: 'purple.500',
		mStatus: 'brand.500',
		'lead-buy': 'green.500',
		release: 'red.500',
	};
	return colors[type] || 'gray.500';
};

const getBadgeColor = (type) => {
	const colors = {
		creation: 'blue',
		'assignment-manager': 'teal',
		'assignment-team-lead': 'pink',
		'assignment-agent': 'cyan',
		// 'unassigned-manager': 'gray',
		// 'unassigned-team-leader': 'gray',
		// 'unassigned-agent': 'gray',
		status: 'purple',
		mStatus: 'brand',
		'lead-buy': 'green',
		release: 'red',
	};
	return colors[type] || 'gray';
};

const getTypeLabel = (type) => {
	const labels = {
		creation: 'Created',
		release: 'Release',
		'assignment-manager': 'Manager Assigned',
		'unassigned-manager': 'Unassigned Manager',
		'assignment-team-lead': 'Team Lead Assigned',
		'unassigned-team-lead': 'Unassigned Team Lead',
		'assignment-agent': 'Agent Assigned',
		'unassigned-agent': 'Unassigned Agent',
		status: 'Status Changed',
		mStatus: 'M Status Changed',
		'lead-buy': 'Purchased',
	};
	return labels[type] || type;
};