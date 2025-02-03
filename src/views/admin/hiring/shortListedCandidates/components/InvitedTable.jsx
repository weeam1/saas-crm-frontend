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
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';

const InvitedTable = ({
	headers,
	data,
	loading,
	handleSort,
	sortConfig,
	handleViewCandidate,
}) => {
	const naviagte = useNavigate();

	const user = JSON.parse(localStorage.getItem('user'));

	const [createItemMutation, { isLoading: startingInterview }] =
		useCreateItemMutation();

	const handleStartInterview = async (candidateId) => {
		try {
			const { data } = await createItemMutation({
				path: `/interviews`,
				body: {
					candidate: candidateId,
					leadInterviewer: user._id,
				},
			});

			if (data?.status === 'success') {
				naviagte(`/hiring/interview/${data?.doc._id}`);
				toast.success('Interview started...');
			}
		} catch (error) {
			console.log(error);
			toast.error(
				error.data.message || 'Interveiw not started.. due to some reason.'
			);
		}
	};
	return (
		<>
			{/* Box:  transform='translate(-10px, -10px)' */}
			<Box rounded='md' overflow='hidden'>
				<TableContainer
					maxHeight='500px' // Set a custom height for the container
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
										<Td>
											<HStack gap='1'>
												<span>{item.name}</span>
												<FlagBadge item={item} />
											</HStack>
										</Td>
										<Td>{item.email}</Td>
										<Td>{item.position}</Td>
										<Td>{item.phone}</Td>
										<Td>{item.whatsApp}</Td>
										<Td display='flex' alignItems='center' gap='2'>
											<p>
												{format(
													new Date(item.interviewDate),
													'EEE, MMM d, yyyy'
												)}
											</p>
											<p>{item.interviewTime}</p>
										</Td>
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
													onClick={() => handleStartInterview(item._id)}
												>
													{startingInterview ? 'Staring...' : 'Start Interview'}
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

export default InvitedTable;
