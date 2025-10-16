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
			{/* {timelineData.map((item) => {
				return (
					<Flex
						pb={8}
						pl={8}
						borderLeft={'2px solid grey'}
						alignItems={'center'}
						flexDir={'row'}
						position={'relative'}
					>
						<Box>
							<Text color={'#858585'}>
								{formatPostDate(item?.updatedAt, 'Asia/Dubai')}
							</Text>
							{item?.type === 'creation' && (
								<Text color={'black'} fontSize={18} mb={3}>
									Lead created by
									<strong> {item?.updatedBy}</strong>
								</Text>
							)}
							{item?.type === 'assignment-manager' && (
								<div>
									<Text color={'black'} fontSize={18} mb={1}>
										Lead assigned to manager:
										<strong>
											{' '}
											<u>{item?.updatedData}</u>
										</strong>
									</Text>
									<Box display={'flex'} alignItems='center' fontSize={12}>
										<Text mr={1}>By</Text>{' '}
										<Text color={'brand.500'}>{item?.updatedBy}</Text>
									</Box>
								</div>
							)}

							{item?.type === 'assignment-agent' && (
								<div>
									<Text color={'black'} fontSize={18} mb={1}>
										Lead assigned to agent:
										<strong>
											<u>{item?.updatedData}</u>
										</strong>
									</Text>
									<Box display={'flex'} alignItems='center' fontSize={12}>
										<Text mr={1}>By</Text>{' '}
										<Text color={'brand.500'}>{item?.updatedBy}</Text>
									</Box>
								</div>
							)}

							{item?.type === 'status' && (
								<div>
									<Text color={'black'} fontSize={18} mb={1}>
										Status changed to:
										<strong>
											{' '}
											<u>{item?.updatedData}</u>
										</strong>
									</Text>
									<Box display={'flex'} alignItems='center' fontSize={12}>
										<Text mr={1}>By</Text>{' '}
										<Text color={'brand.500'}>{item?.updatedBy}</Text>
									</Box>
								</div>
							)}

							{item?.type === 'lead-buy' && (
								<div>
									<Text color={'black'} fontSize={18} mb={1}>
										Lead purchased by:
										<strong>
											<u>{item?.updatedData}</u>
										</strong>
									</Text>
									<Box display={'flex'} alignItems='center' fontSize={12}>
										<Text mr={1}>By</Text>{' '}
										<Text color={'brand.500'}>{item?.updatedBy}</Text>
									</Box>
								</div>
							)}
						</Box>
						<Box
							width={30}
							height={30}
							bg={'#1f7eeb'}
							borderRadius={'9999'}
							position={'absolute'}
							top={0}
							transform={'translateX(-53%)'}
							left={'0'}
						></Box>
					</Flex>
				);
			})} */}

			{timelineData.map((item, index) => (
				<Flex
					key={index}
					pb={8}
					pl={8}
					py={2}
					borderLeft='2px solid'
					borderColor='gray.200'
					alignItems='flex-start'
					position='relative'
					bg='whitesmoke'
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
						border='3px solid white'
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
							<Text fontSize={{ base: '10px', md: 'sm' }} color='gray.500'>
								{formatPostDate(item?.updatedAt, 'Asia/Dubai')}
							</Text>
						</Flex>

						<Box
							bg='white'
							p={{ base: 2, md: 4 }}
							borderRadius='lg'
							boxShadow='sm'
						>
							{(item.type === 'assignment-manager' ||
								item.type === 'assignment-agent') && (
								<Box>
									<Text fontSize={{ base: 'sm', md: 'md' }} mb={1}>
										{item.type === 'assignment-manager' ? '👔' : '👤'}{' '}
										<Text as='span' color='teal.500' fontWeight='600'>
											{item?.updatedData}
										</Text>
									</Text>
									<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500'>
										By{' '}
										<Text as='span' color='brand.500'>
											{item?.updatedBy}
										</Text>
									</Text>
								</Box>
							)}

							{item.type === 'status' && (
								<Box>
									<Text fontSize={{ base: 'sm', md: 'md' }} mb={1}>
										🔄
										<Text as='span' color='purple.500' fontWeight='600'>
											{item?.updatedData}
										</Text>
									</Text>
									<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500'>
										By{' '}
										<Text as='span' color='brand.500'>
											{item?.updatedBy}
										</Text>
									</Text>
								</Box>
							)}

							{item.type === 'mStatus' && (
								<Box>
									<Text fontSize={{ base: 'sm', md: 'md' }} mb={1}>
										🔄
										<Text as='span' color='brand.500' fontWeight='600'>
											{item?.updatedData}
										</Text>
									</Text>
									<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500'>
										By{' '}
										<Text as='span' color='brand.500'>
											{item?.updatedBy}
										</Text>
									</Text>
								</Box>
							)}

							{item.type === 'lead-buy' && (
								<Box>
									<Text fontSize={{ base: 'sm', md: 'md' }} mb={1}>
										💰
										<Text as='span' color='green.500' fontWeight='600'>
											{item?.updatedData}
										</Text>
									</Text>
									<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500'>
										By{' '}
										<Text as='span' color='brand.500'>
											{item?.updatedBy}
										</Text>
									</Text>
								</Box>
							)}
							{item.type === 'release' && (
								<Box>
									<Text fontSize={{ base: 'sm', md: 'md' }} mb={1}>
										🔓
										<Text as='span' color='red.500' fontWeight='600'>
											{`${item?.role} Release Lead`}
										</Text>
									</Text>
									<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500'>
										By{' '}
										<Text as='span' color='brand.500'>
											{item?.updatedBy}
										</Text>
									</Text>
								</Box>
							)}

							{/* Dynamic content based on type */}
							{item.type === 'creation' && (
								<Text fontSize={{ base: 'sm', md: 'md' }}>
									🎯 <strong>Lead created</strong> by{' '}
									<Text as='span' color='blue.500' fontWeight='600'>
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

// Helper functions
const getStatusColor = (type) => {
	const colors = {
		creation: 'blue.500',
		'assignment-manager': 'teal.500',
		'assignment-agent': 'cyan.500',
		status: 'purple.500',
		mStatus: 'brand.500',
		'lead-buy': 'green.500',
	};
	return colors[type] || 'gray.500';
};

const getBadgeColor = (type) => {
	const colors = {
		creation: 'blue',
		'assignment-manager': 'teal',
		'assignment-agent': 'cyan',
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
		'assignment-agent': 'Agent Assigned',
		status: 'Status Changed',
		mStatus: 'M Status Changed',
		'lead-buy': 'Purchased',
	};
	return labels[type] || type;
};
