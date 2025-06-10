import { useSelector } from 'react-redux';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useFetchItemsQuery } from 'api/apiSlice';

import { HasAccess } from '../../../../redux/accessUtils';

import CheckTable from '../components/invoiceChecktable';
import Breadcrumb from '../components/BreadCrumb';
import { IoArrowBack } from 'react-icons/io5';
import AppButton from 'components/shared/AppButton';
import Loader from 'components/loading/Loader';
import BreadCrumb from 'components/shared/BreadCrumb';

const DeveloperInvoices = () => {
	const { id } = useParams();
	const developer_id = id;
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState([]);
	const [displaySearchData, setDisplaySearchData] = useState(false);
	const [searchedData, setSearchedData] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [committedSearchTerm, setCommittedSearchTerm] = useState('');

	const user = JSON.parse(localStorage.getItem('user')) || {};
	const tree = useSelector((state) => state.user.tree);
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [queryArgs, setQueryArgs] = useState({
		path: developer_id ? `/invoices` : `/invoices`,
		params: { page: 1, limit: 25, developer: developer_id },
	});

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
			accessor: 'claimType',
		},
		{
			Header: 'Developer',
			accessor: 'developer.developer_name',
		},
		{
			Header: 'Project',
			accessor: 'project.name',
		},
		{
			Header: 'Bank Account',
			accessor: 'bank_account.account_holder_name',
		},
		{
			Header: 'Status',
			accessor: 'Status',
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

	const { data: developer, isLoading: developerLoading } = useFetchItemsQuery(
		{ path: `/developer/get/${developer_id}` },
		{
			refetchOnMountOrArgChange: true,
		}
	);

	const {
		data: invoiceData,
		isLoading: queryLoading,
		refetch: invoicesRefetch,
		error,
		isUninitialized,
	} = useFetchItemsQuery(queryArgs, {
		skip: !user._id,
		refetchOnMountOrArgChange: true,
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
			setQueryArgs((prev) => ({ ...prev }));
			window.history.replaceState({}, document.title);
		}
	}, [location.state, isUninitialized, user._id]);

	const fetchData = (options = {}) => {
		const { pageIndex: newPageIndex, pageSize: newPageSize, search } = options;

		if (
			newPageIndex === pageIndex &&
			newPageSize === pageSize &&
			search === committedSearchTerm
		) {
			return;
		}

		const updatedPageIndex =
			newPageIndex !== undefined ? newPageIndex : pageIndex;
		const updatedPageSize = newPageSize !== undefined ? newPageSize : pageSize;
		const updatedSearch = search !== undefined ? search : committedSearchTerm;

		setPageIndex(updatedPageIndex);
		setPageSize(updatedPageSize);
		setCommittedSearchTerm(updatedSearch);

		const updatedQueryArgs = {
			path: developer_id ? `/invoices` : `/invoices`,
			params: {
				page: updatedPageIndex + 1,
				limit: updatedPageSize,
				developer: developer_id,
				...(updatedSearch && { search: updatedSearch }),
			},
		};

		setQueryArgs(updatedQueryArgs);
	};

	const breadcrumbItems = useMemo(
		() => [
			{ label: 'Developers', path: '/invoice?tab=developers' },
			{
				label: 'Invoices',
				path: `/invoice/developers/invoices/${developer_id}`,
			},
		],
		[]
	);

	useEffect(() => {
		invoicesRefetch(queryArgs);
	}, [queryArgs]);

	const navigate = useNavigate();

	return (
		<Box fontFamily="'DM Sans', sans-serif">
			<BreadCrumb items={breadcrumbItems} />

			<AppButton
				leftIcon={<IoArrowBack />}
				onClick={() => navigate('/invoice?tab=developers')}
			>
				Back
			</AppButton>

			{developerLoading ? (
				<Loader />
			) : (
				<Grid templateColumns='repeat(6, 1fr)' mb={3} gap={4}>
					<GridItem colSpan={6}>
						<CheckTable
							developer={developer}
							dateTime={dateTime}
							setDateTime={setDateTime}
							isLoading={isLoading}
							setIsLoading={setIsLoading}
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
			)}
		</Box>
	);
};

export default DeveloperInvoices;
