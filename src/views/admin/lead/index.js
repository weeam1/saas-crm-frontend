import { Button, Flex, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getApi } from 'services/api';
import { HasAccess } from '../../../redux/accessUtils';
import CheckTable from './components/CheckTable';
import { postApi } from 'services/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useUserSession from 'hooks/useUserSession';
import { usePermissions } from 'hooks/usePermissions';
import { useNavigate } from 'react-router-dom';

const Index = ({ handleView, view }) => {
	const [isLoding, setIsLoding] = useState(false);
	const [data, setData] = useState([]);
	const [displaySearchData, setDisplaySearchData] = useState(false);
	const [displayAdvSearchData, setDisplayAdvSearchData] = useState(false);
	const [searchedData, setSearchedData] = useState([]);
	// const user = JSON.parse(localStorage.getItem('user'));

	const { user, userRoleName, isSuperAdmin } = useUserSession();
	const { hasPermission } = usePermissions();
	const navigate = useNavigate();

	useEffect(() => {
		if (!hasPermission('leads')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	const [totalLeads, setTotalLeads] = useState(0);
	const [pages, setPages] = useState(0);
	const [hideColumns, setHideColumns] = useState([]);

	const tree = useSelector((state) => state.user.tree);
	const [permission, emailAccess, callAccess] = HasAccess([
		'Lead',
		'Email',
		'Call',
	]);

	const tableColumns = [
		{ Header: '#', accessor: 'intID', isSortable: false, width: 10 },
		{ Header: 'Name', accessor: 'leadName', width: 20 },
		{ Header: 'Manager', accessor: 'managerAssigned' },
		{ Header: 'Agent', accessor: 'agentAssigned' },
		{ Header: 'M.Status', accessor: 'eLeadStatus' },
		{ Header: 'Status', accessor: 'leadStatus' },
		{ Header: 'Manager Assign Date', accessor: 'managerAssignedDate' },
		{ Header: 'Agent Assign Date', accessor: 'agentAssignedDate' },
		{ Header: 'Whatsapp', accessor: 'leadWhatsappNumber' },
		{ Header: 'Phone', accessor: 'leadPhoneNumber' },
		{ Header: 'Date & Time', accessor: 'createdDate', width: 40 },
		{ Header: 'Timetocall', accessor: 'timetocall' },
		{ Header: 'Budget', accessor: 'budget' },
		{ Header: 'Nationality', accessor: 'nationality' },
		{ Header: 'Language', accessor: 'leadLang' },

		{ Header: 'Last Note', width: 100, accessor: 'lastNote' },
		{ Header: 'Country', accessor: 'ip' },
		{ Header: 'Source Content', accessor: 'leadSourceDetails' },
		{ Header: 'Attendence Day', accessor: 'attendanceDay' },

		{ Header: 'Campaign', accessor: 'leadCampaign' },
		{ Header: 'Campaign URL', accessor: 'pageUrl' },
		{ Header: 'Address', accessor: 'leadAddress' },
		{ Header: 'Email', accessor: 'leadEmail' },
		{ Header: 'Medium', accessor: 'leadSourceMedium' },
		{ Header: 'In UAE?', accessor: 'r_u_in_uae' },
		{ Header: 'Action', isSortable: false, center: true },
	];
	const tableColumnsManager = [
		{ Header: '#', accessor: 'intID', isSortable: false, width: 10 },
		{ Header: 'Name', accessor: 'leadName', width: 20 },
		{ Header: 'Manager', accessor: 'managerAssigned' },
		{ Header: 'Agent', accessor: 'agentAssigned' },
		{ Header: 'M.Status', accessor: 'eLeadStatus' },
		{ Header: 'Status', accessor: 'leadStatus' },
		// { Header: 'Whatsapp', accessor: 'leadWhatsappNumber' },
		// { Header: 'Phone', accessor: 'leadPhoneNumber' },
		{ Header: 'Date & Time', accessor: 'createdDate', width: 40 },
		{ Header: 'Timetocall', accessor: 'timetocall' },
		{ Header: 'Budget', accessor: 'budget' },
		{ Header: 'Nationality', accessor: 'nationality' },
		{ Header: 'Language', accessor: 'leadLang' },
		{ Header: 'Last Note', width: 100, accessor: 'lastNote' },
		{ Header: 'Country', accessor: 'ip' },
		{ Header: 'Source Content', accessor: 'leadSourceDetails' },
		{ Header: 'Campaign', accessor: 'leadCampaign' },
		{ Header: 'Campaign URL', accessor: 'pageUrl' },
		{ Header: 'Address', accessor: 'leadAddress' },
		// { Header: 'Email', accessor: 'leadEmail' },
		{ Header: 'Medium', accessor: 'leadSourceMedium' },
		{ Header: 'In UAE?', accessor: 'r_u_in_uae' },
		{ Header: 'Release', isSortable: false, center: true },
		{ Header: 'Action', isSortable: false, center: true },
	];
	const tableColumnsAgent = [
		{ Header: '#', accessor: 'intID', isSortable: false, width: 10 },
		{ Header: 'Name', accessor: 'leadName', width: 20 },
		{ Header: 'Manager', accessor: 'managerAssigned' },
		{ Header: 'M.Status', accessor: 'eLeadStatus' },
		{ Header: 'Status', accessor: 'leadStatus' },
		{ Header: 'Whatsapp', accessor: 'leadWhatsappNumber' },
		{ Header: 'Phone', accessor: 'leadPhoneNumber' },
		{ Header: 'Date & Time', accessor: 'createdDate', width: 40 },
		{ Header: 'Timetocall', accessor: 'timetocall' },
		{ Header: 'Budget', accessor: 'budget' },
		{ Header: 'Nationality', accessor: 'nationality' },
		{ Header: 'Language', accessor: 'leadLang' },
		{ Header: 'Last Note', width: 100, accessor: 'lastNote' },
		{ Header: 'Country', accessor: 'ip' },
		{ Header: 'Address', accessor: 'leadAddress' },
		{ Header: 'Campaign', accessor: 'leadCampaign' },
		{ Header: 'Source Content', accessor: 'leadSourceDetails' },
		{ Header: 'Email', accessor: 'leadEmail' },
		{ Header: 'Medium', accessor: 'leadSourceMedium' },
		{ Header: 'Campaign URL', accessor: 'pageUrl' },
		{ Header: 'In UAE?', accessor: 'r_u_in_uae' },
		{ Header: 'Release', isSortable: false, center: true },
		{ Header: 'Action', isSortable: false, center: true },
	];

	const roleColumns = {
		Manager: tableColumnsManager,
		Agent: tableColumnsAgent,
	};

	const role = userRoleName;

	const [dynamicColumns, setDynamicColumns] = useState(
		roleColumns[role] || tableColumns
	);

	const hiddenFields = JSON.parse(
		localStorage.getItem('userCustomColumns') || '[]'
	);
	const [selectedColumns, setSelectedColumns] = useState(
		roleColumns[role]?.filter(
			(c) => hiddenFields?.includes(c.accessor) === false
		) ||
			tableColumns?.filter((c) => hiddenFields?.includes(c.accessor) === false)
	);

	const [action, setAction] = useState(false);
	const [dateTime, setDateTime] = useState({
		from: '',
		to: '',
	});
	const [autoAssignLoading, setAutoAssignLoading] = useState(false);
	const [columns, setColumns] = useState(roleColumns[role] || tableColumns);
	const { isOpen } = useDisclosure();

	const dataColumn = dynamicColumns?.filter((item) =>
		selectedColumns?.find((colum) => colum?.Header === item.Header)
	);

	const fetchData = async (pageNo = 1, pageSize = 30) => {
		setIsLoding(true);

		let result = await getApi(
			isSuperAdmin
				? 'api/lead/' +
						'?dateTime=' +
						dateTime?.from +
						'|' +
						dateTime?.to +
						'&page=' +
						pageNo +
						'&pageSize=' +
						pageSize
				: `api/lead/?user=${user._id}&role=${
						userRoleName
					}&page=${pageNo}&pageSize=${pageSize}&dateTime=${
						dateTime?.from + '|' + dateTime?.to
					}`
		);

		const newData = result.data?.result?.map((lead) => {
			if (lead?.ip) {
				const parts = lead?.ip.split('-');

				// Return only the IP part, which is the first element of the array
				lead.ip = parts?.length > 1 ? parts[1] : parts[0];
			}
			return { ...lead };
		});

		setData(newData || []);
		setPages(result.data?.totalPages || 0);
		setTotalLeads(result.data?.totalLeads || 0);
		setIsLoding(false);
	};

	const fetchUserCustomColumns = async () => {
		try {
			// Check if data exists in localStorage
			const cachedData = localStorage.getItem('userCustomColumns');

			if (cachedData) {
				// Parse and set data from localStorage
				const parsedData = JSON.parse(cachedData);
				setHideColumns(parsedData || []);
				setSelectedColumns(
					roleColumns[role]?.filter(
						(c) => parsedData.includes(c.accessor) === false
					) ||
						tableColumns?.filter(
							(c) => parsedData.includes(c.accessor) === false
						)
				);
			} else {
				// Fetch from backend if not found in localStorage
				let { data } = await getApi(`api/customColumns/${user._id}`);

				if (!data?.doc) {
					setHideColumns([]);
				} else {
					const customCols = data?.doc?.columns;
					setHideColumns(customCols);
					setSelectedColumns(
						roleColumns[role]?.filter(
							(c) => customCols.includes(c.accessor) === false
						) ||
							tableColumns?.filter(
								(c) => customCols.includes(c.accessor) === false
							)
					);

					// Store fetched data in localStorage
					localStorage.setItem('userCustomColumns', JSON.stringify(customCols));
				}
			}
		} catch (error) {
			console.error('Error fetching custom columns:', error);
		}
	};

	const refetchData = async (pageNo = 1, pageSize = 30) => {
		let result = await getApi(
			isSuperAdmin
				? 'api/lead/' +
						'?dateTime=' +
						dateTime?.from +
						'|' +
						dateTime?.to +
						'&page=' +
						pageNo +
						'&pageSize=' +
						pageSize
				: `api/lead/?user=${user._id}&role=${
						userRoleName
					}&page=${pageNo}&pageSize=${pageSize}&dateTime=${
						dateTime?.from + '|' + dateTime?.to
					}`
		);

		const newData = result.data?.result?.map((lead) => {
			if (lead?.ip) {
				const parts = lead?.ip.split('-');

				// Return only the IP part, which is the first element of the array
				lead.ip = parts?.length > 1 ? parts[1] : parts[0];
			}
			return { ...lead };
		});

		setData(newData || []);
		setPages(result.data?.totalPages || 0);
		setTotalLeads(result.data?.totalLeads || 0);
	};

	const fetchSearchedData = async (term = '', pageNo = 1, pageSize = 30) => {
		setIsLoding(true);

		let result = await getApi(
			isSuperAdmin
				? 'api/lead/search' +
						'?term=' +
						term +
						'&dateTime=' +
						dateTime?.from +
						'|' +
						dateTime?.to +
						'&page=' +
						pageNo +
						'&pageSize=' +
						pageSize
				: `api/lead/search?term=${term}&user=${user._id}&role=${
						userRoleName
					}&dateTime=${
						dateTime?.from + '|' + dateTime?.to
					}&page=${pageNo}&pageSize=${pageSize}`
		);
		setDisplaySearchData(true);
		const newData = result.data?.result?.map((lead) => {
			if (lead?.ip) {
				const parts = lead?.ip.split('-');

				// Return only the IP part, which is the first element of the array
				lead.ip = parts?.length > 0 ? parts[1] : parts[0];
			}
			return { ...lead };
		});
		setSearchedData(newData || []);
		setPages(result.data?.totalPages || 0);
		setTotalLeads(result.data?.totalLeads || 0);
		setIsLoding(false);
	};

	const fetchAdvancedSearch = async (data = {}, pageNo = 1, pageSize = 30) => {
		setIsLoding(true);
		// change the new v2 search api
		let result = await getApi(
			isSuperAdmin
				? 'api/lead/v2/advanced-search' +
						'?data=' +
						JSON.stringify(data) +
						'&dateTime=' +
						dateTime?.from +
						'|' +
						dateTime?.to +
						'&page=' +
						pageNo +
						'&pageSize=' +
						pageSize
				: `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&user=${
						user._id
					}&role=${userRoleName}&dateTime=${
						dateTime?.from + '|' + dateTime?.to
					}&page=${pageNo}&pageSize=${pageSize}`
		);
		setDisplayAdvSearchData(true);
		setIsLoding(false);
		const newData = result.data?.result?.map((lead) => {
			if (lead?.ip) {
				const parts = lead?.ip.split('-');

				// Return only the IP part, which is the first element of the array
				lead.ip = parts?.length > 0 ? parts[1] : parts[0];
			}
			return { ...lead };
		});
		setSearchedData(newData || []);
		setPages(result.data?.totalPages || 0);
		setTotalLeads(result.data?.totalLeads || 0);
	};

	const autoAssign = async () => {
		try {
			setAutoAssignLoading(true);
			let agents = [];

			if (tree && tree['managers']) {
				agents = tree['agents']['manager-' + user?._id?.toString()];
			}
			await postApi('api/user/autoAssign', { agents });
			setAutoAssignLoading(false);
			toast.success('Auto assignment of agents done!');
			fetchData();
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong!');
		}
	};

	useEffect(() => {
		fetchUserCustomColumns();
		setColumns(tableColumns);
	}, []);

	return (
		<div>
			<Grid templateColumns='repeat(6, 1fr)' mb={3} gap={4}>
				<GridItem colSpan={6}>
					{/* {userRoleName === "Manager" && (
            <Flex justifyContent={"flex-end"} mb={4}>
              <Button
                onClick={autoAssign}
                bg={"black"}
                disabled={autoAssignLoading}
                rounded={"full"}
                colorScheme={"white"}
              >
                {autoAssignLoading ? "Assigning.." : "Auto Assign"}
              </Button>
            </Flex>
          )} */}
					<CheckTable
						hasPermission={hasPermission}
						hideColumns={hideColumns}
						setHideColumns={setHideColumns}
						dateTime={dateTime}
						setDateTime={setDateTime}
						totalLeads={totalLeads}
						isLoding={isLoding}
						setIsLoding={setIsLoding}
						pages={pages}
						columnsData={roleColumns[role] || tableColumns}
						isOpen={isOpen}
						setAction={setAction}
						dataColumn={dataColumn}
						action={action}
						fetchSearchedData={fetchSearchedData}
						setSearchedData={setSearchedData}
						allData={
							displaySearchData || displayAdvSearchData ? searchedData : data
						}
						setData={setData}
						tableData={
							displaySearchData || displayAdvSearchData ? searchedData : data
						}
						fetchData={fetchData}
						refetchData={refetchData}
						displaySearchData={displaySearchData}
						setDisplaySearchData={setDisplaySearchData}
						displayAdvSearchData={displayAdvSearchData}
						setDisplayAdvSearchData={setDisplayAdvSearchData}
						setDynamicColumns={setDynamicColumns}
						dynamicColumns={dynamicColumns}
						fetchAdvancedSearch={fetchAdvancedSearch}
						selectedColumns={selectedColumns}
						access={permission}
						setSelectedColumns={setSelectedColumns}
						emailAccess={emailAccess}
						callAccess={callAccess}
						setTotalLeads={setTotalLeads}
						handleView={handleView}
						view={view}
					/>
				</GridItem>
			</Grid>
		</div>
	);
};

export default Index;
