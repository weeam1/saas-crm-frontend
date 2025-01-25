import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Skeleton,
	IconButton,
	Box,
	Flex,
	Text,
	Button,
	HStack,
	Image,
} from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
// import CandidateView from 'views/admin/hiring/candidates/components/CandidateView';

const ShortListedTable = ({
	headers,
	data,
	loading,
	handleSort,
	sortConfig,
	// handleViewCV,
	// handleDownloadCV,
}) => {
	return (
		<Box transform='translate(-10px, -10px)' rounded='md' overflow='hidden'>
			<TableContainer>
				<Table variant='striped' size='md'>
					<Thead position='sticky ' top={0} bg='brand.200' zIndex={1} p='4'>
						<Tr>
							{headers.map((header) => (
								<Th key={header.key} textAlign='center' color='gray.800'>
									<Flex align='center' justify='space-evenly' gap='4'>
										<Text textTransform='capitalize'>{header.label}</Text>
										{header.key !== 'action' && (
											<IconButton
												aria-label='Sort'
												size='xs'
												icon={
													sortConfig.key === header.key &&
													sortConfig.direction === 'asc' ? (
														<TriangleUpIcon />
													) : (
														<TriangleDownIcon />
													)
												}
												onClick={() => handleSort(header.key)}
												variant='ghost'
											/>
										)}
									</Flex>
								</Th>
							))}
						</Tr>
					</Thead>
					<Tbody>
						{loading
							? Array.from({ length: 5 }).map((_, index) => (
									<Tr key={index}>
										{headers.map((header, i) => (
											<Td key={i}>
												<Skeleton height='20px' />
											</Td>
										))}
									</Tr>
								))
							: data?.map((item, index) => (
									<Tr key={index} fontSize='sm'>
										<Td>
											<HStack gap='1'>
												<span>{item.name}</span>

												{item.country?.flags?.png && (
													<Flex
														alignItems='center'
														gap='1'
														fontSize='.8rem'
														fontWeight='semibold'
														color='gray.800'
													>
														{/* <FaLocationDot style={{ marginRight: '4px' }} /> */}
														<Image
															rounded='sm'
															src={item.country?.flags.png}
															alt={item.country?.flags.alt}
															h='12px'
															fit='cover'
															shadow='md'
														/>
													</Flex>
												)}
											</HStack>
										</Td>
										<Td>{item.email}</Td>
										<Td>{item.position}</Td>
										<Td>{item.phone}</Td>
										<Td>{item.whatsApp}</Td>
										<Td>{new Date(item.createdAt).toLocaleDateString()}</Td>
										{/* <Td>{item.nationality}</Td> */}
										<Td>
											<HStack gap='1'>
												<Button
													bg='#EDC270'
													color='gray.800'
													h='6'
													py='2'
													px='4'
													fontSize='xs'
													fontWeight='normal'
													shadow='sm'
													rounded='md'
													_hover={{ bg: '#E0B960' }}
													_active={{ bg: '#D4AC50' }}
													// onClick={handleViewCV}
												>
													View
												</Button>
												<Button
													bg='#EDC270'
													color='gray.800'
													h='6'
													py='2'
													px='4'
													fontSize='xs'
													fontWeight='normal'
													shadow='sm'
													rounded='md'
													_hover={{ bg: '#E0B960' }}
													_active={{ bg: '#D4AC50' }}
												>
													Arrange Interview
												</Button>
											</HStack>
										</Td>
									</Tr>
								))}
					</Tbody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default ShortListedTable;
