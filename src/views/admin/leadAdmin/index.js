import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Pagination from './components/Pagination';
import { getApi, putApi } from 'services/api';
import { toast } from 'react-toastify';
import axios from 'axios';
import { constant } from 'constant';
import { getUserNameById } from 'utils';
import { useSelector } from 'react-redux';
import { sendLeadNotification } from 'api';
import { formattedDate } from 'utils/helpers';
// lead for admin
const LeadScreen = () => {
	const user = JSON.parse(localStorage.getItem('user'));
	const isSuperAdmin = user?.role === 'superAdmin';
	const isAgent = user?.roles?.some((role) => role.roleName === 'agent');
	const users = useSelector((state) => state.user?.users) || [];
	const location = useLocation();

	const defaultPage = 1;
	const defaultPageSize = 25;
	const defaultTab = 'All';
	const defaultSearchQuery = '';

	const getInitialPage = () => {
		const pageFromStorage = sessionStorage.getItem('currentPage');
		const urlParams = new URLSearchParams(window.location.search);
		const pageFromUrl = urlParams.get('page');
		return pageFromStorage
			? parseInt(pageFromStorage)
			: pageFromUrl
				? parseInt(pageFromUrl)
				: defaultPage;
	};

	const getInitialPageSize = () => {
		const sizeFromStorage = sessionStorage.getItem('pageSize');
		const urlParams = new URLSearchParams(window.location.search);
		const sizeFromUrl = urlParams.get('pageSize');
		return sizeFromStorage
			? parseInt(sizeFromStorage)
			: sizeFromUrl
				? parseInt(sizeFromUrl)
				: defaultPageSize;
	};

	const getInitialTab = () => {
		const tabFromStorage = sessionStorage.getItem('activeTab');
		const urlParams = new URLSearchParams(window.location.search);
		const tabFromUrl = urlParams.get('tab');
		return tabFromStorage || tabFromUrl || defaultTab;
	};

	const getInitialSearchQuery = () => {
		const searchFromStorage = sessionStorage.getItem('searchQuery');
		const urlParams = new URLSearchParams(window.location.search);
		return searchFromStorage || urlParams.get('search') || defaultSearchQuery;
	};

	const [currentPage, setCurrentPage] = useState(getInitialPage());
	const [pageSize, setPageSize] = useState(getInitialPageSize());
	const [activeTab, setActiveTab] = useState(getInitialTab());
	const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery());
	const [leads, setLeads] = useState(null);
	const [searchedData, setSearchedData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchClear, setSearchClear] = useState(false);
	const [formValues, setFormValues] = useState({});
	const [isFormReset, setIsFormReset] = useState(false);
	const [tagValues, setGetTagValues] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [totalLeads, setTotalLeads] = useState(0);
	const [displayAdvSearchData, setDisplayAdvSearchData] = useState(false);
	const [displaySearchData, setDisplaySearchData] = useState(false);
	const [dateTime, setDateTime] = useState({ from: '', to: '' });
	const [searchNotFound, setSearchNotFound] = useState(null);

	const resetToDefaults = () => {
		setCurrentPage(defaultPage);
		setPageSize(defaultPageSize);
		setActiveTab(defaultTab);
		setSearchQuery(defaultSearchQuery);
		setLeads(null);
		setSearchedData([]);
		setLoading(true);
		setError(null);
		setSearchClear(false);
		setFormValues({});
		setIsFormReset(false);
		setGetTagValues([]);
		setTotalPages(0);
		setTotalLeads(0);
		setDisplayAdvSearchData(false);
		setDisplaySearchData(false);
		setDateTime({ from: '', to: '' });
		setSearchNotFound(null);

		window.history.replaceState({}, '', location.pathname);
		sessionStorage.clear();
	};

	const updateUrlAndStorage = useCallback(
		(newPageSize) => {
			const urlParams = new URLSearchParams();
			urlParams.set('tab', activeTab);
			urlParams.set('page', currentPage);
			urlParams.set('pageSize', newPageSize || pageSize);
			if (searchQuery) urlParams.set('search', searchQuery);

			const newUrl = `?${urlParams.toString()}`;
			window.history.replaceState({}, '', newUrl);

			if (sessionStorage.getItem('activeTab') !== activeTab) {
				sessionStorage.setItem('activeTab', activeTab);
			}
			if (sessionStorage.getItem('currentPage') !== String(currentPage)) {
				sessionStorage.setItem('currentPage', currentPage);
			}
			if (
				sessionStorage.getItem('pageSize') !== String(newPageSize || pageSize)
			) {
				sessionStorage.setItem('pageSize', newPageSize || pageSize);
			}
			if (sessionStorage.getItem('searchQuery') !== searchQuery) {
				sessionStorage.setItem('searchQuery', searchQuery);
			}
		},
		[activeTab, currentPage, pageSize, searchQuery]
	);

	const fetchLeads = useCallback(
		async (tab = activeTab, page = currentPage, size = pageSize) => {
			try {
				setLoading(true);
				setError(null);
				setSearchNotFound(null);

				const queryParams = new URLSearchParams();
				if (tab !== 'All') {
					const statusMap = {
						Pending: 'pending',
						Approved: 'accepted',
						Rejected: 'rejected',
					};
					queryParams.append('approvalStatus', statusMap[tab]);
				}
				queryParams.append('page', page);
				queryParams.append('pageSize', size);

				const result = await getApi(`api/adminApproval/get?${queryParams}`);
				if (result.status === 200) {
					setLeads(result.data);
					setTotalPages(result.data.totalPages || 0);
					setTotalLeads(result.data.totalApprovals || 0);
					setSearchedData([]);
					setDisplayAdvSearchData(false);
					setDisplaySearchData(false);
				}
			} catch (err) {
				setError(err.message || 'Failed to fetch leads');
			} finally {
				setLoading(false);
			}
		},
		[activeTab, currentPage, pageSize]
	);

	const fetchSearchedData = useCallback(
		async (
			term = searchQuery,
			page = currentPage,
			size = pageSize,
			activeTabParam = activeTab
		) => {
			try {
				setLoading(true);
				setError(null);
				setSearchNotFound(null);

				const queryParams = new URLSearchParams({
					term: term || '',
					page: page.toString(),
					pageSize: size.toString(),
					activeTab: activeTabParam,
				});

				if (user.role !== 'superAdmin') {
					queryParams.append('user', user._id);
					queryParams.append('role', user.roles?.[0]?.roleName || '');
					if (dateTime?.from && dateTime?.to) {
						queryParams.append('dateTime', `${dateTime.from}|${dateTime.to}`);
					}
					queryParams.append('isInLeadPool', 'true');
				}

				const result = await getApi(`api/adminApproval/search?${queryParams}`);

				const newData = result.data?.result || [];
				const validatedData = Array.isArray(newData) ? newData : [];

				setDisplaySearchData(true);
				setSearchedData(validatedData);
				setTotalPages(result.data?.totalPages || 0);
				setTotalLeads(result.data?.totalLeads || 0);
				setCurrentPage(page);

				// Handle empty search results
				if (validatedData.length === 0) {
					if (page === 1) {
						setSearchNotFound(`Search data not found for: "${term}"`);
					} else {
						setSearchNotFound(
							`No more results found for: "${term}" on page ${page}`
						);
					}
				}

				setLeads((prevLeads) => ({ ...prevLeads, approvals: validatedData }));
			} catch (err) {
				console.error('Fetch Searched Data Error:', err);
				setError(err.message || 'Failed to fetch searched leads');
				setSearchedData([]);
				setTotalPages(0);
				setTotalLeads(0);
				setLeads((prevLeads) => ({ ...prevLeads, approvals: [] }));
			} finally {
				setLoading(false);
			}
		},
		[searchQuery, currentPage, pageSize, activeTab, user, dateTime]
	);

	const fetchAdvancedSearch = useCallback(
		async (
			data = formValues,
			page = currentPage,
			size = pageSize,
			activeTabParam = activeTab
		) => {
			try {
				setLoading(true);
				setError(null);
				setSearchNotFound(null);

				const cleanedData = Object.fromEntries(
					Object.entries(data).filter(
						([_, value]) =>
							value !== '' && value !== undefined && value !== null
					)
				);

				const queryParams = new URLSearchParams({
					data: JSON.stringify(cleanedData),
					page: page.toString(),
					pageSize: size.toString(),
					activeTab: activeTabParam,
				});

				if (user.role !== 'superAdmin') {
					queryParams.append('user', user._id);
					queryParams.append('role', user.roles?.[0]?.roleName || '');
					if (dateTime?.from && dateTime?.to) {
						queryParams.append('dateTime', `${dateTime.from}|${dateTime.to}`);
					}
					queryParams.append('isInLeadPool', 'true');
				}

				const url = `api/adminApproval/advanced-search?${queryParams}`;

				const result = await getApi(url);

				const newData = result.data?.result || [];
				const validatedData = Array.isArray(newData) ? newData : [];

				setDisplayAdvSearchData(true);
				setDisplaySearchData(false);
				setSearchedData(validatedData);
				setCurrentPage(page);

				setTotalPages(result.data?.totalPages || 0);
				setTotalLeads(result.data?.totalLeads || 0);

				if (validatedData.length === 0 && result.data?.totalLeads === 0) {
					const searchCriteria = Object.entries(cleanedData)
						.map(([key, value]) => {
							if (key === 'agentAssigned') {
								const agentName = getUserNameById(value, users) || value;
								return `agentAssigned: ${agentName}`;
							}

							if (key === 'from') {
								return `Start: ${formattedDate(value)}`;
							}

							if (key === 'to') {
								return `End: ${formattedDate(value)}`;
							}

							return `${key}: ${value}`;
						})
						.join(', ');
					setSearchNotFound(`Search data not found for: ${searchCriteria}`);
				}

				setLeads((prevLeads) => ({ ...prevLeads, approvals: validatedData }));
			} catch (err) {
				console.error('Fetch Advanced Search Error:', err);
				setError(err.message || 'Failed to fetch advanced search leads');
				setSearchedData([]);
				setTotalPages(0);
				setTotalLeads(0);
				setLeads((prevLeads) => ({ ...prevLeads, approvals: [] }));
			} finally {
				setLoading(false);
			}
		},
		[activeTab, currentPage, pageSize, user, dateTime, formValues, users]
	);

	const clearAdvancedSearch = useCallback(() => {
		setSearchQuery('');
		setDisplayAdvSearchData(false);
		setDisplaySearchData(false);
		setSearchedData([]);
		setFormValues({});
		setGetTagValues([]);
		setIsFormReset(true);
		setSearchNotFound(null);
		fetchLeads(activeTab, currentPage, pageSize);
	}, [activeTab, currentPage, pageSize, fetchLeads]);

	const approveChangeHandler = async (
		e,
		leadId,
		agentId,
		approvalId,
		currentTab
	) => {
		if (e === 'none') return;

		const currentDate = new Date().toISOString();

		try {
			const res = await axios.put(
				constant['baseUrl'] + 'api/adminApproval/update',
				{
					isApproved: e === 'accept',
					objectId: approvalId,
					agentId,
				},
				{
					headers: {
						Authorization:
							localStorage.getItem('token') || sessionStorage.getItem('token'),
					},
				}
			);

			if (res?.data?.status) {
				try {
					const data = {
						agentAssigned: agentId,
						// leadType: 'leadpool',
					};

					const updatedRes = await putApi(`api/lead/edit/${leadId}`, data);

					if (displayAdvSearchData || displaySearchData) {
						setSearchedData((prev) => {
							const updatedLeads = prev.map((lead) =>
								lead._id === leadId
									? {
											...lead,
											agentAssigned: agentId,
											approvalStatus: 'accepted',
											approvedDate: currentDate,
										}
									: lead
							);
							return currentTab === 'Pending'
								? updatedLeads.filter((lead) => lead._id !== leadId)
								: updatedLeads;
						});
					} else {
						setLeads((prev) => {
							const updatedApprovals = prev.approvals.map((approval) =>
								approval._id === approvalId
									? {
											...approval,
											approvalStatus: 'accepted',
											agentId,
											approvedDate: currentDate,
										}
									: approval
							);
							return {
								...prev,
								approvals:
									currentTab === 'Pending'
										? updatedApprovals.filter(
												(approval) => approval._id !== approvalId
											)
										: updatedApprovals,
								totalApprovals:
									currentTab === 'Pending'
										? prev.totalApprovals - 1
										: prev.totalApprovals,
							};
						});
					}

					toast.success('Lead request approved successfully!');

					sendLeadNotification(user?._id, agentId, updatedRes?.data);
				} catch (error) {
					console.log(error);
					toast.error('Failed to update the lead');
				}
			} else {
				try {
					if (agentId) {
						const lead = await getApi(`api/lead/view/${leadId}`);
						const r = await getApi(`api/user/view/${agentId}`);
						await putApi(`api/user/edit/${agentId}`, {
							coins:
								lead?.data?.lead?.leadStatus === 'new'
									? r?.data?.coins + 300
									: r?.data?.coins + 50,
						});
					}

					if (displayAdvSearchData || displaySearchData) {
						setSearchedData((prev) => {
							const updatedLeads = prev.map((lead) =>
								lead._id === leadId
									? {
											...lead,
											approvalStatus: 'rejected',
											rejectedDate: currentDate,
										}
									: lead
							);
							return currentTab === 'Pending'
								? updatedLeads.filter((lead) => lead._id !== leadId)
								: updatedLeads;
						});
					} else {
						setLeads((prev) => {
							const updatedApprovals = prev.approvals.map((approval) =>
								approval._id === approvalId
									? {
											...approval,
											approvalStatus: 'rejected',
											rejectedDate: currentDate,
										}
									: approval
							);
							return {
								...prev,
								approvals:
									currentTab === 'Pending'
										? updatedApprovals.filter(
												(approval) => approval._id !== approvalId
											)
										: updatedApprovals,
								totalApprovals:
									currentTab === 'Pending'
										? prev.totalApprovals - 1
										: prev.totalApprovals,
							};
						});
					}

					toast.success('Lead request rejected successfully!');
				} catch (error) {
					console.log(error);
					toast.error('Failed to update user coins');
				}
			}
		} catch (error) {
			console.log('error', error);
			toast.error(
				error.response?.data?.message || 'Failed to process lead request'
			);
		}
	};

	useEffect(() => {
		const initialTab = getInitialTab();
		const initialPage = getInitialPage();
		const initialPageSize = getInitialPageSize();
		const initialSearchQuery = getInitialSearchQuery();

		setActiveTab(initialTab);
		setCurrentPage(initialPage);
		setPageSize(initialPageSize);
		setSearchQuery(initialSearchQuery);

		if (initialSearchQuery) {
			fetchSearchedData(
				initialSearchQuery,
				initialPage,
				initialPageSize,
				initialTab
			);
		} else if (Object.keys(formValues).length > 0) {
			fetchAdvancedSearch(formValues, initialPage, initialPageSize, initialTab);
		} else {
			fetchLeads(initialTab, initialPage, initialPageSize);
		}
	}, [location.pathname]);

	useEffect(() => {
		updateUrlAndStorage(pageSize);
	}, [activeTab, currentPage, pageSize, searchQuery, updateUrlAndStorage]);

	const handlePageChange = useCallback(
		(newPage) => {
			setCurrentPage(newPage);
			updateUrlAndStorage(pageSize);
			if (displayAdvSearchData && Object.keys(formValues).length > 0) {
				fetchAdvancedSearch(formValues, newPage, pageSize, activeTab);
			} else if (displaySearchData && searchQuery) {
				fetchSearchedData(searchQuery, newPage, pageSize, activeTab);
			} else {
				fetchLeads(activeTab, newPage, pageSize);
			}
		},
		[
			activeTab,
			pageSize,
			searchQuery,
			formValues,
			displayAdvSearchData,
			displaySearchData,
			fetchLeads,
			fetchSearchedData,
			fetchAdvancedSearch,
			updateUrlAndStorage,
		]
	);

	const handlePageSizeChange = useCallback(
		(newSize) => {
			setPageSize(newSize);
			setCurrentPage(1);
			updateUrlAndStorage(newSize);
			if (displayAdvSearchData && Object.keys(formValues).length > 0) {
				fetchAdvancedSearch(formValues, 1, newSize, activeTab);
			} else if (displaySearchData && searchQuery) {
				fetchSearchedData(searchQuery, 1, newSize, activeTab);
			} else {
				fetchLeads(activeTab, 1, newSize);
			}
		},
		[
			activeTab,
			searchQuery,
			formValues,
			displayAdvSearchData,
			displaySearchData,
			fetchLeads,
			fetchSearchedData,
			fetchAdvancedSearch,
			updateUrlAndStorage,
		]
	);

	// const handleTabChange = useCallback(
	//   (newTab) => {
	//     setCurrentPage(1);
	//     setDisplayAdvSearchData(false);
	//     setDisplaySearchData(false);
	//     setSearchedData([]);
	//     setSearchQuery("");
	//     setActiveTab(newTab);
	//     setSearchNotFound(null);
	//     updateUrlAndStorage(pageSize);
	//     fetchLeads(newTab, 1, pageSize);
	//   },
	//   [pageSize, fetchLeads, updateUrlAndStorage]
	// );
	const handleTabChange = useCallback(
		(newTab) => {
			setCurrentPage(1);
			setActiveTab(newTab);
			setSearchQuery('');
			setFormValues({});
			setSearchedData([]);
			setDisplayAdvSearchData(false);
			setDisplaySearchData(false);
			setSearchNotFound(null);
			setGetTagValues([]);
			setIsFormReset(true);
			updateUrlAndStorage(pageSize);
			fetchLeads(newTab, 1, pageSize);
		},
		[pageSize, fetchLeads, updateUrlAndStorage]
	);
	const handleSearch = useCallback(
		(query) => {
			setSearchQuery(query);
			setCurrentPage(1);
			setDisplayAdvSearchData(false);
			updateUrlAndStorage(pageSize);
			if (query) {
				fetchSearchedData(query, 1, pageSize, activeTab);
			} else {
				setDisplaySearchData(false);
				setSearchNotFound(null);
				fetchLeads(activeTab, 1, pageSize);
			}
		},
		[activeTab, pageSize, fetchLeads, fetchSearchedData, updateUrlAndStorage]
	);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<Pagination
				leads={
					displayAdvSearchData || displaySearchData
						? { ...leads, approvals: searchedData }
						: leads
				}
				currentPage={currentPage}
				setCurrentPage={handlePageChange}
				totalPages={totalPages}
				totalItems={totalLeads}
				pageSize={pageSize}
				onPageSizeChange={handlePageSizeChange}
				activeTab={activeTab}
				setActiveTab={handleTabChange}
				loading={loading}
				searchQuery={searchQuery}
				setSearchQuery={handleSearch}
				fetchAdvancedSearch={fetchAdvancedSearch}
				setSearchClear={setSearchClear}
				setFormValues={setFormValues}
				isFormReset={isFormReset}
				setIsFormReset={setIsFormReset}
				setGetTagValues={setGetTagValues}
				clearAdvancedSearch={clearAdvancedSearch}
				formValues={formValues}
				isAgent={isAgent}
				isSuperAdmin={isSuperAdmin}
				approveChangeHandler={approveChangeHandler}
				searchNotFound={searchNotFound}
			/>
		</div>
	);
};

export default LeadScreen;
