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
import FlagBadge from '../../_components/FlagBadge';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useCreateItemMutation } from 'api/apiSlice';

const InterviewedRoundTable = ({
	headers,
	data,
	loading,
	handleSort,
	sortConfig,
	handleViewCandidate,
	handleViewResult,
}) => {
	const user = JSON.parse(localStorage.getItem('user'));
	const navigate = useNavigate();

	const [createItemMutation, { isLoading: startingInterview }] =
		useCreateItemMutation();

	const handleStartInterview = async (interview) => {
		try {
			console.log({
				candidate: interview?.candidate?._id,
				interview: interview?._id,
			});
			const data = await createItemMutation({
				path: `/interviews/create-round`,
				body: {
					candidate: interview?.candidate?._id,
					interviewId: interview?._id,
				},
			}).unwrap();

			if (data?.status === 'success' && data?.doc?._id) {
				// navigate(`/hiring/interview/${data.doc._id}`);

				window.location.href = `/hiring/interview/${data.doc._id}`;
				toast.success('Interview started...');
			} else {
				toast.error('Invalid response from server.');
			}
		} catch (error) {
			console.log(error);
			toast.error(
				error?.data?.message || 'Interview not started, please try again.'
			);
		}
	};

	return (
		<>
			{/* Box:  transform='translate(-10px, -10px)' */}
			<Box rounded='md' overflow='hidden'>
				<TableContainer
					maxHeight='700px' // Set a custom height for the container
					overflowY='auto' // Enable vertical scrolling
					overflowX='auto' // Optional: Enable horizontal scrolling
				>
					<Table variant='striped' size='md'>
						<Thead position='sticky' top={0} bg='brand.200' zIndex={1} p='4'>
							<Tr>
								{headers?.map((header) => (
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
							) : data && data?.length ? (
								data?.map((item, index) => (
									<Tr key={index} fontSize='sm'>
										<Td minWidth='300px'>
											<HStack gap='1'>
												<span>{item.candidate.name}</span>
												<FlagBadge item={item.candidate} />
											</HStack>
										</Td>
										<Td minWidth='250px'>{item.candidate.email}</Td>
										<Td>{item?.agency?.name ?? 'N/A'}</Td>

										<Td>{item.position}</Td>
										<Td>{item.candidate.phone}</Td>
										<Td>{item.candidate.whatsApp}</Td>
										<Td>{item.jobType}</Td>
										<Td>
											{!item.remarks ? 'No Result' : `${item.percentageScore}%`}
										</Td>
										<Td>
											<HStack alignItems='center'>
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
													onClick={() =>
														handleViewCandidate(item.candidate._id)
													}
												>
													View
												</Button>

												<Button
													bg='#EDC270'
													color='gray.800'
													h='6'
													py='2'
													px='4'
													flex={1}
													fontSize='xs'
													fontWeight='normal'
													shadow='sm'
													rounded='md'
													_hover={{ bg: '#E0B960' }}
													_active={{ bg: '#D4AC50' }}
													onClick={() => handleViewResult(item)}
												>
													Submit Result
												</Button>

												{item?.remarks && (
													<Button
														bg='#EDC270'
														color='gray.800'
														h='6'
														py='2'
														px='4'
														flex={1}
														fontSize='xs'
														fontWeight='normal'
														shadow='sm'
														rounded='md'
														_hover={{ bg: '#E0B960' }}
														_active={{ bg: '#D4AC50' }}
														onClick={() => handleStartInterview(item)}
													>
														Start Interview
													</Button>
												)}
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

export default InterviewedRoundTable;
