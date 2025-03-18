import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Pagination from './components/Pagination';
import { getApi, putApi } from 'services/api';
import { toast } from 'react-toastify';
import axios from 'axios';
import { constant } from 'constant';
import { getUserNameById } from 'utils';
import { useSelector } from 'react-redux';

const LeadScreen = () => {
	const user = JSON.parse(localStorage.getItem('user'));
	const isSuperAdmin = user?.role === 'superAdmin';
	const isAgent = user?.roles?.some((role) => role.roleName === 'agent');
	const users = useSelector((state) => state.user?.users) || [];
	const location = useLocation();

	const defaultPage = 1;
	const defaultPageSize = 50;
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
					// Do not reset searchQuery or formValues here to preserve search state
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
		async (term = searchQuery, pageNo = currentPage, size = pageSize) => {
			try {
				setLoading(true);
				setError(null);
				setSearchNotFound(null);

				let result = await getApi(
					user.role === 'superAdmin'
						? `api/adminApproval/search?term=${term}&activeTab=${activeTab}&page=${pageNo}&pageSize=${size}`
						: `api/lead/search?term=${term}&user=${user._id}&role=${user.roles[0]?.roleName}&dateTime=${dateTime?.from + '|' + dateTime?.to}&page=${pageNo}&pageSize=${size}&isInLeadPool=true`
				);
				setDisplaySearchData(true);
				const newData =
					result.data?.result?.map((lead) => {
						if (lead?.ip) {
							const parts = lead.ip.split('-');
							lead.ip = parts?.length > 0 ? parts[1] : parts[0];
						}
						return {
							...lead,
							agentId: lead.agentAssigned,
						};
					}) || [];

				if (newData.length === 0) {
					setSearchNotFound(`Search data not found for: "${term}"`);
				}

				setSearchedData(newData);
				setTotalPages(result.data?.totalPages || 0);
				setTotalLeads(result.data?.totalLeads || 0);
				setLeads({ ...leads, approvals: newData });
			} catch (err) {
				setError(err.message || 'Failed to fetch searched leads');
			} finally {
				setLoading(false);
			}
		},
		[searchQuery, currentPage, pageSize, user, dateTime, leads]
	);

	const fetchAdvancedSearch = useCallback(
		async (data = formValues, pageNo = currentPage, size = pageSize) => {
			try {
				setLoading(true);
				setError(null);
				setSearchNotFound(null);

				let result = await getApi(
					user.role === 'superAdmin'
						? `api/adminApproval/advanced-search?data=${JSON.stringify(data)}&activeTab=${activeTab}&page=${pageNo}&pageSize=${size}`
						: `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&user=${user._id}&role=${user.roles[0]?.roleName}&dateTime=${dateTime?.from + '|' + dateTime?.to}&page=${pageNo}&pageSize=${size}&isInLeadPool=true`
				);

				setDisplayAdvSearchData(true);
				const newData =
					result.data?.result?.map((lead) => {
						if (lead?.ip) {
							const parts = lead.ip.split('-');
							lead.ip = parts?.length > 0 ? parts[1] : parts[0];
						}
						return {
							...lead,
							agentId: lead.agentAssigned,
						};
					}) || [];

				if (newData.length === 0) {
					const searchCriteria = Object.entries(data)
						.filter(([_, value]) => value !== '' && value !== undefined)
						.map(([key, value]) => {
							if (key === 'agentAssigned') {
								const agentName = getUserNameById(value, users) || value;
								return `agentAssigned: ${agentName}`;
							}
							return `${key}: ${value}`;
						})
						.join(', ');
					setSearchNotFound(`Search data not found for: ${searchCriteria}`);
				}

				setSearchedData(newData);
				setTotalPages(result.data?.totalPages || 0);
				setTotalLeads(result.data?.totalLeads || 0);
				setLeads({ ...leads, approvals: newData });
			} catch (err) {
				setError(err.message || 'Failed to fetch advanced search leads');
			} finally {
				setLoading(false);
			}
		},
		[formValues, currentPage, pageSize, user, dateTime, leads, users]
	);

	const clearAdvancedSearch = useCallback(() => {
		setSearchQuery('');
		setDisplayAdvSearchData(false);
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
				// Approval case
				try {
					const data = {
						agentAssigned: agentId,
						leadType: 'leadpool',
					};
					await putApi(`api/lead/edit/${leadId}`, data);

					if (displayAdvSearchData || displaySearchData) {
						setSearchedData((prev) => {
							const updatedLeads = prev.map((lead) =>
								lead._id === leadId
									? {
											...lead,
											agentAssigned: agentId,
											approvalStatus: 'accepted',
										}
									: lead
							);
							// In "Pending" tab, remove the lead; in "All" tab, keep it
							return currentTab === 'Pending'
								? updatedLeads.filter((lead) => lead._id !== leadId)
								: updatedLeads;
						});
					} else {
						setLeads((prev) => {
							const updatedApprovals = prev.approvals.map((approval) =>
								approval._id === approvalId
									? { ...approval, approvalStatus: 'accepted', agentId }
									: approval
							);
							// In "Pending" tab, remove the approval; in "All" tab, keep it
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
				} catch (error) {
					console.log(error);
					toast.error('Failed to update the lead');
				}
			} else {
				// Rejection case
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
									? { ...lead, approvalStatus: 'rejected' }
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
									? { ...approval, approvalStatus: 'rejected' }
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
	// Initial load respects the current activeTab from session storage or URL
	useEffect(() => {
		const initialTab = getInitialTab(); // Get tab from session storage or URL
		setActiveTab(initialTab); // Set the initial tab explicitly
		resetToDefaults(); // Reset other states
		fetchLeads(initialTab, defaultPage, defaultPageSize); // Fetch with the correct tab
	}, [location.pathname]);

	useEffect(() => {
		updateUrlAndStorage(pageSize);
	}, [activeTab, currentPage, pageSize, searchQuery, updateUrlAndStorage]);

	const handlePageChange = useCallback(
		(newPage) => {
			setCurrentPage(newPage);
			updateUrlAndStorage(pageSize);
			if (displayAdvSearchData) {
				fetchAdvancedSearch(formValues, newPage, pageSize);
			} else if (displaySearchData) {
				fetchSearchedData(searchQuery, newPage, pageSize);
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
			if (displayAdvSearchData) {
				fetchAdvancedSearch(formValues, 1, newSize);
			} else if (displaySearchData) {
				fetchSearchedData(searchQuery, 1, newSize);
			} else {
				fetchLeads(activeTab, 1, newSize); // Ensure activeTab is used
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

	const handleTabChange = useCallback(
		(newTab) => {
			setCurrentPage(1);
			setDisplayAdvSearchData(false);
			setDisplaySearchData(false);
			setSearchedData([]);
			setSearchQuery('');
			setActiveTab(newTab);
			setSearchNotFound(null);
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
				fetchSearchedData(query, 1, pageSize);
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
