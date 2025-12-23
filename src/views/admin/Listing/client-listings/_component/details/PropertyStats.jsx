import {
	Stat,
	StatLabel,
	Box,
	StatHelpText,
	Progress,
	VStack,
	HStack,
	Icon,
} from '@chakra-ui/react';
import { FaStar, FaRegStar, FaChartLine, FaEye } from 'react-icons/fa';
import { formatPostDate } from 'utils/helpers';

const PropertyStats = ({ property }) => {
	return (
		<Box>
			<Box pb={0}>
				<Box fontWeight='semibold'>Property Statistics</Box>
			</Box>
			<Box>
				<VStack spacing={4} align='stretch'>
					<Stat>
						<HStack justify='space-between'>
							<StatLabel>Listing Score</StatLabel>
							<Box fontSize='lg'>8.5/10</Box>
						</HStack>
						<Progress value={85} colorScheme='green' size='sm' mt={2} />
						<StatHelpText>
							<Icon as={FaChartLine} mr={1} />
							Excellent listing quality
						</StatHelpText>
					</Stat>

					<Stat>
						<StatLabel>Days on Market</StatLabel>
						<Box fontSize='lg'>
							{Math.floor(
								(new Date() - new Date(property.createdAt)) /
									(1000 * 60 * 60 * 24)
							)}
						</Box>
						<StatHelpText>
							Since {formatPostDate(property.createdAt)}
						</StatHelpText>
					</Stat>

					<Box>
						<HStack justify='space-between' mb={2}>
							<Box fontSize='sm'>Completion Rate</Box>
							<Box fontSize='sm' fontWeight='bold'>
								92%
							</Box>
						</HStack>
						<Progress value={92} colorScheme='blue' size='sm' />
					</Box>

					<HStack justify='space-between'>
						<HStack>
							<Icon as={FaEye} color='gray.500' />
							<Box fontSize='sm'>Views: 245</Box>
						</HStack>
						<HStack>
							<Icon as={FaStar} color='yellow.400' />
							<Icon as={FaStar} color='yellow.400' />
							<Icon as={FaStar} color='yellow.400' />
							<Icon as={FaStar} color='yellow.400' />
							<Icon as={FaRegStar} color='gray.300' />
						</HStack>
					</HStack>
				</VStack>
			</Box>
		</Box>
	);
};

export default PropertyStats;
