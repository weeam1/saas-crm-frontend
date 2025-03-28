import { Grid, GridItem } from '@chakra-ui/react';
import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { HasAccess } from '../../../redux/accessUtils';
import CheckTable from './components/CheckTable';
import { useSelector } from 'react-redux';
import { useFetchItemsQuery } from 'api/apiSlice';

const Index = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState([]);
	const [displaySearchData, setDisplaySearchData] = useState(false);
	const [searchedData, setSearchedData] = useState([]);
	const [searchTerm, setSearchTerm] = useState(''); // Local input state
	const [committedSearchTerm, setCommittedSearchTerm] = useState(''); // Triggers API
	const user = JSON.parse(localStorage.getItem('user')) || {};
	const tree = useSelector((state) => state.user.tree);
	const location = useLocation();

	const [permission, emailAccess, callAccess] = HasAccess([
		'Lead',
		'Email',
		'Call',
	]);

	const tableColumns = [
		{
			Header: 'Date',
			accessor: 'createdAt',
			Cell: ({ value }) => new Date(value).toLocaleDateString(),
		},
		{
			Header: 'Invoice Number',
			accessor: 'invoiceNo',
		},
		{
			Header: 'Claim Type',
			accessor: 'claim_type',
		},
		{
			Header: 'Developer',
			accessor: 'developer.developer_name',
		},
		{
			Header: 'Bank Account',
			accessor: 'bank_account.account_holder_name',
		},
		{
			Header: 'Total Amount',
			accessor: 'totalAmount',
		},
		{ Header: 'Action', id: 'action', isSortable: false, center: true },
	];

	const roleColumns = {
		Manager: tableColumns,
		Agent: tableColumns,
	};

	const role = user?.roles?.[0]?.roleName || 'Agent';
	const [dynamicColumns, setDynamicColumns] = useState(
		roleColumns[role] || tableColumns
	);
	const [selectedColumns, setSelectedColumns] = useState(
		roleColumns[role] || tableColumns
	);
	const [action, setAction] = useState(false);
	const [dateTime, setDateTime] = useState({ from: '', to: '' });

	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(25);

	// Base query for normal data
	const baseQueryArgs = useMemo(
		() => ({
			path: `/invoices`,
			params: { page: pageIndex + 1, limit: pageSize },
		}),
		[pageIndex, pageSize]
	);

	// Search query when committed search term is present
	const searchQueryArgs = useMemo(
		() => ({
			path: `/invoices`,
			params: {
				search: committedSearchTerm,
				page: pageIndex + 1,
				limit: pageSize,
			},
		}),
		[committedSearchTerm, pageIndex, pageSize]
	);

	const queryArgs = committedSearchTerm ? searchQueryArgs : baseQueryArgs;

	const {
		data: invoiceData,
		isLoading: queryLoading,
		error,
		refetch,
		isUninitialized,
	} = useFetchItemsQuery(queryArgs, {
		skip: !user._id,
		refetchOnMountOrArgChange: false,
		refetchOnReconnect: false,
	});

	const dataColumn = useMemo(
		() =>
			dynamicColumns.filter((item) =>
				selectedColumns.some((col) => col.Header === item.Header)
			),
		[dynamicColumns, selectedColumns]
	);

	useEffect(() => {
		setIsLoading(queryLoading);
		if (invoiceData?.doc) {
			console.log('API Response:', invoiceData);
			setData(invoiceData.doc);
			if (committedSearchTerm) {
				setSearchedData(invoiceData.doc);
				setDisplaySearchData(true);
			} else {
				setDisplaySearchData(false);
			}
		} else if (error) {
			console.error('Error fetching data:', error);
			setData([]);
			setSearchedData([]);
		}
	}, [invoiceData, queryLoading, error, committedSearchTerm]);

	useEffect(() => {
		if (location.state?.refetch && !isUninitialized && user._id) {
			refetch();
			window.history.replaceState({}, document.title);
		}
	}, [location.state, refetch, isUninitialized, user._id]);

	const fetchData = useMemo(() => {
		return ({ pageIndex: newPageIndex, pageSize: newPageSize, search }) => {
			setPageIndex(newPageIndex);
			setPageSize(newPageSize);
			if (search !== undefined) {
				setCommittedSearchTerm(search); // Update committed search term
			}
			if (!isUninitialized && user._id) {
				refetch();
			}
		};
	}, [isUninitialized, user._id, refetch]);

	return (
		<div>
			<Grid templateColumns='repeat(6, 1fr)' mb={3} gap={4}>
				<GridItem colSpan={6}>
					<CheckTable
						dateTime={dateTime}
						setDateTime={setDateTime}
						isLoding={isLoading}
						setIsLoding={setIsLoading}
						columnsData={roleColumns[role] || tableColumns}
						setAction={setAction}
						dataColumn={dataColumn}
						action={action}
						setSearchedData={setSearchedData}
						allData={data}
						displaySearchData={displaySearchData}
						tableData={displaySearchData ? searchedData : data}
						fetchData={fetchData}
						setDisplaySearchData={setDisplaySearchData}
						setDynamicColumns={setDynamicColumns}
						dynamicColumns={dynamicColumns}
						selectedColumns={selectedColumns}
						access={permission}
						setSelectedColumns={setSelectedColumns}
						emailAccess={emailAccess}
						callAccess={callAccess}
						pageIndex={pageIndex}
						pageSize={pageSize}
						totalItems={invoiceData?.totalDocs || 0}
						totalPages={invoiceData?.totalPages || 1}
						currentPage={invoiceData?.currentPage || 1}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
					/>
				</GridItem>
			</Grid>
		</div>
	);
};

export default Index;