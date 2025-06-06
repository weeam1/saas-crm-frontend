import {
	Avatar,
	Box,
	Divider,
	Flex,
	Heading,
	Icon,
	SimpleGrid,
	Text,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react';
import Rating from 'components/shared/Rating';
import { FaLocationDot } from 'react-icons/fa6';
import { FiMail } from 'react-icons/fi';
import TeamProgress from './TeamProgress';
import { constant } from 'constant';

const TeamProfileCard = ({ data, teamPefomance }) => {
	const textColor = useColorModeValue('gray.700', 'gray.100');

	return (
		<Box
			bg='gray.100'
			p={{ base: 4, md: 6 }}
			mb={4}
			rounded='xl'
			boxShadow='sm'
			borderWidth='1px'
			borderColor='gray.100'
		>
			<Flex
				direction={{ base: 'column', md: 'row' }}
				align={{ base: 'center', md: 'flex-start' }}
				gap={6}
			>
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
					boxShadow='lg'
				/>

				<VStack align='start' spacing={3} flex={1} w='full'>
					<Box w='full'>
						<Heading size='lg' color={textColor} fontWeight='semibold' mb={2}>
							{data?.doc?.fullName || 'No name provided'}
						</Heading>

						<Divider borderColor='gray.300' mb={3} />

						<SimpleGrid
							columns={{ base: 1, md: 2 }}
							spacing={{ base: 3, md: 4 }}
							w='full'
							alignItems='center'
						>
							<Flex align='center' gap={3}>
								<Icon as={FiMail} boxSize={5} color='gray.500' />
								<Box>
									<Text fontSize='xs' color='gray.500' fontWeight='medium'>
										Email
									</Text>
									<Text fontSize='sm' isTruncated maxW='200px'>
										{data?.doc?.username || 'Not provided'}
									</Text>
								</Box>
							</Flex>

							<Flex align='center' gap={3}>
								<Icon as={FaLocationDot} boxSize={5} color='gray.500' />
								<Box>
									<Text fontSize='xs' color='gray.500' fontWeight='medium'>
										Agency
									</Text>
									<Text fontSize='sm' isTruncated maxW='200px'>
										{data?.doc?.agency?.name || 'Not assigned'}
									</Text>
								</Box>
							</Flex>

							<VStack mx='8' alignItems='flex-start'>
								<Text fontSize='xs' fontWeight='medium' color='gray.500'>
									Rating
								</Text>
								<Rating value={teamPefomance?.rating || 0} />
							</VStack>
							<TeamProgress score={teamPefomance?.score || 0} />
						</SimpleGrid>
					</Box>

					{/* <Box w={{ base: 'full', md: '50%' }} mt={4}>
						<Text fontSize='sm' fontWeight='medium' mb={2} color='gray.600'>
							Performance
						</Text>
						<VStack spacing={4} align='start'>
							<Rating value={teamPefomance?.rating || 0} />
							<TeamProgress score={teamPefomance?.score || 0} />
						</VStack>
					</Box> */}
				</VStack>
			</Flex>
		</Box>
	);
};

export default TeamProfileCard;
