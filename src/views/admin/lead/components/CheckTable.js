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
	Table,
	Tag,
	TagLabel,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	MenuDivider,
	useColorModeValue,
	useDisclosure,
	Skeleton,
	Badge,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	useGlobalFilter,
	usePagination,
	useSortBy,
	useTable,
} from "react-table";
import * as XLSX from "xlsx";

// Custom components
import {
	DeleteIcon,
	EditIcon,
	EmailIcon,
	PhoneIcon,
	SearchIcon,
} from "@chakra-ui/icons";
import Card from "components/card/Card";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import {
	FaHistory,
	FaSort,
	FaSortDown,
	FaSortUp,
	FaTasks,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getApi } from "services/api";
import Delete from "../Delete";
import AddEmailHistory from "views/admin/emailHistory/components/AddEmail";
import AddPhoneCall from "views/admin/phoneCall/components/AddPhoneCall";
import Add from "../Add";
import { AddIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import Edit from "../Edit";
import { BsColumnsGap, BsWhatsapp } from "react-icons/bs";
import ImportModal from "./ImportModal";
import CustomSearchInput from "components/search/search";
import DataNotFound from "components/notFoundData";
import RenderManager from "./RenderManager";
import RenderAgent from "./RenderAgent";
import RenderStatus from "./RenderStatus";
import { MdFileUpload, MdTask } from "react-icons/md";
import AddTask from "./addTask";
import LeadsModal from "../LeadsModal";
import AdvancedSearchModal from "./AdvancedSearchModal";
// import SizeExample from "./Dummy";
import { useStateContext } from "contexts/store";
import RenderEStatus from "./RenderEStatus";
import { postApi } from "services/api";
import TableLoading from "components/loading/TableLoading";
import ManageColumnModal from "./ManageColumnModal";
import BulkAssignModal from "./BulkAssignModal";
import ReleaseLead from "./ReleaseLead";

const CheckTable = React.memo((props) => {
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
		setDisplayAdvSearchData,
		displayAdvSearchData,
		selectedColumns,
		setSelectedColumns,
		dynamicColumns,
		callAccess,
		emailAccess,
		setAction,
		action,
		setIsLoding,
		dateTime,
		setDateTime,
		pages,
		fetchAdvancedSearch,
		totalLeads,
		fetchSearchedData,
		setData,
		refetchData,
		hideColumns,
	} = props;
	const textColor = useColorModeValue("gray.500", "white");
	const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
	const [leadData, setLeadData] = useState([]);
	const columns = useMemo(() => dataColumn, [dataColumn]);
	// const columns = dataColumn;

	const [bulkAssign, setBulkAssign] = useState(false);

	const [selectedValues, setSelectedValues] = useState([]);
	const [getTagValues, setGetTagValues] = useState([]);
	const [gopageValue, setGopageValue] = useState(1);

	const user = JSON.parse(localStorage.getItem("user"));

	const [leadsModal, setLeadsModal] = useState({
		isOpen: false,
		lid: null,
	});
	const [deleteModel, setDelete] = useState(false);
	const [addEmailHistory, setAddEmailHistory] = useState(false);
	const [addPhoneCall, setAddPhoneCall] = useState(false);
	const [advaceSearch, setAdvaceSearch] = useState(false);
	const [searchClear, setSearchClear] = useState(false);
	const [selectedId, setSelectedId] = useState();
	const [callSelectedId, setCallSelectedId] = useState();
	const navigate = useNavigate();

	// let data = useMemo(() => tableData, [tableData]);
	let data = tableData;

	const [showTable, setShowTable] = useState(false);

	useEffect(() => {
		if (!isLoding) {
			const timer = setTimeout(() => {
				setShowTable(true);
			}, 500); // 1 second delay

			return () => clearTimeout(timer); // Clean up timeout
		}
	}, [isLoding]);

	useEffect(() => {
		setData(tableData);
		console.log({ tableData });
	}, [refetchData, setData, tableData]);

	useEffect(() => {
		const savedColumns =
			JSON.parse(localStorage.getItem("userCustomColumns")) || [];
		const updatedColumns = dynamicColumns.filter(
			(col) => !savedColumns.includes(col.accessor)
		);
		setSelectedColumns(updatedColumns);
	}, [dynamicColumns, setSelectedColumns]);

	const [selectAllChecked, setSelectAllChecked] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		isOpen: isTaskOpen,
		onOpen: onTaskOpen,
		onClose: onTaskClose,
	} = useDisclosure();
	const [edit, setEdit] = useState(false);
	const [updatedPage, setUpdatedPage] = useState(0);
	const [isImportLead, setIsImportLead] = useState(false);
	const searchbox = useRef();
	const [column, setColumn] = useState("");
	// const [updatedStatuses, setUpdatedStatuses] = useState([]);
	const [manageColumns, setManageColumns] = useState(false);
	const [tempSelectedColumns, setTempSelectedColumns] = useState(dataColumn); // State to track changes
	const [taskInits, setTaskInits] = useState({});
	const { isLeadCycle, setIsLeadCycle } = useStateContext();

	const [formValues, setFormValues] = useState([]);
	const [isFormReset, setIsFormReset] = useState(false);

	const csvColumns = [
		{ Header: "Name", accessor: "leadName" },
		{ Header: "Status", accessor: "leadStatus" },
		{ Header: "Whatsapp", accessor: "leadWhatsappNumber" },
		{ Header: "Phone", accessor: "leadPhoneNumber" },
		{ Header: "Date & Time", accessor: "createdDate" },
		{ Header: "Timetocall", accessor: "timetocall" },
	];

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

	// const toggleColumnVisibility = (columnKey) => {
	// 	setColumn(columnKey); // Optional: Update any additional state tied to the current column.

	// 	isColumnSelected = tempSelectedColumns?.some(
	// 		(column) => column?.accessor === columnKey
	// 	);

	// 	console.log({ columnKey, isColumnSelected });

	// 	if (isColumnSelected) {
	// 		// Remove column from selected
	// 		const updatedColumns = tempSelectedColumns?.filter(
	// 			(column) => column?.accessor !== columnKey
	// 		);
	// 		console.log({ updatedColumns });
	// 		setTempSelectedColumns([...updatedColumns]); // Spread to ensure a new array is created
	// 	} else {
	// 		// Add column to selected
	// 		const columnToAdd = dynamicColumns?.find(
	// 			(column) => column?.accessor === columnKey
	// 		);
	// 		console.log({ columnToAdd });
	// 		if (columnToAdd) {
	// 			setTempSelectedColumns((prevColumns) => [...prevColumns, columnToAdd]);
	// 		}
	// 	}
	// };

	const handleColumnClear = () => {
		isColumnSelected = selectedColumns?.some(
			(selectedColumn) => selectedColumn?.accessor === column?.accessor
		);
		setTempSelectedColumns(dynamicColumns);
		setManageColumns(!manageColumns ? !manageColumns : false);
	};

	const refreshData = () => {
		if (displaySearchData) {
			fetchSearchedData(searchbox.current?.value?.trim() || "", 1, pageSize);
		} else if (displayAdvSearchData) {
			const data = Object.fromEntries(
				Object.entries(formValues).filter(([key, value]) => value !== "")
			);
			fetchAdvancedSearch(data, pageIndex + 1, pageSize);
		} else {
			fetchData(pageIndex + 1, pageSize);
		}
	};

	const bulkRefreshData = () => {
		if (displaySearchData) {
			fetchSearchedData(searchbox.current?.value?.trim() || "", 1, pageSize);
		} else if (displayAdvSearchData) {
			const data = Object.fromEntries(
				Object.entries(formValues).filter(([key, value]) => value !== "")
			);
			fetchAdvancedSearch(data, pageIndex + 1, pageSize);
		} else {
			refetchData(pageIndex + 1, pageSize);
		}
	};

	// const initialValues = {
	// 	leadName: "",
	// 	leadStatus: "",
	// 	eLeadStatus: "",
	// 	leadEmail: "",
	// 	leadPhoneNumber: "",
	// 	managerAssigned: "",
	// 	agentAssigned: "",
	// 	leadWhatsappNumber: "",
	// 	nationality: "",
	// 	ip: "",
	// 	leadAddress: "",
	// 	leadCampaign: "",
	// 	leadSourceDetails: "",
	// 	leadSourceMedium: "",
	// 	pageUrl: "",
	// 	r_u_in_uae: "",
	// 	leadLang: "",
	// };

	// 	const formik = useFormik({
	// 		initialValues,
	// 		validationSchema: validationLeadSearchSchema,
	// 		onSubmit: (values, { formikResetForm }) => {
	// 			// Initialize cleanedData and tags
	// 			const { cleanedData, tags } = Object.entries(values).reduce(
	// 				(acc, [key, value]) => {
	// 					if (value !== "" && value !== undefined) {
	// 						// Add raw value to cleanedData for API
	// 						acc.cleanedData[key] = value;

	// 						let displayValue = value;

	// 						// Special formatting rules for score range
	// 						if (key === "fromLeadScore" || key === "toLeadScore") {
	// 							displayValue = `${values.fromLeadScore || 0}-${
	// 								values.toLeadScore || "max"
	// 							}`;
	// 						}

	// 						// Special formatting for leadStatus
	// 						if (key === "leadStatus") {
	// 							displayValue =
	// 								value === "active"
	// 									? "Interested"
	// 									: value === "pending"
	// 										? "Not Interested"
	// 										: value;
	// 						}

	// 						// Handle agentAssigned
	// 						if (key === "agentAssigned") {
	// 							const agentsArray = Object.values(tree.agents).flatMap(
	// 								(managerArray) => managerArray
	// 							);
	// 							const assignedAgent = agentsArray.find(
	// 								(agent) => agent?._id?.toString() === value
	// 							);

	// 							displayValue = assignedAgent
	// 								? `${assignedAgent.firstName} ${assignedAgent.lastName}`
	// 								: value === -1
	// 									?"no Agent"
	// 									: value;
	// 						}

	// 						// Handle managerAssigned
	// 						if (key === "managerAssigned") {
	// 							const assignedManager = tree.managers.find(
	// 								(user) => user?._id?.toString() === value
	// 							);

	// 							displayValue = assignedManager
	// 								? `${assignedManager.firstName} ${assignedManager.lastName}`
	// 								: value === -1
	// 									?"no Manager"
	// 									: value;
	// 						}

	// 						// Add formatted value to tags for UI
	// 						acc.tags.push(`${key}: ${displayValue}`);
	// 					}

	// 					return acc;
	// 				},
	// 				{ cleanedData: {}, tags: [] }
	// 			);

	// 			// Call API with cleaned data
	// 			fetchAdvancedSearch(cleanedData, 1, pageSize);

	// 			// Update UI with tags
	// 			setGetTagValues(tags);
	// 			setAdvaceSearch(false);
	// 			setSearchClear(true);

	// 			// Reset form values
	// 			// resetForm();
	// 		},
	// 	});
	// const {
	// 	control,
	// 	handleSubmit,
	// 	setValue,
	// 	reset,
	// 	formState: { errors, isDirty },
	// } = useForm({
	// 	defaultValues: initialValues,
	// 	resolver: yupResolver(validationLeadSearchSchema),
	// });

	const handleClear = () => {
		// Clear parent states
		if (searchbox.current) searchbox.current.value = "";
		setDisplaySearchData(false);
		setDisplayAdvSearchData(false);
		setSearchedData([]);
		setUpdatedPage(0);
		fetchData(1, pageSize);
		setGopageValue(1);
		setUpdatedPage(0);
		setGetTagValues([]);
		setIsFormReset(true);
	};

	const [columnVisibility, setColumnVisibility] = useState(
		hideColumns?.reduce((acc, key) => {
			acc[key] = false;
			return acc;
		}, {})
	);

	const tableInstance = useTable(
		{
			columns,
			data,
			manualPagination: true,
			state: { columnVisibility },
			onColumnVisibilityChange: setColumnVisibility,
			initialState: { pageIndex: updatedPage, pageSize: 30 },
			pageCount: pages,
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

	const tableDataUpdate = async () => {
		refetchData(page, pageSize);
	};

	const handleCheckboxChange = (event, value) => {
		if (event.target.checked) {
			setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
		} else {
			setSelectedValues((prevSelectedValues) =>
				prevSelectedValues.filter((selectedValue) => selectedValue !== value)
			);
		}
	};

	const handleLeadsModal = (lid) => {
		setLeadsModal({
			isOpen: true,
			lid,
		});
	};

	const handleClick = () => {
		onOpen();
	};

	const saveManageCols = async () => {
		try {
			// Identify hidden columns
			const tempAccessors = tempSelectedColumns.map((t) => t.accessor);

			const hideCols = dynamicColumns
				.filter((d) => !tempAccessors.includes(d.accessor))
				.map((d) => d.accessor);

			// Prepare data for saving
			const userHideColsData = {
				userId: user._id,
				columns: hideCols,
			};

			// Save to backend
			await postApi(`api/customColumns`, userHideColsData);

			// Update local storage and state
			localStorage.setItem("userCustomColumns", JSON.stringify(hideCols));
			setSelectedColumns(tempSelectedColumns);
			setManageColumns(false);

			// Refetch data
			refetchData();
		} catch (error) {
			console.error("Error saving columns:", error);
		}
	};

	const fetchCustomData = async () => {
		const response = await getApi("api/custom-field?moduleName=Lead");
		setLeadData(response.data);
	};

	useEffect(() => {
		if (fetchCustomData) fetchCustomData();
	}, [action]);

	const size = "lg";

	const handleExportLeads = (extension) => {
		if (selectedValues && selectedValues?.length > 0) {
			downloadCsvOrExcel(extension, selectedValues);
		} else {
			downloadCsvOrExcel(extension);
		}
	};

	const downloadCsvOrExcel = async (extension, selectedIds) => {
		try {
			if (selectedIds && selectedIds?.length > 0) {
				const selectedRecordsWithSpecificFileds = tableData
					?.filter((rec) => selectedIds.includes(rec._id))
					?.map((rec) => {
						const selectedFieldsData = {};
						csvColumns.forEach((property) => {
							if (
								property.accessor === "leadStatus" &&
								!rec[property.accessor]
							) {
								selectedFieldsData[property.accessor] = "new";
							} else {
								selectedFieldsData[property.accessor] = rec[property.accessor];
							}
						});
						return selectedFieldsData;
					});

				convertJsonToCsvOrExcel(
					selectedRecordsWithSpecificFileds,
					csvColumns,
					"lead",
					extension
				);
			} else {
				const AllRecordsWithSpecificFileds = tableData?.map((rec) => {
					const selectedFieldsData = {};
					csvColumns.forEach((property) => {
						if (property.accessor === "leadStatus" && !rec[property.accessor]) {
							selectedFieldsData[property.accessor] = "new";
						} else {
							selectedFieldsData[property.accessor] = rec[property.accessor];
						}
					});
					return selectedFieldsData;
				});
				convertJsonToCsvOrExcel(
					AllRecordsWithSpecificFileds,
					csvColumns,
					"lead",
					extension
				);
			}
		} catch (e) {
			console.error(e);
		}
	};

	const convertJsonToCsvOrExcel = (
		jsonArray,
		csvColumns,
		fileName,
		extension
	) => {
		const csvHeader = csvColumns.map((col) => col.Header);

		const csvContent = [
			csvHeader,
			...jsonArray.map((row) => csvColumns.map((col) => row[col.accessor])),
		];

		const ws = XLSX.utils.aoa_to_sheet(csvContent);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
		XLSX.writeFile(wb, `${fileName}.${extension}`); // .csv, .xlsx
		setSelectedValues([]);
	};

	const fetchSearch = () => {
		if (searchbox.current?.value?.trim()) {
			fetchSearchedData(searchbox.current?.value?.trim(), 1, pageSize);
			setUpdatedPage(0);
			setGopageValue(1);
		}
	};

	useEffect(() => {
		setGopageValue(1);
		setUpdatedPage(0);
		if (displaySearchData) {
			fetchSearchedData(searchbox.current?.value?.trim());
		} else if (displayAdvSearchData) {
			fetchAdvancedSearch();
		} else {
			fetchData();
		}
	}, [action]);

	useEffect(() => {
		setGopageValue(1);
		setUpdatedPage(0);
		if (
			fetchData &&
			(dateTime.from !== null || dateTime.to !== null) &&
			!displaySearchData
		)
			fetchData();
	}, [dateTime]);

	useEffect(() => {
		setUpdatedPage(pageIndex);
		if (displaySearchData) {
			fetchSearchedData(
				searchbox.current?.value?.trim() || "",
				pageIndex + 1,
				pageSize
			);
		} else if (displayAdvSearchData) {
			const data = Object.fromEntries(
				Object.entries(formValues).filter(([key, value]) => value !== "")
			);
			fetchAdvancedSearch(data, pageIndex + 1, pageSize);
		} else {
			fetchData(pageIndex + 1, pageSize);
		}
	}, [pageIndex]);

	useEffect(() => {
		setUpdatedPage(0);
		setGopageValue(1);
		if (displaySearchData) {
			fetchSearchedData(searchbox.current?.value?.trim() || "", 1, pageSize);
		} else if (displayAdvSearchData) {
			const data = Object.fromEntries(
				Object.entries(formValues).filter(([key, value]) => value !== "")
			);
			fetchAdvancedSearch(data, 1, pageSize);
		} else if (pageSize !== 30) {
			fetchData(1, pageSize);
		}
	}, [pageSize]);

	const updateRowStatus = (id, newStatus) => {
		if (displayAdvSearchData) {
			setSearchedData((prevData) => {
				// First, reset the leadStatus for the target row
				const resetData = prevData.map((row) =>
					row._id === id ? { ...row, leadStatus: "" } : row
				);

				// Then, update the leadStatus to the new value
				const updatedData = resetData.map((row) =>
					row._id === id ? { ...row, leadStatus: newStatus } : row
				);

				// Return the updated data array
				return [...updatedData];
			});
		} else {
			setData((prevData) => {
				// First, reset the leadStatus for the target row
				const resetData = prevData.map((row) =>
					row._id === id ? { ...row, leadStatus: "" } : row
				);

				// Then, update the leadStatus to the new value
				const updatedData = resetData.map((row) =>
					row._id === id ? { ...row, leadStatus: newStatus } : row
				);

				// Return the updated data array
				return [...updatedData];
			});
		}
	};

	return (
		<>
			{/* <Flex
				p={4}
				alignItems={"center"}
				style={{
					position: "relative",
					fontSize: 15,
				}}
				className="date-range-selector"
			>
				<Flex alignItems={"center"}>
					<p>From:</p>
					<div style={{ width: 10 }}></div>
					<input
						value={dateTime.from}
						onChange={(e) => {
							if (e.target.value) {
								setDateTime({ ...dateTime, from: e.target.value });
							} else {
								setDateTime({ to: "", from: "" });
							}
						}}
						style={{ color: "#422afb" }}
						type="datetime-local"
					/>
				</Flex>
				{dateTime?.from && (
					<div>
						<Flex ms={2} alignItems={"center"}>
							<p>To:</p>
							<div style={{ width: 10 }}></div>
							<input
								value={dateTime.to}
								onChange={(e) => {
									setDateTime({ ...dateTime, to: e.target.value });
								}}
								style={{ color: "#422afb" }}
								type="datetime-local"
							/>
						</Flex>
					</div>
				)}

				{(dateTime.from || dateTime.to) && (
					<Button
						colorScheme="red"
						variant="outline"
						ml={3}
						size="sm"
						onClick={() =>
							setDateTime({
								from: "",
								to: "",
							})
						}
					>
						Clear
					</Button>
				)}
			</Flex> */}
			<Card
				direction="column"
				w="100%"
				overflowX={{ sm: "scroll", lg: "hidden" }}
			>
				{(user?.role === "superAdmin" ||
					user?.roles[0]?.roleName === "Manager") && (
					<Button
						size="sm"
						variant="outline"
						colorScheme="gray"
						bg="whiteAlpha.300"
						mt={{ base: "5px", md: "0" }}
						alignSelf={{ base: "center", sm: "end" }} // Center on mobile, end on larger devices
						onClick={() => setBulkAssign(true)}
						width="fit-content"
						isDisabled={!(selectedValues && selectedValues.length > 1)}
						leftIcon={<FaTasks />}
					>
						Bulk Assign
					</Button>
				)}
				<Grid templateColumns="repeat(12, 1fr)" gap={2}>
					<GridItem
						colSpan={{ base: 8 }}
						display={"flex"}
						alignItems={"center"}
					>
						<Flex alignItems={"center"} flexWrap={"wrap"}>
							<Text
								color={useColorModeValue("secondaryGray.900", "white")}
								fontSize="22px"
								fontWeight="600"
							>
								Leads (<span>{totalLeads || 0}</span>)
							</Text>
							<CustomSearchInput
								searchbox={searchbox}
								dataColumn={dataColumn}
								isPaginated={true}
								fetchSearch={fetchSearch}
							/>
							<Button
								variant="outline"
								colorScheme="brand"
								leftIcon={<SearchIcon />}
								onClick={() => setAdvaceSearch(true)}
								mt={{ sm: "5px", md: "0" }}
								size="sm"
							>
								Advance Search
							</Button>
							{displaySearchData ||
								(displayAdvSearchData && (
									<Button
										variant="outline"
										size="sm"
										colorScheme="red"
										ms={2}
										onClick={() => {
											handleClear();

											setGetTagValues([]);
										}}
									>
										Clear
									</Button>
								))}

							{selectedValues.length > 0 && access?.delete && (
								<DeleteIcon
									cursor={"pointer"}
									onClick={() => setDelete(true)}
									color={"red"}
									ms={2}
								/>
							)}
						</Flex>
					</GridItem>

					<GridItem
						colSpan={{ base: 4 }}
						display={"flex"}
						justifyContent={"end"}
						alignItems={"center"}
						textAlign={"right"}
					>
						<Menu isLazy>
							<MenuButton p={4}>
								<BsColumnsGap />
							</MenuButton>
							<MenuList
								minW={"fit-content"}
								transform={"translate(1670px, 60px)"}
								zIndex={2}
							>
								<MenuItem
									onClick={() => setManageColumns(true)}
									width={"165px"}
								>
									{" "}
									Manage Columns
								</MenuItem>
								{user?.role === "superAdmin" && (
									<>
										<MenuItem
											width={"165px"}
											onClick={() => setIsImportLead(true)}
										>
											{" "}
											Import Leads
										</MenuItem>
										<MenuDivider />
										<MenuItem
											width={"165px"}
											onClick={() => handleExportLeads("csv")}
										>
											{selectedValues && selectedValues?.length > 0
												? "Export Selected Data as CSV"
												: "Export as CSV"}
										</MenuItem>
										<MenuItem
											width={"165px"}
											onClick={() => handleExportLeads("xlsx")}
										>
											{selectedValues && selectedValues?.length > 0
												? "Export Selected Data as Excel"
												: "Export as Excel"}
										</MenuItem>
									</>
								)}
							</MenuList>
						</Menu>

						{access?.create && (
							<Button
								onClick={() => handleClick()}
								size="sm"
								variant="brand"
								leftIcon={<AddIcon />}
							>
								Add New
							</Button>
						)}
					</GridItem>
					<HStack spacing={4} mb={2}>
						{getTagValues &&
							getTagValues.map((item) => (
								<Tag
									size="sm"
									p={2}
									key={item}
									borderRadius="full"
									variant="solid"
									backgroundColor="brand.100"
									color="brand.800"
								>
									<TagLabel>{item}</TagLabel>
								</Tag>
							))}
					</HStack>
				</Grid>
				{bulkAssign && selectedValues?.length && (
					<BulkAssignModal
						refreshData={bulkRefreshData}
						bulkAssign={bulkAssign}
						setBulkAssign={setBulkAssign}
						setSelectedValues={setSelectedValues}
						selectedValues={selectedValues}
						setSelectAllChecked={setSelectAllChecked}
					/>
				)}

				<Box overflowY={"auto"} w="100%" className="table-fix-container">
					<Table
						{...getTableProps()}
						color="black"
						mb="30px"
						sx={{
							"& tbody tr:hover": {
								// Apply hover effect directly to rows
								backgroundColor: "white", // Hover background
								boxShadow: "sm", // Add subtle shadow on hover
								transition: "background-color 0.2s ease, box-shadow 0.2s ease", // Smooth transition
							},
						}}
					>
						<Thead zIndex={1} height="10vh">
							{headerGroups?.map((headerGroup, index) => (
								<Tr
									{...headerGroup.getHeaderGroupProps()}
									key={index}
									position="sticky"
									top="0"
									zIndex="2"
									height="60px"
									width="100%"
									borderRadius="10px 10px 0 0"
									borderBottom="1px solid #ebd3a6"
									bg="brand.200"
									opacity="1"
									marginBottom="1rem"
								>
									{headerGroup.headers?.map((column, index) => (
										<Th
											{...column.getHeaderProps(
												column.isSortable !== false &&
													column.getSortByToggleProps()
											)}
											key={index}
											textAlign="center" // Center text in the cell
											borderColor="gray.200"
											fontWeight="medium"
											maxWidth="150px"
										>
											<Flex
												align="center"
												justifyContent="center" // Center the Flex content
												fontSize={{ sm: "12px", lg: "14px" }}
											>
												{column.Header === "#" && (
													<Checkbox
														borderColor="brand.600"
														value="true"
														isChecked={selectAllChecked}
														onChange={(event) => {
															setSelectAllChecked(!selectAllChecked);
															if (event.target.checked) {
																const ids = page?.map((l) => l?.original?._id);
																setSelectedValues(() => [...ids]);
															} else {
																setSelectedValues([]);
															}
														}}
														me="10px"
													/>
												)}
												<span
													style={{
														textTransform: "capitalize",
														textAlign: "center", // Ensure text alignment
													}}
												>
													{column.render("Header")}
												</span>
												{column.isSortable !== false && (
													<span>
														{column.isSorted ? (
															column.isSortedDesc ? (
																<FaSortDown />
															) : (
																<FaSortUp />
															)
														) : (
															<FaSort />
														)}
													</span>
												)}
											</Flex>
										</Th>
									))}
								</Tr>
							))}
						</Thead>
						<Tbody
							{...getTableBodyProps()}
							mb="24px"
							sx={{
								"& tbody tr:hover": {
									backgroundColor: "white",
									boxShadow: "sm",
									transition:
										"background-color 0.2s ease, box-shadow 0.2s ease",
								},
							}}
						>
							{isLoding ? (
								<TableLoading columns={columns} length={8} />
							) : !showTable ? (
								<TableLoading columns={columns} length={8} />
							) : data?.length ? (
								page?.map((row, i) => {
									prepareRow(row);
									// updatedStatuses?.forEach((status) => {
									// 	if (status?.id === row?.original?._id) {
									// 		row.cells.find(
									// 			(cell) => cell?.column?.Header === "Status"
									// 		).value = status?.status;
									// 	}
									// });

									return (
										<Tr {...row?.getRowProps()} key={i} className="leadRow">
											{row?.cells?.map((cell, index) => {
												let data = "";
												if (cell?.column.Header === "#") {
													data = (
														<Flex align="center">
															<Checkbox
																colorScheme="brandScheme"
																value={selectedValues}
																isChecked={selectedValues.includes(
																	row.original?._id
																)}
																onChange={(event) =>
																	handleCheckboxChange(event, row.original?._id)
																}
																me="10px"
															/>
															<Text
																color={textColor}
																fontSize="sm"
																fontWeight="600"
															>
																{cell?.value || "-"}
															</Text>
														</Flex>
													);
												} else if (cell?.column.Header === "Name") {
													data = access?.view ? (
														// <Text
														// 	onClick={() =>
														// 		handleLeadsModal(row.original?._id)
														// 	}
														// 	me="10px"
														// 	sx={{
														// 		"&:hover": {
														// 			color: "blue.500",
														// 			textDecoration: "underline",
														// 		},
														// 	}}
														// 	cursor="pointer"
														// 	color={"brand.600"}
														// 	fontSize="sm"
														// 	fontWeight="600"
														// 	textAlign="center"
														// 	width={140}
														// >
														// 	{cell?.value?.text || cell?.value}
														// 	{row?.original?.leadType === "leadpool" &&
														// 		user.role !== "superAdmin" && (
														// 			<Badge
														// 				colorScheme="blue"
														// 				size="xs"
														// 				mx="2px"
														// 				textTransform="lowercase"
														// 				sx={{
														// 					fontSize: "0.6rem",
														// 				}}
														// 				p=".6em"
														// 				rounded="full"
														// 			>
														// 				Pool
														// 			</Badge>
														// 		)}
														// </Text>
														<Flex
															alignItems="center"
															width={200}
															textAlign="left"
														>
															<Text
																onClick={() =>
																	handleLeadsModal(row.original?._id)
																}
																me="10px"
																sx={{
																	"&:hover": {
																		color: "blue.500",
																		textDecoration: "underline",
																	},
																}}
																cursor="pointer"
																color={"brand.600"}
																fontSize="sm"
																fontWeight="600"
															>
																{cell?.value?.text || cell?.value}
															</Text>
															{row?.original?.leadType === "leadpool"
																? user.roles[0].roleName === "Agent" && (
																		<Badge
																			colorScheme="green"
																			fontSize="0.7rem"
																			size="sm"
																			p="2px"
																			rounded="full"
																			textTransform="capitalize"
																		>
																			Pool
																		</Badge>
																	)
																: row?.original?.leadType === "release" && (
																		<Badge
																			colorScheme="pink"
																			fontSize=".7rem"
																			size="sm"
																			p="2px"
																			rounded="full"
																			textTransform="capitalize"
																		>
																			release
																		</Badge>
																	)}
														</Flex>
													) : (
														<Text
															me="10px"
															fontSize="sm"
															fontWeight="600"
															textAlign="center"
														>
															{cell?.value?.text || cell?.value}
															{/* {row?.original?.leadType === "leadpool" && (
																<span>leadpool</span>
															)} */}
														</Text>
													);
												} else if (cell?.column.Header === "Whatsapp") {
													data = (
														<Text
															me="10px"
															fontSize="sm"
															fontWeight="500"
															width={140}
														>
															{cell?.value?.text || cell?.value || "-"}
														</Text>
													);
												} else if (cell?.column.Header === "Phone") {
													data = callAccess?.create ? (
														<Text
															me="10px"
															fontSize="sm"
															fontWeight="500"
															maxWidth={140}
															sx={{
																"&:hover": {
																	color: "blue.500",
																	textDecoration: "underline",
																	cursor: "pointer",
																},
															}}
															onClick={() => {
																setAddPhoneCall(true);
																setCallSelectedId(row?.original?._id);
															}}
														>
															{cell?.value?.formula || cell?.value || "-"}
														</Text>
													) : (
														<Text me="10px" fontSize="sm" fontWeight="600">
															{cell?.value?.formula || cell?.value || "-"}
														</Text>
													);
												} else if (cell?.column.Header === "Address") {
													data = (
														<Text fontSize="sm" fontWeight={500}>
															{cell?.value && cell.value !== "-"
																? cell.value
																: "no address"}
														</Text>
													);
												} else if (cell?.column.Header === "Status") {
													// data = (
													// 	<div className="selectOpt">
													// 		<RenderStatus
													// 			setUpdatedStatuses={setUpdatedStatuses}
													// 			id={cell?.row?.original?._id}
													// 			cellValue={cell?.value}
													// 		/>
													// 	</div>
													// );

													let cellContent = cell.render("Cell");

													// Replace the "Status" cell with the status dropdown
													if (cell.column.Header === "Status") {
														cellContent = (
															<RenderStatus
																id={cell?.row?.original?._id}
																cellValue={cell?.value}
																updateRowStatus={updateRowStatus}
																rowOriginalStatus={row?.original?.leadStatus}
															/>
														);
													}

													return (
														<td key={cell.column.id} {...cell.getCellProps()}>
															{cellContent}
														</td>
													);
												} else if (cell?.column.Header === "E.Status") {
													data = (
														<div>
															<RenderEStatus
																// setUpdatedEStatus={setUpdatedEStatus}
																id={cell?.row?.original?._id}
																cellValue={cell?.value}
																user={user}
															/>
														</div>
													);
												} else if (cell?.column.Header === "Manager") {
													data = (
														<RenderManager
															id={row?.original?._id}
															updateRowStatus={updateRowStatus}
															displaySearchData={
																displaySearchData || displayAdvSearchData
															}
															setSearchedData={setSearchedData}
															pageIndex={pageIndex}
															setData={setData}
															leadID={row?.original?._id?.toString()}
															value={cell?.value}
															isAdmin={user?.role === "superAdmin"}
														/>
													);
												} else if (cell?.column.Header === "Agent") {
													data = (
														<>
															<RenderAgent
																updateRowStatus={updateRowStatus}
																tableDataUpdate={tableDataUpdate}
																setData={setData}
																leadID={row?.original?._id?.toString()}
																managerAssigned={row?.original?.managerAssigned}
																displaySearchData={
																	displaySearchData || displayAdvSearchData
																}
																setSearchedData={setSearchedData}
																value={cell?.value}
															/>
														</>
													);
												} else if (cell?.column.Header === "Nationality") {
													data = (
														<Text
															fontSize="md"
															fontWeight="medium"
															textAlign={"center"}
														>
															{cell?.value?.text ||
																cell?.value ||
																"Not available"}
														</Text>
													);
												} else if (cell?.column.Header === "Language") {
													data = (
														<Text
															fontSize="md"
															fontWeight="medium"
															textAlign={"center"}
														>
															{cell?.value || "Not Available"}
														</Text>
													);
												} else if (cell?.column.Header === "Timetocall") {
													data = (
														<Text
															fontSize="sm"
															fontWeight={500}
															width={300}
															textAlign={"center"}
														>
															{cell?.value?.text || cell?.value || "no Data"}
														</Text>
													);
												} else if (cell?.column.Header === "Budget") {
													data = (
														<Text
															fontSize="sm"
															fontWeight={500}
															width={100}
															textAlign={"center"}
														>
															{cell?.value || (
																<span style={{ color: "#444" }}>No Data</span>
															)}
														</Text>
													);
												} else if (cell?.column.Header === "Date & Time") {
													data = (
														<Text
															fontSize={"sm"}
															textAlign={"center"}
															fontWeight="500"
															width={150}
														>
															{new Date(
																cell?.value?.text || cell?.value
															).toLocaleString() || "Not available"}
														</Text>
													);
												} else if (cell?.column.Header === "Last Note") {
													data = (
														<Text width={200} fontSize={"sm"}>
															{cell?.value || "no note"}
														</Text>
													);
												} else if (cell?.column.Header === "Country") {
													data = (
														<Text fontSize={"sm"} width={150} fontWeight={500}>
															{cell?.value || "no country"}
														</Text>
													);
												} else if (cell?.column.Header === "Address") {
													data = (
														<Text
															color="black"
															fontSize={"sm"}
															fontWeight={500}
														>
															{cell?.value || "no address"}
														</Text>
													);
												} else if (cell?.column.Header === "Campaign") {
													data = (
														<Text fontSize={"sm"} width={150}>
															{cell?.value || "no campaign"}
														</Text>
													);
												} else if (cell?.column.Header === "Source Content") {
													data = (
														<Text fontSize={"sm"} width={150}>
															{cell?.value || "no content"}
														</Text>
													);
												} else if (cell?.column.Header === "Email") {
													data = (
														<Text fontSize={"sm"} width={150}>
															{cell?.value || "no email"}
														</Text>
													);
												} else if (cell?.column.Header === "Medium") {
													data = (
														<Text fontSize={"sm"} width={200}>
															{cell?.value || "no medium"}
														</Text>
													);
												} else if (cell?.column.Header === "Campaign URL") {
													data = (
														<Text fontSize={"sm"} width={300}>
															{cell?.value || "no URL"}
														</Text>
													);
												} else if (cell?.column.Header === "In UAE?") {
													data = (
														<Text fontSize={"sm"} width={140}>
															{cell?.value || "not selected"}
														</Text>
													);
												} else if (cell?.column.Header === "Release") {
													data = (
														<ReleaseLead
															isReleased={row.original?.isReleased}
															role={user?.roles[0]?.roleName}
															leadId={row.original?._id}
															refreshData={refreshData}
															setData={
																displayAdvSearchData ? setSearchedData : setData
															}
														/>
													);
												} else if (cell?.column.Header === "Action") {
													data = (
														<Text
															fontSize="md"
															fontWeight="900"
															textAlign={"center"}
														>
															<Menu isLazy>
																<MenuButton>
																	<CiMenuKebab />
																</MenuButton>
																<MenuList
																	minW={"fit-content"}
																	transform={"translate(1520px, 173px);"}
																>
																	{access?.update &&
																	user?.role === "superAdmin" ? (
																		<MenuItem
																			py={2.5}
																			onClick={() => {
																				setEdit(true);
																				setSelectedId(cell?.row?.original._id);
																			}}
																			icon={<EditIcon fontSize={15} mb={1} />}
																		>
																			Edit
																		</MenuItem>
																	) : (
																		""
																	)}
																	{callAccess?.create && (
																		<MenuItem
																			py={2.5}
																			width={"165px"}
																			onClick={() => {
																				setAddPhoneCall(true);
																				setCallSelectedId(
																					cell?.row?.values._id
																				);
																			}}
																			icon={<PhoneIcon fontSize={15} mb={1} />}
																		>
																			Create Call
																		</MenuItem>
																	)}
																	{emailAccess?.create && (
																		<MenuItem
																			py={2.5}
																			width={"165px"}
																			onClick={() => {
																				setAddEmailHistory(true);
																				setSelectedId(cell?.row?.values._id);
																			}}
																			icon={<EmailIcon fontSize={15} mb={1} />}
																		>
																			Send Email
																		</MenuItem>
																	)}
																	<MenuItem
																		py={2.5}
																		width={"max-content"}
																		onClick={() => {
																			// navigate(
																			//   "/leadCycle/" + row?.original?._id
																			// );
																			setIsLeadCycle({
																				isOpen: true,
																				id: row?.original?._id,
																			});
																		}}
																		icon={<FaHistory fontSize={15} mb={1} />}
																	>
																		View Lead cycle
																	</MenuItem>
																	<MenuItem
																		py={2.5}
																		width={"max-content"}
																		onClick={() => {
																			navigate(
																				"/leadHistory/" + cell?.row?.values?._id
																			);
																		}}
																		icon={<FaHistory fontSize={15} mb={1} />}
																	>
																		View Call history
																	</MenuItem>

																	<MenuItem
																		display={{ sm: "block", xl: "none" }}
																		py={2.5}
																		width={"195px"}
																		onClick={() => {
																			const contact = parseInt(
																				cell?.row?.values?.leadPhoneNumber
																			);
																			if (contact)
																				document.location.href = `tel:+92${contact}`;
																		}}
																		icon={<PhoneIcon fontSize={15} mb={1} />}
																	>
																		Open in Dialpad
																	</MenuItem>

																	<MenuItem
																		py={2.5}
																		width={"210px"}
																		onClick={() => {
																			const contact = parseInt(
																				cell?.row?.values?.leadPhoneNumber
																			);
																			if (contact)
																				window.open(
																					`https://api.whatsapp.com/send/?phone=${contact}`
																				);
																		}}
																		icon={<BsWhatsapp fontSize={15} mb={1} />}
																	>
																		Open in Whatsapp
																	</MenuItem>
																	{user?.roles[0]?.roleName === "Agent" && (
																		<MenuItem
																			py={2.5}
																			width={"210px"}
																			onClick={() => {
																				setTaskInits(row?.original);
																				onTaskOpen();
																			}}
																			icon={<MdTask fontSize={15} mb={1} />}
																		>
																			Create Follow Up
																		</MenuItem>
																	)}
																	{/* {access?.view && (
                                    <MenuItem
                                      py={2.5}
                                      color={"green"}
                                      onClick={() =>
                                        navigate(
                                          `/leadView/${cell?.row?.original._id}`
                                        )
                                      }
                                      icon={<ViewIcon fontSize={15} mb={1} />}
                                    >
                                      View
                                    </MenuItem>
                                  )} */}
																	{access?.delete &&
																	user?.role == "superAdmin" ? (
																		<MenuItem
																			py={2.5}
																			color={"red"}
																			onClick={() => {
																				setSelectedValues([
																					cell?.row?.original._id,
																				]);
																				setDelete(true);
																			}}
																			icon={<DeleteIcon fontSize={15} mb={1} />}
																		>
																			Delete
																		</MenuItem>
																	) : (
																		""
																	)}
																</MenuList>
															</Menu>
														</Text>
													);
												}
												return (
													<Td
														paddingTop={"0.35rem"}
														paddingBottom={"0.35rem"}
														paddingLeft={"5px"}
														paddingRight={"5px"}
														{...cell?.getCellProps()}
														key={index}
														style={
															cell?.column?.Header === "Manager"
																? { padding: "0 5px 0 0" }
																: cell?.column?.Header === "Agent"
																	? { padding: 0 }
																	: {}
														}
														fontSize={{ sm: "14px" }}
														minW={{ sm: "150px", md: "200px", lg: "auto" }}
														borderColor="transparent"
													>
														{data}
													</Td>
												);
											})}
										</Tr>
									);
								})
							) : (
								data?.length === 0 && (
									<Tr>
										<Td colSpan={columns.length}>
											<Text
												textAlign={"center"}
												width="100%"
												color={textColor}
												fontSize="sm"
												fontWeight="600"
											>
												<DataNotFound />
											</Text>
										</Td>
									</Tr>
								)
							)}
						</Tbody>
					</Table>
				</Box>
				{data?.length > 0 && (
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

				<AddEmailHistory
					fetchData={fetchData}
					isOpen={addEmailHistory}
					onClose={setAddEmailHistory}
					data={data?.contact}
					lead="true"
					id={selectedId}
				/>

				{/* <AddTask
					leadData={taskInits}
					fetchData={() => {}}
					isOpen={isTaskOpen}
					onClose={onTaskClose}
				/> */}

				<AddPhoneCall
					fetchData={fetchData}
					isOpen={addPhoneCall}
					onClose={setAddPhoneCall}
					data={data?.contact}
					id={callSelectedId}
					lead="true"
				/>

				{isOpen && (
					<Add
						isOpen={isOpen}
						size={size}
						setLeadData={setLeadData}
						leadData={leadData[0]}
						onClose={onClose}
						fetchData={fetchData}
						setAction={setAction}
						action={action}
						refreshData={refreshData}
					/>
				)}
				{selectedId && (
					<Edit
						isOpen={edit}
						size={size}
						setLeadData={setLeadData}
						leadData={leadData[0]}
						selectedId={selectedId}
						setSelectedId={setSelectedId}
						onClose={setEdit}
						setAction={setAction}
						moduleId={leadData?.[0]?._id}
					/>
				)}

				<ImportModal
					text="Lead file"
					fetchData={fetchData}
					isOpen={isImportLead}
					onClose={setIsImportLead}
				/>
			</Card>
			{/* Advance filter */}
			<AdvancedSearchModal
				advaceSearch={advaceSearch}
				setFormValues={setFormValues}
				fetchAdvancedSearch={fetchAdvancedSearch}
				setGetTagValues={setGetTagValues}
				setSearchClear={setSearchClear}
				isLoading={isLoding}
				handleClear={handleClear}
				setAdvaceSearch={setAdvaceSearch}
				isFormReset={isFormReset}
				setIsFormReset={setIsFormReset}
			/>

			<ManageColumnModal
				setManageColumns={setManageColumns}
				manageColumns={manageColumns}
				handleColumnClear={handleColumnClear}
				toggleColumnVisibility={toggleColumnVisibility}
				selectedColumns={selectedColumns}
				dynamicColumns={dynamicColumns}
				isLoding={isLoding}
				saveManageCols={saveManageCols}
			/>

			{/* <Modal
				onClose={() => {
					setManageColumns(false);
				}}
				isOpen={manageColumns}
				isCentered
			>
				<ModalOverlay />
				<ModalContent height={"90vh"} overflowY={"scroll"}>
					<ModalHeader>Manage Columns</ModalHeader>
					<ModalCloseButton
						onClick={() => {
							setManageColumns(false);
						}}
					/>
					<ModalBody>
						<div>
							{dynamicColumns.map((column) => (
								<Text display={"flex"} key={column.accessor} py={2}>
									<Checkbox
										value={selectedColumns.some(
											(selectedColumn) =>
												selectedColumn.accessor === column.accessor
										)}
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
							colorScheme="brand"
							size="sm"
							mr={2}
							onClick={saveManageCols}
							disabled={isLoding ? true : false}
						>
							{isLoding ? <Spinner /> : "Save"}
						</Button>
						<Button
							size="sm"
							variant="outline"
							colorScheme="red"
							onClick={() => handleColumnClear()}
						>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal> */}
			{/* Delete model */}
			<Delete
				isOpen={deleteModel}
				onClose={setDelete}
				setSelectedValues={setSelectedValues}
				url="api/lead/deleteMany"
				data={selectedValues}
				method="many"
				setAction={setAction}
				setSelectAllChecked={setSelectAllChecked}
			/>

			{leadsModal.isOpen && (
				<LeadsModal
					leadsModal={leadsModal}
					onClose={() => setLeadsModal({ isOpen: false, lid: null })}
					reFreshData={refreshData}
				/>
			)}
		</>
	);
});

export default CheckTable;
