import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	IconButton,
	Box,
	Flex,
	Text,
	Button,
	HStack,
	Image,
	Tooltip,
} from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import TableLoading from 'components/loading/TableLoading';
import MailIcon from './MailIcon';
// import CandidateView from 'views/admin/hiring/candidates/components/CandidateView';

const ShortListedTable = ({
	headers,
	data,
	loading,
	handleSort,
	sortConfig,
	handleViewCandidate,
	handleArrangeInterview,
}) => {
	return (
		<>
			{/* Box:  transform='translate(-10px, -10px)' */}
			<Box rounded='md' overflow='hidden'>
				<TableContainer
					maxHeight='400px' // Set a custom height for the container
					overflowY='auto' // Enable vertical scrolling
					overflowX='auto' // Optional: Enable horizontal scrolling
				>
					<Table variant='striped' size='md'>
						<Thead position='sticky' top={0} bg='brand.200' zIndex={1} p='4'>
							<Tr>
								{headers.map((header) => (
									<Th
										key={header.key}
										textAlign='center'
										color='gray.800'
										width={header.width || '150px'}
									>
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
							{loading ? (
								<TableLoading columns={headers} length={8} />
							) : data.length ? (
								data?.map((item, index) => (
									<Tr key={index} fontSize='sm'>
										<Td>
											<HStack gap='1'>
												<span>{item.name}</span>

												{item.country?.flags?.png && (
													<Tooltip
														label={item.nationality}
														hasArrow
														cursor={'pointer'}
													>
														<Image
															rounded='sm'
															src={item.country?.flags.png}
															alt={item.country?.flags.alt}
															h='12px'
															fit='cover'
															shadow='md'
														/>
													</Tooltip>
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
											<HStack gap='1' alignItems='center'>
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
													onClick={() => handleViewCandidate(item._id)}
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
													onClick={() => handleArrangeInterview(item._id)}
												>
													Arrange Interview
												</Button>
												{/* Mail Icon for accepting interview intive */}
												<MailIcon isRead={item.inviteAccepted} />
											</HStack>
										</Td>
									</Tr>
								))
							) : (
								<Tr>
									<Td colSpan={headers.length}>
										<Text
											textAlign={'center'}
											width='100%'
											color='gray.500'
											fontSize='sm'
											fontWeight='600'
										>
											No data found
										</Text>
									</Td>
								</Tr>
							)}
						</Tbody>
					</Table>
				</TableContainer>
			</Box>
		</>
	);
};

export default ShortListedTable;
