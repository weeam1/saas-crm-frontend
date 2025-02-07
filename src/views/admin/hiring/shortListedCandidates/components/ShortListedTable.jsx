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
} from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import TableLoading from 'components/loading/TableLoading';
import MailIcon from './MailIcon';
import FlagBadge from '../../_components/FlagBadge';
import StatusBadge from 'components/shared/StatusBadge';

const ShortListedTable = ({
	headers,
	data,
	loading,
	isFetching,
	handleSort,
	sortConfig,
	handleViewCandidate,
	handleArrangeInterview,
}) => {
	return (
		<>
			<Box rounded='md' overflow='hidden'>
				<TableContainer
					maxHeight='500px' // Set a custom height for the container
					overflowY='auto' // Enable vertical scrolling
					overflowX='auto' // Optional: Enable horizontal scrolling
				>
					<Table variant='striped' size='md' width='100%'>
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
							) : data?.length > 0 ? (
								data?.map((item, index) => (
									<Tr key={index} fontSize='sm'>
										<Td minWidth='200px'>
											<HStack gap='1'>
												<span>{item.name}</span>
												<FlagBadge item={item} />
											</HStack>
										</Td>
										<Td minWidth='250px'>{item.email}</Td>
										<Td>{item.position.name}</Td>
										<Td>{item.phone}</Td>
										<Td>{item.whatsApp}</Td>
										<Td>{new Date(item.createdAt).toLocaleDateString()}</Td>
										{/* <Td>{item.nationality}</Td> */}
										<Td>
											<HStack
												gap='1'
												alignItems='center'
												justifyContent='space-between'
											>
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
												{item.isInterviewed ? (
													<StatusBadge
														status='Interviewed'
														color={'green'}
														size={4}
													/>
												) : (
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
														{item.interviewDate
															? 'Reschedule'
															: 'Arrange Interview'}
													</Button>
												)}

												{/* Mail Icon for accepting interview intive */}
												<MailIcon isRead={item.inviteAccepted} />
											</HStack>
										</Td>
									</Tr>
								))
							) : (
								!loading && (
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
								)
							)}
						</Tbody>
					</Table>
				</TableContainer>
			</Box>
		</>
	);
};

export default ShortListedTable;
