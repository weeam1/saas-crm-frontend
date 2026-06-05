// import {
// 	Table,
// 	Thead,
// 	Tbody,
// 	Tr,
// 	Th,
// 	Td,
// 	TableContainer,
// 	Icon,
// 	Button,
// 	HStack,
// } from '@chakra-ui/react';
import TableLoading from 'components/loading/TableLoading';
// import { FiEdit } from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom';

// const AgencyTable = ({ data, handleEdit, isLoading }) => {
// 	const navigate = useNavigate();

// 	const handleOfficeSettingsClick = (row) => {
// 		console.log({ row });
// 		navigate(`/office-settings/${row._id}`, {
// 			state: { agencyName: row.name, agencyId: row._id },
// 		});
// 	};

// 	const columns = [
// 		'S.No',
// 		'Name',
// 		'Location',
// 		'TRN',
// 		'Contact',
// 		'Alternate Contact',
// 		'Action',
// 	];

// 	return (
// 		<TableContainer>
// 			<Table variant='striped' size='md'>
// 				<Thead bg='brand.200'>
// 					<Tr>
// 						{columns.map((col, index) => (
// 							<Th key={index} color='gray.800'>
// 								{col}
// 							</Th>
// 						))}
// 					</Tr>
// 				</Thead>
// 				<Tbody>
// 					{isLoading ? (
// 						<TableLoading columns={columns} length={2} py='4' />
// 					) : data?.length > 0 ? (
// 						data?.map((row, i) => (
// 							<Tr key={row._id}>
// 								<Td>{++i}</Td>
// 								<Td>{row.name ?? 'N/A'}</Td>
// 								<Td>{row.location ?? 'N/A'}</Td>
// 								<Td>{row.TRN ?? 'N/A'}</Td>
// 								<Td>{row.contactNumberPrimary ?? 'N/A'}</Td>
// 								<Td>{row.contactNumberAlternate ?? 'N/A'}</Td>
// 								<Td onClick={() => handleEdit(row)}>
// 									<HStack>
// 										<Button
// 											bg='#EDD199'
// 											textAlign='center'
// 											borderRadius='5px'
// 											mr='2'
// 											onClick={() => handleOfficeSettingsClick(row)}
// 										>
// 											Office Setting
// 										</Button>
// 										<Icon
// 											as={FiEdit}
// 											boxSize={4}
// 											color='green.400'
// 											cursor='pointer'
// 										/>
// 									</HStack>
// 								</Td>
// 							</Tr>
// 						))
// 					) : (
// 						<Tr>
// 							<Td colSpan={5}>No data found!</Td>
// 						</Tr>
// 					)}
// 				</Tbody>
// 			</Table>
// 		</TableContainer>
// 	);
// };

// export default AgencyTable;

import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Icon,
	Button,
	HStack,
	Text,
	Box,
	Flex,
	Tooltip,
	Badge,
} from '@chakra-ui/react';
import { FiEdit, FiMapPin, FiPhone, FiFileText } from 'react-icons/fi';
import { MdOutlineSettings, MdBusiness } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import NoData from 'components/Message/NoData';

