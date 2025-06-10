import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormLabel,
	Grid,
	GridItem,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Table,
	Tag,
	TagLabel,
	Tbody,
	Td,
	Tr,
	Text,
	Th,
	Thead,
	useColorModeValue,
	useDisclosure,
	IconButton,
	Select,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { DeleteIcon, AddIcon, ViewIcon } from '@chakra-ui/icons';
import Card from 'components/card/Card';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import Pagination from './Pagination';
import { FiFilter } from 'react-icons/fi';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomSearchInput from './Search';
import DataNotFound from 'components/notFoundData';
import Breadcrumb from './BreadCrumb';
import TableLoading from 'components/loading/TableLoading';
import Add from '../../../admin/developers/Add';
import Edit from 'views/admin/developers/Edit';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { buttonStyle } from 'utils/btn';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';

export default function CheckTable(props) {
	const {
		tableData,
		dataColumn,
		fetchData,
		isLoding,
		allData,
		access,
		setSearchedData,
		setDisplaySearchData,
		displaySearchData,
		selectedColumns,
		setSelectedColumns,
		dynamicColumns,
		setAction,
		action,
		dateTime,
		setDateTime,
		pageIndex,
		pageSize,
		totalItems,
		totalPages,
		currentPage,
		searchTerm,
		setSearchTerm,
		navigate,
		agencies,
		selectedAgency,
		setSelectedAgency,
		role,
		fetchAgencies,
	} = props;

	const textColor = useColorModeValue('gray.500', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

	const [selectedValues, setSelectedValues] = useState([]);
	const [getTagValues, setGetTagValues] = useState([]);
	// const [deleteModel, setDeleteModel] = useState(false);
	const [edit, setEdit] = useState(false);
	const [editData, setEditData] = useState({});

	const [advaceSearch, setAdvaceSearch] = useState(false);
	const [agencyFilterOpen, setAgencyFilterOpen] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const [manageColumns, setManageColumns] = useState(false);
	const [tempSelectedAgency, setTempSelectedAgency] = useState(selectedAgency);
	const [tempSelectedColumns, setTempSelectedColumns] =
		useState(selectedColumns);
	const [isInitialLoading, setIsInitialLoading] = useState(true);

	const {
		isOpen: isAddOpen,
		onOpen: onAddOpen,
		onClose: onAddClose,
	} = useDisclosure();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const incomingPayment = queryParams.get('incomingPayment');

	const columns = useMemo(() => dataColumn, [dataColumn]);
	const data = useMemo(() => tableData, [tableData]);

	const initialValues = {
		trn: '',
		developer_name: '',
	};

	const validationSchema = yup.object({
		trn: yup.string(),
		developer_name: yup.string(),
	});

	const handleClick = () => {
		onAddOpen();
	};

	useEffect(() => {
		if (incomingPayment) {
			onAddOpen();
		}
	}, []);

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const searchResult = allData?.filter(
				(item) =>
					(!values.trn || item.trn === values.trn) &&
					(!values.developer_name ||
						item.developer_name
							?.toLowerCase()
							.includes(values.developer_name.toLowerCase()))
			);
			const getValue = [values.trn, values.developer_name].filter(
				(value) => value
			);
			setGetTagValues(getValue);
			setSearchedData(searchResult);
			setDisplaySearchData(true);
			setAdvaceSearch(false);
		},
	});

	const {
		errors,
		touched,
		values,
		handleBlur,
		handleChange,
		handleSubmit,
		resetForm,
	} = formik;

	const handleCheckboxChange = (event, value) => {
		if (event.target.checked) {
			setSelectedValues((prev) => [...prev, value]);
		} else {
			setSelectedValues((prev) => prev.filter((v) => v !== value));
		}
	};

	const toggleColumnVisibility = (columnKey) => {
		const isColumnSelected = tempSelectedColumns.some(
			(col) => col.accessor === columnKey || col.id === columnKey
		);
		if (isColumnSelected) {
			setTempSelectedColumns((prev) =>
				prev.filter((col) => (col.accessor || col.id) !== columnKey)
			);
		} else {
			const columnToAdd = dynamicColumns.find(
				(col) => (col.accessor || col.id) === columnKey
			);
			setTempSelectedColumns((prev) => [...prev, columnToAdd]);
		}
	};

	const handlePageChange = (page) => {
		fetchData({ pageIndex: page - 1, pageSize });
	};

	const handlePageSizeChange = (e) => {
		const newSize = Number(e.target.value);
		fetchData({ pageIndex: 0, pageSize: newSize });
	};

	const handleRowClick = (developerId) => {
		navigate(`/invoice/developers/invoices/${developerId}`);
	};

	const handleAgencySelect = (agencyId) => {
		setSelectedAgency(agencyId); // Update state for UI consistency
		fetchData({ pageIndex: 0, pageSize, agency: agencyId }); // Pass agencyId directly
		setAgencyFilterOpen(false);
	};

	useEffect(() => {
		setIsInitialLoading(true);
		const timer = setTimeout(() => {
			setIsInitialLoading(false);
		}, 3000);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		fetchData({ pageIndex, pageSize });
	}, [pageIndex, pageSize]);

	// const breadcrumbItems = useMemo(
	// 	() => [{ label: 'Developers', path: '/invoice/developers' }],
	// 	[]
	// );

	const handleEditClose = () => {
		setEdit(false);
		setSelectedId(null);
		setEditData({});
	};

	console.log({ getTagValues, displaySearchData, searchTerm });

	return (
		<>
			{/* <Breadcrumb items={breadcrumbItems} /> */}
			<Card
				direction='column'
				w='100%'
				overflowX={{ sm: 'scroll', lg: 'hidden' }}
<<<<<<< HEAD
				marginTop={'-16px'}
				marginLeft={'-4px'}
				borderRadius={'0px'}
=======
				marginTop={"-16px"}
				marginLeft={"-4px"}
				borderRadius={"0px"}
>>>>>>> 201fe35d55bc8f86aac993a8703a86f4d50387b9
			>
				<Grid templateColumns='repeat(12, 1fr)' gap={2} p={4}>
					<GridItem
						colSpan={{ base: 12, md: 8 }}
						display='flex'
						alignItems='center'
					>
						<Flex
							alignItems={{ base: 'flex-start' }}
							flexWrap='wrap'
							direction={{ base: 'column', md: 'row' }}
							width='100%'
							gap={2}
						>
							<Text
								color={useColorModeValue('secondaryGray.900', 'white')}
								fontSize='22px'
								fontWeight='700'
								mb={{ base: 2, md: 0 }}
							>
								Developers (<CountUpComponent targetNumber={totalItems} />)
							</Text>
							<CustomSearchInput
								fetchData={fetchData}
								setDisplaySearchData={setDisplaySearchData}
								searchTerm={searchTerm}
								setSearchTerm={setSearchTerm}
								pageIndex={pageIndex}
								pageSize={pageSize}
								width={{ base: '100%', md: 'auto' }}
							/>
							{displaySearchData && searchTerm && (
								<Button
									variant='outline'
									size='sm'
									colorScheme='red'
									onClick={() => {
										setSearchTerm('');
										setDisplaySearchData(false);
										fetchData({ pageIndex: 0, pageSize, search: '' });
									}}
									mt={{ base: 2, md: 0 }}
								>
									Clear
								</Button>
							)}
							{/* {selectedValues.length > 0 && (
								<DeleteIcon
									cursor='pointer'
									onClick={() => setDeleteModel(true)}
									color='red'
									mt={{ base: 2 }}
									ms={{ base: 0, md: 2 }}
								/>
							)} */}
						</Flex>
					</GridItem>

					<GridItem
						colSpan={{ base: 12, md: 4 }}
						display='flex'
						justifyContent={{ base: 'center', md: 'end' }}
						alignItems='center'
						mt={{ base: 2, md: 0 }}
					>
						{/* {role === 'superAdmin' && (
							<IconButton
								icon={<FiFilter />}
								onClick={() => setAgencyFilterOpen(true)}
								aria-label='Filter Date'
								colorScheme='brand'
								variant='solid'
								size='sm'
								borderRadius='full'
								boxShadow='md'
							/>
						)} */}
						<Button
							onClick={handleClick}
							size='sm'
							w={{ base: '100%', sm: '140px', md: '128px' }}
							borderRadius='6px'
							h={{ base: '36px', md: '40px' }}
							bg='#B79045'
							color='white'
							leftIcon={<AddIcon />}
							ml={{ base: 0, md: 2 }}
							fontSize={{ base: '12px', md: '14px' }}
							py={{ base: '8px', md: '10px' }}
							_hover={{ bg: '#996F30' }}
							_active={{ bg: '#7A5625' }}
						>
							Add New
						</Button>
					</GridItem>
				</Grid>

				<Flex justifyContent='space-between' alignItems='center' mb={2} px={4}>
					<HStack spacing={4}>
						{getTagValues?.length > 0 &&
							getTagValues.map((item) => (
								<Tag
									size='md'
									p={2}
									key={item}
									borderRadius='full'
									variant='solid'
									colorScheme='gray'
								>
									<TagLabel>{item}</TagLabel>
								</Tag>
							))}
						{displaySearchData && searchTerm && (
							<Tag
								size='md'
								p={2}
								borderRadius='full'
								variant='solid'
								colorScheme='gray'
							>
								<TagLabel>{searchTerm}</TagLabel>
							</Tag>
						)}
						{selectedAgency && selectedAgency !== 'All' && (
							<Tag
								size='md'
								p={2}
								borderRadius='full'
								variant='solid'
								colorScheme='gray'
							>
								<TagLabel>
									{
										agencies.find((agency) => agency._id === selectedAgency)
											?.name
									}
								</TagLabel>
							</Tag>
						)}
					</HStack>
					{selectedAgency && selectedAgency !== 'All' && (
						<Button
							variant='outline'
							size='sm'
							colorScheme='red'
							onClick={() => {
								setDisplaySearchData(false);
								setSelectedAgency('All'); // Reset to "All"
								fetchData({ pageIndex: 0, pageSize, agency: 'All' }); // Fetch all data
							}}
						>
							Clear
						</Button>
					)}
				</Flex>

				<Box mb={2}>
					{totalItems > 0 && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
							totalItems={totalItems}
							itemsPerPage={pageSize}
							handlePageSize={handlePageSizeChange}
							refetching={isLoding}
							loading={isLoding}
						/>
					)}
				</Box>

				<Box
					height='70vh'
					overflowY='auto'
					scrollBehavior='smooth'
					borderRadius='md'
					boxShadow='sm'
					bg='white'
				>
					<Table variant='striped' color='gray.500' mb='24px'>
						<Thead
							position='sticky'
							top={0}
							bg='white'
							zIndex={2}
							boxShadow='0px 2px 8px rgba(0, 0, 0, 0.1)'
						>
							<Tr>
								{columns.map((column, index) => (
									<Th
										key={index}
										pe='10px'
										borderColor={borderColor}
										bg='#EDD199'
									>
										<Flex
											align='center'
											justifyContent={column.center ? 'center' : 'start'}
											fontSize={{ sm: '14px', lg: '16px' }}
											color='secondaryGray.900'
										>
											<span
												style={{
													textTransform: 'capitalize',
													marginRight: '8px',
												}}
											>
												{column.Header}
											</span>
										</Flex>
									</Th>
								))}
							</Tr>
						</Thead>
						<Tbody>
							{isLoding || isInitialLoading ? (
								<TableLoading columns={columns} length={10} py='4' />
							) : data?.length === 0 ? (
								<Tr>
									<Td colSpan={columns.length} textAlign='center'>
										<Text fontSize='md' color='gray.500'>
											No developers found.
										</Text>
									</Td>
								</Tr>
							) : (
								data.map((row, i) => (
									<Tr key={i}>
										{columns.map((column, index) => {
											let cellData = '';
											if (column.Header === 'Date') {
												const date = row.createdAt
													? new Date(row.createdAt)
													: null;
												cellData = (
													<Flex align='center'>
														{/* <Checkbox
                              colorScheme="brandScheme"
                              isChecked={selectedValues.includes(row._id)}
                              onChange={(e) => handleCheckboxChange(e, row._id)}
                              me="10px"
                            /> */}
														<Text color='brand.600' fontSize='sm' minW='180px'>
															{date
																? format(date, 'MMM d, yyyy h:mm a')
																: 'N/A'}
														</Text>
													</Flex>
												);
											} else if (column.Header === 'Developer') {
												cellData = (
													<Text
														fontSize='sm'
														fontWeight='700'
														color='blue.500'
														cursor='pointer'
														onClick={() => handleRowClick(row._id)}
														_hover={{ textDecoration: 'underline' }}
													>
														{row.developer_name || '-'}
													</Text>
												);
											} else if (column.Header === 'Trn') {
												cellData = (
													<Text fontSize='sm' fontWeight='700'>
														{row.trn || '-'}
													</Text>
												);
											} else if (column.Header === 'Email') {
												cellData = (
													<Text
														fontSize='sm'
														fontWeight='700'
														color='blue.500'
														cursor='pointer'
														onClick={() => handleRowClick(row._id)}
														_hover={{ textDecoration: 'underline' }}
													>
														{row.email || '-'}
													</Text>
												);
											} else if (column.Header === 'Agency') {
												cellData = (
													<Text fontSize='sm' fontWeight='700'>
														{row.agency?.name || 'N/A'}
													</Text>
												);
											} else if (column.Header === 'Address') {
												cellData = (
													<Text fontSize='sm' fontWeight='700'>
														{row.address || 'N/A'}
													</Text>
												);
											} else if (column.Header === 'Country') {
												cellData = (
													<Text fontSize='sm' fontWeight='700'>
														{row.country || 'N/A'}
													</Text>
												);
											} else if (column.Header === 'Status') {
												cellData = (
													<Text
														color={textColor}
														fontSize='sm'
														fontWeight='700'
													>
														{row.status || '-'}
													</Text>
												);
											} else if (column.Header === 'Action') {
												cellData = (
													<Flex justifyContent='center' gap={2}>
														<Link
															to={`/invoice/developers/invoices/${row?._id}`}
														>
															<Button
																{...buttonStyle}
																colorScheme='brand'
																_hover={{ bg: 'brand.400' }}
																_active={{ bg: 'brand.400' }}
															>
																Invoices
															</Button>
														</Link>

														<IconButton
															icon={<FaEdit />}
															size='sm'
															colorScheme='brand'
															aria-label='Edit'
															onClick={() => {
																setEdit(true);
																setSelectedId(row._id);
																setEditData(row);
															}}
														/>
													</Flex>
												);
											}
											return (
												<Td
													key={index}
													fontSize={{ sm: '14px' }}
													minW={{ sm: '150px', md: '200px', lg: 'auto' }}
													borderColor='transparent'
												>
													{cellData}
												</Td>
											);
										})}
									</Tr>
								))
							)}
						</Tbody>
					</Table>
				</Box>

				{/* Add New Modal */}
				{isAddOpen && (
					<Add
						isOpen={isAddOpen}
						onClose={onAddClose}
						fetchData={fetchData}
						pageIndex={pageIndex}
						pageSize={pageSize}
						setAction={setAction}
						refetch
					/>
				)}

				{edit && (
					<Edit
						isOpen={edit}
						setAction={setAction}
						onClose={handleEditClose}
						fetchData={fetchData}
						data={editData}
						setEdit={setEdit}
						selectedId={selectedId}
						pageIndex={pageIndex}
						pageSize={pageSize}
					/>
				)}

				{/* Advanced Search Modal */}
				{advaceSearch && (
					<Modal
						onClose={() => setAdvaceSearch(false)}
						isOpen={advaceSearch}
						isCentered
					>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>Advanced Search</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Grid templateColumns='repeat(12, 1fr)' gap={2}>
									<GridItem colSpan={{ base: 12, md: 6 }}>
										<FormLabel fontSize='sm' fontWeight='600'>
											TRN
										</FormLabel>
										<Input
											fontSize='sm'
											name='trn'
											value={values.trn}
											onChange={handleChange}
											onBlur={handleBlur}
											placeholder='Enter TRN'
										/>
									</GridItem>
									<GridItem colSpan={{ base: 12, md: 6 }}>
										<FormLabel fontSize='sm' fontWeight='600'>
											Developer Name
										</FormLabel>
										<Input
											fontSize='sm'
											name='developer_name'
											value={values.developer_name}
											onChange={handleChange}
											onBlur={handleBlur}
											placeholder='Enter Developer Name'
										/>
									</GridItem>
								</Grid>
							</ModalBody>
							<ModalFooter>
								<Button
									colorScheme='brand'
									size='sm'
									mr={2}
									onClick={handleSubmit}
								>
									Search
								</Button>
								<Button
									colorScheme='red'
									variant='outline'
									size='sm'
									onClick={() => resetForm()}
								>
									Clear
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				)}

				{/* Agency Filter Modal */}
				{agencyFilterOpen && (
					<Modal
						fontFamily="'DM Sans', sans-serif"
						onClose={() => setAgencyFilterOpen(false)}
						isOpen={agencyFilterOpen}
						isCentered
					>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>Agency Filter</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<FormLabel fontSize='sm' fontWeight='600'>
									Select Agency
								</FormLabel>
								<Select
									value={tempSelectedAgency}
									onChange={(e) => setTempSelectedAgency(e.target.value)}
									mb={4}
								>
									<option value='All'>All</option>
									{agencies.length > 0 ? (
										agencies.map((agency) => (
											<option key={agency._id} value={agency._id}>
												{agency.name}
											</option>
										))
									) : (
										<option disabled>No agencies available</option>
									)}
								</Select>
								{agencies.length === 0 && (
									<Text fontSize='sm' color='gray.500'>
										No agencies available at the moment.
									</Text>
								)}
							</ModalBody>
							<ModalFooter>
								<Button
									variant='outline'
									bg='#e2e8f0'
									size='md'
									w='100px'
									borderRadius='3px'
									mr={2}
									onClick={() => setAgencyFilterOpen(false)}
								>
									Close
								</Button>
								<Button
									bg='#d99a36'
									color='white'
									w='100px'
									borderRadius='3px'
									size='md'
									onClick={() => handleAgencySelect(tempSelectedAgency)}
								>
									Apply
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				)}

				{/* Manage Columns Modal */}
				{manageColumns && (
					<Modal
						onClose={() => setManageColumns(false)}
						isOpen={manageColumns}
						isCentered
					>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>Manage Columns</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								{dynamicColumns.map((column) => (
									<Text
										display='flex'
										key={column.accessor || column.id}
										py={2}
									>
										<Checkbox
											isChecked={tempSelectedColumns.some(
												(c) =>
													(c.accessor || c.id) ===
													(column.accessor || column.id)
											)}
											onChange={() =>
												toggleColumnVisibility(column.accessor || column.id)
											}
											pe={2}
										/>
										{column.Header}
									</Text>
								))}
							</ModalBody>
							<ModalFooter>
								<Button
									colorScheme='brand'
									size='sm'
									mr={2}
									onClick={() => {
										setSelectedColumns(tempSelectedColumns);
										setManageColumns(false);
									}}
								>
									Save
								</Button>
								<Button
									variant='outline'
									colorScheme='red'
									size='sm'
									onClick={() => setManageColumns(false)}
								>
									Close
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				)}
			</Card>
		</>
	);
}
