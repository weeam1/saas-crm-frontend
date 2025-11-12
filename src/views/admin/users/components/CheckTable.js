import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormLabel,
	Grid,
	GridItem,
	HStack,
	Icon,
	IconButton,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Portal,
	Table,
	Tag,
	TagLabel,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr,
	useClipboard,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import {
	useGlobalFilter,
	usePagination,
	useSortBy,
	useTable,
} from 'react-table';

// Custom components
import {
	AddIcon,
	CopyIcon,
	DeleteIcon,
	EditIcon,
	SearchIcon,
	ViewIcon,
} from '@chakra-ui/icons';
import Card from 'components/card/Card';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import Pagination from 'components/pagination/Pagination';
import Spinner from 'components/spinner/Spinner';
import { FaCoins, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Delete from '../Delete';
import AddUser from '../Add';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { CiMenuKebab } from 'react-icons/ci';
import { IoIosArrowBack } from 'react-icons/io';
import Edit from '../Edit';
import DataNotFound from 'components/notFoundData';
import CustomSearchInput from 'components/search/search';
import CopyID from './CopyID';
import AddCoinsModal from '../AddCoinsModal';
import RemoveCoinsModal from '../RemoveCoinsModal';
import StatusToggle from './StatusToogle';
import TableLoading from 'components/loading/TableLoading';
import { formatCurrency } from 'utils/helpers';
import { BsCircleFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import useUserSession from 'hooks/useUserSession';
import TopSearch from './TopSearch';
import SearchTags from 'components/search/SearchTags';

export default function CheckTable(props) {
	// const { columnsData, action, setAction } = props;
	const {
		columnsData,
		tableData,
		fetchData,
		dataColumn,
		isLoding,
		allData,
		setSearchedData,
		setDisplaySearchData,
		displaySearchData,
		selectedColumns,
		setSelectedColumns,
		dynamicColumns,
		setDynamicColumns,
		setAction,
		setData,
		action,
	} = props;

	const { user, isSuperAdmin } = useUserSession();

	const textColor = useColorModeValue('gray.500', 'white');
	const bgColor = useColorModeValue('white', 'gray.800');
	const headerBg = useColorModeValue('brand.300', 'brand.100');
	const headerText = useColorModeValue('brand.700', 'brand.900');
	const footerBg = useColorModeValue('gray.50', 'gray.700');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	// const columns = useMemo(() => columnsData, [columnsData]);
	const columns = useMemo(() => dataColumn, [dataColumn]);
	const data = useMemo(() => tableData, [tableData]);

	const [selectedValues, setSelectedValues] = useState([]);
	const [deleteModel, setDelete] = useState(false);
	const [gopageValue, setGopageValue] = useState();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [advaceSearch, setAdvaceSearch] = useState(false);
	const [addCoinsModal, setAddCoinsModal] = useState({
		user: null,
		isOpen: false,
	});
	const [removeCoinsModal, setRemoveCoinsModal] = useState({
		user: null,
		isOpen: false,
	});
	const [searchClear, setSearchClear] = useState(false);
	const [searchbox, setSearchbox] = useState('');
	const [manageColumns, setManageColumns] = useState(false);
	const [tempSelectedColumns, setTempSelectedColumns] = useState(dataColumn);
	const [getTagValues, setGetTagValues] = useState([]);
	const [edit, setEdit] = useState(false);
	const [selectedId, setSelectedId] = useState();
	const [editData, setEditData] = useState({});
	const navigate = useNavigate();
	const [column, setColumn] = useState('');
	const [filters, setFilters] = useState({});

	const [tableLoading, setTableLoading] = useState(true);

	const [topLevelSearch, setTopLevelSearch] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setTableLoading(false);
		}, 1500);

		return () => clearTimeout(timeout);
	}, []);

	let isColumnSelected;
	const toggleColumnVisibility = (columnKey) => {
		setColumn(columnKey);

		isColumnSelected = tempSelectedColumns?.some(
			(column) => column?.accessor === columnKey
		);

		if (isColumnSelected) {
			const updatedColumns = tempSelectedColumns?.filter(
				(column) => column?.accessor !== columnKey
			);
			setTempSelectedColumns(updatedColumns);
		} else {
			const columnToAdd = dynamicColumns?.find(
				(column) => column?.accessor === columnKey
			);
			setTempSelectedColumns([...tempSelectedColumns, columnToAdd]);
		}
	};
	const handleColumnClear = () => {
		isColumnSelected = selectedColumns?.some(
			(selectedColumn) => selectedColumn?.accessor === column?.accessor
		);
		setTempSelectedColumns(dynamicColumns);
		setManageColumns(!manageColumns ? !manageColumns : false);
	};
	const initialValues = {
		firstName: '',
		username: '',
		lastName: '',
	};
	const validationSchema = yup.object({
		firstName: yup.string(),
		username: yup.string().email('User Email is invalid'),
		lastName: yup.string(),
	});
	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit: (values, { resetForm }) => {
			const searchResult = allData?.filter(
				(item) =>
					(!values?.firstName ||
						(item?.firstName &&
							item?.firstName
								.toLowerCase()
								.includes(values?.firstName?.toLowerCase()))) &&
					(!values?.username ||
						(item?.username &&
							item?.username
								.toLowerCase()
								.includes(values?.username?.toLowerCase()))) &&
					(!values?.lastName ||
						(item?.lastName &&
							item?.lastName
								.toLowerCase()
								.includes(values?.lastName?.toLowerCase())))
			);
			let getValue = [
				values.firstName,
				values?.username,
				values?.lastName,
			].filter((value) => value);
			setGetTagValues(getValue);
			setSearchedData(searchResult);
			setDisplaySearchData(true);
			setAdvaceSearch(false);
			setSearchClear(true);
			resetForm();
		},
	});

	const handleClear = () => {
		setDisplaySearchData(false);
		setSearchbox('');
		setGetTagValues([]);
	};

	useEffect(() => {
		setSearchedData && setSearchedData(data);
	}, []);
	const {
		errors,
		touched,
		values,
		handleBlur,
		handleChange,
		handleSubmit,
		setFieldValue,
		resetForm,
		dirty,
	} = formik;
	const handleClick = () => {
		onOpen();
	};

	const tableInstance = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0 },
		},
		useGlobalFilter,
		useSortBy,
		usePagination
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize },
	} = tableInstance;

	if (pageOptions.length < gopageValue) {
		setGopageValue(pageOptions.length);
	}

	const handleCheckboxChange = (event, value) => {
		if (event.target.checked) {
			setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
		} else {
			setSelectedValues((prevSelectedValues) =>
				prevSelectedValues.filter((selectedValue) => selectedValue !== value)
			);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);
	// }, [action]);

	const handleSearch = (results) => {
		setSearchedData(results);
	};

	const updateUsers = (user) => {
		setData((prev) => {
			const idx = prev.findIndex((item) => item._id === user._id);
			if (idx === -1) return [...prev, user];
			return [...prev.slice(0, idx), user, ...prev.slice(idx + 1)];
		});
	};

	const statusChange = (user, status) => {
		setData((prev) => {
			const idx = prev.findIndex((item) => item._id === user?._id);

			if (idx !== -1) {
				// update existing user
				const updated = [...prev];
				updated[idx] = { ...user, isActive: status };
				return updated;
			} else {
				// add new user
				return [...prev, { ...user, isActive: status }];
			}
		});
	};

	const handleFilterChange = (newFilters) => {
		let filteredData = allData;

		if (newFilters.role) {
			filteredData = filteredData.filter(
				(user) => user.roles?.[0]?.roleName === newFilters.role
			);
		}

		if (newFilters.status !== undefined) {
			filteredData = filteredData.filter(
				(user) => user.isOnline === newFilters.status
			);
		}

		if (newFilters.accountStatus !== undefined) {
			filteredData = filteredData.filter(
				(user) => user.isActive === newFilters.accountStatus
			);
		}

		setSearchedData(filteredData);
		setDisplaySearchData(true);
		setTopLevelSearch(true);
	};

	const handleClearFilters = () => {
		setFilters({});
		setGetTagValues([]);
		setSearchbox('');
		setTopLevelSearch(false);
		setDisplaySearchData(false);
	};
	return (
		<>
			<Card
				direction='column'
				w='100%'
				py={3}
				px={2}
				overflowX={{ sm: 'scroll', lg: 'hidden' }}
			>
				<Flex
					justifyContent={'space-between'}
					align='center'
					mb={1}
					flexDir={{ base: 'column', md: 'row' }}
				>
					<Text
						color={useColorModeValue('secondaryGray.900', 'white')}
						fontSize='22px'
						fontWeight='700'
						lineHeight='100%'
						m={4}
					>
						Users (
						<CountUpComponent key={data?.length} targetNumber={data?.length} />)
					</Text>
					<Flex align='center' gap={2} flexDir={{ base: 'column', md: 'row' }}>
						<CustomSearchInput
							setSearchbox={setSearchbox}
							setDisplaySearchData={setDisplaySearchData}
							searchbox={searchbox}
							allData={allData}
							dataColumn={dataColumn}
							onSearch={handleSearch}
							fetchSearch={handleSearch}
						/>
						<Button
							colorScheme='brand'
							size='sm'
							borderRadius={'md'}
							py={3}
							px={6}
							onClick={() => setAdvaceSearch(true)}
						>
							Advance Search
						</Button>
						{displaySearchData === true && !topLevelSearch ? (
							<Button
								variant='outline'
								size='sm'
								colorScheme='red'
								ms={2}
								onClick={() => {
									handleClear();
								}}
							>
								clear
							</Button>
						) : (
							''
						)}
						{/* {selectedValues.length > 0 && (
								<DeleteIcon
									onClick={() => setDelete(true)}
									color={'red'}
									ms={2}
									cursor='pointer'
								/>
							)} */}
						{/* <Menu isLazy>
							<MenuButton p={4}>
								<BsColumnsGap />
							</MenuButton>
							<MenuList
								minW={'fit-content'}
								transform={'translate(1670px, 60px)'}
								zIndex={2}
							>
								<MenuItem
									onClick={() => setManageColumns(true)}
									width={'165px'}
								>
									{' '}
									Manage Columns
								</MenuItem>
						<MenuItem width={"165px"} onClick={() => setIsImportLead(true)}> Import Leads
                </MenuItem>
                <MenuDivider />
                <MenuItem width={"165px"} onClick={() => handleExportLeads('csv')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as CSV' : 'Export as CSV'}</MenuItem>
                <MenuItem width={"165px"} onClick={() => handleExportLeads('xlsx')}>{selectedValues && selectedValues?.length > 0 ? 'Export Selected Data as Excel' : 'Export as Excel'}</MenuItem>
							</MenuList>
						</Menu> */}

						{isSuperAdmin && (
							<Button
								onClick={() => handleClick()}
								variant='brand'
								size='sm'
								leftIcon={<AddIcon />}
								borderRadius={'md'}
							>
								Add New
							</Button>
						)}
					</Flex>
				</Flex>
				{/* <Button
							onClick={() => navigate('/admin-setting')}
							variant='brand'
							size='sm'
							leftIcon={<IoIosArrowBack />}
							ml={2}
						>
							Back
						</Button> */}
				{getTagValues && (
					<Box mx={4}>
						<SearchTags searchTags={getTagValues} />
					</Box>
				)}
				{/* Delete model */}
				{/* {deleteModel && (
					<Delete
						isOpen={deleteModel}
						onClose={setDelete}
						setAction={setAction}
						setSelectedValues={setSelectedValues}
						url='api/user/deleteMany'
						data={selectedValues}
						method='many'
						const
						handleClear={handleClear}
						fetchData={fetchData}
					/>
				)} */}

				<TopSearch
					filters={filters}
					setFilters={setFilters}
					onFilterChange={handleFilterChange}
					handleClear={handleClearFilters}
					allData={allData}
				/>
				<Box
					overflowY={'auto'}
					height='70vh'
					scrollBehavior='smooth'
					borderRadius='md'
					boxShadow='sm'
					bg='white'
				>
					<Table {...getTableProps()} variant='striped'>
						<Thead
							color='gray.500'
							mb='24px'
							position='sticky'
							top={0}
							bg='white'
							zIndex={1}
							boxShadow='0px 2px 8px rgba(0, 0, 0, 0.1)'
						>
							{headerGroups?.map((headerGroup, index) => (
								<Tr {...headerGroup.getHeaderGroupProps()} key={index}>
									{headerGroup.headers?.map((column, index) => (
										<Th key={index} bg='brand.200' whiteSpace='nowrap' py={4}>
											<Box
												display='flex'
												alignItems='center'
												justifyContent='center'
											>
												<Text
													fontSize={{ base: '12px', md: '14px' }}
													fontWeight='600'
													color='gray.700'
													textTransform='capitalize'
												>
													{column.render('Header')}
												</Text>
											</Box>
										</Th>
									))}
								</Tr>
							))}
						</Thead>
						<Tbody {...getTableBodyProps()}>
							{isLoding || tableLoading ? (
								<TableLoading columns={columns} length='10' py='4' />
							) : data?.length > 0 ? (
								page?.map((row, i) => {
									prepareRow(row);

									return (
										<Tr {...row?.getRowProps()} key={i}>
											{row?.cells?.map((cell, index) => {
												let data = '';
												if (cell?.column.Header === '#') {
													data = (
														<Flex align='center'>
															{/* {isSuperAdmin &&
															cell?.row?.original?.role !== 'superAdmin' ? (
																<Checkbox
																	colorScheme='brandScheme'
																	value={selectedValues}
																	isChecked={selectedValues.includes(
																		cell?.value
																	)}
																	onChange={(event) =>
																		handleCheckboxChange(event, cell?.value)
																	}
																	me='10px'
																/>
															) : (
																<Text me='28px'></Text>
															)} */}
															<Text
																color={textColor}
																fontSize='sm'
																fontWeight='700'
															>
																{cell?.row?.index + 1}
															</Text>
														</Flex>
													);
												}
												// else if (cell?.column.Header === 'ID') {
												// 	data = <CopyID value={row?.original?._id || ''} />;
												// }
												else if (cell?.column.Header === 'email') {
													const email = cell?.value;
													const userId = cell?.row?.values._id;

													data = (
														<Link to={`/users/${userId}`}>
															<Text
																me='10px'
																sx={{
																	'&:hover': {
																		color: 'blue.400',
																		textDecoration: 'underline',
																	},
																}}
																color='brand.500'
																fontSize='sm'
																fontWeight='700'
															>
																{email}
															</Text>
														</Link>
													);
												} else if (cell?.column.Header === 'first Name') {
													data = (
														<Text
															me='10px'
															color={textColor}
															fontSize='sm'
															fontWeight='700'
														>
															{cell?.value ? cell?.value : ' - '}
														</Text>
													);
												} else if (cell?.column.Header === 'last Name') {
													data = (
														<Text
															me='10px'
															color={textColor}
															fontSize='sm'
															fontWeight='700'
														>
															{cell?.value ? cell?.value : ' - '}
														</Text>
													);
												} else if (cell?.column.Header === 'Status') {
													data = (
														<HStack
															spacing={1.5}
															px={2}
															py={0.5}
															borderRadius='md'
															borderWidth='1px'
															width='fit-content'
															align='center'
															bg={
																row?.original?.isOnline ? 'green.50' : 'red.50'
															}
															borderColor={
																row?.original?.isOnline
																	? 'green.400'
																	: 'red.400'
															}
														>
															<Icon
																as={BsCircleFill}
																color={
																	row?.original?.isOnline
																		? 'green.400'
																		: 'red.400'
																}
																boxSize={2.5}
															/>
															<Text
																fontSize='sm'
																fontWeight='medium'
																color='gray.800'
															>
																{row?.original?.isOnline ? 'Online' : 'Offline'}
															</Text>
														</HStack>
													);
												} else if (cell?.column.Header === 'role') {
													data = (
														<Text
															color={textColor}
															fontSize='sm'
															fontWeight='700'
														>
															{cell?.value ||
																cell?.row?.original?.role ||
																'N/A'}
														</Text>
													);
												} else if (cell?.column.Header === 'Coins') {
													data = (
														<Text
															color='blue.400'
															fontSize='sm'
															fontWeight='700'
														>
															{cell?.value || 'N/A'}
														</Text>
													);
												} else if (cell?.column.Header === 'Target') {
													data = (
														<Box textAlign='center'>
															<Text
																fontSize='sm'
																color={textColor}
																fontWeight='700'
																textAlign='center'
															>
																{formatCurrency(
																	cell?.value,
																	row.original.currency
																)}
															</Text>
														</Box>
													);
												} else if (cell?.column.Header === 'Account Status') {
													data = (
														<StatusToggle
															user={row?.original}
															initialStatus={cell?.value}
															role={
																row?.original?.role === 'superAdmin'
																	? 'superAdmin'
																	: row?.original?.roles[0]?.roleName
															}
															statusChange={statusChange}
														/>
													);
												} else if (cell?.column.Header === 'Action') {
													data = (
														<Box
															fontSize='md'
															fontWeight='900'
															textAlign={'center'}
														>
															<Menu isLazy>
																<MenuButton>
																	<CiMenuKebab />
																</MenuButton>

																<Portal>
																	<MenuList
																		minW={'fit-content'}
																		placement='top'
																		// transform={'translate(1520px, 173px);'}
																		zIndex={99999}
																	>
																		{(isSuperAdmin ||
																			user?.roles[0]?.roleName ===
																				'Manager') && (
																			<MenuItem
																				py={2.5}
																				onClick={() => {
																					setEdit(true);
																					setSelectedId(
																						cell?.row?.original._id
																					);
																					setEditData(cell?.row?.original);
																				}}
																				icon={<EditIcon mb={1} fontSize={15} />}
																			>
																				Edit
																			</MenuItem>
																		)}

																		<MenuItem
																			py={2.5}
																			color={'green'}
																			onClick={() =>
																				navigate(
																					`/users/${cell?.row?.values._id}`
																				)
																			}
																			icon={<ViewIcon mb={1} fontSize={15} />}
																		>
																			View
																		</MenuItem>
																		{isSuperAdmin && (
																			<>
																				<MenuItem
																					py={2.5}
																					color={'green'}
																					onClick={() =>
																						setAddCoinsModal({
																							user: row?.original,
																							isOpen: true,
																						})
																					}
																					icon={
																						<FaCoins mb={1} fontSize={15} />
																					}
																				>
																					Add Coins
																				</MenuItem>
																				<MenuItem
																					py={2.5}
																					color={'green'}
																					onClick={() =>
																						setRemoveCoinsModal({
																							user: row?.original,
																							isOpen: true,
																						})
																					}
																					icon={
																						<FaCoins mb={1} fontSize={15} />
																					}
																				>
																					Remove Coins
																				</MenuItem>
																				{/* {cell?.row?.original?.role ===
																				'superAdmin' ? (
																					''
																				) : (
																					<MenuItem
																						py={2.5}
																						color={'red'}
																						onClick={() => {
																							setSelectedValues([
																								cell?.row?.original._id,
																							]);
																							setDelete(true);
																						}}
																						icon={<DeleteIcon fontSize={15} />}
																					>
																						Delete
																					</MenuItem>
																				)} */}
																			</>
																		)}
																	</MenuList>
																</Portal>
															</Menu>
														</Box>
													);
												}
												return (
													<Td
														{...cell?.getCellProps()}
														key={index}
														fontSize={{ sm: '14px' }}
														minW={{ sm: '150px', md: '200px', lg: 'auto' }}
														borderColor='transparent'
													>
														{data}
													</Td>
												);
											})}
										</Tr>
									);
								})
							) : (
								<Tr>
									<Td colSpan={columns.length}>
										<Text
											textAlign={'center'}
											width='100%'
											color={textColor}
											fontSize='sm'
											fontWeight='700'
										>
											<DataNotFound />
										</Text>
									</Td>
								</Tr>
							)}
						</Tbody>
					</Table>
				</Box>
				{data?.length > 5 && (
					<Pagination
						gotoPage={gotoPage}
						gopageValue={gopageValue}
						setGopageValue={setGopageValue}
						pageCount={pageCount}
						canPreviousPage={canPreviousPage}
						previousPage={previousPage}
						canNextPage={canNextPage}
						pageOptions={pageOptions}
						setPageSize={setPageSize}
						nextPage={nextPage}
						pageSize={pageSize}
						pageIndex={pageIndex}
					/>
				)}
			</Card>
			{isOpen && (
				<AddUser
					isOpen={isOpen}
					size={'lg'}
					setAction={setAction}
					onClose={onClose}
					fetchData={fetchData}
				/>
			)}

			{edit && (
				<Edit
					isOpen={edit}
					size={'sm'}
					setAction={setAction}
					onClose={onClose}
					fetchData={fetchData}
					data={editData}
					setEdit={setEdit}
					selectedId={selectedId}
					refrence='table'
					updateUsers={updateUsers}
				/>
			)}
			{addCoinsModal?.isOpen && (
				<AddCoinsModal
					isOpen={addCoinsModal?.isOpen}
					setDisplaySearchData={setDisplaySearchData}
					size={'sm'}
					onClose={() => setAddCoinsModal({ isOpen: false, user: null })}
					fetchData={fetchData}
					updateUsers={updateUsers}
					selectedUser={addCoinsModal?.user}
				/>
			)}

			{removeCoinsModal?.isOpen && (
				<RemoveCoinsModal
					isOpen={removeCoinsModal?.isOpen}
					setDisplaySearchData={setDisplaySearchData}
					size={'sm'}
					onClose={() => setRemoveCoinsModal({ isOpen: false, user: null })}
					fetchData={fetchData}
					updateUsers={updateUsers}
					selectedUser={removeCoinsModal?.user}
				/>
			)}

			{/* Advance filter */}
			{advaceSearch && (
				<Modal
					onClose={() => {
						setAdvaceSearch(false);
						resetForm();
					}}
					isOpen={advaceSearch}
					size='lg'
					isCentered
					scrollBehavior='inside'
					motionPreset='slideInBottom'
				>
					<ModalOverlay />
					<ModalContent
						bg={bgColor}
						borderRadius='2xl'
						shadow='2xl'
						maxW={{ base: 'full', sm: '90vw', md: '500px' }}
						overflow='hidden'
						mx={{ base: 3, md: 0 }}
					>
						<ModalHeader
							p={0}
							borderBottom='1px solid'
							borderColor={borderColor}
						>
							<Flex
								bg={headerBg}
								color={headerText}
								px={6}
								py={3}
								position='sticky'
								top='0'
								zIndex='10'
								boxShadow='md'
							>
								<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
									Advanced Search
								</Text>
								<ModalCloseButton
									position='absolute'
									right='12px'
									top='10px'
									color={headerText}
									_hover={{ bg: 'whiteAlpha.200' }}
								/>
							</Flex>
						</ModalHeader>
						<ModalBody>
							<Grid templateColumns='repeat(12, 1fr)' mb={3} gap={2}>
								<GridItem colSpan={{ base: 12 }}>
									<FormLabel
										display='flex'
										ms='4px'
										fontSize='sm'
										fontWeight='600'
										color={'#000'}
										mb='0'
										mt={2}
									>
										First Name
									</FormLabel>
									<Input
										fontSize='sm'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values?.firstName}
										name='firstName'
										placeholder='Enter First Name'
										fontWeight='500'
									/>
									<Text mb='10px' color={'red'}>
										{' '}
										{errors.firstName && touched.firstName && errors.firstName}
									</Text>
								</GridItem>
								<GridItem colSpan={{ base: 12 }}>
									<FormLabel
										display='flex'
										ms='4px'
										fontSize='sm'
										fontWeight='600'
										color={'#000'}
										mb='0'
										mt={2}
									>
										Last Name
									</FormLabel>
									<Input
										fontSize='sm'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values?.lastName}
										name='lastName'
										placeholder='Enter Last Name'
										fontWeight='500'
									/>
									<Text mb='10px' color={'red'}>
										{' '}
										{errors.lastName && touched.lastName && errors.lastName}
									</Text>
								</GridItem>
								<GridItem colSpan={{ base: 12 }}>
									<FormLabel
										display='flex'
										ms='4px'
										fontSize='sm'
										fontWeight='600'
										color={'#000'}
										mb='0'
										mt={2}
									>
										Email Id
									</FormLabel>
									<Input
										fontSize='sm'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values?.username}
										name='username'
										placeholder='Enter User Name'
										fontWeight='500'
									/>
									<Text mb='10px' color={'red'}>
										{' '}
										{errors.username && touched.username && errors.username}
									</Text>
								</GridItem>
							</Grid>
						</ModalBody>
						<ModalFooter
							position='sticky'
							bottom='0'
							bg={footerBg}
							borderTop='1px solid'
							borderColor={borderColor}
							py={3}
							px={5}
							zIndex='10'
							justifyContent='flex-end'
							gap={3}
						>
							<Button
								variant='outline'
								colorScheme='gray'
								size='sm'
								borderRadius='md'
								onClick={() => resetForm()}
							>
								Clear
							</Button>
							<Button
								size='sm'
								borderRadius='md'
								onClick={handleSubmit}
								disabled={isLoding || !dirty ? true : false}
								colorScheme='brand'
							>
								{isLoding ? <Spinner /> : 'Search'}
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			)}

			{/* Manage Columns */}
			{/* <Modal
				onClose={() => {
					setManageColumns(false);
					resetForm();
				}}
				isOpen={manageColumns}
				isCentered
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Manage Columns</ModalHeader>
					<ModalCloseButton
						onClick={() => {
							setManageColumns(false);
							resetForm();
						}}
					/>
					<ModalBody>
						<div>
							{dynamicColumns.map((column) => (
								<Text display={'flex'} key={column.accessor} py={2}>
									<Checkbox
										defaultChecked={selectedColumns.some(
											(selectedColumn) =>
												selectedColumn.accessor === column.accessor
										)}
										onChange={() => toggleColumnVisibility(column.accessor)}
										pe={2}
									/>
									{column.Header}
								</Text>
							))}
						</div>
					</ModalBody>
					<ModalFooter>
						<Button
							size='sm'
							variant='brand'
							colorScheme='green'
							mr={2}
							onClick={() => {
								setSelectedColumns(tempSelectedColumns);
								setManageColumns(false);
								resetForm();
							}}
							disabled={isLoding ? true : false}
						>
							{isLoding ? <Spinner /> : 'Save'}
						</Button>
						<Button
							size='sm'
							variant='outline'
							colorScheme='red'
							onClick={() => handleColumnClear()}
						>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal> */}
		</>
	);
}