const AgencyTable = ({ data, handleEdit, isLoading }) => {
	const navigate = useNavigate();

	const handleOfficeSettingsClick = (row) => {
		navigate(`/office-settings/${row._id}`, {
			state: { agencyName: row.name, agencyId: row._id },
		});
	};

	const columns = useMemo(
		() => [
			{ key: 'sno', label: 'S.No', width: '70px' },
			{ key: 'name', label: 'Agency Name' },
			{ key: 'location', label: 'Location' },
			{ key: 'trn', label: 'TRN' },
			{ key: 'contact', label: 'Contact' },
			{ key: 'altContact', label: 'Alt Contact' },
			{ key: 'action', label: 'Action', width: '220px' },
		],
		[],
	);

	return (
		<Box
			bg='bg.surface'
			border='1px solid'
			borderColor='border.default'
			borderRadius='xl'
			overflow='hidden'
			boxShadow='card'
			minH='70vh'
		>
			<TableContainer>
				<Table variant='unstyled' size='md'>
					{/* Header */}
					<Thead>
						<Tr
							bg='bg.elevated'
							borderBottom='1px solid'
							borderColor='border.default'
						>
							{columns.map((col, index) => (
								<Th
									key={index}
									py='14px'
									px='5'
									fontSize='11px'
									fontWeight='700'
									letterSpacing='0.08em'
									textTransform='uppercase'
									color='gold.primary'
									borderBottom='none'
									whiteSpace='nowrap'
									width={col.width}
								>
									<HStack spacing={2}>
										{col.icon && <Icon as={col.icon} boxSize='12px' />}
										<Text>{col.label}</Text>
									</HStack>
								</Th>
							))}
						</Tr>
					</Thead>

					{/* Body */}
					<Tbody>
						{isLoading ? (
							<TableLoading columns={columns} length={5} py='4' />
						) : data?.length > 0 ? (
							data.map((row, i) => (
								<Tr
									key={row._id}
									borderBottom='1px solid'
									borderColor='border.subtle'
									transition='all 0.15s'
									_hover={{ bg: 'bg.elevated' }}
									_last={{ borderBottom: 'none' }}
								>
									{/* S.No */}
									<Td px='5' py='14px' borderBottom='none'>
										<Flex
											align='center'
											justify='center'
											w='28px'
											h='28px'
											borderRadius='md'
											bg='rgba(212,175,55,0.1)'
											border='1px solid'
											borderColor='rgba(212,175,55,0.2)'
										>
											<Text
												fontSize='12px'
												fontWeight='700'
												color='gold.primary'
											>
												{i + 1}
											</Text>
										</Flex>
									</Td>

									{/* Agency Name */}
									<Td px='5' py='14px' borderBottom='none'>
										<Text
											fontSize='14px'
											fontWeight='600'
											color='text.heading'
											noOfLines={1}
										>
											{row.name || 'N/A'}
										</Text>
									</Td>

									{/* Location */}
									<Td px='5' py='14px' borderBottom='none'>
										<Text fontSize='13px' color='text.body' noOfLines={1}>
											{row.location || 'N/A'}
										</Text>
									</Td>

									{/* TRN */}
									<Td px='5' py='14px' borderBottom='none'>
										<Text
											fontSize='12px'
											color='text.body'
											fontFamily='mono'
											letterSpacing='0.04em'
										>
											{row.TRN || 'N/A'}
										</Text>
									</Td>

									{/* Contact */}
									<Td px='5' py='14px' borderBottom='none'>
										<Flex align='center' gap={2}>
											<Icon as={FiPhone} boxSize='12px' color='green.400' />
											<Text fontSize='13px' color='text.body'>
												{row.contactNumberPrimary || 'N/A'}
											</Text>
										</Flex>
									</Td>

									{/* Alternate Contact */}
									<Td px='5' py='14px' borderBottom='none'>
										{row.contactNumberAlternate ? (
											<Flex align='center' gap={2}>
												<Icon as={FiPhone} boxSize='12px' color='text.muted' />
												<Text fontSize='13px' color='text.muted'>
													{row.contactNumberAlternate}
												</Text>
											</Flex>
										) : (
											<Text fontSize='13px' color='text.muted'>
												—
											</Text>
										)}
									</Td>

									{/* Actions */}
									<Td px='5' py='14px' borderBottom='none'>
										<HStack spacing='2'>
												<Button
													size='sm'
													onClick={(e) => {
														e.stopPropagation();
														handleOfficeSettingsClick(row);
													}}
													h='32px'
													variant='outline'
													px='3'
													fontSize='12px'
													fontWeight='600'

													leftIcon={
														<Icon as={MdOutlineSettings} boxSize='13px' />
													}
													
												>
													Office Settings
												</Button>

											<Tooltip label='Edit Agency' placement='top' hasArrow>
												<Flex
													align='center'
													justify='center'
													w='32px'
													h='32px'
													borderRadius='lg'
													border='1px solid'
													borderColor='border.default'
													bg='transparent'
													cursor='pointer'
													transition='all 0.15s'
													_hover={{
														bg: 'rgba(16,185,129,0.1)',
														borderColor: 'green.400',
														transform: 'translateY(-1px)',
													}}
													onClick={() => handleEdit(row)}
												>
													<Icon as={FiEdit} boxSize='14px' color='green.400' />
												</Flex>
											</Tooltip>
										</HStack>
									</Td>
								</Tr>
							))
						) : (
							// Empty State
							<Tr>
								<Td colSpan={columns.length} py={12}>
									<NoData label='agencies' />
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default AgencyTable;
